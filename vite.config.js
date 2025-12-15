import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for /docs deployment (relative paths)
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "docs"
  }
});

