<script setup lang="ts" generic="T extends string | number | object">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { computed } from 'vue';

export interface SelectOption<T> {
  value: T
  label: string
  disabled?: boolean
}

export interface VSelectProps<T> {
  modelValue?: T
  options: SelectOption<T>[]
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<VSelectProps<T>>(), {
  modelValue: undefined,
  placeholder: 'Select an option',
  disabled: false,
  size: 'md',
  class: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>();

const selectedOption = computed(() => 
  props.options.find(opt => opt.value === props.modelValue),
);

const handleChange = (value: T) => {
  emit('update:modelValue', value);
};

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return sizes[props.size];
});
</script>

<template>
  <listbox
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="handleChange"
  >
    <div class="relative">
      <listbox-button
        :class="[
          'relative w-full text-left rounded-md',
          'bg-white border border-cool-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-tea-green-500 focus:border-tea-green-500',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cool-gray-50',
          sizeClasses,
          props.class
        ]"
      >
        <span
          :class="[
            'block truncate mr-4',
            !selectedOption && 'text-cool-gray-400'
          ]"
        >
          {{ selectedOption?.label || placeholder }}
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            class="h-5 w-5 text-cool-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </listbox-button>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <listbox-options
          class="absolute z-10 mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm top-full"
        >
          <listbox-option
            v-for="option in options"
            :key="String(option.value)"
            v-slot="{ active, selected }"
            :value="option.value"
            :disabled="option.disabled"
            as="template"
          >
            <li
              :class="[
                'relative cursor-pointer select-none py-2 pl-10 pr-4',
                active ? 'bg-tea-green-100 text-tea-green-900' : 'text-cool-gray-900',
                option.disabled && 'opacity-50 cursor-not-allowed',
              ]"
            >
              <span
                :class="[
                  'block truncate',
                  selected ? 'font-medium' : 'font-normal',
                ]"
              >
                {{ option.label }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-tea-green-600"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </li>
          </listbox-option>
        </listbox-options>
      </transition>
    </div>
  </listbox>
</template>
