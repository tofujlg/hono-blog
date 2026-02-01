import { readdir, readFile, mkdir, writeFile, rm } from "fs/promises";
import { join, basename } from "path";

const BASE_DIR = "/home/jujekebab/dev/personal/ralph/ralph-loop-quickstart/references/hono-blog";
const POSTS_DIR = `${BASE_DIR}/posts`;
const CONTENT_DIR = `${BASE_DIR}/content/blog`;

interface PostInfo {
  filepath: string;
  date: string;
  slug: string;
  content: string;
}

async function getAllPosts(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllPosts(fullPath)));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseFrontmatter(content: string): { date: string; title: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { date: "", title: "" };
  }

  const frontmatter = match[1];
  const dateMatch = frontmatter.match(/date:\s*"?([^"\n]+)"?/);
  const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);

  return {
    date: dateMatch?.[1] || "",
    title: titleMatch?.[1]?.replace(/"/g, "") || "",
  };
}

function extractSlugFromFilename(filename: string): string {
  // Remove .md extension
  const name = basename(filename, ".md");
  // Remove date prefix like "2020-10-31-"
  const slugMatch = name.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
  return slugMatch?.[1] || name;
}

async function main() {
  console.log("Starting post reorganization...\n");

  // Get all posts
  const postFiles = await getAllPosts(POSTS_DIR);
  console.log(`Found ${postFiles.length} posts\n`);

  // Parse each post
  const posts: PostInfo[] = [];
  for (const filepath of postFiles) {
    const content = await readFile(filepath, "utf-8");
    const { date } = parseFrontmatter(content);
    const slug = extractSlugFromFilename(filepath);

    if (!date) {
      console.warn(`Warning: No date found in ${filepath}`);
      continue;
    }

    posts.push({ filepath, date, slug, content });
  }

  // Create new directory structure and move posts
  for (const post of posts) {
    const [year, month, day] = post.date.split("-");

    // Create directory path: content/blog/YYYY/MM/MMDD-slug/
    const articleFolder = `${month}${day}-${post.slug || "untitled"}`;
    const newDir = join(CONTENT_DIR, year, month, articleFolder);
    const newPath = join(newDir, "index.md");

    // Create directory
    await mkdir(newDir, { recursive: true });

    // Write the post
    await writeFile(newPath, post.content);

    console.log(`Moved: ${post.filepath}`);
    console.log(`   To: ${newPath}\n`);
  }

  console.log("\n=== Reorganization Complete ===");
  console.log(`Processed ${posts.length} posts`);
  console.log(`\nNew structure created in: ${CONTENT_DIR}`);
  console.log("\nNext steps:");
  console.log("1. Verify the new structure looks correct");
  console.log("2. Delete the old posts/ directory");
  console.log("3. Update src/index.tsx to read from content/blog/");
}

main().catch(console.error);
