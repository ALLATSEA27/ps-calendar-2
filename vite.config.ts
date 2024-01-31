import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// const repoName = "ps-calendar-2";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  // base: `/${repoName}/`,
});
