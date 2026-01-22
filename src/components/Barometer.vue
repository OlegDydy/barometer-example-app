<script setup lang="ts">
import { Cog } from 'lucide-vue-next';
import { computed, ref, shallowRef } from 'vue';
import { OpenWeatherMap, type OWMResponse } from '../services/OpenWeatherMap';
import { settingsStore } from '../store/settingsStore';
import { strftime } from '../utils/formatTime';
import BarsWidget from './BarsWidget.vue';
import Settings from './Settings.vue';
import SunWidget from './SunWidget.vue';
import WidgetNow from './WidgetNow.vue';
import WindWidget from './WindWidget.vue';

const settingsOpen = ref(false);
const data = shallowRef<null | OWMResponse>(null);

const dataSource = new OpenWeatherMap('', { name: 'Saransk', lat: settingsStore.lat, lon: settingsStore.lon });

function extractData<R extends 'minutely' | 'hourly' | 'daily'>(
  data: OWMResponse | undefined | null,
  range: R,
  attr: keyof OWMResponse[R][0],
) {
  if (!data) return undefined;

  let max = -Infinity;
  let min = Infinity;
  const result = data[range].map((item, i) => {
    const value = item[attr as keyof typeof item];
    if (value > max) max = value;
    if (value < min) min = value;
    return {
      value: value,
      percent: 0,
      label: i % 4 == 0 ? strftime('%H:%M', new Date(item.dt * 1000)) : undefined,
    };
  });
  const delta = max - min;
  for (const i of result) {
    i.percent = (i.value - min) / delta;
  }
  return result;
}

const tempData = computed(() => extractData(data.value, 'hourly', 'temp'));
const pressureData = computed(() => extractData(data.value, 'hourly', 'pressure'));
const humidityData = computed(() => extractData(data.value, 'hourly', 'humidity'));

async function updateData() {
  data.value = await dataSource.fetch({ lang: 'ru' });
}
updateData();

function openSettings() {
  settingsOpen.value = true;
}
</script>

<template>
  <main>
    <header class="header">
      <button class="actions _icon" title="Settings" @click="openSettings">
        <i class="icon"><Cog /></i>
      </button>
      <h1 class="center">Барометер</h1>
    </header>
    <hr />
    <div class="table">
      <WidgetNow :report="data" />
      <BarsWidget name="temp" :bar-data="tempData"><span>Температура</span></BarsWidget>
      <BarsWidget name="pressure" :bar-data="pressureData"><span>Давление</span></BarsWidget>
      <BarsWidget name="humidity" :bar-data="humidityData"><span>Влажность</span></BarsWidget>
      <SunWidget :current="data?.current" :day="data?.daily[0]" />
      <WindWidget :current="data?.current" />
    </div>
  </main>
  <Settings v-model:open="settingsOpen" />
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr;
  width: 64rem;
}

.header {
  position: relative;

  & > .actions {
    position: absolute;
    right: 0;
  }
}

.info {
  padding: 0.5rem;
}
</style>
