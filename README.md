# WebXR Depth Testbed Babylon.js

[![Deploy static content to Pages](https://github.com/drumath2237/webxr-depth-testbed-babylon/actions/workflows/deploy.yml/badge.svg)](https://github.com/drumath2237/webxr-depth-testbed-babylon/actions/workflows/deploy.yml)

[日本語](./README.ja.md)

## About

A demo project showing how to use WebXR Depth Sensing Module in Babylon.js.
In this project, depth image from depth-sensing estimation result are drawn realtime.
The depth image is drawn in HTML canvas element using WebXR DOM Overlay feature.

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

First of all, you have to create SSL/TLS certificate and you can use openssl command. When you are asked CommonName in the shell, answer https://<IP Adress>:3000

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

Then, you can install and start dev server with commands below.

```bash
# install
yarn install

# launch dev server
yarn dev
```

## Contact

You cas ask me anything on [my twitter](https://twitter.com/ninisan_drumath).
