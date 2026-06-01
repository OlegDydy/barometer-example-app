<script setup lang="ts">
import { Cog, RotateCw } from 'lucide-vue-next';
import { computed, ref, watch, watchEffect } from 'vue';
import { AppUnits } from '../consts/weatherConsts';
import { OpenWeatherMap } from '../services/OpenWeatherMap';
import { DataSource, settingsStore } from '../store/settingsStore';
import { strftime } from '../utils/formatTime';
import BarsWidget from './BarsWidget.vue';
import Settings from './Settings.vue';
import SunWidget from './SunWidget.vue';
import WidgetNow from './WidgetNow.vue';
import WindWidget from './WindWidget.vue';
import { OpenMeteo } from '../services/OpenMeteo';
import type { HourlyConditions, IDataSource } from '../services/IDataSource';

const HOUR = 3_600_000;

const settingsOpen = ref(false);

const weather = computed<IDataSource>(() => {
  if (settingsStore.value.source == DataSource.openWeatherMap) {
    return new OpenWeatherMap(
      () => settingsStore.value.apiKey,
      () => settingsStore.value.location,
    )
  }

  return new OpenMeteo(() => settingsStore.value.location);
});

function extractData(data: HourlyConditions[] | null | undefined, attr: keyof HourlyConditions) {
  if (!data) return undefined;

  const result = data.map((item, i) => {
    const value = item[attr as keyof typeof item];
    if (typeof value != 'number') throw new Error('Not a numeric data row');

    return {
      value: value,
      label: i % 4 == 0 ? strftime('%H:%M', item.time) : undefined,
    };
  });
  return result;
}

const tempData = computed(() => extractData(weather.value.loaded ? weather.value.hourly : null, 'temp'));
const pressureData = computed(() => extractData(weather.value.loaded ? weather.value.hourly : null, 'pressure'));
const humidityData = computed(() => extractData(weather.value.loaded ? weather.value.hourly : null, 'humidity'));

function updateData() {
  weather.value.refresh();
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
      <BarsWidget name="temp" :bar-data="tempData"
        ><span>Температура ({{ AppUnits[weather.units].temp }})</span></BarsWidget
      >
      <BarsWidget name="pressure" :bar-data="pressureData"><span>Давление (кПа)</span></BarsWidget>
      <BarsWidget name="humidity" :bar-data="humidityData"><span>Влажность (%)</span></BarsWidget>
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
