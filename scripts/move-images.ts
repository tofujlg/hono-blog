import { readdir, readFile, copyFile } from "fs/promises";
import { join, basename, extname } from "path";

const BASE_DIR = "/home/jujekebab/dev/personal/ralph/ralph-loop-quickstart/references/hono-blog";
const IMAGES_DIR = `${BASE_DIR}/public/images`;
const CONTENT_DIR = `${BASE_DIR}/content/blog`;

interface ArticleInfo {
  folder: string;
  year: string;
  month: string;
  slug: string;
  date: string;
  title: string;
}

async function getAllArticleFolders(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const folders: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const subEntries = await readdir(fullPath, { withFileTypes: true });
      const hasIndexMd = subEntries.some(e => e.name === "index.md");

      if (hasIndexMd) {
        folders.push(fullPath);
      } else {
        folders.push(...(await getAllArticleFolders(fullPath)));
      }
    }
  }

  return folders;
}

async function getArticleInfo(folder: string): Promise<ArticleInfo> {
  const pathParts = folder.split("/");
  const folderName = pathParts[pathParts.length - 1];
  const month = pathParts[pathParts.length - 2];
  const year = pathParts[pathParts.length - 3];
  const slug = folderName.slice(5); // Remove MMDD-

  const indexPath = join(folder, "index.md");
  const content = await readFile(indexPath, "utf-8");

  const dateMatch = content.match(/date:\s*"?(\d{4}-\d{2}-\d{2})"?/);
  const titleMatch = content.match(/title:\s*"([^"]+)"/);

  return {
    folder,
    year,
    month,
    slug,
    date: dateMatch?.[1] || "",
    title: titleMatch?.[1] || "",
  };
}

function normalizeSlug(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/^\d+/, ""); // Remove leading numbers
}

async function main() {
  console.log("Moving images to article folders...\n");

  const imageFiles = await readdir(IMAGES_DIR);
  console.log(`Found ${imageFiles.length} images\n`);

  const articleFolders = await getAllArticleFolders(CONTENT_DIR);
  const articles = await Promise.all(articleFolders.map(getArticleInfo));
  console.log(`Found ${articles.length} article folders\n`);

  let movedCount = 0;
  let notFoundCount = 0;
  const notFound: string[] = [];

  for (const imageFile of imageFiles) {
    // Try multiple patterns to extract year-month
    let year: string | undefined;
    let month: string | undefined;
    let rest: string | undefined;

    // Pattern 1: "2021-01-slug-name.ext"
    let match = imageFile.match(/^(\d{4})-(\d{2})-(.+)$/);
    if (match) {
      [, year, month, rest] = match;
    }

    // Pattern 2: "images-react.svg" or similar without date - try to match by content
    if (!year) {
      rest = imageFile;
    }

    const ext = extname(imageFile);
    const slugPart = (rest || imageFile).replace(ext, "");

    // Find matching article
    let targetFolder: string | undefined;
    let bestScore = 0;

    for (const article of articles) {
      // Must match year/month if we have it
      if (year && month && (article.year !== year || article.month !== month)) {
        continue;
      }

      // Calculate similarity score
      let score = 0;

      const normalizedImageSlug = normalizeSlug(slugPart);
      const normalizedArticleSlug = normalizeSlug(article.slug);
      const normalizedTitle = normalizeSlug(article.title);

      // Check if image slug contains article slug or vice versa
      if (normalizedImageSlug.includes(normalizedArticleSlug.slice(0, 6))) {
        score += 10;
      }
      if (normalizedArticleSlug.includes(normalizedImageSlug.slice(0, 6))) {
        score += 10;
      }

      // Check if image contains words from title
      const titleWords = article.title.toLowerCase().split(/\s+/);
      for (const word of titleWords) {
        if (word.length > 3 && slugPart.toLowerCase().includes(word)) {
          score += 5;
        }
      }

      // Check date pattern match (like "20210206" in image matches folder "0206-")
      const datePattern = slugPart.match(/(\d{8})/);
      if (datePattern) {
        const dateStr = datePattern[1];
        if (dateStr === article.date.replace(/-/g, "")) {
          score += 20;
        }
      }

      // Special cases
      if (slugPart.includes("obsidian") && article.slug.includes("obsidian")) {
        score += 15;
      }
      if (slugPart.includes("gatsby") && article.slug.includes("gatsby")) {
        score += 15;
      }
      if (slugPart.includes("neovim") && article.slug.includes("neovim")) {
        score += 15;
      }
      if (slugPart.includes("Nowt36") && article.slug.includes("nowt36")) {
        score += 15;
      }
      if (slugPart.includes("processing") && article.slug.includes("processing")) {
        score += 15;
      }
      if (slugPart.includes("keyball") && article.slug.includes("keyball")) {
        score += 15;
      }
      if (slugPart.includes("cocot") && article.slug.includes("cocot")) {
        score += 15;
      }
      if (slugPart.includes("VSCode") && article.slug.includes("vscode")) {
        score += 15;
      }
      if (slugPart.includes("RN_") && (article.slug.includes("reactnative") || article.title.includes("React Native"))) {
        score += 15;
      }
      if (slugPart.includes("css") && article.slug.includes("css")) {
        score += 15;
      }
      if (slugPart.includes("udemy") && article.slug.includes("udemy")) {
        score += 15;
      }

      if (score > bestScore) {
        bestScore = score;
        targetFolder = article.folder;
      }
    }

    if (targetFolder && bestScore >= 10) {
      const srcPath = join(IMAGES_DIR, imageFile);
      const destPath = join(targetFolder, imageFile);

      // Check if already copied
      try {
        await readFile(destPath);
        console.log(`Already exists: ${imageFile} in ${basename(targetFolder)}/`);
      } catch {
        await copyFile(srcPath, destPath);
        console.log(`Moved: ${imageFile} -> ${basename(targetFolder)}/ (score: ${bestScore})`);
      }
      movedCount++;
    } else {
      notFound.push(`${imageFile} (best score: ${bestScore})`);
      notFoundCount++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Moved: ${movedCount} images`);
  console.log(`Not matched: ${notFoundCount} images`);

  if (notFound.length > 0) {
    console.log("\nImages not matched:");
    notFound.forEach(f => console.log(`  - ${f}`));
  }
}

main().catch(console.error);
