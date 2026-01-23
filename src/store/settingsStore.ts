import type { OWMLocation } from '../services/OpenWeatherMap';
import { PersistentStore } from './PersistentStore';

export type SettingsStore = {
  apiKey: string;
  updatePeriod: number;
  location: OWMLocation;
};

export const settingsStore = new PersistentStore('owm_settings', {
  apiKey: '',
  updatePeriod: 1,
  location: {
    name: 'Saransk',
    lat: 54.1838,
    lon: 45.1749,
  },
} as SettingsStore);
