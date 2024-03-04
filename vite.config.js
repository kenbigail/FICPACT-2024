import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // If Possible only make index, don't direct to other files.
    // host: kenbigail.github.io,
    port: 5000,
  },
});
