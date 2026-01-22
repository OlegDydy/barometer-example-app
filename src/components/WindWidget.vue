<script setup lang="ts">
import { Navigation2, Wind, WindArrowDown } from 'lucide-vue-next';
import { computed } from 'vue';
import { OWMUnits, type OWMCurrent } from '../services/OpenWeatherMap';

const { current } = defineProps<{ current?: OWMCurrent }>();

const turns = [
  { abbr: 'В', name: 'Восток' },
  { abbr: 'ВСВ', name: 'Востоко-Северо-Восток' },
  { abbr: 'СВ', name: 'Северо-Восток' },
  { abbr: 'ССВ', name: 'Северо-Северо-Восток' },
  { abbr: 'С', name: 'Север' },
  { abbr: 'ССЗ', name: 'Северо-Северо-Запад' },
  { abbr: 'СЗ', name: 'Северо-Запад' },
  { abbr: 'ЗСЗ', name: 'Западо-Северо-Запад' },
  { abbr: 'З', name: 'Запад' },
  { abbr: 'ЗЮЗ', name: 'Западо-Юго-Запад' },
  { abbr: 'ЮЗ', name: 'Юго-Запад' },
  { abbr: 'ЮЮЗ', name: 'Юго-Юго-Запад' },
  { abbr: 'Ю', name: 'Юг' },
  { abbr: 'ЮЮВ', name: 'Юго-Юго-Восток' },
  { abbr: 'ЮВ', name: 'Юго-Восток' },
  { abbr: 'ВЮВ', name: 'Востоко-Юго-Восток' },
];

const direction = computed(() => Math.round(((current?.wind_deg || 0) * turns.length) / 360));
</script>

<template>
  <div data-slot="wind" class="wind card" :class="{ _indifferent: !current }">
    <template v-if="current">
      <p>Ветер</p>
      <div class="wind__params">
        <span
          ><i class="icon" title="Ветер"><Wind /></i> {{ current.wind_speed }} {{ OWMUnits.standard.speed }}</span
        >
        <span
          ><i class="icon" title="Направление ветра"
            ><Navigation2 :style="{ transform: `rotate(${0.75 - direction / turns.length}turn)` }" /></i
          >{{ ' ' }}<abbr :title="turns[direction]?.name">{{ turns[direction]?.abbr }}</abbr> ({{
            current.wind_deg
          }}°)</span
        >
        <span class="icon" title="Порывы"
          ><WindArrowDown /><i></i> порывы до {{ current.wind_gust }}{{ OWMUnits.standard.speed }}</span
        >
      </div>
    </template>
    <template v-else
      ><p><br /></p>
      <br
    /></template>
  </div>
</template>

<style lang="scss" scoped>
.wind {
  padding: 0.5rem;

  &__params {
    display: flex;
    justify-content: space-around;
  }
}
</style>
