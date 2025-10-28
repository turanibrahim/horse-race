import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import SessionResultsTable from '../session-results-table.vue';
import VTable from '@/components/atoms/v-table.vue';
import type { RaceResult } from '@/types';

describe('session-results-table', () => {
  const mockResults: RaceResult[] = [
    { horseId: 1, horseName: 'Thunder', finishTime: 12.5, position: 1 },
    { horseId: 2, horseName: 'Lightning', finishTime: 13.2, position: 2 },
    { horseId: 3, horseName: 'Storm', finishTime: 14.1, position: 3 },
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('rendering', () => {
    it('renders the container', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.find('.bg-white').exists()).toBe(true);
    });

    it('renders session name', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('Race 1 - Results');
    });

    it('renders VTable component when results exist', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.findComponent(VTable).exists()).toBe(true);
    });

    it('displays all horse names', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      mockResults.forEach(result => {
        expect(wrapper.text()).toContain(result.horseName);
      });
    });
  });

  describe('empty state', () => {
    it('shows empty message when no results', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: [],
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('No results yet');
    });

    it('does not render VTable when no results', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: [],
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.findComponent(VTable).exists()).toBe(false);
    });

    it('shows start race prompt', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: [],
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('Start the race to see results');
    });
  });

  describe('columns', () => {
    it('displays position column', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('Position');
    });

    it('displays horse name column', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('Horse Name');
    });

    it('displays finish time column', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('Finish Time');
    });
  });

  describe('position rendering', () => {
    it('displays gold badge for first place', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const goldBadge = wrapper.find('.bg-yellow-500');
      expect(goldBadge.exists()).toBe(true);
      expect(goldBadge.text()).toBe('1');
    });

    it('displays silver badge for second place', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const silverBadge = wrapper.find('.bg-gray-400');
      expect(silverBadge.exists()).toBe(true);
      expect(silverBadge.text()).toBe('2');
    });

    it('displays bronze badge for third place', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const bronzeBadge = wrapper.find('.bg-orange-600');
      expect(bronzeBadge.exists()).toBe(true);
      expect(bronzeBadge.text()).toBe('3');
    });

    it('renders position badges as rounded circles', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const badges = wrapper.findAll('.rounded-full');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('finish time', () => {
    it('displays finish times with 2 decimal places', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.text()).toContain('12.50s');
      expect(wrapper.text()).toContain('13.20s');
    });

    it('renders finish times in monospace font', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const timeElements = wrapper.findAll('.font-mono');
      expect(timeElements.length).toBe(mockResults.length);
    });
  });

  describe('props', () => {
    it('accepts results prop', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      expect(wrapper.props('results')).toEqual(mockResults);
    });

    it('accepts sessionName prop', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Test Session',
        },
      });

      expect(wrapper.props('sessionName')).toBe('Test Session');
    });

    it('updates when sessionName changes', async () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      await wrapper.setProps({ sessionName: 'Race 2' });

      expect(wrapper.text()).toContain('Race 2 - Results');
    });
  });

  describe('styling', () => {
    it('applies white background', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.bg-white');
      expect(container.exists()).toBe(true);
    });

    it('applies rounded corners', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.rounded-lg');
      expect(container.exists()).toBe(true);
    });

    it('applies padding', () => {
      const wrapper = mount(SessionResultsTable, {
        props: {
          results: mockResults,
          sessionName: 'Race 1',
        },
      });

      const container = wrapper.find('.p-6');
      expect(container.exists()).toBe(true);
    });
  });
});
