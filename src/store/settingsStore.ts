import { shallowReactive } from 'vue';

export const settingsStore = shallowReactive({
  apiKey: '',
  updatePeriod: 3600_000,
});
