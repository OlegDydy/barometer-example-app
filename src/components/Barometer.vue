<script setup lang="ts">
import { Cog, RotateCw } from 'lucide-vue-next';
import { computed, ref, watch, watchEffect } from 'vue';
import { OWMUnits } from '../consts/openWeatherConsts';
import { OpenWeatherMap } from '../services/OpenWeatherMap';
import { settingsStore } from '../store/settingsStore';
import type { OWMHourly } from '../types/openWeatherMap';
import { strftime } from '../utils/formatTime';
import BarsWidget from './BarsWidget.vue';
import Settings from './Settings.vue';
import SunWidget from './SunWidget.vue';
import WidgetNow from './WidgetNow.vue';
import WindWidget from './WindWidget.vue';

const HOUR = 3_600_000;

const settingsOpen = ref(false);

const weather = new OpenWeatherMap(
  () => settingsStore.value.apiKey,
  () => settingsStore.value.location,
);

function extractData(data: OWMHourly[] | null | undefined, attr: keyof OWMHourly) {
  if (!data) return undefined;

  const result = data.map((item, i) => {
    const value = item[attr as keyof typeof item];
    if (typeof value != 'number') throw new Error('Not a numeric data row');

    return {
      value: value,
      label: i % 4 == 0 ? strftime('%H:%M', new Date(item.dt * 1000)) : undefined,
    };
  });
  return result;
}

const tempData = computed(() => extractData(weather.loaded ? weather.hourly : null, 'temp'));
const pressureData = computed(() => extractData(weather.loaded ? weather.hourly : null, 'pressure'));
const humidityData = computed(() => extractData(weather.loaded ? weather.hourly : null, 'humidity'));

function updateData() {
  weather.refresh();
}
watch(
  () => [settingsStore.value.apiKey, settingsStore.value.location.lat, settingsStore.value.location.lon],
  updateData,
);
updateData();

watchEffect((onCleanup) => {
  const refreshInterval = setInterval(updateData, settingsStore.value.updatePeriod * HOUR);
  onCleanup(() => {
    clearInterval(refreshInterval);
  });
});

function openSettings() {
  settingsOpen.value = true;
}
</script>

<template>
  <main>
    <header class="header">
      <button class="float-left _icon" title="Обновить данные" @click="updateData">
        <RotateCw />
      </button>
      <button class="float-right _icon" title="Настройки" @click="openSettings">
        <Cog />
      </button>
      <h1 class="center">Барометр</h1>
    </header>
    <hr />
    <div class="table">
      <WidgetNow :source="weather" />
      <BarsWidget name="temp" :bar-data="tempData" :suffix="OWMUnits[weather.units].temp"
        ><span>Температура ({{ OWMUnits[weather.units].temp }})</span></BarsWidget
      >
      <BarsWidget name="pressure" :bar-data="pressureData" suffix=" кПа"><span>Давление (кПа)</span></BarsWidget>
      <BarsWidget name="humidity" :bar-data="humidityData" suffix="%"><span>Влажность (%)</span></BarsWidget>
      <SunWidget :source="weather" />
      <WindWidget :source="weather" />
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
}
.float-left {
  position: absolute;
  left: 0;
}

.float-right {
  position: absolute;
  right: 0;
}

.info {
  padding: 0.5rem;
}
</style>
