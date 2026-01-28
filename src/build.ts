import { toSSG } from "hono/ssg";
import { cp, copyFile } from "node:fs/promises";
import app from "./index";

const result = await toSSG(app, {
  dir: "./dist",
  afterGenerateHook: async (result) => {
    if (result.files) {
      for (const file of result.files) {
        console.log(`Generated: ${file.path}`);
      }
    }
  },
});

if (!result.success) {
  console.error("SSG build failed:", result.error);
  process.exit(1);
}

// Copy public assets to dist
await cp("./public/images", "./dist/images", { recursive: true });
await copyFile("./public/theme.js", "./dist/theme.js");
console.log("Copied public assets to dist");

console.log("SSG build complete!");
