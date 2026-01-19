<script setup lang="ts">
import { computed, reactive, useTemplateRef, watchEffect } from 'vue';

const canvas = useTemplateRef('canvas');
const ctx = computed(() => canvas.value?.getContext('2d') || null);

const controlPoints = reactive(<number>[0, 1, 2, 3]);
const size = 4;

const SEGMENTS = 128;
function ellipse(rx: number, ry = 1): number {
  let sum = 0;
  let x = rx;
  let y = 0;
  for (let i = 1; i <= SEGMENTS; ++i) {
    const a = ((Math.PI / 2) * i) / SEGMENTS;
    const nx = rx * Math.cos(a);
    const ny = ry * Math.sin(a);
    sum += Math.hypot(nx - x, ny - y);
  }
  return sum * 4;
}

function approx(a: number, b = 1, chain = [1, 1]): number {
  const ratio = a / b;
  // return b * 4 * (1 / (ratio + 1) + ratio);
  const last = chain.length - 1;
  let sum = chain[last];
  for (let i = last; i--; ) {
    sum = chain[i] / (ratio + sum);
  }
  return 4 * b * sum;
}

function fix(x: number) {
  if (x > 2) return 0;

  return ((0.006600646426239134 * x - 0.04658177262052619) * x + 0.1111427211658603) * x;
}

type Vector2Like = [x: number, y: number];
const ticks = 128;
const xRange: Vector2Like = [0, 10];
const colors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f'];

function updateRange(range: Vector2Like, value): Vector2Like {
  if (value < range[0]) range[0] = value;
  if (value > range[1]) range[1] = value;
  return range;
}

function plot(ctx: CanvasRenderingContext2D) {
  const values: number[][] = [[], []];
  const yRange: Vector2Like = [+Infinity, -Infinity];
  for (let i = 0; i <= ticks; ++i) {
    const x = xRange[0] + (xRange[1] - xRange[0]) * (i / ticks);

    let y = ellipse(x) - approx(x);
    values[0][i] = y;
    updateRange(yRange, y);
    
    y = fix(x);
    values[0][i] = y;
    updateRange(yRange, y);
  }
  
  let step = Math.log10();
}

watchEffect(() => {});
</script>

<template>
  <canvas ref="canvas" width="1280" height="720"></canvas>
</template>

<style scoped>
canvas {
  border: 1px dashed currentColor;
}
</style>
