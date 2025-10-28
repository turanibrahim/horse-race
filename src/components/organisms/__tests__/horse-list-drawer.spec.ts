import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import HorseListDrawer from '../horse-list-drawer.vue';
import VDrawer from '@/components/atoms/v-drawer.vue';
import HorseTable from '@/components/molecules/horse-table.vue';
import VButton from '@/components/atoms/v-button.vue';
import { useHorseStore } from '@/store/horse.store';

describe('horse-list-drawer', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('rendering', () => {
    it('renders VDrawer component', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      expect(wrapper.findComponent(VDrawer).exists()).toBe(true);
    });

    it('passes modelValue prop to VDrawer', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const drawer = wrapper.findComponent(VDrawer);
      expect(drawer.props('modelValue')).toBe(true);
    });

    it('renders drawer on left side', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const drawer = wrapper.findComponent(VDrawer);
      expect(drawer.props('position')).toBe('left');
    });

    it('renders drawer with responsive width', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const drawer = wrapper.findComponent(VDrawer);
      expect(drawer.props('width')).toBe('min(100%, 800px)');
    });
  });

  describe('header slot', () => {
    it('renders header title', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      expect(wrapper.text()).toContain('Horse List');
    });

    it('renders close button', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const closeButton = wrapper.findAllComponents(VButton).find(btn => 
        btn.props('variant') === 'ghost',
      );
      expect(closeButton).toBeDefined();
    });

    it('renders SVG icon in close button', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const svgs = wrapper.findAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('content', () => {
    it('renders HorseTable component', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      expect(wrapper.findComponent(HorseTable).exists()).toBe(true);
    });

    it('passes horses from store to HorseTable', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const horseStore = useHorseStore();
      const horseTable = wrapper.findComponent(HorseTable);
      
      expect(horseTable.props('horses')).toEqual(horseStore.horses);
    });

    it('displays total horse count', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      expect(wrapper.text()).toContain('Total Horses:');
    });

    it('shows correct horse count from store', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const horseStore = useHorseStore();
      expect(wrapper.text()).toContain(horseStore.horses.length.toString());
    });
  });

  describe('footer slot', () => {
    it('renders close button in footer', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const closeButtons = wrapper.findAllComponents(VButton).filter(btn => 
        btn.text() === 'Close',
      );
      expect(closeButtons.length).toBeGreaterThan(0);
    });

    it('close button has outline variant', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const closeButton = wrapper.findAllComponents(VButton).find(btn => 
        btn.text() === 'Close',
      );
      expect(closeButton?.props('variant')).toBe('outline');
    });
  });

  describe('events', () => {
    it('emits update:modelValue when drawer is closed', async () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const drawer = wrapper.findComponent(VDrawer);
      drawer.vm.$emit('update:modelValue', false);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });
  });

  describe('props', () => {
    it('accepts modelValue prop', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: false,
        },
      });

      expect(wrapper.props('modelValue')).toBe(false);
    });

    it('updates when modelValue changes', async () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: false,
        },
      });

      await wrapper.setProps({ modelValue: true });

      const drawer = wrapper.findComponent(VDrawer);
      expect(drawer.props('modelValue')).toBe(true);
    });
  });

  describe('drawer configuration', () => {
    it('enables overlay', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const drawer = wrapper.findComponent(VDrawer);
      expect(drawer.props('overlay')).toBe(true);
    });

    it('enables close on overlay click', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const drawer = wrapper.findComponent(VDrawer);
      expect(drawer.props('closeOnOverlayClick')).toBe(true);
    });
  });

  describe('styling', () => {
    it('applies flex layout to header', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const header = wrapper.find('.flex.items-center.justify-between');
      expect(header.exists()).toBe(true);
    });

    it('applies spacing to content', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const content = wrapper.find('.space-y-4');
      expect(content.exists()).toBe(true);
    });

    it('applies flex layout to footer', () => {
      const wrapper = mount(HorseListDrawer, {
        props: {
          modelValue: true,
        },
      });

      const footer = wrapper.find('.flex.justify-end');
      expect(footer.exists()).toBe(true);
    });
  });
});
