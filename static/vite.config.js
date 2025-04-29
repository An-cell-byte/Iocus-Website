// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // 👉 El código fuente vive aquí:
  root: "static/vista-administrador",

  // 👉 Dónde saldrá el build (quedará dentro de /static/dist)
  build: {
    outDir: "../dist", // 1 nivel arriba = static/dist
    emptyOutDir: true, // limpia dist antes de construir
  },

  plugins: [react()],
});
