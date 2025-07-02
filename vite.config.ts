import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // use `describe`, `it`, etc. globally
    environment: "jsdom", // simulates the DOM (needed for React components)
    setupFiles: "./src/setupTests.ts", // optional: add global mocks, etc.
  },
});
