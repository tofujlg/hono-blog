import type { FC, PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>jujekebab</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="/styles.css" />
      <script src="/theme.js"></script>
    </head>
    <body>
      <Header />
      {children}
    </body>
  </html>
);
