import { defineConfig, devices } from '@playwright/test'
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,timeout:90000,use:{baseURL:'http://127.0.0.1:4173',launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']},trace:'retain-on-failure'},projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1080}}}]})
