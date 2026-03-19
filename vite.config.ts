import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  esbuild: {
    drop: ['console', 'debugger'], // 打包時自動移除所有 console.log 和 debugger
  },
});
