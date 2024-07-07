import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'izncdq',
  e2e: {
    "baseUrl": "http://localhost:81",
    setupNodeEvents(on, config) {
    },
  },
});
