<script setup lang="ts">
import VDrawer from '@/components/atoms/v-drawer.vue';
import HorseTable from '@/components/molecules/horse-table.vue';
import VButton from '@/components/atoms/v-button.vue';
import { useHorseStore } from '@/store/horse.store';
import { computed } from 'vue';

interface HorseListDrawerProps {
  modelValue: boolean
}

const props = defineProps<HorseListDrawerProps>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const horseStore = useHorseStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const handleClose = () => {
  isOpen.value = false;
};
</script>

<template>
  <v-drawer
    v-model="isOpen"
    position="left"
    width="800px"
    :overlay="true"
    :close-on-overlay-click="true"
  >
    <template #header="{ close }">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-cool-gray-900">
          Horse List
        </h2>
        <v-button
          variant="ghost"
          size="sm"
          @click="close"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </v-button>
      </div>
    </template>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-cool-gray-600">
          Total Horses: <span class="font-semibold text-cool-gray-900">{{ horseStore.horses.length }}</span>
        </p>
      </div>

      <horse-table :horses="horseStore.horses" />
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <v-button
          variant="outline"
          size="md"
          @click="handleClose"
        >
          Close
        </v-button>
      </div>
    </template>
  </v-drawer>
</template>
