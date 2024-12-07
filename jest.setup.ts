import '@testing-library/jest-dom';

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|jpg|png|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    '^@/../../utils/supabase/server$': '<rootDir>/__mocks__/supabase.ts',
  },
};

export default config;
