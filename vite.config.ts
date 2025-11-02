import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"], // ✅ avoids duplicate React instances
  },
  optimizeDeps: {
    include: ["react-paystack"], // ✅ ensure Paystack is bundled
  },
  build: {
    rollupOptions: {
      external: [], // ✅ don't exclude react-paystack
    },
  },
}));
