---
title: "JestでNodeアプリをテストする"
date: "2021-02-10"
tags: ["Jest"]
emoji: ""
---

## はじめに

[Jest](https://jestjs.io/ja/)はFacebookが開発するオープンソースのJavaScriptのテストフレームワークです。

ちなみにJavaScriptのTestでJestらしいです。

<br/>

`Jest はシンプルさを重視した、快適な JavaScript テスティングフレームワークです。`

<br/>

と公式ドキュメントにあるようにシンプルなシンタックスでテストを書くことができます。

この記事ではNode.jsとExpressのためテストの書き方を紹介します。


## なぜテストする必要があるのか

一つのアプリケーションはいくつものモジュールに分割することができます。ユニットテストにはそのモジュールがきちんと機能しているかを確かめる目的があります。
<br/>

そうすることで
<br/>

- 各モジュールの役割を明確にすること
- バグがあった時に原因を探しやすくなる
<br/>

などのメリットがあります。

小規模のプログラムだと、手動でテストすることも可能かもしれませんが、プログラムが大規模になるにつれテストの重要度は増していきます。

## Jestの設定
開発でしか使いませんのでdev-dependenciesとしてnpmインストールします。

```bash:title=terminal
$ npm i jest --save-dev
```

`npm run test`でテストを実行できるように、package.jsonにスクリプトを用意しましょう。

{/* ```js:title=package.json */}
```js {2-4} title="package.json"
{
  "scripts": {
    "test": "jest"
  }
}
```

## 基本的な使い方

テスト用のコードは`tests`というディレクトリを作成し、そのなかに`title.test.js`という風にモジュールの名前に対応するテストファイルをそれぞれ作成します。そうしなくてはいけないというルールはありませんが、この方法だとより管理しやすいと思います。
<br/>
<br/>

```bash
├── src
│   └── app.js
├── tests
│   └── app.test.js
└── package.json
```

例としてこのような足算する関数をテストしてみましょう。

```js:title=app.js
const add = (a,b) => a + b;
```
<br/>

Jestでのテストの書き方は非常にシンプルです。testの第一引数には「テスト名（期待する結果をストリングで）」を第2引数には「テストコード」を渡します。

例えば上記のadd関数の役割は「aとbの和を返すこと」ですので。このようなコードになります。
ほとんど英文に近いですね。

```js:title=app.test.js
test("Should return a plus b", () => {
  const result = add(1,2);
  expect(result).toBe(3);
});
```

## テストを実行する

`npm run test`でテストを実行することができます。結果はこのような形でコンソールに表示されます。
もしエラーがあったら、そのユニットテストを確認して修正する、という感じです。

```bash
Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        6.676s
Ran all test suites.

Watch Usage: Press w to show more.
```

## 非同期処理のテスト
非同期処理のテストは普通のテストとは違い、結果が帰ってくるまで待つ必要があります。
非同期処理のテスト方法には2種類あります。

<br/>
<br/>

1.doneを使う方法

```js:title=app.test.js
test('Async test demo',(done)=>{
  setTimeout(() => {
      expect(2).toBe(2)
      done()
  }, 2000);
})
```
`done()`が呼び出されるまで、テストの判定を行わないことをJestに教えることができます。
<br/>
<br/>

2.async/awaitを使う方法

```js:title=app.test.js
test('Should add two numbers async/await', async()=>{
	const sum = await add(10,22);
	expect(sum).toBe(32)
})
```
これは普通のJSのasync/awaitとほとんど同じですね。


## Node.jsアプリテストする
Jestはデフォルトではブラウザでの動作をテストするものなので、Node.jsをテストするのに使うには少し変更を加えなくてはいけません。

- testEnviromentの設定

package.jsonに以下のコードを書き足します。

```js:title=package.json
{
"jest": {
"testEnvironment": "node" }
}
```

-  テスト環境の構築


開発環境でデータベースと繋がっている場合は、テストする度にデータが追加されていくのを防ぐためにテスト用のDBを用意する必要があります。
[cmd-env](https://www.npmjs.com/package/env-cmd)を用いる場合はルートディレクトリに`config/test.env`を追加して、テスト実行用のスクリプトを

`env-cmd ./config/test.env jest --watch`

に変更しましょう。

## Expressをテストする

Expressアプリをテストするには[supertest](https://www.npmjs.com/package/supertest)を使用します。SupertestはExpressの開発チームによって作られたExpress用のテストライブラリです。
Jestはユニットテストのフレームワークで、supertestはexpressのwebアプリのhttpリクエストレベルでテスト（＝サーバーのテスト）をすることができます。

- まずはsupertestをインストールします。
```bash:title=terminal
$ npm i supertest --save-dev
```

supertestはサーバーが起動していなくてもテストを実行することができます。その場合は`app.listen`が実行されないようにコードを書き換える必要があります。

```js:title=app.test.js
const request = require("supertest");
const app = require("express");
test("Should render home page", async () => {
  const response = await request(app)
    .get("/")
    .expect(200);
}
```

Supertestはステータス・コードでテストの合否を判定します。ルーターで設定したステータス・コードと一致するようにテスト用のコードを書きます。

## Jest Lifecycle method

テストは毎回同じ状態のDBを使って実行したい。
そんな時はJestのLifecycle methodの`beforeEach`メソッドを用いて以下のようにすることができます。 
`beforeEeach`メソッドはテストが実行される直前に毎回実行されれます。

```js:title=app.test.js
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should....",()=>{
//テスト内容
})
```
ここでは、`beforeEach`メソッドを用いてDBを一度空にして、ユーザーインスタンスを一つ追加された状態で毎回テストを実行するようにしています。

## まとめ

Jestはシンプルにテストを書くことが出来て気に入っています。Reactアプリのテストにも使ったことがあるのですが、Nodeをテストする時と結構書き方が違いました。

そこらへんもまた記事にできたらなと思います。

## 参考
- [JavaScriptでも単体テストを導入しよう！ってかテストって何？](https://sbfl.net/blog/2019/01/20/javascript-unittest/)
- [How to test Express.js with Jest and Supertest](https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/)
- [Configuring jest](https://jestjs.io/docs/en/configuration)
