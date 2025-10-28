<script setup lang="ts">
import VButton from '@/components/atoms/v-button.vue';

const emit = defineEmits<{
  'click:horse-list': []
  'click:generate-program': []
  'click:start-pause-race': []
}>();

const handleHorseList = () => {
  emit('click:horse-list');
};

const handleGenerateProgram = () => {
  emit('click:generate-program');
};

const handleStartPauseRace = () => {
  emit('click:start-pause-race');
};
</script>

<template>
  <header class="flex justify-between items-center px-8 py-6 bg-white border-b-2 border-cool-gray-200 -mx-8 -mt-8 mb-8">
    <div class="flex gap-4">
      <v-button variant="primary" size="md" @click="handleHorseList">
        Horse List
      </v-button>
    </div>
    
    <div class="flex gap-4">
      <v-button variant="secondary" size="md" @click="handleGenerateProgram">
        Generate Program
      </v-button>
      <v-button variant="accent" size="md" @click="handleStartPauseRace">
        Start/Pause Race
      </v-button>
    </div>
  </header>
</template>

