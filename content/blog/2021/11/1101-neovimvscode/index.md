---
title: "Neovimを導入してVSCode上で同じショートカットを使えるようにした"
date: "2021-11-01"
tags: ["vim"]
emoji: ""
---

## はじいに
コマンドライン上での生産性を上げるために前から興味のあったVim(NeoVim)を導入しました。結構プラグインもいれてシェルではかなり快適に操作できるようになったのですが、VSCode上でも同じようにしたいと思い、VSCode上でもVimと同じショートカット、さらにはwhich-keyなどのプラグインも使えるようにしたのでメモを残したいと思います。

### プラグイン
[Vimplug](https://github.com/junegunn/vim-plug)を使いNeovimにプラグインをいくつかインストールしました。

- [FuzzyFinder](https://github.com/junegunn/fzf)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [Vim-gitgutter](https://www.google.com/search?q=vim+git+gutter&oq=vim+git+gutter&aqs=chrome..69i57.419730j0j4&sourceid=chrome&ie=UTF-8)
- [vim comentary](https://github.com/tpope/vim-commentary)
- [vim-polyglot](https://github.com/sheerun/vim-polyglot)
- [coc-nvm](https://github.com/neoclide/coc.nvim)	

などなど、ちょっと多すぎるので割愛します。

## VSCodeとの連携
VS extentionの neoVimをインストールして、neovimとそのconfigのpathを指定してあげます。それらかVSCode上の`keybindins.json`と`setting.json`にvimのコマンドを追加しました。

Neovim側のconfigとしましては、VS codeが立ち上がっているときは別の`.vim`ファイルから設定が読み込まれるようにしました。一部動作しないコマンドもありますが、許容範囲内なのでOKとします。

## まとめ
今までVimを導入しなかた理由はVSCodeに慣れすぎていたのが理由でしたが、コマンドライン上とVSCode上で同じコマンドを使えるなら導入しない理由はないと思い今回の導入に至りました。

まだまだVimのショートカット自体は学習中ですが、マウスを使う機会がすごく減ったのは楽しいです。

## 参考
- [Udemy :シリコンバレー現役エンジニアが教える NeoVim(VIM) + Tmux + Zsh 入門](https://www.udemy.com/course/vim-tmux-zsh/)

このコースは手短にVimやTmuxのセットアップを教えてくれるのでおすすめです。

- [VSCode with embedded Neovim](https://www.youtube.com/watch?v=g4dXZ0RQWdw&t=25s)
