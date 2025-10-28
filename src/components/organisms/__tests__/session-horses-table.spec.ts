import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import SessionHorsesTable from '../session-horses-table.vue';
import HorseTable from '@/components/molecules/horse-table.vue';
import type { Horse } from '@/types';

describe('session-horses-table', () => {
  const mockHorses: Horse[] = [
    { id: 1, name: 'Thunder', color: '#FF0000', conditionScore: 80 },
    { id: 2, name: 'Lightning', color: '#00FF00', conditionScore: 70 },
    { id: 3, name: 'Storm', color: '#0000FF', conditionScore: 60 },
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('rendering', () => {
    it('renders the container', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.find('.bg-white').exists()).toBe(true);
    });

    it('renders session name', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('Race 1 - Horses');
    });

    it('renders HorseTable component', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.findComponent(HorseTable).exists()).toBe(true);
    });

    it('passes horses prop to HorseTable', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const horseTable = wrapper.findComponent(HorseTable);
      expect(horseTable.props('horses')).toEqual(mockHorses);
    });
  });

  describe('header', () => {
    it('displays session name with " - Horses" suffix', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Test Session',
        },
      });

      expect(wrapper.text()).toContain('Test Session - Horses');
    });

    it('applies correct header styling', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const header = wrapper.find('h3');
      expect(header.classes()).toContain('text-xl');
      expect(header.classes()).toContain('font-semibold');
    });
  });

  describe('props', () => {
    it('accepts horses prop', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.props('horses')).toEqual(mockHorses);
    });

    it('accepts sessionName prop', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Custom Session',
        },
      });

      expect(wrapper.props('sessionName')).toBe('Custom Session');
    });

    it('updates when horses prop changes', async () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const newHorses: Horse[] = [
        { id: 4, name: 'NewHorse', color: '#FFFFFF', conditionScore: 90 },
      ];

      await wrapper.setProps({ horses: newHorses });

      const horseTable = wrapper.findComponent(HorseTable);
      expect(horseTable.props('horses')).toEqual(newHorses);
    });

    it('updates when sessionName prop changes', async () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      await wrapper.setProps({ sessionName: 'Race 2' });

      expect(wrapper.text()).toContain('Race 2 - Horses');
    });
  });

  describe('empty state', () => {
    it('renders with empty horses array', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: [],
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.findComponent(HorseTable).exists()).toBe(true);
    });

    it('passes empty array to HorseTable', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: [],
          sessionName: 'Race 1',
        },
      });

      const horseTable = wrapper.findComponent(HorseTable);
      expect(horseTable.props('horses')).toEqual([]);
    });
  });

  describe('styling', () => {
    it('applies white background', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.bg-white');
      expect(container.exists()).toBe(true);
    });

    it('applies rounded corners', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.rounded-lg');
      expect(container.exists()).toBe(true);
    });

    it('applies padding', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.p-6');
      expect(container.exists()).toBe(true);
    });

    it('applies border', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.border');
      expect(container.exists()).toBe(true);
    });

    it('applies margin to header', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const headerContainer = wrapper.find('.mb-4');
      expect(headerContainer.exists()).toBe(true);
    });
  });

  describe('integration', () => {
    it('renders all horses from prop', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(mockHorses.length);
    });

    it('displays horse details through HorseTable', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      mockHorses.forEach(horse => {
        expect(wrapper.text()).toContain(horse.name);
        expect(wrapper.text()).toContain(horse.conditionScore.toString());
      });
    });
  });

  describe('container structure', () => {
    it('has proper nested structure', () => {
      const wrapper = mount(SessionHorsesTable, {
        props: {
          horses: mockHorses,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.bg-white.rounded-lg.p-6');
      expect(container.exists()).toBe(true);
      
      const headerSection = container.find('.mb-4');
      expect(headerSection.exists()).toBe(true);
      
      const horseTable = container.findComponent(HorseTable);
      expect(horseTable.exists()).toBe(true);
    });
  });
});
