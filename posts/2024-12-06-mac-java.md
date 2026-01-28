---
title: "[Mac] Javaのバージョンを簡単に切り替える"
date: "2024-12-06"
tags: ["Mac", "Java"]
emoji: ""
---

{/* ## TODO:
- Write medium
- Write Zenn */}


## やりたいこと


プロジェクトによって、Javaのバージョンを切り替えたいということがあると思います。
Node.jsのバージョンを切り替えるのは、`nvm`を使えば簡単にできますが、Javaのバージョンを切り替える方法がわからなかったので、調べてみました。

## 前提
前提として、MacOSで、Homebrewを使ってJavaをインストールしていることとします。
現在使用しているJavaのバージョンは、`java -version`で確認できます。
```shell title="terminal"
$ java -version
openjdk version "17.0.12" 2024-07-18
OpenJDK Runtime Environment (build 17.0.12+8-LTS-20240718.1)
OpenJDK 64-Bit Server VM (build 17.0.12+8-LTS-20240718.1, mixed mode, sharing)
```

また、コンピューターにインストールされているJavaのバージョンは、`/usr/libexec/java_home -V`で確認できます。

```shell title="terminal"
$ /usr/libexec/java_home -V
Matching Java Virtual Machines (3):
    17.0.12 (arm64) "Azul Systems, Inc." - "Zulu 17.52.17" /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    11.0.23 (arm64) "Azul Systems, Inc." - "Zulu 11.72.19" /Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
    1.8.0_432 (arm64) "Azul Systems, Inc." - "Zulu 8.82.0.21" /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
```

デフォルトで使用したいバージョンは、パスを、`.zshrc`や`.bashrc`に追加することで設定できます。

```bash title=".zshrc"
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```
この場合、java17がデフォルトで使用されています。

## バージョンを変更する
僕の場合、基本的にjava17を使用するプロジェクトが多いので、デフォルトはjava17にしてます。しかし、たまにjava11を使用するプロジェクトがあるので、その時は以下のコマンドを実行します。

```bash title="terminal"
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
```
もう一度バージョンを確認してみると、
```shell title="terminal"
$ java -version
openjdk version "11.0.23" 2024-07-18
OpenJDK Runtime Environment (build 11.0.23+8-LTS-20240718.1)
OpenJDK 64-Bit Server VM (build 11.0.23+8-LTS-20240718.1, mixed mode, sharing)
```
となり、java11が使用されていることがわかります。

これで、プロジェクトごとに異なるバージョンを使用することができます。少し不便なのは、ターミナルを再起動すると、デフォルトのバージョンに戻ってしまうことです。
ターミナルを再起動するたびに、上述のコマンドを実行する必要があります。

そこで役に立つのが、zshの[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)というプラグインです。
zsh用のオートコンプリーションプラグインで、`ex`とタイプし始めると、

```bash title="terminal"
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

という提案が出てきます。

![zsh-autosuggestions](/images/2024-zsh-auto-complete.gif)

これでバージョンを変えるのも、1秒ぐらいですむので、この方法でストレスを感じることはあまりないと思います。
