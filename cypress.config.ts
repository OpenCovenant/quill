import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    viewportWidth: 1536,
    viewportHeight: 960
  },
    blockHosts: ["*.google-analytics.com"]
});
