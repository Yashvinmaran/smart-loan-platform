import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  envPrefix: "VITE_",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
