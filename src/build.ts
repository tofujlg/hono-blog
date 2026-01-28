import { toSSG } from "hono/ssg";
import { cp } from "node:fs/promises";
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

// Copy images to dist
await cp("./public/images", "./dist/images", { recursive: true });
console.log("Copied images to dist/images");

console.log("SSG build complete!");
