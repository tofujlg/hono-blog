---
title: "ReactNative: Installed Build Tools revision 31.0.0 is corrupted"
date: "2023-03-07"
tags: ["React Native"]
emoji: ""
---

## 状況
React Nativeで`yarn android`した時に以下のエラーが発生。

```shell
Installed Build Tools revision 31.0.0 is corrupted. Remove and install again using the SDK Manager.
```

`cd ./android`して、`./gradlew clean`を実行したり、ビルドツールを再インストールしたがエラーは変わらず。

結局以下の方法で解決した。

`C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0`
`C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0\lib`

の二箇所のディレクトリの`d8.bat`を`dx.bat.`に変更。



## 参考
[Android Studio error "Installed Build Tools revision 31.0.0 is corrupted" - Stack Overflow](https://stackoverflow.com/questions/68387270/android-studio-error-installed-build-tools-revision-31-0-0-is-corrupted)
