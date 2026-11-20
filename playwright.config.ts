import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'

const url = 'http://127.0.0.1:4173'
export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  timeout: 90000,
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: url,
    launchOptions: {
      executablePath: existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined
    },
    trace: 'retain-on-failure'
  },
  projects: [{name:'desktop', use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1080}}}]
})
