# WebXR Depth Testbed Babylon.js

[![Deploy static content to Pages](https://github.com/drumath2237/webxr-depth-testbed-babylon/actions/workflows/deploy.yml/badge.svg)](https://github.com/drumath2237/webxr-depth-testbed-babylon/actions/workflows/deploy.yml)

[English](./README.md)

## About

WebXR Depth Sensing Module による depth 推定の結果を Babylon.js で扱うデモンストレーション。
取得した Depth 値から Depth 画像を生成してリアルタイムで表示します。
Depth 画像は WebXR DOM Overlay によって canvas 要素を使っています。

<https://user-images.githubusercontent.com/11372210/195320156-16d4f9e8-3f2c-4135-85bb-410960b17e7f.mp4>

## Environment

|     item      |          Env           |
| :-----------: | :--------------------: |
|      OS       |    Windows 10 Home     |
|    Node.js    |          16.x          |
|  Babylon.js   |         5.27.0         |
|     Vite      |         3.1.0          |
| Debug Machine | Pixel 4a 5G(Android12) |
|    Chrome     | Chrome for Android 106 |

## Install & Usage

最初に HTTPS を有効にするため、OpenSSL コマンドで SSL/TLS 証明書を発行します。
`CommonName?`と聞かれたら、`https://<IPアドレス>:3000`と入力します。

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

その後次のコマンドにより、インストールと開発用サーバーを起動します。

```bash
# install
yarn install

# launch dev server
yarn dev
```

## Contact

何かございましたら、[にー兄さんの Twitter](https://twitter.com/ninisan_drumath)へご連絡ください。
