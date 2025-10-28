import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VSelect from '../v-select.vue';
import { Listbox, ListboxButton, ListboxOption } from '@headlessui/vue';

describe('v-select', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  describe('rendering', () => {
    it('renders the select component', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      expect(wrapper.findComponent(Listbox).exists()).toBe(true);
    });

    it('renders ListboxButton', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      expect(wrapper.findComponent(ListboxButton).exists()).toBe(true);
    });

    it('displays placeholder when no value is selected', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
          placeholder: 'Choose an option',
        },
      });

      expect(wrapper.text()).toContain('Choose an option');
    });

    it('displays default placeholder when no custom placeholder is provided', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      expect(wrapper.text()).toContain('Select an option');
    });
  });

  describe('options', () => {
    it('renders all options when dropdown is open', async () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      await wrapper.findComponent(ListboxButton).trigger('click');
      await wrapper.vm.$nextTick();

      const options = wrapper.findAllComponents(ListboxOption);
      expect(options.length).toBe(mockOptions.length);
    });

    it('renders option labels correctly when dropdown is open', async () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      await wrapper.findComponent(ListboxButton).trigger('click');
      await wrapper.vm.$nextTick();

      mockOptions.forEach(option => {
        expect(wrapper.html()).toContain(option.label);
      });
    });

    it('handles disabled options when dropdown is open', async () => {
      const optionsWithDisabled = [
        { value: '1', label: 'Option 1', disabled: true },
        { value: '2', label: 'Option 2', disabled: false },
      ];

      const wrapper = mount(VSelect, {
        props: {
          options: optionsWithDisabled,
        },
      });

      await wrapper.findComponent(ListboxButton).trigger('click');
      await wrapper.vm.$nextTick();

      const options = wrapper.findAllComponents(ListboxOption);
      expect(options[0]?.props('disabled')).toBe(true);
      expect(options[1]?.props('disabled')).toBe(false);
    });
  });

  describe('selection', () => {
    it('displays selected option label', () => {
      const wrapper = mount(VSelect, {
        props: {
          modelValue: '2',
          options: mockOptions,
        },
      });

      expect(wrapper.text()).toContain('Option 2');
    });

    it('emits update:modelValue when selection changes', async () => {
      const wrapper = mount(VSelect, {
        props: {
          modelValue: '1',
          options: mockOptions,
        },
      });

      await wrapper.findComponent(Listbox).vm.$emit('update:modelValue', '2');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2']);
    });
  });

  describe('sizes', () => {
    it('applies small size classes', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
          size: 'sm',
        },
      });

      const button = wrapper.findComponent(ListboxButton);
      expect(button.classes()).toContain('px-3');
      expect(button.classes()).toContain('py-1.5');
    });

    it('applies medium size classes by default', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      const button = wrapper.findComponent(ListboxButton);
      expect(button.classes()).toContain('px-4');
      expect(button.classes()).toContain('py-2');
    });

    it('applies large size classes', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
          size: 'lg',
        },
      });

      const button = wrapper.findComponent(ListboxButton);
      expect(button.classes()).toContain('px-6');
      expect(button.classes()).toContain('py-3');
    });
  });

  describe('disabled state', () => {
    it('passes disabled prop to Listbox', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
          disabled: true,
        },
      });

      expect(wrapper.findComponent(Listbox).props('disabled')).toBe(true);
    });

    it('does not disable by default', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      expect(wrapper.findComponent(Listbox).props('disabled')).toBe(false);
    });
  });

  describe('custom classes', () => {
    it('applies custom classes', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
          class: 'custom-class',
        },
      });

      const button = wrapper.findComponent(ListboxButton);
      expect(button.classes()).toContain('custom-class');
    });
  });

  describe('methods', () => {
    it('emits update:modelValue event through component', async () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      await wrapper.findComponent(ListboxButton).trigger('click');
      await wrapper.vm.$nextTick();

      const options = wrapper.findAllComponents(ListboxOption);
      await options[2]?.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['3']);
    });
  });

  describe('computed properties', () => {
    it('shows selected option label in button', async () => {
      const wrapper = mount(VSelect, {
        props: {
          modelValue: '2',
          options: mockOptions,
        },
      });

      const button = wrapper.findComponent(ListboxButton);
      expect(button.text()).toContain('Option 2');
    });

    it('applies size classes based on size prop', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
          size: 'lg',
        },
      });

      const button = wrapper.findComponent(ListboxButton);
      expect(button.classes()).toContain('px-6');
      expect(button.classes()).toContain('py-3');
    });
  });

  describe('styling', () => {
    it('applies base button styles', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      const button = wrapper.findComponent(ListboxButton);
      expect(button.classes()).toContain('relative');
      expect(button.classes()).toContain('w-full');
      expect(button.classes()).toContain('text-left');
      expect(button.classes()).toContain('rounded-md');
    });

    it('renders dropdown icon', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      const icon = wrapper.find('svg');
      expect(icon.exists()).toBe(true);
    });

    it('applies placeholder styling when no value selected', () => {
      const wrapper = mount(VSelect, {
        props: {
          options: mockOptions,
        },
      });

      const placeholderSpan = wrapper.find('.text-cool-gray-400');
      expect(placeholderSpan.exists()).toBe(true);
    });
  });

  describe('options with different value types', () => {
    it('handles string values', () => {
      const stringOptions = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ];

      const wrapper = mount(VSelect, {
        props: {
          options: stringOptions,
          modelValue: 'a',
        },
      });

      expect(wrapper.text()).toContain('Option A');
    });

    it('handles number values', () => {
      const numberOptions = [
        { value: 1, label: 'Option 1' },
        { value: 2, label: 'Option 2' },
      ];

      const wrapper = mount(VSelect, {
        props: {
          options: numberOptions,
          modelValue: 1,
        },
      });

      expect(wrapper.text()).toContain('Option 1');
    });
  });
});
