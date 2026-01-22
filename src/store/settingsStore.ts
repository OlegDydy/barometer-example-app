import { shallowReactive, watchEffect } from 'vue';
import { clamp } from '../utils/clamp';
import type { OWMLocation } from '../services/OpenWeatherMap';

export type SettingsStore = {
  apiKey: string;
  updatePeriod: number;
  location: OWMLocation;
  lat: number;
  lon: number;
}

const KEY = "owm_settings";
export const HOUR = 3_600_000;

export const settingsStore = shallowReactive<SettingsStore>(loadState());

watchEffect(() => {
  const data = { ...settingsStore };
  data.updatePeriod = (data.updatePeriod / HOUR) | 0;
  localStorage.setItem(KEY, JSON.stringify(data));
});

function loadState() {
  const result: SettingsStore = {
    apiKey: '5796abbde9106b7da4febfae8c44c232',
    updatePeriod: 3_600_000,
    location: {
      name: 'Saransk',
      lat: 54.1838,
      lon: 45.1749,
    },
    lat: 54.1838,
    lon: 45.1749,
  };
  const stored = localStorage.getItem(KEY);
  try {
    if (stored) {
      const data: SettingsStore = JSON.parse(stored);
      if (typeof data.apiKey == 'string') result.apiKey = data.apiKey;
      if (typeof data.updatePeriod == 'number') result.updatePeriod = clamp(data.updatePeriod | 0, 1, 24) * HOUR;
      if (typeof data.location == 'object') {
        result.location.name = data.location.name;
        result.location.lat = data.lat;
        result.location.lon = data.lon;
      }
    }
  } catch {}
  return result;
}
