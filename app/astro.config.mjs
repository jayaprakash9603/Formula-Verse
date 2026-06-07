// @ts-check
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const LIVE_SLUGS = [
  "pythagorean-theorem-visualizer",
  "circle-area-visualizer",
  "quadratic-formula-visualizer",
  "einsteins-emc2-visualizer",
  "newtons-second-law-visualizer",
  "kinetic-energy-visualizer",
  "ohms-law-visualizer",
  "wave-equation-visualizer",
  "compound-interest-visualizer",
  "ideal-gas-law-visualizer",
  "pythagorean-3d-theorem",
  "sphere-volume-visualizer",
];

export default defineConfig({
  site: "https://formulaverse.tools",
  output: "static",
  trailingSlash: "ignore",
  build: {
    inlineStylesheets: "auto",
    assets: "_astro",
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        if (page.includes("/404")) return false;
        const m = page.match(/\/tools\/([^/]+)(?:\/(?:guide|examples|faq))?\/?$/);
        if (m) return LIVE_SLUGS.includes(m[1]);
        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@radix-ui/react-accordion",
        "@radix-ui/react-dialog",
        "@radix-ui/react-progress",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slider",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toast",
        "@radix-ui/react-tooltip",
        "class-variance-authority",
        "clsx",
        "cmdk",
        "lucide-react",
        "tailwind-merge",
        "roughjs",
        "three",
        "@react-three/fiber",
        "@react-three/drei",
      ],
    },
    ssr: {
      noExternal: ["three", "@react-three/fiber", "@react-three/drei", "zustand"],
    },
    build: {
      cssMinify: "lightningcss",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules/react-dom") ||
              id.includes("node_modules/react/")
            ) {
              return "react-vendor";
            }
            if (
              id.includes("node_modules/three") ||
              id.includes("@react-three/fiber") ||
              id.includes("@react-three/drei")
            ) {
              return "three-vendor";
            }
            if (id.includes("node_modules/lucide-react")) return "icons";
            if (id.includes("node_modules/roughjs")) return "roughjs";
          },
        },
      },
    },
  },
});
