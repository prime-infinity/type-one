import { defineConfig } from "vite";

export default defineConfig({
  // ... other Vite config options ...

  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },

  // Copy public folder to the root of the build output
  publicDir: "public",
});
