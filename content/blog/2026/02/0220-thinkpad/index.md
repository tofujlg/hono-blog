---
title: "Thinkpat T14 Gen6 AMD x Arch Linux"
date: "2026-02-20"
tags: ["Linux"]
emoji: ""
---

## Main
Thinkpad T14 Gen6 AMDにArch linuxを入れた。
メモリを32GBにしたのはナイス判断だった。いくつかプログラムを立ち上げた時に「メモリ大丈夫かな」と考えなくて良いだけで価値がある。それにしてもメモリの値段は高すぎるけれども。

![pic](/images/arch_thinkpad.jpg)

## セットアップ
- LUFSで暗号化
- Systemd
- Arch installは使わず
- Hyprlandk
- Waybar
- Nix

LUFSでディスクを暗号化してArchをインストールしたものの、Systemdから復号することができずに焦った。購入当日に置物になるところだった。

Archは、こういう問題にかなり頻繁に直面するのだが、その問題をひとつひとつ解消していくプロセスそのものがLinuxとハードウェアの学習になるから気に入っている。正直高度にカスタマイズしたいとかは思わない。Linuxを理解したいという気持ちが強い。

それと今回はArch installerは使わなかった。前回はインストーラーを使用してインストールしたがそれは簡単な方法だったみたいのでゼロからやってみた。２ヶ月Archを使ったあとだったので、復号を除いてはわりとすんなりできた。

前のArch LaptopもNixでパッケージ管理していたので、Archをインストールしてから使用しているパッケージのインストールまでは一瞬だった。これはNixを使う明らかなメリットだと思う。
今回ArchかNixOSで迷ったけれども、暫くは「レガシーLinux」を使用して、伝統的なLinuxの構造を理解したいと思った。実務的な動機。

Arch Wikiには[P14s Gen6のページ](https://wiki.archlinux.org/title/Lenovo_ThinkPad_P14s_(AMD)_Gen_6)しかなく、動くか少し不安だったけれども、無事動いてくれて良かった。

そういえば、MacOSを使うのをやめて２ヶ月ほど立ったが、困ったことと言えば、Codex DesktopとかMacOSのみのソフトがたまにあることぐらいか。それよりもLinuxの楽しさのほうが勝る。


