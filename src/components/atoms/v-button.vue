<script setup lang="ts">
import { computed } from 'vue'

export interface VButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<VButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-tea-green-600 text-white hover:bg-tea-green-700 focus:ring-tea-green-500 active:bg-tea-green-800',
    secondary: 'bg-flax-500 text-flax-900 hover:bg-flax-600 focus:ring-flax-400 active:bg-flax-700',
    accent: 'bg-coral-pink-600 text-white hover:bg-coral-pink-700 focus:ring-coral-pink-500 active:bg-coral-pink-800',
    outline: 'bg-transparent border-2 border-cool-gray-300 text-cool-gray-700 hover:bg-cool-gray-50 hover:border-cool-gray-400 focus:ring-cool-gray-500 active:bg-cool-gray-100',
    ghost: 'bg-transparent text-cool-gray-700 hover:bg-cool-gray-100 focus:ring-cool-gray-500 active:bg-cool-gray-200'
  }
  
  return variants[props.variant]
})
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center',
      'font-medium rounded-md transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
      props.class
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>