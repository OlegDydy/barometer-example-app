<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { reactive, useTemplateRef, watchPostEffect } from 'vue';
import { settingsStore } from '../store/settingsStore';
import { clamp } from '../utils/clamp';

const open = defineModel('open', { type: Boolean, default: false });
const dialog = useTemplateRef('dialog');

const state = reactive({ ...settingsStore.value, location: { ...settingsStore.value.location } });

const supportsDialog = 'HTMLDialogElement' in globalThis;
watchPostEffect(() => {
  if (!dialog.value) return;

  if (open.value) {
    if (supportsDialog) {
      dialog.value.showModal();
    } else {
      dialog.value.setAttribute('open', 'modal');
    }
  } else {
    if (supportsDialog) {
      dialog.value.close();
    } else {
      dialog.value.removeAttribute('open');
    }
  }
});

function save() {
  const store = settingsStore.value;

  store.apiKey = state.apiKey;
  store.updatePeriod = clamp(state.updatePeriod | 0, 1, 24);
  store.location = { ...state.location };
}

function close(e: Event) {
  e.preventDefault();
  open.value = false;
}
</script>

<template>
  <Transition>
    <dialog v-if="open" ref="dialog" closedby="any" @cancel="close">
      <button class="close _icon _small" @click="close">
        <X />
      </button>

      <h2 style="margin-top: 1rem">Настройки</h2>

      <div class="entry">
        <label for="apiKey">API ключ</label>
        <input
          id="apiKey"
          class="text-center"
          type="text"
          v-model="state.apiKey"
          size="30"
          placeholder="Вставьте свой OpenWeatherMap API ключ"
        />
      </div>

      <div class="entry">
        <label for="updatePeriod">Период обновления</label>
        <div class="entry-combined">
          <input id="updatePeriod" type="number" v-model="state.updatePeriod" min="1" max="24" />
          <label for="updatePeriod">ч</label>
        </div>
      </div>

      <div class="entry">
        <label for="location_name">Название населенного пункта</label>
        <input
          id="location_name"
          type="text"
          v-model="state.location.name"
          placeholder="Названние которое будет отображаться в виджете"
        />
      </div>

      <div class="entry">
        <label for="lat">Координаты</label>
        <div class="entry-combined">
          <input id="lat" type="number" v-model="state.location.lat" min="-90" max="90" step="0.0001" size="5" />
          <label for="lat">Шир</label>
          <input id="lon" type="number" v-model="state.location.lon" min="-180" max="180" step="0.0001" size="5" />
          <label for="lon">Дол</label>
        </div>
      </div>
      <hr />
      <button @click="save">Сохранить</button>
    </dialog>
  </Transition>
  <Transition>
    <div v-if="open" class="backdrop" @click="close"></div>
  </Transition>
</template>

<style lang="scss" scoped>
dialog {
  --transition: 0.2s;
  position: fixed;
  border: none;
  inset: 0;
  z-index: 11;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  width: 32rem;

  .close {
    position: absolute;
    right: 0.25rem;
    top: 0.25rem;
  }

  &.v-enter-active,
  &.v-leave-active {
    transition: opacity var(--transition) ease;

    & + .backdrop {
      transition:
        opacity var(--transition) ease,
        backdrop-filter var(--transition) ease;
    }
  }

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;

    & + .backdrop {
      opacity: 0;
      backdrop-filter: blur(0);
    }
  }
}

/* For old browsers */
.backdrop {
  --transition: 0.2s;
  display: none;
  visibility: hidden;
  position: fixed;
}

.backdrop {
  z-index: 10;
  inset: 0;
  background: #0004;
  backdrop-filter: blur(0.125rem);
}

dialog::backdrop {
  display: none;
}

dialog[open] + .backdrop {
  display: block;
  visibility: visible;
}
</style>
