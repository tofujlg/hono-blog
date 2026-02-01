import type { FC, PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";

export const Layout: FC<PropsWithChildren> = ({ children }) => (
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
);
