import { mockEnv } from './testUtils/mockEnv';

jest.mock('../src/utils/logger');
jest.mock('../src/env');

// Reset the env between tests
beforeEach(() => mockEnv());
