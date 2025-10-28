import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import RaceTrack from '../race-track.vue';
import VHorse from '@/components/atoms/v-horse.vue';
import type { Horse } from '@/types';

describe('race-track', () => {
  const mockHorses: Horse[] = [
    { id: 1, name: 'Thunder', color: '#FF0000', conditionScore: 80 },
    { id: 2, name: 'Lightning', color: '#00FF00', conditionScore: 70 },
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('rendering', () => {
    it('renders the track container', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      expect(wrapper.find('.bg-white').exists()).toBe(true);
    });

    it('renders distance label', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      expect(wrapper.text()).toContain('Race Distance: 1200m');
    });

    it('renders correct number of horses', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const horses = wrapper.findAllComponents(VHorse);
      expect(horses).toHaveLength(mockHorses.length);
    });

    it('renders horse names on track', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      mockHorses.forEach(horse => {
        expect(wrapper.text()).toContain(horse.name);
      });
    });
  });

  describe('status badge', () => {
    it('shows "Ready" badge when not running', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      expect(wrapper.text()).toContain('Ready');
    });

    it('shows "Running" badge when race is running', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: true,
          isPaused: false,
          isCompleted: false,
        },
      });

      expect(wrapper.text()).toContain('Running');
    });

    it('shows "Paused" badge when race is paused', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: true,
          isPaused: true,
          isCompleted: false,
        },
      });

      expect(wrapper.text()).toContain('Paused');
    });

    it('shows "Completed" badge when race is completed', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: true,
        },
      });

      expect(wrapper.text()).toContain('Completed');
    });

    it('applies pulse animation to running badge', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: true,
          isPaused: false,
          isCompleted: false,
        },
      });

      const badge = wrapper.find('.animate-pulse-opacity');
      expect(badge.exists()).toBe(true);
    });
  });

  describe('track layout', () => {
    it('renders track lanes', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const lanes = wrapper.findAll('.flex-1.border-b-2');
      expect(lanes.length).toBe(10);
    });

    it('renders finish line', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const finishLine = wrapper.find('.right-0.top-0.bottom-0.w-1');
      expect(finishLine.exists()).toBe(true);
    });

    it('applies gradient background to track', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const track = wrapper.find('.bg-gradient-to-br');
      expect(track.exists()).toBe(true);
    });
  });

  describe('horse components', () => {
    it('passes correct color to each horse', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const horseComponents = wrapper.findAllComponents(VHorse);
      horseComponents.forEach((horse, index) => {
        expect(horse.props('color')).toBe(mockHorses[index]?.color);
      });
    });

    it('passes isRunning false when not started', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const horseComponents = wrapper.findAllComponents(VHorse);
      horseComponents.forEach(horse => {
        expect(horse.props('isRunning')).toBe(false);
      });
    });

    it('passes isRunning false when paused', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: true,
          isPaused: true,
          isCompleted: false,
        },
      });

      const horseComponents = wrapper.findAllComponents(VHorse);
      horseComponents.forEach(horse => {
        expect(horse.props('isRunning')).toBe(false);
      });
    });

    it('passes isRunning false when completed', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: true,
        },
      });

      const horseComponents = wrapper.findAllComponents(VHorse);
      horseComponents.forEach(horse => {
        expect(horse.props('isRunning')).toBe(false);
      });
    });
  });

  describe('props', () => {
    it('accepts horses prop', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      expect(wrapper.props('horses')).toEqual(mockHorses);
    });

    it('accepts distance prop', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1600,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      expect(wrapper.props('distance')).toBe(1600);
    });

    it('accepts isRunning prop', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: true,
          isPaused: false,
          isCompleted: false,
        },
      });

      expect(wrapper.props('isRunning')).toBe(true);
    });

    it('accepts isPaused prop', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: true,
          isPaused: true,
          isCompleted: false,
        },
      });

      expect(wrapper.props('isPaused')).toBe(true);
    });

    it('accepts isCompleted prop', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: true,
        },
      });

      expect(wrapper.props('isCompleted')).toBe(true);
    });
  });

  describe('horse positioning', () => {
    it('positions each horse in separate lane', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const horseLanes = wrapper.findAll('.absolute.h-\\[10\\%\\]');
      expect(horseLanes).toHaveLength(mockHorses.length);
    });
  });

  describe('styling', () => {
    it('applies rounded corners to container', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const container = wrapper.find('.rounded-lg');
      expect(container.exists()).toBe(true);
    });

    it('applies border to container', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const container = wrapper.find('.border');
      expect(container.exists()).toBe(true);
    });

    it('applies padding to container', () => {
      const wrapper = mount(RaceTrack, {
        props: {
          horses: mockHorses,
          distance: 1200,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        },
      });

      const container = wrapper.find('.p-6');
      expect(container.exists()).toBe(true);
    });
  });
});
