---
title: "CSSでフワッとアニメーション"
date: "2022-02-13"
tags: ["CSS"]
emoji: ""
---

ページ読み込み時にフワッとロードする方法

<iframe src="https://giphy.com/embed/YmBolYnjtFj1pkvtfb" width="480" height="309" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/YmBolYnjtFj1pkvtfb">via GIPHY</a></p>

数行のCSSで達成することができる

```html
<body>
  <div id="header1">
    <h1>Header 1</h1>
    <p>Some text</p>
  </div>
   <div id="header2">
    <h1>Header 2</h1>
    <p>Some text</p>
  </div>
   <div id="header3">
    <h1>Header 3</h1>
    <p>Some text</p>
  </div>
</body>
```
こういうHTMLがあるとします。

```css
@keyframes fadeIn {
  0% {
      opacity: 0
  }
  100% {
      opacity: 1
  }
}
#header1{
  animation: fadeIn .3s ease-in 0s 1 normal;
}
#header2 {
  animation: fadeIn .9s ease-in 0s 1 normal;
}
#header3 {
  animation: fadeIn 1.5s ease-in 0s 1 normal;
}
```
Divごとにアニメーションの速度を設定します。
全体をフワッとさせたければBodyに追加すればOKです。

## keyframeで動きの変化を指定

`@keyframe`とはアットルールの一種でCSSの動作を規定するものです。
上述のCSSの`0%`と`100%`をそれぞれ`from`と`to`に変換することもできます。FadeInはアニメーショの定義名です。

## animation
`animation: fadeIn .3s ease-in 0s 1 normal;`

↓

`animation: 定義名 変化時間 進行具合 ループ 交互に反対再生させるか;`



## 参照
- [animation - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [Site Unreachable](https://www.w3schools.com/css/css3_animations.asp)
[CSSアニメーションで動きを指定しよう | 動くWebデザインアイディア帳](https://coco-factory.jp/ugokuweb/css02/)
