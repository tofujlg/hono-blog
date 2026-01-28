import { readdir, readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { join, dirname, basename } from "node:path";

const SOURCE_DIR = "/home/jujekebab/dev/personal/tofu-tech-blog/content/blog";
const POSTS_DIR = "./posts";
const IMAGES_DIR = "./public/images";

async function findFiles(dir: string, ext: string[]): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findFiles(fullPath, ext)));
    } else if (ext.some((e) => entry.name.toLowerCase().endsWith(e))) {
      files.push(fullPath);
    }
  }
  return files;
}

async function migrateImages() {
  await mkdir(IMAGES_DIR, { recursive: true });

  // Find all images in source
  const imageExts = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
  const images = await findFiles(SOURCE_DIR, imageExts);

  console.log(`Found ${images.length} images`);

  // Create a map of original path -> new filename
  const imageMap: Record<string, string> = {};

  for (const imagePath of images) {
    // Create unique name based on path
    const relativePath = imagePath.replace(SOURCE_DIR + "/", "");
    const newName = relativePath.replace(/\//g, "-");
    imageMap[imagePath] = newName;

    // Copy image
    await copyFile(imagePath, join(IMAGES_DIR, newName));
    console.log(`Copied: ${newName}`);
  }

  // Now update all posts to fix image paths
  const posts = await readdir(POSTS_DIR);

  for (const postFile of posts) {
    if (!postFile.endsWith(".md")) continue;

    const postPath = join(POSTS_DIR, postFile);
    let content = await readFile(postPath, "utf-8");
    let modified = false;

    // Find all image references like ![alt](./path) or ![alt](path)
    const imageRegex = /!\[([^\]]*)\]\(\.?\.?\/?([\w\-./]+\.(png|jpg|jpeg|gif|svg|webp))\)/gi;

    content = content.replace(imageRegex, (match, alt, imagePath) => {
      // Find the image in our map
      const imageFileName = basename(imagePath);

      // Search for matching image in the map
      for (const [originalPath, newName] of Object.entries(imageMap)) {
        if (originalPath.endsWith(imageFileName) || originalPath.includes(imagePath.replace("./", ""))) {
          modified = true;
          return `![${alt}](/images/${newName})`;
        }
      }

      console.log(`Warning: Image not found for ${imagePath} in ${postFile}`);
      return match;
    });

    if (modified) {
      await writeFile(postPath, content);
      console.log(`Updated: ${postFile}`);
    }
  }

  console.log("Image migration complete!");
}

migrateImages().catch(console.error);
