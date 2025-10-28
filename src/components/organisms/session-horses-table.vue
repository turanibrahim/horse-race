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
  <div class="bg-white rounded-lg p-6 border border-cool-gray-200">
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-cool-gray-900">
        {{ sessionName }} - Horses
      </h3>
    </div>

    <horse-table :horses="props.horses" />
  </div>
</template>

