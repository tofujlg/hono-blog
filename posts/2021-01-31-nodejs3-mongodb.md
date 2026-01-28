---
title: "Node.js学習記3 MongoDB"
date: "2021-01-31"
tags: ["Nodejs"]
emoji: ""
---

## はじめに

Node.jsの学習をさらに進めたので記録を残しておきたい。今回は新たにMongoDBの学習を始めた。データベースを扱った経験は以前Reactでタスク管理アプリを作った時にfirebaseとつなげた時ぐらいだ。今回もNode.jsで同じ物を作っているのだが、ユーザー体験からしてReactで作った方が快適じゃない？と思った。自分で同じ物をつくるならそうすると思う。

## MongoDB
データベースは大別してSQLとNoSQL(Not Only SQL)があり、MongoDBはNoSQL系の中では一番人気のデータベースだ。
両者には以下の違いがある。

SQL:
- Tableにデータが保存される。
- Row とColumn

NoSQL:
- Collectionにデータが保存される
- DocumentとField

## Robo 3T
MongoDBで作成したデータベースを閲覧・編集するのに[Robo3T](https://robomongo.org/)というデスクトップアプリをインストールした。フロントエンドの開発で使うGUIとかVSCodeぐらいなのでこれが必要なのかと驚いた。

今のところ、格納されているデータを確認したり不要なデータを消したりするぐらいの使いかたしかしていない。

## MongoDBとアプリを繋げる
`mongodb`というMongoDB公式のドライバー/npmパッケージを利用してサーバーとデータベースを接続し、データの操作を行う。しかしこれらの操作は後述するMongooseというライブラリに置き換えられるのでほとんど使わないのだが、記録として残しておきたい。

```js:title=app.js
const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const connectionUrl = "URL;
const databaseName = "Data-name";

// サーバーに接続する
MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database!");
    }
// データーベースに接続する
    const db = client.db(databaseName);
	//データを追加する
    db.collection("users").insertOne({
      name: "Test",
      value: 125,
    });
  }
);
```

### データ操作

データを追加するとMongoDBが自動でObjectIDというプロパティを追加する。これを利用してドキュメントを取り出すことができるのだが、このIDはストリングでは無いのでそのまま入力してもうまく機能しない。

```js:title=app.js
  db.collection("users").findOne(
   { _id: new ObjectID("6012afe570c0d822118e1518") },
	//　ここでただidを入力しても機能しない
    //{ _id: "6012afe570c0d822118e1518" },
```
- データを更新する時

データを更新する時も、operatorというものを途中に挿入しないといけない。MongoDBをそのまま利用するとこのような面倒臭い処理があるのでMongooseを利用するらしい。だいたいの場合はsetというオペレーターで済むらしいが。

```js:title=app.js
db.collection("tasks")
      .updateMany(
        {
          completed: false,
        },
        {
          $set: {
            completed: true,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
```

## Mongoose
[Mongoose](https://mongoosejs.com/)はMongoDBを操作するためのnpmパッケージだ。MongoDBに様々な入力設定をすることができる。今回はuserとtaskという二つのモデルを作成した。

- MongoDBのポート&コレクションに接続。第2引数でオプションを設定する。

```js:title=app.js
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager', { useNewUrlParser: true,
useCreateIndex: true
})
```
- モデルの作成

```js:title=app.js
const User = mongoose.model('User', { 
	name: {
        type: String
    	},
 	age: {
        type: Number
} })
```
このようにプロパティの型を定義することでそれ以外のデータを受け取った時にエラーを投げてくれる。

- インスタンスの作成
```js:title=app.js
const me = new User({ name: 'Totoro',
age: 8 })
```
モデルをもとにしてインスタンスを作成することができる。

- インスタンスを保存する
```js:title=app.js
me.save().then(() => { console.log(me)
}).catch((error) => { console.log('Error!', error)
})
```

## REST API
Representational State Transferの略。データベースを操作するAPIらしい。
同じAPIでもGooglemap APIなどといった具体的なアプリケーションではなく設計思想だ。

データ操作の種類総称として`CRUD`と言うものがあり、それぞれの以下の操作の頭文字をとっている。
- Create
- Read
- Update
- Delete

そしてそれらの操作とURLを紐づける時、例えば

```
http://test.com/user1/create
http://test.com/user1/read/
http://test.com/user1/Update/
http://test.com/user1/Delete/
```
とすることができる。しかしこれはRESTの思想と相反するらしい。
REST主張としては、URLはあくまで「どのようなリソースを扱っているのか」に限るべきなのだ。
だからこれらは全て
```
http://test.com/user1
```
と表示して、それぞれの操作はhttpのリクエストメソッドで峻別すれば良い。これだけがRESTの定義ではなく[他にもいろいろある](https://e-words.jp/w/REST.html)が今回はこれぐらいで…。

## Mongooseを使ったCRUD操作

httpのメソッドはそれぞれ
```
Create => post
Read => Get
Update => Patch
Delete => Delete
```
となる。

また、httpリクエストの管理するツールには[Postman](https://www.postman.com/)を利用した。便利

- POSTメソッドデ新しいユーザーを作成する。

```js:title=app.js
//Jsonでデータを受け取るため
app.use(express.json())
//新しいユーザーインスタンスの追加
app.post('/users', (req, res) => {
const user = new User(req.body)
user.save().then(() => { res.send(user)
}).catch((e) => { res.status(400).send(e)
}) })
```
- async/awaitでより読みやすく書くことができる。
```js:title=app.js
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
```

## まとめ

Web開発なのにほとんどブラウザを使うことがなかった。チュートリアルを進めていて、特に難しいと思ったことは無いのだが、それは敷かれたレールの上を進んでいるだけであって、自分で設計するとなるとかなり難しくなりそう。最近はプログラミングの難しさはコーディングより設計なのでは、と思っている。


## 参考
[Qitta:0からREST APIについて調べてみた](https://qiita.com/masato44gm/items/dffb8281536ad321fb08)
[REST (API)が理解できないのでまとめてみる](https://www.subthread.co.jp/blog/20160506/)
