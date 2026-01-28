---
title: "Obsidian nvim"
date: "2026-01-21"
tags: ["Obsidian", "PDE"]
emoji: ""
---

## Main
勢い余って、ObsidianもNeovimで操作できないかなぁと思って試行錯誤している。

`kickstarter.nvim`をforkして、自分好みのミニマルなObsidian用のneovimのConfigをカスタマイズしている。`obsidian-nvim/obsidian.nvim`の力などを借りながら、Obsidian GUIでやっている70%ぐらいのことはできるよういなってきた。

結局の所、ObsidianもただのMarkdownを扱うGUIであるからNvimでできないはずはないのだが、いくつかまだ設定できていいないところがある。

例えば、別ページへのリンクの生成が遅い。数千あるファイルがIndex化されてないからだろうか。ripgrepを使えば一瞬だと思うのだが、fuzzy findも効かない。

Laptopを使っている時のMarkdown操作はnvimでできるようになると思うが、Androidでは現状Obsidian以上のMarkdownクライエントを知らないので、結局はObsidianを使い続けるだろう。

Obsidian Syncを使っているので、同期の方法も考え直さないいけない。現状同期のためだけにObsidian GUiを開いている。裏でメモリを1GB食っている。

同じデータを扱っているはずなのに、開くソフトウェアを変えるだけで、データの印象が大きく変わったりするは不思議である。
