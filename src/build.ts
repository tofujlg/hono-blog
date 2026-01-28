import { toSSG } from "hono/ssg";
import { writeFile, mkdir } from "node:fs/promises";
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

console.log("SSG build complete!");
