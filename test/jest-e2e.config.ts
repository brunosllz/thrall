import type { Config } from '@jest/types';

import jestConfig from '../jest.config';

export default <Config.InitialOptions>{
  ...jestConfig,
  rootDir: '../',
  testEnvironment: './prisma/prisma-test-environment.ts',
  testRegex: '.e2e-spec.ts$',
};
