import type { Config } from '@jest/types';
import path from 'node:path';

import jestConfig from '../jest.config';

export default <Config.InitialOptions>{
  ...jestConfig,
  rootDir: '../',
  testEnvironment: path.join(__dirname, '../prisma/prisma-test-environment.ts'),
  testRegex: '.e2e-spec.ts$',
};
