import { afterEach } from 'vitest';
import { config } from '@vue/test-utils';

config.global.stubs = {
  teleport: true,
};

afterEach(() => {
  // Cleanup DOM after each test
});
