---
title: "Node.js学習記　その1"
date: "2021-01-21"
tags: ["Nodejs"]
emoji: ""
---

## Node.jsの学習を始めた
 
　Gatsbyブログの制作がひと段落したのでNode.jsの学習を始めた。僕の学習計画は「Gatsbyを理解すること」が中心に置かれている気がする。というのも、そもそもReactやJavaScriptを学びたいと思ったのもGatsbyに出会ったからだし、今回Node.jsを学びたいと思ったのも`gatsby-node.js`で何が起こっているのかよくわからなかったというのがあるからだ。
 
<br/>
　前からサーバーサイドをかじってみたいという気持ちはあった。3ヶ月ほど前にRuby on RailsをProgateでやったことがあるが何も覚えていない。サーバーサイドはRubyにPythonなど色々な言語がある。僕はJSが好きなので、JSでできるのならそうしようと、ひとまずNodeを学ぶことを決意した。Pythonはweb開発以外にもできることが多そうなので気になってはいるが、しばらくは見送りたい。

　まだ学習して間も無いが、学んだことをまとめておきたい。

## Global & Core メソッド

  `console.log`などはインポートしなくても使えるGlobalメソッドで、インポートしなくてもすぐに使用することができる。しかし他の多くのメソッドはCoreメソッドと言われ、使用する際にはかならずインポートしなくてはならない。
  <br/>
```js:title=app.js
const fs = require("fs");
fs.writeFileSync("notes.txt", "My name is Kebab.");
fs.appendFileSync(
"notes.txt",
"This is the text added by appendFileSync method."
);
```
<br/>
これはすごく単純なコードだが、「自分が書いたコードがファイルを作成する」のに少し感動した。


## npm

　毎度おなじみの`npm i blabla`。これはもうJSやReactのプロジェクトである程度慣れているが教科書的なことを書いておく。


1. 初期化
<br/>

```bash:title=terminal
npm init
```
<br/>

ここでいくつかの質問に答える。基本は全てenterでOK。
プロジェクトのルートディレクトリにpackage.jsonとnode_moduleが作成される。

2. パッケージのインストール
<br/>

```bash:title=terminal
npm install 'package-name'
```
<br/>

を実行するとpackage.jsonとnode_modulesにインストールしたパッケージが追加される。

3. node_modulesとpackage-lock.json
<br/>
<br/>

　これらはnpmが管理してくれるので手動で決して編集するべきではない。
node_modulesにあるコードも全てJSで書かれているので覗いてみたりするが、よくわからない。パッケージとかどうやって作るんだろう。

## JsonとObject
　JSのデータの種類の中で配列とオブジェクトはそれなりに親しんできた。Node.jsで初めてjsonを触ったのでデータについて書き残しておきたい。　
<br/>

```js:title=app.js
const dataBuffer = fs.readFileSync("test.json");
console.log(dataBuffer);
```
<br/>

この状態はバイナリデータのままなので

`<Buffer 7b 22 6e 61 6d 65 22 3a 22 47 75 6e 74 68 65 72 22 2c 22 70 6c 61 6e 65 74 22 3a 22 45 61 72 74 68 22 2c 22 61 67 65 22 3a 35 34 7d>`
<br/>
みたいな数列が得られる。これはJSで使えない。

<br/>

次にstringifyしてみると。JSONの形で得られる。
Jsonはフロントとバックエンドでデータのやりとりをするのに使われるデータの種類で、JSのエコシステムに限らずrubyやpythonでも扱うことができる。

```js:title=app.js
const dataJSON = dataBuffer.toString();
console.log(dataJSON);
//出力
//{"name":"Gunther","planet":"Earth","age":54}
```

```js:title=app.js
const user = JSON.parse(dataJSON);
user.name = "Gunther";
user.age = 54;
```

最終的にパースすると、オブジェクトが得られる。
こういうふうにオブジェクトの形ならばデータの編集も容易だ。

## 新しく使ったパッケージ
- [yargs](https://www.npmjs.com/package/yargs)
<br/>

コマンドラインパーサー。ヘルプメッセージなどを追加できる。

```js:title=app.js
yargs.command({
command: "remove",
describe: "Remove a note",
handler: function () {
console.log("Removing the note!");
},
});
```

- [chalk](https://www.npmjs.com/package/chalk)
<br/>

ターミナルの文字を見やすいように修飾してくれる。

```js:title=app.js
console.log(chalk.green("Hehe"))
```

## まとめ

基本的にはJSを書いているだけという印象。httpとかに入ると難しく感じるのかな。
