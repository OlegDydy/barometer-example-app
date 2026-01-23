import { reactive, watchEffect, type Reactive } from 'vue';

type WithVersion = {
  version: number;
  data: unknown;
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

  protected migrate(oldData: WithVersion): T {
    return oldData.data as T;
  }

  private _load(defaultValue: T | (() => T)): T {
    const data = typeof defaultValue == 'function' ? (defaultValue as () => T)() : defaultValue;
    const storedJson = localStorage.getItem(this.#key);
    try {
      if (storedJson) {
        const stored: WithVersion = JSON.parse(storedJson);
        Object.assign(data, this.migrate(stored));
      }
    } catch (e) {
      if (!(e instanceof MigrationFailed || e instanceof SyntaxError)) throw e;
    }
    return data;
  }

  private _store() {
    watchEffect(() => {
      const data: WithVersion = { version: this.version(), data: this.#data };
      localStorage.setItem(this.#key, JSON.stringify(data));
    });
  }
}
