<script setup lang="ts">
import { Sun, Sunrise, Sunset } from 'lucide-vue-next';
import type { OWMCurrent, OWMDaily } from '../services/OpenWeatherMap';
import { strftime } from '../utils/formatTime';

const { current, day } = defineProps<{ current?: OWMCurrent; day?: OWMDaily }>();
</script>

<template>
  <div data-slot="sun" class="sun card" :class="{ _indifferent: !current }">
    <template v-if="current && day">
      <p>Солнце</p>
      <div class="sun__params">
        <span
          ><i class="icon" title="Ультрафиолетовый индекс"><Sun /><sub>UV</sub></i> {{ current.uvi }}</span
        ><span
          ><i class="icon" title="Восход"><Sunrise /></i> {{ strftime('%H:%M', day.sunrise * 1000) }}</span
        ><span
          ><i class="icon" title="Заход"><Sunset /></i> {{ strftime('%H:%M', day.sunset * 1000) }}</span
        >
      </div>
    </template>
    <template v-else>
      <p><br /></p>
      <br />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.sun {
  padding: 0.5rem;

  &__params {
    display: flex;
    justify-content: space-around;
  }
}
</style>
