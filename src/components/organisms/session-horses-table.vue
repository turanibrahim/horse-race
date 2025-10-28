<script setup lang="ts">
import type { Horse } from '@/types';
import HorseTable from '@/components/molecules/horse-table.vue';

interface SessionHorsesTableProps {
  horses: Horse[]
  sessionName: string
}

const props = defineProps<SessionHorsesTableProps>();
</script>

<template>
  <div class="session-horses-table">
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-cool-gray-900">
        {{ sessionName }} - Horses
      </h3>
    </div>

    <horse-table :horses="props.horses" />
  </div>
</template>

<style>
.session-horses-table {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}
</style>
