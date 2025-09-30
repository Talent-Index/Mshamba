import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  optimizeDeps: {
    include: [
      "@suiet/wallet-kit",
      "@mysten/sui.js/transactions",
      "@mysten/sui.js/client",
      "@mysten/sui.js/utils",
    ],
  },
  
});
