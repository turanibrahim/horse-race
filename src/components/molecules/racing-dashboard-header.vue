<script setup lang="ts">
import { ref } from 'vue';
import VButton from '@/components/atoms/v-button.vue';

const emit = defineEmits<{
  'click:horse-list': []
  'click:generate-program': []
  'click:start-pause-race': []
}>();

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleHorseList = () => {
  closeMobileMenu();
  emit('click:horse-list');
};

const handleGenerateProgram = () => {
  closeMobileMenu();
  emit('click:generate-program');
};

const handleStartPauseRace = () => {
  closeMobileMenu();
  emit('click:start-pause-race');
};
</script>

<template>
  <header class="relative flex justify-between items-center px-4 py-4 md:px-8 md:py-6 bg-white border-b-2 border-cool-gray-200 mb-4 md:mb-8">
    <!-- Desktop Menu -->
    <div class="hidden md:flex gap-4">
      <v-button variant="primary" size="md" @click="handleHorseList">
        Horse List
      </v-button>
    </div>
    
    <div class="hidden md:flex gap-4">
      <v-button variant="secondary" size="md" @click="handleGenerateProgram">
        Generate Program
      </v-button>
      <v-button variant="accent" size="md" @click="handleStartPauseRace">
        Start/Pause Race
      </v-button>
    </div>

    <!-- Mobile Menu Button -->
    <button 
      aria-label="Toggle menu"
      class="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-cool-gray-100 transition-colors"
      @click="toggleMobileMenu"
    >
      <svg 
        class="w-6 h-6 text-cool-gray-700" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Backdrop for mobile menu -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/25 z-40 md:hidden"
      @click="closeMobileMenu"
    />

    <!-- Mobile Menu Dropdown -->
    <div 
      v-if="isMobileMenuOpen"
      class="absolute top-full left-0 right-0 mt-2 mx-4 bg-white border-2 border-cool-gray-200 rounded-lg shadow-lg z-50 md:hidden"
    >
      <nav class="flex flex-col p-4 gap-3">
        <v-button 
          variant="primary" 
          size="md" 
          class="w-full"
          @click="handleHorseList"
        >
          Horse List
        </v-button>
        <v-button 
          variant="secondary" 
          size="md" 
          class="w-full"
          @click="handleGenerateProgram"
        >
          Generate Program
        </v-button>
        <v-button 
          variant="accent" 
          size="md" 
          class="w-full"
          @click="handleStartPauseRace"
        >
          Start/Pause Race
        </v-button>
        <button
          class="mt-2 py-2 px-4 text-cool-gray-600 hover:text-cool-gray-900 hover:bg-cool-gray-50 rounded-md transition-colors"
          @click="closeMobileMenu"
        >
          Close
        </button>
      </nav>
    </div>
  </header>
</template>

