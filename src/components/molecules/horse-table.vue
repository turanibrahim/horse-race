<script setup lang="ts">
import { computed } from 'vue';
import type { Horse } from '@/types';
import VTable from '@/components/atoms/v-table.vue';

interface HorseTableProps {
  horses: Horse[]
}

const props = defineProps<HorseTableProps>();

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Horse Name' },
  { key: 'color', label: 'Color' },
  { key: 'conditionScore', label: 'Condition Score' },
];

const tableData = computed(() => 
  props.horses as unknown as Record<string, unknown>[],
);
</script>

<template>
  <v-table
    :columns="columns"
    :data="tableData"
  >
    <template #cell-color="{ row }">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-full border border-cool-gray-300"
          :style="{ backgroundColor: (row as unknown as Horse).color }"
        />
        <span class="text-sm text-cool-gray-600">{{ (row as unknown as Horse).color }}</span>
      </div>
    </template>

    <template #cell-conditionScore="{ row }">
      <div class="flex items-center gap-2">
        <div class="flex-1 max-w-[200px] bg-cool-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="{
              'bg-red-500': (row as unknown as Horse).conditionScore < 33,
              'bg-yellow-500': (row as unknown as Horse).conditionScore >= 33 && (row as unknown as Horse).conditionScore < 66,
              'bg-green-500': (row as unknown as Horse).conditionScore >= 66,
            }"
            :style="{ width: `${(row as unknown as Horse).conditionScore}%` }"
          />
        </div>
        <span class="text-sm font-medium text-cool-gray-700 min-w-[3ch]">
          {{ (row as unknown as Horse).conditionScore }}
        </span>
      </div>
    </template>
  </v-table>
</template>
