<script setup lang="ts">
import { Navigation2, Wind, WindArrowDown } from 'lucide-vue-next';
import { computed } from 'vue';
import { OWMUnits } from '../consts/openWeatherConsts';
import { windDirections as dir } from '../consts/windDirections';
import { OpenWeatherMap } from '../services/OpenWeatherMap';

const { source } = defineProps<{ source: OpenWeatherMap }>();

const direction = computed(() => (source.loaded ? Math.round((source.current.wind_deg * dir.length) / 360) : 0));
</script>

<template>
  <div class="wind card" :class="{ loading: !source.loaded }">
    <template v-if="source.loaded">
      <p>Ветер</p>
      <div class="wind__params">
        <span
          ><i class="icon" title="Ветер"><Wind /></i> {{ source.current.wind_speed }}
          {{ OWMUnits[source.units].speed }}</span
        >
        <span
          ><i class="icon" title="Направление ветра"
            ><Navigation2 :style="{ transform: `rotate(${0.75 - direction / dir.length}turn)` }" /></i
          >{{ ' ' }}<abbr :title="dir[direction]?.name">{{ dir[direction]?.abbr }}</abbr> ({{
            source.current.wind_deg
          }}°)</span
        >
        <span class="icon" title="Порывы"
          ><WindArrowDown /><i></i> порывы до {{ source.current.wind_gust }} {{ OWMUnits[source.units].speed }}</span
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
