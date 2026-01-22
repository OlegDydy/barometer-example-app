<script setup lang="ts">
const props = defineProps<{ name?: string; barData?: { value: number, percent: number, label?: string }[] }>();

</script>

<template>
  <div :data-slot="name || 'bars'" class="bars card" :class="{ _indifferent: !barData }">
    <template v-if="barData">
      <slot>Bars</slot>
      <div class="plot">
        <div v-for="bar, id in barData" :key="id" :style="`height: ${bar.percent * 100}% `">
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

  & > * {
    position: relative;
    border-radius: 0.25rem;
    background-color: cornflowerblue;
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
</style>
