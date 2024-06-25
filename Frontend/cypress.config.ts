import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'izncdq',
  e2e: {
    "baseUrl": "http://localhost:3024",
    setupNodeEvents(on, config) {
    },
  },
});
