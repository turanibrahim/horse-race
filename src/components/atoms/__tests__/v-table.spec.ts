import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VTable from '../v-table.vue';

describe('v-table', () => {
  const mockColumns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'email', label: 'Email' },
  ];

  const mockData = [
    { name: 'John', age: 30, email: 'john@example.com' },
    { name: 'Jane', age: 25, email: 'jane@example.com' },
    { name: 'Bob', age: 35, email: 'bob@example.com' },
  ];

  describe('rendering', () => {
    it('renders a table element', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
    });

    it('renders table headers', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
      });

      const headers = wrapper.findAll('thead th');
      expect(headers).toHaveLength(mockColumns.length);
      
      mockColumns.forEach((col, index) => {
        expect(headers[index]?.text()).toContain(col.label);
      });
    });

    it('renders table rows', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(mockData.length);
    });

    it('renders table cells with data', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
      });

      const firstRow = wrapper.findAll('tbody tr')[0];
      const cells = firstRow?.findAll('td');
      
      expect(cells?.[0]?.text()).toBe('John');
      expect(cells?.[1]?.text()).toBe('30');
      expect(cells?.[2]?.text()).toBe('john@example.com');
    });

    it('renders empty state when no data', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: [],
        },
      });

      expect(wrapper.text()).toContain('No data available');
    });
  });

  describe('variants', () => {
    it('renders with default variant', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          variant: 'default',
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
    });

    it('applies striped variant classes', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          variant: 'striped',
        },
      });

      const table = wrapper.find('table');
      expect(table.classes()).toContain('[&_tbody_tr:nth-child(even)]:bg-cool-gray-50');
    });

    it('applies bordered variant classes', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          variant: 'bordered',
        },
      });

      const table = wrapper.find('table');
      expect(table.classes()).toContain('border');
      expect(table.classes()).toContain('border-cool-gray-200');
    });
  });

  describe('sizes', () => {
    it('applies small size classes', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          size: 'sm',
        },
      });

      const table = wrapper.find('table');
      expect(table.classes()).toContain('text-xs');
    });

    it('applies medium size classes by default', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
      });

      const table = wrapper.find('table');
      expect(table.classes()).toContain('text-sm');
    });

    it('applies large size classes', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          size: 'lg',
        },
      });

      const table = wrapper.find('table');
      expect(table.classes()).toContain('text-base');
    });
  });

  describe('column alignment', () => {
    it('applies left alignment by default', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
      });

      const firstHeader = wrapper.find('thead th');
      expect(firstHeader.classes()).toContain('text-left');
    });

    it('applies center alignment', () => {
      const columnsWithAlign = [
        { key: 'name', label: 'Name', align: 'center' as const },
      ];

      const wrapper = mount(VTable, {
        props: {
          columns: columnsWithAlign,
          data: mockData,
        },
      });

      const firstHeader = wrapper.find('thead th');
      expect(firstHeader.classes()).toContain('text-center');
    });

    it('applies right alignment', () => {
      const columnsWithAlign = [
        { key: 'age', label: 'Age', align: 'right' as const },
      ];

      const wrapper = mount(VTable, {
        props: {
          columns: columnsWithAlign,
          data: mockData,
        },
      });

      const firstHeader = wrapper.find('thead th');
      expect(firstHeader.classes()).toContain('text-right');
    });
  });

  describe('column width', () => {
    it('applies column width when specified', () => {
      const columnsWithWidth = [
        { key: 'name', label: 'Name', width: '200px' },
        { key: 'age', label: 'Age' },
      ];

      const wrapper = mount(VTable, {
        props: {
          columns: columnsWithWidth,
          data: mockData,
        },
      });

      const firstHeader = wrapper.find('thead th');
      expect(firstHeader.attributes('style')).toContain('width: 200px');
    });
  });

  describe('sortable columns', () => {
    it('renders sort icon for sortable columns', () => {
      const sortableColumns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'age', label: 'Age', sortable: false },
      ];

      const wrapper = mount(VTable, {
        props: {
          columns: sortableColumns,
          data: mockData,
        },
      });

      const firstHeader = wrapper.findAll('thead th')[0];
      expect(firstHeader?.find('svg').exists()).toBe(true);
    });

    it('emits sort event when sortable column is clicked', async () => {
      const sortableColumns = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const wrapper = mount(VTable, {
        props: {
          columns: sortableColumns,
          data: mockData,
        },
      });

      const header = wrapper.find('thead th');
      await header.trigger('click');

      expect(wrapper.emitted('sort')).toBeTruthy();
      expect(wrapper.emitted('sort')?.[0]).toEqual([sortableColumns[0]]);
    });

    it('does not emit sort event for non-sortable columns', async () => {
      const columns = [
        { key: 'name', label: 'Name', sortable: false },
      ];

      const wrapper = mount(VTable, {
        props: {
          columns,
          data: mockData,
        },
      });

      const header = wrapper.find('thead th');
      await header.trigger('click');

      expect(wrapper.emitted('sort')).toBeFalsy();
    });

    it('applies cursor-pointer class to sortable columns', () => {
      const sortableColumns = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const wrapper = mount(VTable, {
        props: {
          columns: sortableColumns,
          data: mockData,
        },
      });

      const header = wrapper.find('thead th');
      expect(header.classes()).toContain('cursor-pointer');
    });
  });

  describe('hoverable', () => {
    it('applies hover classes when hoverable is true', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          hoverable: true,
        },
      });

      const row = wrapper.find('tbody tr');
      expect(row.classes()).toContain('hover:bg-tea-green-50');
      expect(row.classes()).toContain('cursor-pointer');
    });

    it('does not apply hover classes when hoverable is false', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          hoverable: false,
        },
      });

      const row = wrapper.find('tbody tr');
      expect(row.classes()).not.toContain('hover:bg-tea-green-50');
    });
  });

  describe('events', () => {
    it('emits row-click event when row is clicked', async () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
      });

      const firstRow = wrapper.find('tbody tr');
      await firstRow.trigger('click');

      expect(wrapper.emitted('row-click')).toBeTruthy();
      expect(wrapper.emitted('row-click')?.[0]).toEqual([mockData[0], 0]);
    });
  });

  describe('slots', () => {
    it('renders custom cell slot', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
        slots: {
          'cell-name': '<strong>Custom Name</strong>',
        },
      });

      expect(wrapper.html()).toContain('<strong>Custom Name</strong>');
    });

    it('renders custom empty slot', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: [],
        },
        slots: {
          empty: 'No records found',
        },
      });

      expect(wrapper.text()).toContain('No records found');
    });

    it('passes row, value, and index to cell slot', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
        },
        slots: {
          'cell-name': ({ value, index }: { value: unknown; index: number }) => 
            `${index}: ${value}`,
        },
      });

      const firstCell = wrapper.findAll('tbody tr')[0]?.find('td');
      expect(firstCell?.text()).toContain('0:');
    });
  });

  describe('custom classes', () => {
    it('applies custom wrapper classes', () => {
      const wrapper = mount(VTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          class: 'custom-table-class',
        },
      });

      const tableWrapper = wrapper.find('.overflow-x-auto');
      expect(tableWrapper.classes()).toContain('custom-table-class');
    });
  });

});
