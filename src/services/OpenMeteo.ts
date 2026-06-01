import { ref, shallowRef, toValue, type MaybeRefOrGetter, type Ref, type ShallowRef } from 'vue';
import type { AppUnit } from '../consts/weatherConsts';
import type { GeoLocation } from '../types/GeoLocation';
import { OMCodeMap, type OMDayConditions, type OMResponse } from '../types/openMeteo';
import type { CurrentConitions, DailyConditions, HourlyConditions, IDataSource } from './IDataSource';

type ErrorResp = { error: boolean; reason: string };

export class OpenMeteo implements IDataSource {
  private static readonly SOURCE_URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41';

  private static readonly DEFAULT = {
    daily: ['sunset', 'sunrise', 'uv_index_max', 'relative_humidity_2m_mean', 'surface_pressure_mean'],
    hourly: ['temperature_2m', 'surface_pressure', 'relative_humidity_2m'],
    current: [
      'weather_code',
      'temperature_2m',
      'surface_pressure',
      'apparent_temperature',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ],
    timezone: 'auto',
  };

  #location: MaybeRefOrGetter<GeoLocation>;

  #data: ShallowRef<OMResponse | null>;
  #loading: Ref<boolean>;
  #error: Ref<string | null>;

  units: AppUnit = 'metric';

  readonly name: string = 'Open Meteo';
  readonly url: string = 'https://open-meteo.com';

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

    const current = this.#data.value.current;
    const today = zipProps<OMDayConditions>(this.#data.value.daily)[0];
    if (!today) throw new Error('Not loaded');

    const weather = OMCodeMap[current.weather_code];

    const sunrise = new Date(today.sunrise);
    const sunset = new Date(today.sunset);
    const now = Date.now();
    const period = sunrise.valueOf() <= now && now <= sunset.valueOf() ? 'd' : 'n';

    return {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      pressure: current.surface_pressure,
      wind_speed: current.wind_speed_10m,
      wind_deg: current.wind_direction_10m,
      wind_gust: current.wind_gusts_10m,
      uvi: today.uv_index_max,
      weather: [
        {
          id: 0,
          main: weather?.main || 'Unknown',
          description: weather?.description || `Неизвестный код: ${current.weather_code}`,
          icon: weather?.icon ? `${weather.icon}${period}` : 'unk',
        },
      ],
      sunrise,
      sunset,
    };
  }

  get hourly(): HourlyConditions[] {
    if (!this.#data.value) throw new Error('Not loaded');

    return zipProps(this.#data.value.hourly).map((item) => ({
      time: new Date(item.time),
      temp: item.temperature_2m,
      humidity: item.relative_humidity_2m,
      pressure: item.surface_pressure,
    }));
  }

  get daily(): DailyConditions[] {
    if (!this.#data.value) throw new Error('Not loaded');

    return zipProps(this.#data.value.daily).map((item) => ({
      humidity: item.relative_humidity_2m_mean,
      pressure: item.surface_pressure_mean,
    }));
  }

  constructor(location: MaybeRefOrGetter<GeoLocation>) {
    this.#location = location;

    this.#loading = ref(false);
    this.#error = ref(null);
    this.#data = shallowRef(null);
  }

  public async refresh() {
    if (this.#loading.value) return;

    this.#loading.value = true;
    try {
      const { lat, lon } = this.location;

      const url = new URL(OpenMeteo.SOURCE_URL);
      url.searchParams.set('latitude', lat.toFixed(4));
      url.searchParams.set('longitude', lon.toFixed(4));

      for (const key in OpenMeteo.DEFAULT) {
        const value = OpenMeteo.DEFAULT[key as keyof typeof OpenMeteo.DEFAULT];
        url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }

      this.#error.value = null;
      const resp = await fetch(url);
      const json: ErrorResp | OMResponse = await resp.json();
      if (!resp.ok) {
        this.#error.value = `Network error: ${resp.status} ${resp.statusText}`;
        return;
      }
      if ('error' in json) {
        this.#error.value = json.reason;
        return;
      }

      this.#data.value = json;
    } finally {
      this.#loading.value = false;
    }
  }
}

function zipProps<T extends {}>(dataRows: { [K in keyof T]: T[K][] }): T[] {
  const entries = Object.entries(dataRows) as [key: string, value: unknown[]][];
  if (entries.length === 0) return [];

  return entries[0]![1].map((_, i) => {
    return Object.fromEntries(entries.map(([key, value]) => [key, value[i]])) as T;
  });
}
