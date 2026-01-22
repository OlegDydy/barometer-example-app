<script setup lang="ts">
import { CircleQuestionMark, Gauge, Thermometer } from 'lucide-vue-next';
import { capitalize, computed } from 'vue';
import { OWMIconMapping, OWMUnits, type OWMResponse } from '../services/OpenWeatherMap';
import { settingsStore } from '../store/settingsStore';

const { report } = defineProps<{ report?: OWMResponse | null }>();

const current = computed(() => {
  return report?.current;
});
const conditions = computed(() => current.value?.weather || []);
</script>

<template>
  <div data-slot="now" class="now card" :class="{ _indifferent: !report }">
    <div v-if="current">
      <p class="summary">
        <i class="icon" title="Температура"><Thermometer /></i> {{ current.temp }}
        {{ OWMUnits.standard.temp }} Ощущается как {{ current.feels_like }}{{ OWMUnits.standard.temp }}
      </p>
      <p class="summary">
        <i class="icon" title="Давление"><Gauge /></i> {{ current.pressure }} кПа
      </p>
      <i class="now__pictogram"><component :is="OWMIconMapping[conditions[0]?.icon || '01d'] || CircleQuestionMark" /></i>
      <p>{{ capitalize(conditions.map((i) => i.description).join(',')) }}</p>
      <h2 class="city">{{ settingsStore.location.name }}</h2>
      <p class="coords">{{ settingsStore.lat }}, {{ settingsStore.lon }}</p>
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
}

.now__pictogram > svg {
  height: 8rem;
  width: auto;
  stroke-width: 1px;
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
