import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/bun";
import { ssgParams } from "hono/ssg";
import { readdir } from "node:fs/promises";

import { getPosts } from "./lib/posts";
import { processMarkdown } from "./lib/markdown";
import { Layout } from "./components/Layout";

const app = new Hono();

app.get("/theme.js", serveStatic({ path: "./public/theme.js" }));
app.get("/styles.css", serveStatic({ path: "./public/styles.css" }));

// RSS Feed
app.get("/rss.xml", async (c) => {
  const posts = await getPosts();
  const siteUrl = "https://blog.example.com"; // Base URL for the blog

  const rssItems = posts.slice(0, 20).map((post) => {
    const description = post.content
      .replace(/[#*`\[\]]/g, "") // Remove markdown syntax
      .replace(/<[^>]*>/g, "") // Remove any HTML tags
      .trim()
      .slice(0, 200);

    const pubDate = new Date(post.date).toUTCString();

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid>${siteUrl}/posts/${post.slug}</guid>
      <description><![CDATA[${description}...]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog</title>
    <link>${siteUrl}</link>
    <description>A developer's blog for publishing articles and technical content</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  return c.text(rss, 200, {
    "Content-Type": "application/rss+xml; charset=utf-8",
  });
});

// Serve images - try public/images first, then search article folders
app.get("/images/:filename", async (c) => {
  const filename = c.req.param("filename");

  // First try public/images
  try {
    const publicPath = `./public/images/${filename}`;
    const file = Bun.file(publicPath);
    if (await file.exists()) {
      return new Response(file);
    }
  } catch {}

  // Search in article folders
  const files = await readdir("./content/blog", { recursive: true });
  for (const f of files) {
    const filePath = typeof f === "string" ? f : f.toString();
    if (filePath.endsWith(filename)) {
      const fullPath = `./content/blog/${filePath}`;
      const file = Bun.file(fullPath);
      if (await file.exists()) {
        return new Response(file);
      }
    }
  }

  return c.notFound();
});

app.use(
  jsxRenderer(({ children }) => <Layout>{children}</Layout>)
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
			<h1>Author</h1>
			<p>jujekebab</p>
			<p>
			主にソフトウェアとコンピューターについて書きますが、身体と映像・文章などのメディアにも関心があります。
			</p>
			<p>
			Mostly, writing (about) software and computer. Sometimes about body and mind and other stuffs.
			</p>
			<p>
			</p>
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
