---
title: "Gatsby.js ブログ記事に目次を追加する"
date: "2021-01-13"
tags: ["Gatsby"]
emoji: "📑"
---

## 目標
Gatsby製のブログにTable of Content風の目次を追加したい。
その際コンポーネントにして任意の場所に設置できるようにしたい。

## gatsby-remark-autolink-headers plugin
[gatsby-remark-autolink-headers](https://www.gatsbyjs.com/plugins/gatsby-remark-autolink-headers/)は
-   見出しタグにidを振る
-   自動で目次を作成してくれる(なぜだか僕の場合は間違ったslugが作成されて使えず…)

<br/>
をしてくれる。

### プラグインのインストール

```bash:title=console
npm install gatsby-remark-autolink-headers
```

### Gatsby-config.jsに追加
Gatsby-remark-autolink-headersはgatsby-transformer-remarkのサブプラグインなので、オプションプラグインに追加します。
そしてこの際、gatsby-remark-prismjsを導入している際はそれより前に追加するようにと公式ドキュメントには書かれています。

<br/>

```js{5}:title=gatsby-config.js
{
resolve: "gatsby-transformer-remark",
options: {
plugins: [
"gatsby-remark-autolink-headers",
"gatsby-remark-code-titles",
"gatsby-remark-prismjs",
}
```

## slug問題
ここで少し問題が。
gatsby-remark-autolink-headersがGraphQLに追加してくれたTableOfContentが自動的に生成してくれるリンクが正しく無いのでこれが使えないことが判明。解決法を探してもよかったのだが、自前で作ることにした。

## React-scrollのインストール
見出しをクリックするとスムーズスクロールして該当箇所にまで移動してくれる機能をつけたいので[react-scroll](https://www.npmjs.com/package/react-scroll)というnpmパッケージをインストールする。

```bash:title=console
npm install react-scroll
```

※Gatsby Linkでも実装できますので、Smooth scrollingが必要ないと思う方は飛ばしてください。

## 目次コンポーネントの作成

```js{14,15,16}:title=tableOfContents.js
import React from "react"
import { Link } from "react-scroll"
import tableOfContentsStyles from "./tableOfContents.module.scss"
  
const TableOfContents = props => {
return (
<div className={tableOfContentsStyles.tableOfContents}>
<h2 className ={tableOfContentsStyles.title}>目次</h2>

{props.headings.map(heading => (
<Link

smooth={true}
to={heading.id}
//--Gatsby Link の場合
//to={`/blog/${props.slug}/#${heading.id}`}

duration={1000}
className={tableOfContentsStyles.heading}

>
{heading.value}
</Link>
))}

</div>
)
}

export default TableOfContents

```
h1,h2,h3など見出しの大きさは無視した目次を作成したいので、見出しを全て拾ってきて、react-scrollのLinkを作成しました。
この際toプロパティはurlではなく、見出しの名前に設定します。
※Gatsby Linkの場合はurlで記入。

## Blog TemplateコンポーネントにTOCを挿入

この際、markdownRemarkのgraphQLにてheadingとidを指定しないと動かない。
