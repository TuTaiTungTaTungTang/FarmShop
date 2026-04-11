import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Hỗ trợ JSX trong file .js (project cũ từ CRA)
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    // Dependency scan của Vite (dev) cũng cần parse .js như JSX
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
    entries: ["index.html"],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build", // giữ nguyên folder build như CRA để deployment không bị ảnh hưởng
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
