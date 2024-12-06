import type { Config } from 'jest';

const config: Config = {
  snapshotResolver: '<rootDir>/jest/SnapshotResolver.ts'
};

export default config;
