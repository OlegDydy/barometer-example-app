import { ref, shallowRef, toValue, type MaybeRefOrGetter, type Ref, type ShallowRef } from 'vue';
import type { OWMUnit } from '../consts/openWeatherConsts';
import { FAKE_RESPONSE } from '../stubs/OpenWeatherMapStub';
import type { OWMResponse } from '../types/openWeatherMap';

export type OWMPart = 'current' | 'minutely' | 'hourly' | 'daily' | 'alerts';

export type OpenWeatherMapProps = {
  exclude?: OWMPart[] | null;
  units?: 'standard' | 'metric' | 'imperial' | null;
  lang?: string | null;
};

export type OWMLocation = {
  name: string;
  lat: number;
  lon: number;
};

export class OpenWeatherMap {
  private static readonly SOURCE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

  #apiKey: MaybeRefOrGetter<string>;
  #location: MaybeRefOrGetter<OWMLocation>;

  #data: ShallowRef<OWMResponse | null>;
  #loading: Ref<boolean>;
  #error: Ref<string | null>;

  public units: OWMUnit = 'metric';

  get location() {
    return toValue(this.#location);
  }

  get loading() {
    return this.#loading.value;
  }

  get loaded() {
    return this.#data.value;
  }

  get error() {
    return this.#error.value;
  }

  get current() {
    if (!this.#data.value) throw new Error('Not loaded');

    const { temp, feels_like, pressure, wind_speed, wind_deg, wind_gust, uvi, weather } = this.#data.value.current!;
    const { sunrise, sunset } = this.#data.value.daily[0]!;
    return {
      temp,
      feels_like,
      pressure,
      wind_speed,
      wind_deg,
      wind_gust,
      uvi,
      weather,
      sunrise,
      sunset,
    };
  }

  get hourly() {
    if (!this.#data.value) throw new Error('Not loaded');

    return this.#data.value.hourly || [];
  }

  get daily() {
    if (!this.#data.value) throw new Error('Not loaded');

    return this.#data.value.daily || [];
  }

  constructor(apiKey: MaybeRefOrGetter<string>, location: MaybeRefOrGetter<OWMLocation>) {
    this.#apiKey = apiKey;
    this.#location = location;

    this.#loading = ref(false);
    this.#error = ref(null);
    this.#data = shallowRef(null);
  }

  public async refresh() {
    if (this.#loading.value) return;

    const apiKey = toValue(this.#apiKey);

    if (!apiKey) {
      this.#error.value = 'No API key provided';

      return;
    }
    if (apiKey === 'fake-data') {
      this.#error.value = null;
      this.#data.value = FAKE_RESPONSE;
      return;
    }
    this.#loading.value = true;
    try {
      const { lat, lon } = this.location;

      const url = new URL(OpenWeatherMap.SOURCE_URL);
      url.searchParams.set('appid', apiKey);
      url.searchParams.set('lat', lat.toFixed(4));
      url.searchParams.set('lon', lon.toFixed(4));

      if (this.units) url.searchParams.set('units', this.units);
      url.searchParams.set('lang', navigator.language);
      url.searchParams.set('exclude', 'minutely');

      this.#error.value = null;
      const resp = await fetch(url);
      if (!resp.ok) {
        const json: { cod: number; message: 'string' } = await resp.json();
        this.#error.value = json.message;
        return;
      }

      this.#data.value = await resp.json();
    } finally {
      this.#loading.value = false;
    }
  }
}
