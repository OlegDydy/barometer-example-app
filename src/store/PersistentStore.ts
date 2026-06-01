import { reactive, watchEffect, type Reactive } from 'vue';

type WithVersion<T = unknown> = {
  version: number;
  data: T;
};

export class MigrationFailed {}

export class PersistentStore<T extends object = {}> {
  #data: Reactive<T>;
  #key: string;

  get value() {
    return this.#data;
  }

  set value(data) {
    Object.assign(this.#data, data);
  }

  constructor(key: string, defaultValue: T | (() => T)) {
    this.#key = key;
    this.#data = reactive<T>(this._load(defaultValue));
    this._store();
  }

  protected version() {
    return 0;
  }

  protected migrate(_version: number, oldData: T): T {
    return oldData;
  }

  private _load(defaultValue: T | (() => T)): T {
    const data = typeof defaultValue == 'function' ? (defaultValue as () => T)() : defaultValue;
    const storedJson = localStorage.getItem(this.#key);
    try {
      if (storedJson) {
        const stored: WithVersion<T> = JSON.parse(storedJson);
        Object.assign(data, this.migrate(stored.version, stored.data));
      }
    } catch (e) {
      if (!(e instanceof MigrationFailed || e instanceof SyntaxError)) throw e;
    }
    return data;
  }

  private _store() {
    watchEffect(() => {
      const data: WithVersion<T> = { version: this.version(), data: (this.#data as unknown) as T };
      console.log('Stored', data, this);
      localStorage.setItem(this.#key, JSON.stringify(data));
    });
  }
}
