import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/bun";
import { ssgParams } from "hono/ssg";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkExpressiveCode from "remark-expressive-code";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { readdir, readFile } from "node:fs/promises";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkExpressiveCode)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

async function processMarkdown(content: string): Promise<string> {
  const result = await processor.process(content);
  return String(result);
}

const app = new Hono();

app.get("/theme.js", serveStatic({ path: "./public/theme.js" }));
app.get("/images/*", serveStatic({ root: "./public" }));

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
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

const Header = () => (
  <header>
    <nav>
      <a href="/">Blog</a> | <a href="/about">About</a> | <a href="/works">Works</a>
      {" | "}
      <button id="theme-toggle">Toggle Dark</button>
    </nav>
    <hr />
  </header>
);

app.use(
  jsxRenderer(({ children }) => (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Blog</title>
        <script src="/theme.js"></script>
        <style>{`
          img { max-width: 100%; height: auto; }
          body { background: #fff; color: #111; }
          a { color: #0066cc; }
          html.dark body { background: #111; color: #eee; }
          html.dark a { color: #6db3f2; }
        `}</style>
      </head>
      <body style={{ maxWidth: "650px", margin: "0 auto", padding: "1rem" }}>
        <Header />
        {children}
      </body>
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

app.get("/about", (c) => {
  return c.render(
    <main>
      <h1>About Me</h1>
      <p>Software Developer</p>
      <p>
        東京在住のソフトウェアエンジニアのブログです。業務ではネイティブアプリ、Web開発をしています。
        他には筋トレ、バスケ、ピラティスなどのボディーワーク、映画・映像に興味があります。
      </p>
      <p>
        Software Developer in Tokyo. I build native apps and web apps at work.
        I like weight training, body work such as Pilates, basketball, and movies.
      </p>
      <p>React Native, Next.js, TypeScript, Java</p>
    </main>
  );
});

app.get("/works", (c) => {
  return c.render(
    <main>
      <h1>My Works</h1>

      <section>
        <h2>growview</h2>
        <p>2024</p>
        <p>React Native製の筋トレ記録アプリ。日々のトレーニングを記録し、成果を動画で出力することが可能。</p>
        <p>Platforms: iOS, Android</p>
        <p>Tech stack: React Native, Expo, TypeScript, NativeWind, React-Native-Reanimated, FFMpeg</p>
        <p>
          Download:{" "}
          <a href="https://apps.apple.com/us/app/growview/id6737449909" target="_blank" rel="noreferrer">App Store</a>{" "}
          | <a href="https://play.google.com/store/apps/details?id=com.jujekebab.growview" target="_blank" rel="noreferrer">Play Store</a>
        </p>
      </section>

      <hr />

      <section>
        <h2>Imagine</h2>
        <p>2025</p>
        <p>目標管理アプリ</p>
        <p>Platforms: Android</p>
        <p>Tech stack: Jetpack Compose, Kotlin</p>
        <p>
          Download:{" "}
          <a href="https://play.google.com/store/apps/details?id=com.jujekebab.imagine" target="_blank" rel="noreferrer">Play Store</a>
        </p>
      </section>
    </main>
  );
});

app.get(
  "/posts/:year/:month/:slug",
  ssgParams(async () => {
    const posts = await getPosts();
    return posts.map((post) => {
      const [year, month, slug] = post.slug.split("/");
      return { year, month, slug };
    });
  }),
  async (c) => {
    const year = c.req.param("year");
    const month = c.req.param("month");
    const slug = c.req.param("slug");
    const fullSlug = `${year}/${month}/${slug}`;
    const posts = await getPosts();
    const post = posts.find((p) => p.slug === fullSlug);
    if (!post) {
      return c.notFound();
    }
    const html = await processMarkdown(post.content);
    return c.render(
      <main>
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
