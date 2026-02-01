import { readdir, readFile } from "node:fs/promises";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export function parseFrontmatter(content: string): { meta: Record<string, any>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: content };
  }

  const [, frontmatter, body] = match;
  const meta: Record<string, any> = {};

  for (const line of frontmatter.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      const [, key, value] = kv;
      if (value.startsWith('"') && value.endsWith('"')) {
        meta[key] = value.slice(1, -1);
      } else if (value.startsWith("[")) {
        meta[key] = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, ""));
      } else {
        meta[key] = value;
      }
    }
  }

  return { meta, body };
}

export async function getPosts(): Promise<Post[]> {
  const files = await readdir("./content/blog", { recursive: true });
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file) => {
        const filename = typeof file === "string" ? file : file.toString();
        // Path format: YYYY/MM/MMDD-slug/index.md
        // Extract slug as: YYYY/MM/MMDD-slug
        const pathParts = filename.split("/");
        // Remove the last part (index.md or filename.md)
        pathParts.pop();
        const slug = pathParts.join("/");

        const raw = await readFile(`./content/blog/${filename}`, "utf-8");
        const { meta, body } = parseFrontmatter(raw);
        return {
          slug,
          title: meta.title || slug,
          date: meta.date || "",
          tags: meta.tags || [],
          content: body,
        };
      })
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
