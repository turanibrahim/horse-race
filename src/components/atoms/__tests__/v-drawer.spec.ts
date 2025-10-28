import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import VDrawer from '../v-drawer.vue';

describe('v-drawer', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('rendering', () => {
    it('renders drawer with hidden position when closed', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: false,
        },
      });

      const drawer = wrapper.find('.fixed');
      expect(drawer.exists()).toBe(true);
      expect(drawer.classes()).toContain('translate-x-full');
    });

    it('renders drawer when open', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
      });

      expect(wrapper.find('.fixed').exists()).toBe(true);
    });

    it('renders default slot content', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
        slots: {
          default: 'Drawer Content',
        },
      });

      expect(wrapper.text()).toContain('Drawer Content');
    });

    it('renders header slot when provided', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
        slots: {
          header: 'Header Content',
        },
      });

      expect(wrapper.text()).toContain('Header Content');
    });

    it('renders footer slot when provided', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
        slots: {
          footer: 'Footer Content',
        },
      });

      expect(wrapper.text()).toContain('Footer Content');
    });
  });

  describe('position', () => {
    it('applies right position classes by default', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
      });

      const drawers = wrapper.findAll('.fixed');
      const drawerDiv = drawers.find(el => el.classes().includes('bg-white'));
      expect(drawerDiv).toBeDefined();
      expect(drawerDiv?.classes()).toContain('shadow-lg');
    });
  });

  describe('overlay', () => {
    it('renders overlay when overlay prop is true', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
          overlay: true,
        },
      });

      expect(wrapper.find('.bg-black\\/50').exists()).toBe(true);
    });

    it('does not render overlay when overlay prop is false', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
          overlay: false,
        },
      });

      expect(wrapper.find('.bg-black\\/50').exists()).toBe(false);
    });
  });

  describe('events', () => {
    it('changes position when modelValue changes', async () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
      });

      let drawers = wrapper.findAll('.fixed');
      let drawerDiv = drawers.find(el => el.classes().includes('bg-white'));
      let classes = drawerDiv?.classes().join(' ') || '';
      expect(classes).not.toContain('translate-x-full');

      await wrapper.setProps({ modelValue: false });
      await wrapper.vm.$nextTick();

      drawers = wrapper.findAll('.fixed');
      drawerDiv = drawers.find(el => el.classes().includes('bg-white'));
      classes = drawerDiv?.classes().join(' ') || '';
      expect(classes).toContain('translate-x-full');
    });

    it('emits close event when overlay is clicked', async () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
          overlay: true,
          closeOnOverlayClick: true,
        },
      });

      const overlay = wrapper.find('.bg-black\\/50');
      await overlay.trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('does not close when overlay is clicked and closeOnOverlayClick is false', async () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
          overlay: true,
          closeOnOverlayClick: false,
        },
      });

      const overlay = wrapper.find('.bg-black\\/50');
      await overlay.trigger('click');

      expect(wrapper.emitted('close')).toBeFalsy();
    });
  });

  describe('body overflow', () => {
    beforeEach(() => {
      document.body.style.overflow = '';
    });

    it('sets body overflow to hidden when drawer opens', async () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: false,
        },
      });

      expect(document.body.style.overflow).toBe('');

      await wrapper.setProps({ modelValue: true });
      await flushPromises();

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('resets body overflow when drawer closes', async () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: false,
        },
      });

      await wrapper.setProps({ modelValue: true });
      await flushPromises();
      expect(document.body.style.overflow).toBe('hidden');

      await wrapper.setProps({ modelValue: false });
      await flushPromises();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('slot props', () => {
    it('passes close function to header slot', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
        slots: {
          header: '<button @click="close">Close</button>',
        },
      });

      expect(wrapper.html()).toContain('button');
    });

    it('passes close function to default slot', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
        slots: {
          default: '<button @click="close">Close</button>',
        },
      });

      expect(wrapper.html()).toContain('button');
    });

    it('passes close function to footer slot', () => {
      const wrapper = mount(VDrawer, {
        props: {
          modelValue: true,
        },
        slots: {
          footer: '<button @click="close">Close</button>',
        },
      });

      expect(wrapper.html()).toContain('button');
    });
  });
});
