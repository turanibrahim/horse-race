import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VButton from '../v-button.vue';

describe('v-button', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(VButton, {
        slots: {
          default: 'Click me',
        },
      });

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.text()).toBe('Click me');
    });

    it('renders with slot content', () => {
      const wrapper = mount(VButton, {
        slots: {
          default: '<span>Custom Content</span>',
        },
      });

      expect(wrapper.html()).toContain('Custom Content');
    });
  });

  describe('variants', () => {
    it('applies primary variant classes', () => {
      const wrapper = mount(VButton, {
        props: {
          variant: 'primary',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('bg-tea-green-600');
      expect(button.classes()).toContain('text-white');
    });

    it('applies secondary variant classes', () => {
      const wrapper = mount(VButton, {
        props: {
          variant: 'secondary',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('bg-flax-500');
      expect(button.classes()).toContain('text-flax-900');
    });

    it('applies accent variant classes', () => {
      const wrapper = mount(VButton, {
        props: {
          variant: 'accent',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('bg-coral-pink-600');
      expect(button.classes()).toContain('text-white');
    });

    it('applies outline variant classes', () => {
      const wrapper = mount(VButton, {
        props: {
          variant: 'outline',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('bg-transparent');
      expect(button.classes()).toContain('border-2');
    });

    it('applies ghost variant classes', () => {
      const wrapper = mount(VButton, {
        props: {
          variant: 'ghost',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('bg-transparent');
      expect(button.classes()).toContain('text-cool-gray-700');
    });
  });

  describe('sizes', () => {
    it('applies small size classes', () => {
      const wrapper = mount(VButton, {
        props: {
          size: 'sm',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('px-3');
      expect(button.classes()).toContain('py-1.5');
      expect(button.classes()).toContain('text-sm');
    });

    it('applies medium size classes', () => {
      const wrapper = mount(VButton, {
        props: {
          size: 'md',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('px-4');
      expect(button.classes()).toContain('py-2');
      expect(button.classes()).toContain('text-sm');
    });

    it('applies large size classes', () => {
      const wrapper = mount(VButton, {
        props: {
          size: 'lg',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('px-6');
      expect(button.classes()).toContain('py-3');
      expect(button.classes()).toContain('text-base');
    });
  });

  describe('disabled state', () => {
    it('applies disabled attribute when disabled prop is true', () => {
      const wrapper = mount(VButton, {
        props: {
          disabled: true,
        },
      });

      expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    });

    it('does not apply disabled attribute when disabled prop is false', () => {
      const wrapper = mount(VButton, {
        props: {
          disabled: false,
        },
      });

      expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    });

    it('applies disabled classes when disabled', () => {
      const wrapper = mount(VButton, {
        props: {
          disabled: true,
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('disabled:opacity-50');
      expect(button.classes()).toContain('disabled:cursor-not-allowed');
    });
  });

  describe('custom classes', () => {
    it('applies custom classes', () => {
      const wrapper = mount(VButton, {
        props: {
          class: 'custom-class another-class',
        },
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('custom-class');
      expect(button.classes()).toContain('another-class');
    });
  });

  describe('base classes', () => {
    it('applies all base classes', () => {
      const wrapper = mount(VButton);

      const button = wrapper.find('button');
      expect(button.classes()).toContain('inline-flex');
      expect(button.classes()).toContain('items-center');
      expect(button.classes()).toContain('justify-center');
      expect(button.classes()).toContain('font-medium');
      expect(button.classes()).toContain('rounded-md');
      expect(button.classes()).toContain('transition-colors');
      expect(button.classes()).toContain('focus:outline-none');
      expect(button.classes()).toContain('focus:ring-2');
    });
  });
});
