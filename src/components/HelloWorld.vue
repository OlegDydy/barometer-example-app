<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watchEffect } from 'vue';

const canvas = useTemplateRef('canvas');
const ctx = computed(() => canvas.value?.getContext('2d') || null);

const controlPoints = reactive([0, 1, 2, 3]);
const size = 4;

type Vector2Like = [x: number, y: number];

function lagrange() {
  
}

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
    x = nx;
    y = ny;
  }
  return sum * 4;
}

function approx(a: number, b = 1, chain = [1, 1]): number {
  const ratio = a / b;
  // return b * 4 * (ratio + 1 / (ratio + 1));
  // return b * 4 * (ratio + 1 / (ratio + (1 / (ratio + (1 / (ratio + 1))))));
  // b * 4 * (ratio + 1 / (ratio + 1))
  const last = chain.length - 1;
  let sum = chain[last];
  for (let i = last; i--; ) {
    sum = chain[i] / (ratio + sum);
  }
  return 4 * b * (ratio + sum);
}

function fix(x: number) {
  if (x > 2) return 0;

  return 4*((0.006600646426239134 * x - 0.04658177262052619) * x + 0.1111427211658603) * x;
}

const ticks = 128;
const xRange: Vector2Like = [0, 10];
const colors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f'];
const refresh = ref(0);

function updateRange(range: Vector2Like, value): Vector2Like {
  if (value < range[0]) range[0] = value;
  if (value > range[1]) range[1] = value;
  return range;
}

function plot(ctx: CanvasRenderingContext2D) {
  refresh.value;

  const values: [number[], number[]] = [[], []];
  const yRange: Vector2Like = [+Infinity, -Infinity];
  for (let i = 0; i <= ticks; ++i) {
    const x = xRange[0] + (xRange[1] - xRange[0]) * (i / ticks);

    let y = ellipse(x) - approx(x);
    values[0][i] = y;
    updateRange(yRange, y);

    y = fix(x);
    values[1][i] = y;
    updateRange(yRange, y);
  }

  let step = Math.log10(yRange[1] - yRange[0]);
  if (step < 0) {
    step = Math.ceil(-step);
    step = 1 / 10 ** step / 2;
  } else {
    step = Math.ceil(step);
    step = 10 ** step / 2;
  }

  // render
  // round
  yRange[0] = Math.floor(yRange[0] / step) * step;
  yRange[1] = Math.ceil(yRange[1] / step) * step;

  // step = 0.05;
  // yRange[0] = -0.10;
  // yRange[1] = 0.35;

  const { width, height } = ctx.canvas;
  const scaleY = height / (yRange[1] - yRange[0]);
  const scaleX = width / (xRange[1] - xRange[0]);
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < values.length; ++i) {
    const row = values[i] as number[];

    let x = xRange[0];
    let y = (row[0] as number) - yRange[0];
    ctx.beginPath();
    ctx.moveTo(x * scaleX, height - y * scaleY);
    for (let j = 1; j <= ticks; ++j) {
      x = xRange[0] + (xRange[1] - xRange[0]) * (j / ticks);
      y = (row[j] as number) - yRange[0];

      ctx.lineTo(x * scaleX, height - y * scaleY);
    }
    ctx.strokeStyle = colors[i % colors.length] as string;
    ctx.stroke();
  }
}

watchEffect(() => {
  if (!ctx.value) return;

  plot(ctx.value);
});

function invalidate() {
  refresh.value++;
}
</script>

<template>
  <button @click="invalidate">render</button>
  <canvas ref="canvas" width="1280" height="720"></canvas>
</template>

<style scoped>
canvas {
  border: 1px dashed currentColor;
}
</style>
