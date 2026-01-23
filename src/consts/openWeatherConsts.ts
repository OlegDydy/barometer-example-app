import {
  Cloud,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudSun,
  CloudSunRain,
  Cloudy,
  Moon,
  Snowflake,
  Sun,
  Waves,
} from 'lucide-vue-next';

export const OWMIconMapping: Record<string, typeof Sun> = {
  '01d': Sun,
  '01n': Moon,
  '02d': CloudSun,
  '02n': CloudMoon,
  '03d': Cloud,
  '03n': Cloud,
  '04d': Cloudy,
  '04n': Cloudy,
  '09d': CloudSunRain,
  '09n': CloudMoonRain,
  '10d': CloudRain,
  '10n': CloudRain,
  '11d': CloudLightning,
  '11n': CloudLightning,
  '13d': Snowflake,
  '13n': Snowflake,
  '50d': Waves,
  '50n': Waves,
};

export type OWMUnit = 'standard' | 'metric' | 'imperial';

type OWMUnitSet = {
  temp: string;
  speed: string;
};

export const OWMUnits: Record<OWMUnit, OWMUnitSet> = {
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
