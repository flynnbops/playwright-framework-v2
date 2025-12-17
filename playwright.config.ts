import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestOptions } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';

// Determine envs, fallback to 'local'
const ENV = process.env.ENV || 'local';
console.log(`Using environment: ${ENV}`);
const API_URL = String(process.env.API_URL) || 'http://localhost:5999';
console.log(`Using API_URL: ${API_URL}`);

type TraceLevel = 'on' | 'off' | 'retain-on-failure' | 'retain-on-first-failure';

// Load corresponding .env file
dotenv.config({ path: path.resolve(__dirname, `.env.${ENV}`) });

const getTraceLevel = (): TraceLevel => {
  const trace = process.env.TRACE;
  if (trace === 'on' || trace === 'off' || trace === 'retain-on-failure' || trace === 'retain-on-first-failure') {
    console.log(`TRACE value: ${trace}`)
    return trace;
  }
  console.log(`Invalid TRACE value: '${trace}', using default 'retain-on-first-failure'`);
  return 'retain-on-first-failure';
};

const traceLevel = getTraceLevel();
// Change the test id attribute to match the one used in the application
const testIdAttribute = 'data-test'

// Browser configurations
const desktopChrome: Partial<PlaywrightTestOptions> = { ...devices['Desktop Chrome'], testIdAttribute };
const authenticatedChrome: Partial<PlaywrightTestOptions> = { ...desktopChrome, storageState: 'playwright/.auth/standard-user.json' };
const unauthenticatedChrome: Partial<PlaywrightTestOptions> = desktopChrome;

const mobileSafariLandScape: Partial<PlaywrightTestOptions> = { ...devices['iPhone 13'], testIdAttribute, viewport: { width: 844, height: 390 } };
const authenticatedSafari: Partial<PlaywrightTestOptions> = { ...mobileSafariLandScape, storageState: 'playwright/.auth/standard-user.json' };
const unauthenticatedSafari: Partial<PlaywrightTestOptions> = mobileSafariLandScape;

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
    trace: traceLevel
  },

  projects: [
    {
      name: 'desktop-chromium-authenticated',
      use: authenticatedChrome,
      dependencies:['desktop-chromium-unauthenticated']
    },
    {
      name: 'desktop-chromium-unauthenticated',
      testMatch: '**/authenticate.ts',
      use: unauthenticatedChrome
    },
    {
      name: 'safari-authenticated',
      use: authenticatedSafari,
      dependencies:['safari-unauthenticated']
    },
    {
      name: 'safari-unauthenticated',
      testMatch: '**/authenticate.ts',
      use: unauthenticatedSafari
    },
    {
      name: 'api',
      use: {
        baseURL: API_URL,
      } 
    }
  ]
});
