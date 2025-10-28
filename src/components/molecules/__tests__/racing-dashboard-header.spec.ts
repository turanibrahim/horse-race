import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RacingDashboardHeader from '../racing-dashboard-header.vue';
import VButton from '@/components/atoms/v-button.vue';

describe('racing-dashboard-header', () => {
  describe('rendering', () => {
    it('renders the header component', () => {
      const wrapper = mount(RacingDashboardHeader);

      expect(wrapper.find('header').exists()).toBe(true);
    });

    it('renders Horse List button', () => {
      const wrapper = mount(RacingDashboardHeader);

      expect(wrapper.text()).toContain('Horse List');
    });

    it('renders Generate Program button', () => {
      const wrapper = mount(RacingDashboardHeader);

      expect(wrapper.text()).toContain('Generate Program');
    });

    it('renders Start/Pause Race button', () => {
      const wrapper = mount(RacingDashboardHeader);

      expect(wrapper.text()).toContain('Start/Pause Race');
    });
  });

  describe('desktop layout', () => {
    it('renders desktop menu with hidden class on mobile', () => {
      const wrapper = mount(RacingDashboardHeader);

      const desktopMenu = wrapper.findAll('.hidden.md\\:flex');
      expect(desktopMenu.length).toBeGreaterThan(0);
    });

    it('renders all VButton components', () => {
      const wrapper = mount(RacingDashboardHeader);

      const buttons = wrapper.findAllComponents(VButton);
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('mobile layout', () => {
    it('renders mobile menu button', () => {
      const wrapper = mount(RacingDashboardHeader);

      const mobileButton = wrapper.find('[aria-label="Toggle menu"]');
      expect(mobileButton.exists()).toBe(true);
    });

    it('mobile menu is hidden by default', () => {
      const wrapper = mount(RacingDashboardHeader);

      const mobileMenu = wrapper.find('nav');
      expect(mobileMenu.exists()).toBe(false);
    });

    it('shows mobile menu when button is clicked', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const toggleButton = wrapper.find('[aria-label="Toggle menu"]');
      await toggleButton.trigger('click');

      expect(wrapper.find('nav').exists()).toBe(true);
    });

    it('hides mobile menu when close button is clicked', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const toggleButton = wrapper.find('[aria-label="Toggle menu"]');
      await toggleButton.trigger('click');

      const closeButton = wrapper.find('nav button:last-child');
      await closeButton.trigger('click');

      expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('shows backdrop when mobile menu is open', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const toggleButton = wrapper.find('[aria-label="Toggle menu"]');
      await toggleButton.trigger('click');

      const backdrop = wrapper.find('.bg-black\\/25');
      expect(backdrop.exists()).toBe(true);
    });

    it('closes mobile menu when backdrop is clicked', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const toggleButton = wrapper.find('[aria-label="Toggle menu"]');
      await toggleButton.trigger('click');

      const backdrop = wrapper.find('.bg-black\\/25');
      await backdrop.trigger('click');

      expect(wrapper.find('nav').exists()).toBe(false);
    });
  });

  describe('events', () => {
    it('emits click:horse-list when Horse List button is clicked', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const buttons = wrapper.findAllComponents(VButton);
      const horseListButton = buttons.find(btn => btn.text().includes('Horse List'));
      await horseListButton?.trigger('click');

      expect(wrapper.emitted('click:horse-list')).toBeTruthy();
    });

    it('emits click:generate-program when Generate Program button is clicked', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const buttons = wrapper.findAllComponents(VButton);
      const generateButton = buttons.find(btn => btn.text().includes('Generate Program'));
      await generateButton?.trigger('click');

      expect(wrapper.emitted('click:generate-program')).toBeTruthy();
    });

    it('emits click:start-pause-race when Start/Pause Race button is clicked', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const buttons = wrapper.findAllComponents(VButton);
      const startPauseButton = buttons.find(btn => btn.text().includes('Start/Pause Race'));
      await startPauseButton?.trigger('click');

      expect(wrapper.emitted('click:start-pause-race')).toBeTruthy();
    });

    it('closes mobile menu after emitting horse-list event', async () => {
      const wrapper = mount(RacingDashboardHeader);

      const toggleButton = wrapper.find('[aria-label="Toggle menu"]');
      await toggleButton.trigger('click');

      expect(wrapper.find('nav').exists()).toBe(true);

      const buttons = wrapper.findAllComponents(VButton);
      const horseListButton = buttons.find(btn => btn.text().includes('Horse List'));
      await horseListButton?.trigger('click');

      expect(wrapper.find('nav').exists()).toBe(false);
    });
  });

  describe('styling', () => {
    it('applies correct header styles', () => {
      const wrapper = mount(RacingDashboardHeader);

      const header = wrapper.find('header');
      expect(header.classes()).toContain('flex');
      expect(header.classes()).toContain('justify-between');
    });

    it('applies border to header', () => {
      const wrapper = mount(RacingDashboardHeader);

      const header = wrapper.find('header');
      expect(header.classes()).toContain('border-b-2');
    });
  });

  describe('button variants', () => {
    it('Horse List button has primary variant', () => {
      const wrapper = mount(RacingDashboardHeader);

      const buttons = wrapper.findAllComponents(VButton);
      const horseListButton = buttons.find(btn => btn.text().includes('Horse List'));
      expect(horseListButton?.props('variant')).toBe('primary');
    });

    it('Generate Program button has secondary variant', () => {
      const wrapper = mount(RacingDashboardHeader);

      const buttons = wrapper.findAllComponents(VButton);
      const generateButton = buttons.find(btn => btn.text().includes('Generate Program'));
      expect(generateButton?.props('variant')).toBe('secondary');
    });

    it('Start/Pause Race button has accent variant', () => {
      const wrapper = mount(RacingDashboardHeader);

      const buttons = wrapper.findAllComponents(VButton);
      const startPauseButton = buttons.find(btn => btn.text().includes('Start/Pause Race'));
      expect(startPauseButton?.props('variant')).toBe('accent');
    });
  });
});
