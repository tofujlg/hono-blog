---
title: "Shader GSGLの設定"
date: "2023-10-28"
tags: ["Shader"]
emoji: ""
---

##  Main
Shader GSGLの勉強を始めたので、メモを残しておく。

[gsglViewer](https://github.com/patriciogonzalezvivo/glslViewer)というCLIをインストールする。

```shell
gsglViewer <fileName.frag>
```
で実行する。

png出力するには、`sequence`コマンドを使用する。

```shell 
sequence ,<startSec>,<endSec>
```

出力した連番画像を動画に変換する

```shell 
ffmpeg -i 00%03d.png -vcodec libx264 -pix_fmt yuv420p out_vimeo.mp4
```

##　まとめ
Shaderは楽しい。

## References
- [Vimeo](https://vimeo.com/298123159)
- [Qiita_ffmpegで連番画像から動画生成 / 動画から連番画像を生成 ~コマ落ちを防ぐには~](https://qiita.com/livlea/items/a94df4667c0eb37d859f)
