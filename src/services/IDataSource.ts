import type { AppUnit } from '../consts/weatherConsts';
import type { GeoLocation } from '../types/GeoLocation';
import type { OWMWeatherSummary } from '../types/openWeatherMap';

export type CurrentConitions = {
  temp: number;
  feels_like: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  uvi: number;
  weather: OWMWeatherSummary[];
  sunrise: Date;
  sunset: Date;
};

export type DailyConditions = {
  pressure: number;
  humidity: number;
};

export type HourlyConditions = {
  time: Date;
  temp: number;
  pressure: number;
  humidity: number;
};

export interface IDataSource {
  units: AppUnit;
  error: string | null;
  readonly name: string;
  readonly url: string;
  readonly location: GeoLocation;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly current: CurrentConitions;
  readonly daily: DailyConditions[];
  readonly hourly: HourlyConditions[];
  refresh(): void;
}
