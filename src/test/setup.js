// component tests render times in the machine's zone; pin it so they pass everywhere
process.env.TZ = 'UTC';

import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
