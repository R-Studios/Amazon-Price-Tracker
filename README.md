# Amazon Price Tracker

> Amazon Price Tracker tracks product prices on Amazon and notifies the user when to buy a product.

- [What is Amazon Price Tracker?](#what-is-amazon-price-tracker?)
- [Prerequisites](#prerequisites)
- Using a Raspberry Pi
  - [Installation guide (Raspberry Pi)](#installation-guide-raspberry-pi)
- Using without a Raspberry Pi
  - [Installation guide](#installation-guide)
- [How do I contribute?](#how-do-i-contribute?)

## What is Amazon Price Tracker?

Amazon Price Tracker consists of a Node.js Express web server backend, which tracks prices for products on Amazon. Products can be managed in a Vue.js single-page application frontend. Email notifications are sent with node-mailer, when a product is available at the desired price.

The project is built for use on a Raspberry Pi 3 Model B V1.2. It will probably also run on other Raspberry Pi models, but is not tested. It also runs on other operating systems (Windows 10 tested), but the setup for autostart is different and will not be described here. 
When the Raspberry Pi is powered up it automatically boots up Amazon Price Tracker and the tool can be accessed by other devices in the same network.

## Prerequisites

What will you need?
- Raspberry Pi
  - Connected to the internet
  - Connected via SSH
  - Node.js installed
  - Chromium installed
- Gmail email address
  - [Configured app password](https://support.google.com/mail/answer/185833?hl=en)

## Using a Raspberry Pi

### Installation Guide (Raspberry Pi)

### Setup

```sh
# node should be installed first

npm install -g chromium

git clone https://github.com/R-Studios/amazon-price-tracker

cd amazon-price-tracker
cd backend
npm install

cd ..
cd frontend
npm install
```

### Configuration

```sh
cd amazon-price-tracker
sudo nano project-settings.json
```

**Fill out the configuration:**

`ip`
The local ip address of the Raspberry Pi in your network.
You can read the information when you are connected via SSH at the top or with:
```sh
ifconfig
```

`port`
The port where the backend will be hosted. For example: 3000

`userAgent`
The user agent which will be used by puppeteer to fetch page information. 
Use a browser and search for "my user agent".

`gmail`
The gmail email address which will be used to send notification emails.

`appPassword`
The gmail app password.

`currency`
The currency which is used by Amazon in your country. For example: $ or €

### Auto start

```sh
cd /etc/xdg/autostart/
sudo nano amazon-price-tracker-frontend.desktop

# Paste following code
[Desktop Entry]
Name=amazon-price-tracker-backend
Exec=sh /usr/bin/amazon-price-tracker-backend.sh

# Paste following code
[Desktop Entry]
Name=amazon-price-tracker-frontend
Exec=sh /usr/bin/amazon-price-tracker-frontend.sh

sudo nano amazon-price-tracker-backend.desktop
```

```sh
cd /usr/bin/

sudo nano amazon-price-tracker-backend.sh

# Paste following code
#!/bin/sh
(sleep 10s && cd /home/amazon-price-tracker/backend && npm run start) &
exit 0

sudo nano amazon-price-tracker-frontend.sh

# Paste following code
#!/bin/sh
(sleep 10s && cd /home/amazon-price-tracker/frontend && npm run start) &
exit 0
```

### Run

Frontend:
http://local-ip-address:8080

Backend:
http://local-ip-address:3000

## Using without a Raspberry Pi

### Installation Guide (Raspberry Pi)

### Setup

```sh
# node should be installed first

git clone https://github.com/R-Studios/amazon-price-tracker

cd amazon-price-tracker
cd backend
npm install

cd ..
cd frontend
npm install
```

### Configuration

Navigate to amazon-price-tracker and edit the project-settings.json

**Fill out the configuration:**

`ip`
The local ip address of the device in your network.
```sh
ipconfig
```

`port`
The port where the backend will be hosted. For example: 3000

`userAgent`
The user agent which will be used by puppeteer to fetch page information. 
Use a browser and search for "my user agent".

`gmail`
The gmail email address which will be used to send notification emails.

`appPassword`
The gmail app password.

`currency`
The currency which is used by Amazon in your country. For example: $ or €

### Start

```sh
cd amazon-price-tracker
cd backend
npm run start
```

```sh
cd amazon-price-tracker
cd frontend
npm run start
```

### Run

Frontend:
http://localhost:8080

Backend:
http://localhost:3000

## How do I contribute?

If you would like to contribute, please create a feature branch and submit a pull request.
Thank you for your contribution.