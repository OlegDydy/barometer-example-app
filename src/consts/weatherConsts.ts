import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Cloudy,
  Moon,
  Snowflake,
  Sun,
  Waves,
  X,
} from 'lucide-vue-next';

export const IconMapping: Record<string, typeof Sun> = {
  // Clear sky
  '01d': Sun,
  '01n': Moon,
  // few clouds
  '02d': CloudSun,
  '02n': CloudMoon,
  // scattered clouds
  '03d': Cloud,
  '03n': Cloud,
  // broken clouds
  '04d': Cloudy,
  '04n': Cloudy,
  // shower rain
  '09d': CloudRain,
  '09n': CloudRain,
  // rain
  '10d': CloudSunRain,
  '10n': CloudMoonRain,
  // thunderstorm
  '11d': CloudLightning,
  '11n': CloudLightning,
  // snow
  '13d': Snowflake,
  '13n': Snowflake,
  // mist
  '50d': Waves,
  '50n': Waves,
  // Extras
  'x01d': CloudDrizzle,
  'x01n': CloudDrizzle,
  // Freezing Drizzle
  'x02d': CloudSnow,
  'x02n': CloudSnow,
  'unk': X,
};

export type AppUnit = 'standard' | 'metric' | 'imperial';

type OWMUnitSet = {
  temp: string;
  speed: string;
};

export const AppUnits: Record<AppUnit, OWMUnitSet> = {
  standard: {
    temp: '°K',
    speed: 'м/с',
  },
  metric: {
    temp: '°C',
    speed: 'м/с',
  },
  imperial: {
    temp: '°F',
    speed: 'миль/ч',
  },
};
