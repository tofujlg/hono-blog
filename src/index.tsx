import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { ssgParams } from "hono/ssg";
import { marked } from "marked";
import { readdir, readFile } from "node:fs/promises";

const app = new Hono();

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  emoji: string;
  content: string;
}

function parseFrontmatter(content: string): { meta: Record<string, any>; body: string } {
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

async function getPosts(): Promise<Post[]> {
  const files = await readdir("./posts");
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file) => {
        const slug = file.replace(".md", "");
        const raw = await readFile(`./posts/${file}`, "utf-8");
        const { meta, body } = parseFrontmatter(raw);
        return {
          slug,
          title: meta.title || slug,
          date: meta.date || "",
          tags: meta.tags || [],
          emoji: meta.emoji || "",
          content: body,
        };
      })
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

app.use(
  jsxRenderer(({ children }) => (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Blog</title>
      </head>
      <body>{children}</body>
    </html>
  ))
);

app.get("/", async (c) => {
  const posts = await getPosts();
  return c.render(
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li>
            <a href={`/posts/${post.slug}`}>{post.title}</a>{" "}
            <small>({post.date})</small>
          </li>
        ))}
      </ul>
    </main>
  );
});

app.get(
  "/posts/:slug",
  ssgParams(async () => {
    const posts = await getPosts();
    return posts.map((post) => ({ slug: post.slug }));
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const posts = await getPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      return c.notFound();
    }
    const html = await marked(post.content);
    return c.render(
      <main>
        <p>
          <a href="/">← Back</a>
        </p>
        <article>
          <h1>{post.title}</h1>
          <p>
            <small>{post.date}</small>
          </p>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
    );
  }
);

export default app;
