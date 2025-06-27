// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    target: "es2020",
    sourcemap: true,
    minify: true,
    clean: true,
    dts: true,
    injectStyle: true,
  },
  // CSS build
  {
    entry: ["src/styles.css"],
    outDir: "dist",
  },
]);
