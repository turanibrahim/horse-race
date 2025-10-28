<script setup lang="ts">
import VButton from '@/components/atoms/v-button.vue';

const handleHorseList = () => {
};

const handleGenerateProgram = () => {
};

const handleStartPauseRace = () => {
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

