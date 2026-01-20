<script setup lang="ts">
import { shallowReactive } from 'vue';
import { settingsStore } from '../store/settingsStore';

const { open } = defineProps<{ open?: boolean }>();

const state = shallowReactive({ ...settingsStore });
</script>

<template>
  <dialog :open>
    <h1>Settings</h1>
    <label for="apiKey">ApiKey</label>
    <input id="apiKey" type="text" v-model="state.apiKey" placeholder="Paste here your OpenWeatherMap API KEY" />

    <label for="updatePeriod">Update period</label>
    <input id="updatePeriod" type="number" v-model="state.updatePeriod" min="1" max="24" />
  </dialog>
</template>

<style lang="scss" scoped></style>
