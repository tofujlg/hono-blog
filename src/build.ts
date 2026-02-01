import { toSSG } from "hono/ssg";
import * as fs from "node:fs/promises";
import { cp, copyFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import app from "./index";

const result = await toSSG(app, fs, {
  dir: "./dist",
  afterGenerateHook: async (result: any) => {
    if (result.files) {
      for (const file of result.files) {
        console.log(`Generated: ${file.path}`);
      }
    }
  },
});

// Generate RSS feed manually (SSG may output it as .html)
const rssResponse = await app.request("/rss.xml");
const rssContent = await rssResponse.text();
await writeFile("./dist/rss.xml", rssContent);
console.log("Generated: rss.xml");

if (!result.success) {
  console.error("SSG build failed:", result.error);
  process.exit(1);
}

// Create dist/images directory
await mkdir("./dist/images", { recursive: true });

// Copy public/images to dist/images
try {
  await cp("./public/images", "./dist/images", { recursive: true });
  console.log("Copied public/images to dist/images");
} catch (e) {
  console.log("No public/images directory found, skipping");
}

// Copy article images from content/blog to dist/images
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
const contentFiles = await readdir("./content/blog", { recursive: true });
let imagesCopied = 0;

for (const file of contentFiles) {
  const filePath = typeof file === "string" ? file : file.toString();
  const ext = filePath.toLowerCase().slice(filePath.lastIndexOf("."));
  if (imageExtensions.includes(ext)) {
    const srcPath = join("./content/blog", filePath);
    const destPath = join("./dist/images", basename(filePath));
    await copyFile(srcPath, destPath);
    imagesCopied++;
  }
}
console.log(`Copied ${imagesCopied} article images to dist/images`);

await copyFile("./public/theme.js", "./dist/theme.js");
console.log("Copied theme.js to dist");

console.log("SSG build complete!");
