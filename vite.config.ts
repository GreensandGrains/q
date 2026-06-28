import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const basePath = (process.env.BASE_PATH || "/");
const apiPort = Number(process.env.API_PORT) || 5000;
const port = Number(process.env.PORT) || 3000;

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port,
    proxy: {
      [`${basePath}api`.replace(/\/\//g, "/")]: {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
      "/api": {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
});
