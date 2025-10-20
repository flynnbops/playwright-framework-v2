import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';

// Determine env, fallback to 'local'
const ENV = process.env.ENV || 'local';
type TraceLevel = 'on' | 'off' | 'retain-on-failure' | 'retain-on-first-failure';

const getTraceLevel = (): TraceLevel => {
  const env = process.env.TRACE;
  if (env === 'on' || env === 'off' || env === 'retain-on-failure' || env === 'retain-on-first-failure') {
    return env;
  }
  return 'retain-on-first-failure';
};

const traceLevel = getTraceLevel();
// Change the test id attribute to match the one used in the application
const testIdAttribute = 'data-test'

// Load corresponding .env file
dotenv.config({ path: path.resolve(__dirname, `.env.${ENV}`) });

// Left most of these settings as defaults
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Changes I made
  reporter: [
      // junit reporter intended for CI
      ['junit', { outputFile: `test-results/${ENV}-tests` }],
      // html reporter intended for debugging and development
      ['html', { open: 'never' }]],
  use: {
    trace: traceLevel,
  },

  projects: [
    {
      name: 'docker-chromium',
      use: { ...devices['Desktop Chrome'],
          testIdAttribute: testIdAttribute,
          storageState: 'playwright/.auth/standard-user.json',
      },
      dependencies:['docker-authenticate']
    },
    {
      name: 'docker-authenticate',
      testMatch: '**/authenticate.ts',
        use: { ...devices['Desktop Chrome'],
          testIdAttribute: testIdAttribute
        }
    },
    {
      name: 'local-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        testIdAttribute: testIdAttribute,
        storageState: 'playwright/.auth/standard-user.json'
      },
      dependencies:['local-authenticate']
    },
    {
      name: 'local-authenticate',
      testMatch: '**/authenticate.ts',
        use: { 
          ...devices['Desktop Chrome'],
          testIdAttribute: testIdAttribute
        }
    },
        {
      name: 'cloud-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        testIdAttribute: testIdAttribute,
        storageState: 'playwright/.auth/standard-user.json',
      },
      dependencies:['cloud-authenticate']
    },
    {
      name: 'cloud-authenticate',
      testMatch: '**/authenticate.ts',
        use: { 
          ...devices['Desktop Chrome'],
          testIdAttribute: testIdAttribute,
        }
    },
    {
      name: 'local-api',
      use: {
        baseURL: 'http://localhost:5999',
      }
    },
    {
      // Not implemented
      // Ran out of time to finish this.
      // Likely timing issues when trying to update the Pet.
      // Where some retrying / timing logic would be useful
      name: 'cloud-api',
      use: {
        baseURL: 'https://petstore3.swagger.io',
      },
    }
    ,
    {
      name: 'docker-api',
      use: {
        baseURL: 'http://petstore:8080'
      }
    }
  ]
});
