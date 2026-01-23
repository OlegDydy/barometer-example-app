<script setup lang="ts">
import { computed } from 'vue';

type PlotDataItem = { value: number; label?: string };

const { barData } = defineProps<{ barData?: PlotDataItem[] }>();

function limits(dataset: PlotDataItem[]): [min: number, max: number] {
  let max = -Infinity;
  let min = Infinity;
  for (const item of dataset) {
    if (item.value > max) max = item.value;
    if (item.value < min) min = item.value;
  }
  let size = max - min;

  if (size == 0) {
    size = 1;
    min -= 0.5;
    max += 0.5;
  }
  return [min, max];
}

function selectStepSize(min: number, max: number) {
  let size = max - min;

  let step = Math.log10(size);
  if (step < 0) {
    step = 1 / 10 ** Math.round(-step);
  } else {
    step = 10 ** Math.round(step);
  }
  let ticks = Math.round(size / step);
  if (ticks < 4) {
    step /= 2;
    ticks *= 2;
  }
  return step;
}

const displayData = computed(() => {
  if (!barData) return { labels: ['', '0', ''], values: [] };

  // Find limits
  let [min, max] = limits(barData);
  const step = selectStepSize(min, max);
  const ticks = Math.round((max - min) / step);

  // Adjust borders according to step size
  min = Math.floor(min / step) * step;
  max = Math.ceil(max / step) * step;

  const size = max - min;
  const values = barData.map(({ value, label }) => ({ value, percent: size > 0 ? (value - min) / size : 0.5, label }));
  const labels: string[] = [];

  for (let i = ticks + 1; i--; ) {
    let value = min + step * i;
    value = Math.round(value * 10) / 10;

    labels.push(value.toString());
  }
  return { labels, values };
});
</script>

<template>
  <div class="bars card" :class="{ loading: !barData }">
    <template v-if="barData">
      <slot>Bars</slot>
      <div class="plot" ref="plot">
        <div class="plot__labels">
          <span v-for="(label, id) in displayData.labels" :key="id">{{ label }}</span>
        </div>
        <div v-for="(bar, id) in displayData.values" :key="id" :style="`height: ${bar.percent * 100}% `">
          <span v-if="bar.label">{{ bar.label }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bars {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  height: 8rem;
}

.plot {
  width: 100%;
  max-width: 32rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  gap: 0.25rem;
  align-items: end;
  padding-bottom: 1.2em;

  & > :not(.plot__labels) {
    position: relative;
    border-radius: 0.25rem;
    background-color: var(--primary);
    width: 1rem;
    flex: 0 0 0.75rem;

    & > span {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 0;
      white-space: nowrap;
    }
  }
}

.plot__labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  text-align: right;
  font-size: 0.75rem;
  color: var(--muted);
  white-space: nowrap;
  position: sticky;
  left: 0;
  z-index: 1;

  & > *::after {
    content: ' -';
    display: inline-block;
  }

  & > :first-child::after {
    color: transparent;
    border-top: 1px solid var(--muted);
  }

  & > :last-child::after {
    color: transparent;
    border-bottom: 1px solid var(--muted);
  }
}
</style>
