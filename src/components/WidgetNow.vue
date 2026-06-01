<script setup lang="ts">
import { CircleQuestionMark, Gauge, Thermometer } from 'lucide-vue-next';
import { capitalize } from 'vue';
import { IconMapping, AppUnits } from '../consts/weatherConsts';
import type { IDataSource } from '../services/IDataSource';

const { source } = defineProps<{ source: IDataSource }>();
</script>

<template>
  <div v-if="source.error" class="now card">
    <div>
      <p>Ошибка при загрузке данных. Проверьте свой API ключ в настройках</p>
    </div>
  </div>
  <div v-else class="now card" :class="{ loading: !source.loaded }">
    <div v-if="source.loaded">
      <p class="summary">
        <i class="icon" title="Температура"><Thermometer /></i> {{ source.current.temp }}
        {{ AppUnits[source.units].temp }} Ощущается как {{ source.current.feels_like }}{{ AppUnits[source.units].temp }}
      </p>
      <p class="summary">
        <i class="icon" title="Давление"><Gauge /></i> {{ source.current.pressure }} кПа
      </p>
      <i class="now__pictogram"
        ><component :is="IconMapping[source.current.weather[0]?.icon || '01d'] || CircleQuestionMark"
      /></i>
      <p>{{ capitalize(source.current.weather.map((i) => i.description).join(',')) }}</p>
      <h2 class="city">{{ source.location.name }}</h2>
      <p class="coords">{{ source.location.lat }}, {{ source.location.lon }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.now {
  grid-row: span 3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;

  &__pictogram > svg {
    height: 8rem;
    width: auto;
    stroke-width: 1px;
  }
}

.city {
  margin-bottom: 0;
}

.coords {
  font-size: 0.75rem;
  margin-top: 0;
  color: var(--muted);
}

.summary {
  margin-bottom: 0;

  &:first-child {
    margin-top: 0;
  }
  & + .summary {
    margin-top: 0.5rem;
  }
  & + :not(.summary) {
    margin-top: 1em;
  }
}
</style>
