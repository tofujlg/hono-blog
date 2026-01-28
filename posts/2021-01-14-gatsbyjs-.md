---
title: "Gatsby.js ブログのサムネイルで絵文字を使う"
date: "2021-01-14"
tags: ["Gatsby"]
emoji: "🖼️"
---

## 目標
記事一覧とブログ記事のトップに画像サムネイルの代わりにTwemojiを用いた絵文字サムネイルをつける。

## 使うツール
[react-emoji-render](https://github.com/tommoor/react-emoji-render#readme)

```bash:title=terminal
npm install react-emoji-render
```

## Twemoji
絵文字TwemojiというTwitterが運営するライブラリを使用する。

## マークダウンでの設定
記事ごとにそれっぽい絵文字を指定します。
フロントマターにemoji項目を追加します。書き忘れた時は💻が自動挿入されます。


```markdown:title=article.md
ーーー
title: "Gatsby.js ブログ記事に目次を追加する"
date: "2021-01-14"
tags: ["Gatsby"]
emoji: "🐱"
ーーー
```

## GraphQLクエリの追加

garphQLのクエリでも、frontmatter.emojiを追加します。

## テンプレートに追加
1. ブログ記事
2. ブログ記事一覧

の２箇所に追加します。
```jsx:title=blogTemplate.js
import { Twemoji } from 'react-emoji-render';
//...
<Twemoji
svg
text={props.data.markdownRemark.frontmatter.emoji || "💻"}
/>

//...
```

## まとめ
ブログのサムネイルは欲しいけど毎回良い感じの画像を生成するのが面倒だという方にとっては良いアイデアだと思います。

## 参考にさせていただきました

- [CatKnowsさん](https://catnose99.com/blazing-fast-writing/)
- [キクナントカさん](https://kikunantoka.com/2020/07/17--add-eyecatch/)
