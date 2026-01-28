import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { ssgParams } from "hono/ssg";
import { marked } from "marked";
import { readdir, readFile } from "node:fs/promises";

const app = new Hono();

async function getPosts() {
  const files = await readdir("./posts");
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file) => {
        const slug = file.replace(".md", "");
        const content = await readFile(`./posts/${file}`, "utf-8");
        const lines = content.split("\n");
        const title = lines[0].replace(/^#\s*/, "");
        return { slug, title, content };
      })
  );
  return posts;
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
            <a href={`/posts/${post.slug}`}>{post.title}</a>
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
        <article dangerouslySetInnerHTML={{ __html: html }} />
      </main>
    );
  }
);

export default app;
