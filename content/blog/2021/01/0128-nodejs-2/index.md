---
title: "Node.js学習記　その2"
date: "2021-01-28"
tags: ["Nodejs"]
emoji: ""
---

## はじめに
Node.jsについてさらに学習したことをまとめておきたい。

## http リクエスト
 Web APIを使う場合に[request](https://www.npmjs.com/package/request)というライブラリを利用してhttpリクエストを行った。
 APIから受け取ったデータをコンソールに表示する。
 
```js:title=app.js
const request = require("request");

const url =
"API address";
request({ url, json: true }, (error, response) => {
if (error) {
//ネットワークのエラー処理
console.log("Unable to connect to location services");
} else if (response.body.features.length === 0) {
// APIエラー処理
console.log("Unable to find the location");
} else {
console.log(response.body);
}
});
});
```

## 非同期処理とコールバック関数

 APIにリクエストしてデータを受け取るまで時間差があるので、受け取ったデータはコールバック関数で処理しなければならない。「Promise使えないの？」という声が出てきそうだけれどもNode.jsのライブラリはまだコールバックしかサポートしてないものが多いらしい。
 
 - 簡単なコールバック関数の例

```js:title=callback.js
const add = (a, b, callback) => {
setTimeout(() => {
const sum = a + b;
callback(sum);
}, 2000);
};

add(1, 4, (sum) => {
console.log(sum); // Should print: 5
});
```

この場合addが高階関数で、console.logがコールバック関数となる。これぐらい簡単な例なら別にPromiseじゃなくてコールバックでも問題ない。


## ES6 Object Destructuring
 これはReactとかでもよく見る省略だと思う。よく見るシンタックスなので、今一度復習しよう。
 
```js:title=object.js
const user = {
name: "John",
level: 82,
country: undefined
};
```
というオブジェクトがあったとする。特定のプロパティを取り出すには、
```js:title=object.js
const userLevel = user.level;
```
というのが伝統的な書き方だろう。しかしES6ではもっとスマートに書くことができ、かつデフォルトの値も設定することもできる。

```js:title=object.js
const { level:userLevel = 1, name, country } = user;
console.log(userLevel);
console.log(name);
```

関数の引数も予めdestructureしておくことができる。便利。

```js:title=object.js
const sortUsers = (type, { name, level  }) => {
console.log(type, name, level);
};

sortUsers("ascend", user);
```

## Express

[Express](https://expressjs.com/)というNode.jsのフレームワークの超基本も学び始めた。Rubyで言うRuby on Railsのようなものなのかな。これはだいぶ前にProgateで触れたことがあったのだが、その頃はJSどころかHTMLすらもよく理解していなかったのでそりゃ理解できるわけもなく記憶から抹消されていた。

### ルーティング
Expressの公式ドキュメントはルーティングを以下のように定義している。

>ルーティングとは、
>アプリケーションが特定のエンドポイントに対するクライアント要求に応答する方法として、
>URI (またはパス)と特定のHTTP要求メソッド(GET、POST など)を決定することです。
>各ルートには1つ以上のハンドラー関数があり、それらはルートが一致したときに実行されます。
ルート定義では、次の構造を使用します。

```js:title=app.js
app.METHOD(PATH, HANDLER)
```
appはexpressのインスタンス。

METHODは、HTTP要求メソッド。

PATHは、サーバー上のパス。

HANDLERは、ルートが一致したときに実行される関数。

### 基本的なルーティング
こんなルーティングはしないだろうけど、説明のためにシンプルなものを用意した。
```js:title=app.js
const express = require("express");
const app = express();

app.get("", (req, res) => {
  res.send("<h1>home</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>About</h1>");
});
//サーバーを起動する
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
```
ルートページにいくとhomeが、/aboutにいくとAboutが得られるようになった。
app.listenでサーバーを起動する。

## handlebars
テンプレートエンジンの[handlebars](https://www.npmjs.com/package/handlebars)について学んだ。
ReactコンポーネントのようなPartialというものを作成しテンプレートとして利用できる。便利。

```js:title=app.js
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index", {
    title: "home",
  });
});
```
hbsファイルでは下記のように利用する
```html:title=index.hbs
<body>
    {{>header}} 
    {{title}}
</body>
```

## まとめ

JavaScriptは色々できる。とりあえずMERN stackをまぁまぁできるようになりたい。
