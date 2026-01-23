export type OWMResponse = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current?: OWMCurrent;
  minutely: { dt: number; precipitation: number }[];
  hourly: OWMHourly[];
  daily: OWMDaily[];
  alerts: OWMAlert[];
};

export type OWMWeatherSummary = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type OWMHourly = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  uvi: number;
  visibility: number;
  wind_speed: number;
  wind_gust: number;
  wind_deg: number;
  pop: number;
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
  weather: OWMWeatherSummary[];
};

export type OWMCurrent = Omit<OWMHourly, 'pop'>;

export type OWMDaily = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
    night: number;
    eve: number;
    morn: number;
    min: number;
    max: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  uvi: number;
  wind_speed: number;
  wind_gust: number;
  wind_deg: number;
  weather: OWMWeatherSummary[];
  pop: number;
  rain?: number;
  snow?: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
};

export type OWMAlert = {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
};
