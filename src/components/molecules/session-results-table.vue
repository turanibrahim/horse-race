<script setup lang="ts">
import { computed } from 'vue';
import type { RaceResult } from '@/types';
import VTable from '@/components/atoms/v-table.vue';

interface SessionResultsTableProps {
  results: RaceResult[]
  sessionName: string
}

const props = defineProps<SessionResultsTableProps>();

const columns = [
  { key: 'position', label: 'Position', width: '80px' },
  { key: 'horseName', label: 'Horse Name' },
  { key: 'finishTime', label: 'Finish Time' },
];

const tableData = computed(() => 
  props.results as unknown as Record<string, unknown>[],
);

const hasResults = computed(() => props.results.length > 0);
</script>

<template>
  <div class="bg-white rounded-lg p-6 border border-cool-gray-200">
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-cool-gray-900">
        {{ sessionName }} - Results
      </h3>
    </div>

    <div v-if="!hasResults" class="p-12 px-4 bg-cool-gray-50 rounded-lg border-2 border-dashed border-cool-gray-200">
      <p class="text-cool-gray-500 text-center italic">
        No results yet. Start the race to see results.
      </p>
    </div>

    <v-table
      v-else
      :columns="columns"
      :data="tableData"
    >
      <template #cell-position="{ row }">
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-sm"
            :class="{
              'bg-yellow-500': (row as unknown as RaceResult).position === 1,
              'bg-gray-400': (row as unknown as RaceResult).position === 2,
              'bg-orange-600': (row as unknown as RaceResult).position === 3,
              'bg-cool-gray-300 text-cool-gray-700': (row as unknown as RaceResult).position > 3,
            }"
          >
            {{ (row as unknown as RaceResult).position }}
          </span>
        </div>
      </template>

      <template #cell-finishTime="{ row }">
        <span class="font-mono text-sm font-medium">
          {{ (row as unknown as RaceResult).finishTime.toFixed(2) }}s
        </span>
      </template>
    </v-table>
  </div>
</template>
