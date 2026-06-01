export type OMResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: { [K in keyof OMCurrentConditions]: string };
  current: OMCurrentConditions;
  hourly_units: { [K in keyof OMHourConditions]: string };
  hourly: { [K in keyof OMHourConditions]: OMHourConditions[K][] };
  daily_units: { [K in keyof OMDayConditions]: string };
  daily: { [K in keyof OMDayConditions]: OMDayConditions[K][] };
};

export type OMCurrentConditions = {
  time: string;
  interval: number;
  weather_code: keyof typeof OMCodeMap;
  temperature_2m: number;
  surface_pressure: number;
  apparent_temperature: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
};

export type OMDayConditions = {
  time: string;
  sunset: string;
  sunrise: string;
  uv_index_max: number;
  relative_humidity_2m_mean: number;
  surface_pressure_mean: number;
};

export type OMHourConditions = {
  time: string;
  temperature_2m: number;
  surface_pressure: number;
  relative_humidity_2m: number;
};

export const OMCodeMap: Record<number, { icon: string; main: string; description: string }> = {
  // 	Clear sky
  0: { icon: '01', main: 'Clear sky', description: 'Ясно' },
  // Mainly clear, partly cloudy, and overcast
  1: { icon: '02', main: 'Cloudy', description: 'Преимущественно ясно' },
  2: { icon: '02', main: 'Cloudy', description: 'Облачно' },
  3: { icon: '02', main: 'Cloudy', description: 'Пасмурно' },
  // Fog and depositing rime fog
  45: { icon: '50', main: 'Fog', description: 'Туман' },
  48: { icon: '50', main: 'Fog', description: 'Иней' },
  // Drizzle: Light, moderate, and dense intensity
  51: { icon: 'x01', main: 'Drizzle', description: 'Изморось' },
  53: { icon: 'x01', main: 'Drizzle', description: 'Моросящий дождь' },
  55: { icon: 'x01', main: 'Drizzle', description: 'Сильный моросящий дождь' },
  // Freezing Drizzle: Light and dense intensity
  56: { icon: 'x02', main: 'Freezing Drizzle', description: 'Холодный моросящий дождь' },
  57: { icon: 'x02', main: 'Freezing Drizzle', description: 'Сильный и холодный моросящий дождь' },
  // Rain: Slight, moderate and heavy intensity
  61: { icon: '10', main: 'Rain', description: 'Небольшой дождь' },
  63: { icon: '10', main: 'Rain', description: 'Дождь' },
  65: { icon: '10', main: 'Rain', description: 'Сильный дождь' },
  // Freezing Rain: Light and heavy intensity
  66: { icon: '10', main: 'Freezing Rain', description: 'Дождь со снегом' },
  67: { icon: '10', main: 'Freezing Rain', description: 'Сильный дождь со снегом' },
  // Snow fall: Slight, moderate, and heavy intensity
  71: { icon: '13', main: 'Snowfall', description: 'Небольшой снегопад' },
  73: { icon: '13', main: 'Snowfall', description: 'Снегопад' },
  75: { icon: '13', main: 'Snowfall', description: 'Сильный снегопад' },
  // Snow grains
  77: { icon: '13', main: 'Snow grains', description: 'Снежные зерна' },
  // Rain showers: Slight, moderate, and violent
  80: { icon: '09', main: 'Rain shower', description: 'Небольшой проливной дождь' },
  81: { icon: '09', main: 'Rain shower', description: 'Проливной дождь' },
  82: { icon: '09', main: 'Rain shower', description: 'Сильный проливной дождь' },
  // Snow showers slight and heavy
  85: { icon: '13', main: 'Snow shower', description: 'Метель' },
  86: { icon: '13', main: 'Snow shower', description: 'Буран' },
  // Thunderstorm: Slight or moderate
  95: { icon: '11', main: 'Thunderstorm', description: 'Гроза' },
  // Thunderstorm with slight and heavy hail
  96: { icon: '11', main: 'Thunderstorm and hail', description: 'Гроза и небольшой град' },
  99: { icon: '11', main: 'Thunderstorm and hail', description: 'Гроза и сильный град' },
};
