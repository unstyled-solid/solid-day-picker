import { defineConfig } from "vitest/config";
import solid from "@solidjs/vite-plugin";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [solid({ compiler: "babel", refresh: false })],
  resolve: { conditions: ["browser", "development"], alias: { "@/test": fileURLToPath(new URL("./test", import.meta.url)) } },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["packages/solid/src/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}", "examples/**/*.test.tsx", "docs/examples/**/*.test.{ts,tsx}"],
    setupFiles: ["test/setup.ts"],
    snapshotSerializers:['test/snapshot-serializer.ts'],
    exclude:['**/node_modules/**','docs/examples/timezone/**'],
    maxWorkers: 2,
    env: { TZ: "UTC" }
  }
});
