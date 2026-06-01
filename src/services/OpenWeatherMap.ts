import { ref, shallowRef, toValue, type MaybeRefOrGetter, type Ref, type ShallowRef } from 'vue';
import type { AppUnit } from '../consts/weatherConsts';
import { FAKE_RESPONSE } from '../stubs/OpenWeatherMapStub';
import type { GeoLocation } from '../types/GeoLocation';
import type { OWMResponse } from '../types/openWeatherMap';
import type { CurrentConitions, DailyConditions, HourlyConditions, IDataSource } from './IDataSource';

export type OWMPart = 'current' | 'minutely' | 'hourly' | 'daily' | 'alerts';

export type OpenWeatherMapProps = {
  exclude?: OWMPart[] | null;
  units?: 'standard' | 'metric' | 'imperial' | null;
  lang?: string | null;
};

export class OpenWeatherMap implements IDataSource {
  private static readonly SOURCE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

  #apiKey: MaybeRefOrGetter<string>;
  #location: MaybeRefOrGetter<GeoLocation>;

  #data: ShallowRef<OWMResponse | null>;
  #loading: Ref<boolean>;
  #error: Ref<string | null>;

  public units: AppUnit = 'metric';

  readonly name: string = 'Open Weather Map';
  readonly url: string = 'https://openweathermap.org';

  get location() {
    return toValue(this.#location);
  }

  get loading() {
    return this.#loading.value;
  }

  get loaded() {
    return this.#data.value != null;
  }

  get error() {
    return this.#error.value;
  }

  get current(): CurrentConitions {
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
      sunrise: new Date(sunrise * 1000),
      sunset: new Date(sunset * 1000),
    };
  }

  get hourly(): HourlyConditions[] {
    if (!this.#data.value) throw new Error('Not loaded');

    return (this.#data.value.hourly || []).map((item) => ({
      time: new Date(item.dt * 1000),
      temp: item.temp,
      pressure: item.pressure,
      humidity: item.humidity,
    }));
  }

  get daily(): DailyConditions[] {
    if (!this.#data.value) throw new Error('Not loaded');

    return this.#data.value.daily || [];
  }

  constructor(apiKey: MaybeRefOrGetter<string>, location: MaybeRefOrGetter<GeoLocation>) {
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
