<script setup lang="ts">
import { Sun, Sunrise, Sunset } from 'lucide-vue-next';
import type { IDataSource } from '../services/IDataSource';
import { strftime } from '../utils/formatTime';

defineProps<{ source: IDataSource }>();
</script>

<template>
  <div class="sun card" :class="{ loading: !source.loaded }">
    <template v-if="source.loaded">
      <p>Солнце</p>
      <div class="sun__params">
        <span
          ><i class="icon" title="Ультрафиолетовый индекс"><Sun /><sub>UV</sub></i> {{ source.current.uvi }}</span
        ><span
          ><i class="icon" title="Восход"><Sunrise /></i> {{ strftime('%H:%M', source.current.sunrise) }}</span
        ><span
          ><i class="icon" title="Заход"><Sunset /></i> {{ strftime('%H:%M', source.current.sunset) }}</span
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
