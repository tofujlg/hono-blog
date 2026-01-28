import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";

const SOURCE_DIR = "/home/jujekebab/dev/personal/tofu-tech-blog/content/blog";
const TARGET_DIR = "./posts";

async function findMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMdxFiles(fullPath)));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function migrate() {
  await mkdir(TARGET_DIR, { recursive: true });

  const files = await findMdxFiles(SOURCE_DIR);
  console.log(`Found ${files.length} MDX files`);

  for (const file of files) {
    const content = await readFile(file, "utf-8");

    // Extract frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) {
      console.log(`Skipping ${file}: no frontmatter`);
      continue;
    }

    const [, frontmatter, body] = fmMatch;

    // Parse frontmatter
    const titleMatch = frontmatter.match(/title:\s*"(.+?)"/);
    const dateMatch = frontmatter.match(/date:\s*"(.+?)"/);
    const tagsMatch = frontmatter.match(/tags:\s*\[(.+?)\]/);
    const emojiMatch = frontmatter.match(/emoji:\s*"(.+?)"/);

    const title = titleMatch?.[1] || "Untitled";
    const date = dateMatch?.[1] || "2020-01-01";
    const tags = tagsMatch?.[1]?.replace(/"/g, "").split(",").map(t => t.trim()) || [];
    const emoji = emojiMatch?.[1] || "";

    // Generate slug from date and title
    const slug = `${date}-${slugify(title)}`.slice(0, 80);

    // Build new frontmatter
    const newFrontmatter = `---
title: "${title}"
date: "${date}"
tags: [${tags.map(t => `"${t}"`).join(", ")}]
emoji: "${emoji}"
---`;

    const newContent = `${newFrontmatter}\n\n${body.trim()}\n`;
    const targetPath = join(TARGET_DIR, `${slug}.md`);

    await writeFile(targetPath, newContent);
    console.log(`Migrated: ${slug}.md`);
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
