<script setup lang="ts">
import { computed } from 'vue';
import VTable, { type VTableColumn } from '@/components/atoms/v-table.vue';
import type { Horse } from '@/types';

interface HorsesTableProps {
  horses: Horse[]
}

const props = defineProps<HorsesTableProps>();

const columns: VTableColumn[] = [
  { key: 'id', label: 'ID', align: 'center', width: '80px' },
  { key: 'name', label: 'Horse Name', align: 'left' },
  { key: 'condition', label: 'Condition', align: 'center', width: '120px' },
];

const tableData = computed(() => 
  props.horses.map(horse => ({
    id: horse.id,
    name: horse.name,
    color: horse.color,
    condition: horse.conditionScore,
  })),
);
</script>

<template>
  <v-table
    :columns="columns"
    :data="tableData"
    variant="striped"
    size="md"
    :hoverable="true"
  >
    <template #cell-name="{ row }">
      <span 
        class="font-semibold"
        :style="{ color: String(row.color) }"
      >
        {{ row.name }}
      </span>
    </template>

    <template #cell-condition="{ row }">
      <span class="font-semibold text-cool-gray-900">
        {{ row.condition }}
      </span>
    </template>
  </v-table>
</template>
