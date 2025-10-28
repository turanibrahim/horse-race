<script setup lang="ts">
import { computed, watch } from 'vue';

interface Props {
  modelValue: boolean
  position?: 'left' | 'right' | 'top' | 'bottom'
  width?: string
  height?: string
  overlay?: boolean
  closeOnOverlayClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'right',
  width: '320px',
  height: '100%',
  overlay: true,
  closeOnOverlayClick: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const positionClasses = computed(() => {
  const baseClasses = 'fixed bg-white shadow-lg transition-transform duration-300 ease-in-out z-50';
  
  switch (props.position) {
  case 'left':
    return `${baseClasses} top-0 left-0 h-full ${isOpen.value ? 'translate-x-0' : '-translate-x-full'}`;
  case 'right':
    return `${baseClasses} top-0 right-0 h-full ${isOpen.value ? 'translate-x-0' : 'translate-x-full'}`;
  case 'top':
    return `${baseClasses} top-0 left-0 w-full ${isOpen.value ? 'translate-y-0' : '-translate-y-full'}`;
  case 'bottom':
    return `${baseClasses} bottom-0 left-0 w-full ${isOpen.value ? 'translate-y-0' : 'translate-y-full'}`;
  default:
    return baseClasses;
  }
});

const drawerStyle = computed(() => {
  if (props.position === 'left' || props.position === 'right') {
    return { width: props.width };
  }
  return { height: props.height };
});

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    isOpen.value = false;
    emit('close');
  }
};

const handleClose = () => {
  isOpen.value = false;
  emit('close');
};

watch(isOpen, (value) => {
  if (typeof document !== 'undefined') {
    // eslint-disable-next-line no-undef
    document.body.style.overflow = value ? 'hidden' : '';
  }
});
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && overlay"
        class="fixed inset-0 bg-black/50 z-40"
        @click="handleOverlayClick"
      />
    </transition>

    <div :class="positionClasses" :style="drawerStyle">
      <div class="flex flex-col h-full">
        <div v-if="$slots.header" class="flex-shrink-0 border-b border-gray-200 p-4">
          <slot name="header" :close="handleClose" />
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <slot :close="handleClose" />
        </div>

        <div v-if="$slots.footer" class="flex-shrink-0 border-t border-gray-200 p-4">
          <slot name="footer" :close="handleClose" />
        </div>
      </div>
    </div>
  </teleport>
</template>
