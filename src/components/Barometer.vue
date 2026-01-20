<script setup lang="ts">
import { Cog, Sun } from 'lucide-vue-next';

/*
+--------+----------+
|        |   temp   |
|  now   | pressure |
|        | humidity |
+--------+----------+
|  sun   |   wind   |
+--------+----------+
*/
</script>

<template>
  <main class="card">
    <header class="header">
      <button class="actions _icon" title="Settings"><Cog /></button>
      <h1 class="center">Barometer</h1>
    </header>
    <hr />
    <div class="table">
      <div data-slot="now">
        <Sun />
      </div>
      <div class="content" data-slot="temp"><span>Temperature graph</span></div>
      <div class="content" data-slot="pressure"><span>Pressure graph</span></div>
      <div class="content" data-slot="humidity"><span>Humidity graph</span></div>
      <div class="info" data-slot="sun"><span>Info About Sun</span></div>
      <div class="info" data-slot="wind"><span>Info About Wind</span></div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr;
  width: 64rem;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;

    background: oklab(from currentcolor l a b / 0.1);
    border-radius: 0.5rem;
  }

  & > [data-slot='now'] {
    grid-row: span 3;
  }
}

.header {
  position: relative;

  & > .actions {
    position: absolute;
    right: 0;
  }
}

._icon {
  padding: 0.5rem;
  font-size: 1rem;
  position: absolute;
  right: 0;

  & > svg {
    display: block;
  }
}

.content {
  height: 8rem;
  padding: 0.25rem 0.5rem;
}

.info {
  padding: 0.5rem;
}

</style>
