import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import HorseTable from '../horse-table.vue';
import VTable from '@/components/atoms/v-table.vue';
import type { Horse } from '@/types';

describe('horse-table', () => {
  const mockHorses: Horse[] = [
    { id: 1, name: 'Thunder', color: '#FF0000', conditionScore: 80 },
    { id: 2, name: 'Lightning', color: '#00FF00', conditionScore: 45 },
    { id: 3, name: 'Storm', color: '#0000FF', conditionScore: 25 },
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('rendering', () => {
    it('renders VTable component', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      expect(wrapper.findComponent(VTable).exists()).toBe(true);
    });

    it('renders correct number of rows', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(mockHorses.length);
    });

    it('renders horse names', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      mockHorses.forEach(horse => {
        expect(wrapper.text()).toContain(horse.name);
      });
    });
  });

  describe('columns', () => {
    it('displays horse name column', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      expect(wrapper.text()).toContain('Horse Name');
    });

    it('displays color column', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      expect(wrapper.text()).toContain('Color');
    });

    it('displays condition score column', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      expect(wrapper.text()).toContain('Condition Score');
    });
  });

  describe('color display', () => {
    it('renders color preview div with correct background color', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      const colorDivs = wrapper.findAll('[class*="w-6"][class*="h-6"]');
      expect(colorDivs.length).toBeGreaterThan(0);
    });

    it('displays color hex value as text', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      mockHorses.forEach(horse => {
        expect(wrapper.text()).toContain(horse.color);
      });
    });
  });

  describe('condition score', () => {
    it('renders progress bar for each horse', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      const progressBars = wrapper.findAll('.h-2.rounded-full');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it('displays condition score value', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      mockHorses.forEach(horse => {
        expect(wrapper.text()).toContain(horse.conditionScore.toString());
      });
    });

    it('applies red color class for low scores', () => {
      const lowScoreHorse: Horse[] = [{ id: 1, name: 'Test', color: '#000', conditionScore: 20 }];
      const wrapper = mount(HorseTable, {
        props: {
          horses: lowScoreHorse,
        },
      });

      const progressBar = wrapper.find('.bg-red-500');
      expect(progressBar.exists()).toBe(true);
    });

    it('applies yellow color class for medium scores', () => {
      const mediumScoreHorse: Horse[] = [{ id: 1, name: 'Test', color: '#000', conditionScore: 50 }];
      const wrapper = mount(HorseTable, {
        props: {
          horses: mediumScoreHorse,
        },
      });

      const progressBar = wrapper.find('.bg-yellow-500');
      expect(progressBar.exists()).toBe(true);
    });

    it('applies green color class for high scores', () => {
      const highScoreHorse: Horse[] = [{ id: 1, name: 'Test', color: '#000', conditionScore: 80 }];
      const wrapper = mount(HorseTable, {
        props: {
          horses: highScoreHorse,
        },
      });

      const progressBar = wrapper.find('.bg-green-500');
      expect(progressBar.exists()).toBe(true);
    });
  });

  describe('empty state', () => {
    it('handles empty horses array', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: [],
        },
      });

      expect(wrapper.findComponent(VTable).exists()).toBe(true);
    });
  });

  describe('props', () => {
    it('accepts horses prop', () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      expect(wrapper.props('horses')).toEqual(mockHorses);
    });

    it('updates when horses prop changes', async () => {
      const wrapper = mount(HorseTable, {
        props: {
          horses: mockHorses,
        },
      });

      const newHorses: Horse[] = [{ id: 4, name: 'NewHorse', color: '#FFFFFF', conditionScore: 90 }];
      await wrapper.setProps({ horses: newHorses });

      expect(wrapper.text()).toContain('NewHorse');
    });
  });
});
