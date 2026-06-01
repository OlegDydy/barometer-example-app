import type { GeoLocation } from '../types/GeoLocation';
import { PersistentStore } from './PersistentStore';

export const enum DataSource {
  openWeatherMap = 'openWeatherMap',
  openMeteo = 'openMeteo',
}

export type SettingsData = {
  apiKey: string;
  updatePeriod: number;
  source: DataSource;
  location: GeoLocation;
};

class SettingsStore extends PersistentStore<SettingsData> {
  constructor() {
    super('owm_settings', {
      apiKey: '',
      updatePeriod: 1,
      source: DataSource.openMeteo,
      location: {
        name: 'Saransk',
        lat: 54.1838,
        lon: 45.1749,
      },
    });
  }

  protected version() {
    return 1;
  }

  protected migrate(version: number, oldData: SettingsData): SettingsData {
    if (version < 1) {
      console.log('Migrate');
      oldData.source = DataSource.openMeteo;
    }
    return oldData;
  }
}

export const settingsStore = new SettingsStore();
