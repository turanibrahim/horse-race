<script setup lang="ts">
import { computed } from 'vue';

export interface VTableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface VTableProps {
  columns: VTableColumn[]
  data: Record<string, unknown>[]
  variant?: 'default' | 'striped' | 'bordered'
  size?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  class?: string
}

const props = withDefaults(defineProps<VTableProps>(), {
  variant: 'default',
  size: 'md',
  hoverable: true,
  class: '',
});

const emit = defineEmits<{
  'row-click': [row: Record<string, unknown>, index: number]
  'sort': [column: VTableColumn]
}>();

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  return sizes[props.size];
});

const cellPaddingClasses = computed(() => {
  const paddings = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  return paddings[props.size];
});

const variantClasses = computed(() => {
  const variants = {
    default: '',
    striped: '[&_tbody_tr:nth-child(even)]:bg-cool-gray-50',
    bordered: 'border border-cool-gray-200',
  };
  return variants[props.variant];
});

const getAlignClass = (align?: string) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  return alignments[align as keyof typeof alignments] || 'text-left';
};

const handleRowClick = (row: Record<string, unknown>, index: number) => {
  emit('row-click', row, index);
};

const handleSort = (column: VTableColumn) => {
  if (column.sortable) {
    emit('sort', column);
  }
};
</script>

<template>
  <div :class="['overflow-x-auto', props.class]">
    <table 
      :class="[
        'w-full border-collapse',
        sizeClasses,
        variantClasses
      ]"
    >
      <thead class="bg-cool-gray-100 border-b-2 border-cool-gray-300">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              cellPaddingClasses,
              getAlignClass(column.align),
              'font-semibold text-cool-gray-700 uppercase tracking-wider',
              column.sortable ? 'cursor-pointer hover:bg-cool-gray-200 transition-colors duration-150' : ''
            ]"
            :style="column.width ? { width: column.width } : undefined"
            @click="handleSort(column)"
          >
            <div class="flex items-center gap-2" :class="getAlignClass(column.align)">
              <span>{{ column.label }}</span>
              <svg
                v-if="column.sortable"
                class="w-4 h-4 text-cool-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-cool-gray-200">
        <tr
          v-for="(row, index) in data"
          :key="index"
          :class="[
            hoverable ? 'hover:bg-tea-green-50 transition-colors duration-150 cursor-pointer' : '',
            'border-b border-cool-gray-100'
          ]"
          @click="handleRowClick(row, index)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              cellPaddingClasses,
              getAlignClass(column.align),
              'text-cool-gray-900'
            ]"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :value="row[column.key]"
              :index="index"
            >
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td
            :colspan="columns.length"
            :class="[
              cellPaddingClasses,
              'text-center text-cool-gray-500 italic'
            ]"
          >
            <slot name="empty">
              No data available
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
