---
title: "Obsidianで筋トレの成長ログをつける"
date: "2022-11-03"
tags: ["Obsidian"]
emoji: "💪"
---

Obsidianで筋トレの成長ログをつけているのでその方法を紹介します。

![Obsidian screenshot](./SCR-20221103-tu4.png)
こんな感じで、自分の扱う重量について棒グラフを作成することができます。

僕は[Storong](https://www.strong.app/)というアプリでウォークアウトのログを取っています。

正直このアプリさえあれば、ジムでの記録は十分なのだが、Obsidianユーザーはデータは全てObsidianに残したいという強迫観念に囚われがちで、僕もその例外ではありません。

本記事ではObsidianでの簡単な筋トレログの付け方を紹介します。

## 必要なプラグイン

[Obsidian Tracker](https://github.com/pyrochlore/obsidian-tracker)をインストールします。

このプラグインは他にも色々できます。

参考：https://www.youtube.com/watch?v=W_leEJHBZW4&t=30s

## コード

適当なノートに日付と重量のカラムのあるテーブルを作成します。僕は筋トレの種目ごとにノートを作っています。
ここではバーベルスクワットのノートを例にします。

```markdown
| Date     | Weight |
| -------- | ------ |
| 20220702 | 55     |
| 20220807 | 65     |
| 20220816 | 75     |
| 20220930 | 80     |
| 20221021 | 90     |
```

今回は、このように「最高重量を更新した日付」を記録してみました。

```tracker
searchType: table
searchTarget: Barbell Squat[0][0], Barbell Squat[0][1]
xDataset: 0
line:
    title: "Barbell Squat"
    xAxisLabel: Date
    yAxisLabel: Weight
		yAxisUnit: kg
		fillGap: true
```

searchtargetでテーブルを指定します。"fillGap:true"にしておかないと、点と点がつながりません。

これだけで、簡単にグラフを作成することができました。

## まとめ

エンジニアだからといって、全て自動化すればよいという訳ではないと思います。数ヶ月に一度手動で「この2ヶ月でこれぐらい重量を伸ばすことができたんだな」と振り返ることは筋トレのモチベーションの維持と、自分の成長を確認する良い機会だと思います。
