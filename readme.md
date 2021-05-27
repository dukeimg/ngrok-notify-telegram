# ngrok-notify-telegram

Inspired by: [thisdavej/ngrok-notify](https://github.com/thisdavej/ngrok-notify)

Create ngrok tunnel to expose localhost to the web and notify by Telegram bot

## Install

Linux/macOS

```
$ sudo npm install --unsafe-perm -g ngrok-notify-telegram
```

We need to install with the `--unsafe-perm` flag to enable the underlying `ngrok` package to run its postinstall script as root to download and save the ngrok binary in the global `node_modules` folder.

## Configure

Create a directory to store the configuration files and navigate to it:

```shell
$ mkdir ngrok && cd ngrok
```

Copy the starter configuration files into this directory:

```shell
$ ngrok-notify-telegram init
```

Create Bot following [this guide](https://core.telegram.org/bots#3-how-do-i-create-a-bot). At the end of the process 
BotFather will give you a token in format `numbers:chars`, copy it.

Update the following configuration files:

- `config.yml` - Add chat ids that you want your bot to post to (TODO: add instructions to retrieve chat ids)
- `.env` - Paste your bot token after `BOT_TOKEN=`

## Use it

Host a web server on port 8080 (or port of your choice) using [http-server](https://www.npmjs.com/package/http-server), [Express](https://www.npmjs.com/package/express), etc.

Create an ngrok http tunnel to expose port 8080 running on the localhost to the world.

```shell
$ ngrok-notify-telegram http 8080
```

An ngrok tunnel on the public Internet will be created and the ngrok URL will be printed to the console.  Additionally, `ngrok-notify-telegram` will send you a message to Telegram using your bot.

Use ngrok-notify-telegram in conjunction with a process manager such as [pm2](http://pm2.keymetrics.io/).  After rebooting your system, you will receive a message with the new ngrok URL without needing to log into the system and start the tunnel manually.

## Alternatives

This package leverages the excellent [ngrok](https://www.npmjs.com/package/ngrok) package and provides notification capabilities.  If you don't have a need for the notify feature, you may want to consider using the [ngrok](https://www.npmjs.com/package/ngrok) package directly instead.

The [ngrok-notify](https://github.com/thisdavej/ngrok-notify) package allows you to get email notifications and notifications to your custom webhook. ngrok-notify-telegram was based on ngrok-notify.

## License

MIT © [Dave Johnson (thisDaveJ)](http://thisdavej.com)

[]: https://github.com/thisdavej/ngrok-notifythisdavej/ngrok-notify
