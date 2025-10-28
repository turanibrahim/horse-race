import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VHorse from '../v-horse.vue';

describe('v-horse', () => {
  describe('rendering', () => {
    it('renders the horse SVG', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('renders with correct dimensions', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      const container = wrapper.find('.relative');
      expect(container.classes()).toContain('w-[50px]');
      expect(container.classes()).toContain('h-10');
    });
  });

  describe('color prop', () => {
    it('applies color to SVG fill', () => {
      const color = '#FF5733';
      const wrapper = mount(VHorse, {
        props: {
          color,
          isRunning: false,
        },
      });

      const svg = wrapper.find('svg');
      expect(svg.attributes('style')).toContain(`fill: ${color}`);
    });

    it('changes color when prop changes', async () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      await wrapper.setProps({ color: '#00FF00' });

      const svg = wrapper.find('svg');
      expect(svg.attributes('style')).toContain('fill: #00FF00');
    });
  });

  describe('isRunning prop', () => {
    it('applies animation class when isRunning is true', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: true,
        },
      });

      const animatedElement = wrapper.find('.relative.w-full.h-full');
      expect(animatedElement.classes()).toContain('animate-gallop-bounce');
    });

    it('does not apply animation class when isRunning is false', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      const animatedElement = wrapper.find('.relative.w-full.h-full');
      expect(animatedElement.classes()).not.toContain('animate-gallop-bounce');
    });

    it('toggles animation when isRunning changes', async () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      let animatedElement = wrapper.find('.relative.w-full.h-full');
      expect(animatedElement.classes()).not.toContain('animate-gallop-bounce');

      await wrapper.setProps({ isRunning: true });

      animatedElement = wrapper.find('.relative.w-full.h-full');
      expect(animatedElement.classes()).toContain('animate-gallop-bounce');
    });
  });

  describe('shadow effect', () => {
    it('applies drop shadow filter', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      const shadowElement = wrapper.find('.relative.w-full.h-full');
      expect(shadowElement.classes()).toContain('[filter:drop-shadow(2px_2px_4px_rgba(0,0,0,0.3))]');
    });
  });

  describe('SVG attributes', () => {
    it('has correct viewBox', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      const svg = wrapper.find('svg');
      expect(svg.attributes('viewBox')).toBe('0 0 300.143 240.397');
    });

    it('has correct SVG dimensions classes', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      const svg = wrapper.find('svg');
      expect(svg.classes()).toContain('w-full');
      expect(svg.classes()).toContain('h-full');
    });

    it('renders SVG paths', () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: false,
        },
      });

      const paths = wrapper.findAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });
  });

  describe('props interface', () => {
    it('accepts valid color strings', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF', 'rgb(255,0,0)', 'blue'];
      
      colors.forEach(color => {
        const wrapper = mount(VHorse, {
          props: {
            color,
            isRunning: false,
          },
        });

        expect(wrapper.props('color')).toBe(color);
      });
    });

    it('accepts boolean isRunning values', async () => {
      const wrapper = mount(VHorse, {
        props: {
          color: '#FF0000',
          isRunning: true,
        },
      });

      expect(wrapper.props('isRunning')).toBe(true);

      await wrapper.setProps({ isRunning: false });
      expect(wrapper.props('isRunning')).toBe(false);
    });
  });
});
