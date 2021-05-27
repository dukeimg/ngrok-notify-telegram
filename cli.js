#!/usr/bin/env node
/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const meow = require('meow');
const yaml = require('js-yaml');
const ngrok = require('ngrok');
const init = require('./lib/init');
const interpolate = require('./lib/interpolate');
const sendMessage = require('./lib/sendMessage');

const updateNotifier = require('update-notifier');
require('dotenv').config();
const pkg = require('./package.json');

const cli = meow(
  `
	Usage: ngrok-notify-telegram PROTO PORT [-n]
        ngrok-notify-telegram init [-f]

  Positional arguments:
    PROTO           Protocol to use in the ngrok tunnel {http,tcp,tls}
    PORT            Port number of the localhost service to expose (e.g. 8080)
    init            Copy starter config files into directory for customizing

  Optional arguments:
    -h, --help      Show help
    -v, --version   Display version information
    -f, --force     Overwrite config files in directory if they exist.

  Examples
    Create ngrok tunnel to expose localhost web server running on port 8080.
    $ ngrok-notify-telegram http 8080
`,
  {
    flags: {
      force: {
        type: 'boolean',
        alias: 'f'
      },
      version: {
        type: 'boolean',
        alias: 'v'
      },
      help: {
        type: 'boolean',
        alias: 'h'
      }
    }
  }
);

const [command] = cli.input;
if (command === 'init') {
  init(cli.flags.f);
  process.exit(0);
}

const missingFiles = init.checkIfNeeded();
if (missingFiles) {
  console.log(missingFiles);
  console.log("Please run 'ngrok-notify-telegram init' to copy starter config files to your directory for customizing.")
  process.exit(1);
}

const cwd = process.cwd();
const config = yaml.safeLoad(
  fs.readFileSync(path.join(cwd, 'config.yml'), 'utf8')
);

const opts = config.ngrok || {};

if (cli.input.length < 2) {
  cli.showHelp();
} else {
  const [proto, strPort] = cli.input;

  opts.proto = proto;

  const isIntegerInRange = (i, min, max) =>
    Number.isInteger(i) && i >= min && i <= max;
  const PORT_MIN = 0;
  const PORT_MAX = 65535;

  const port = parseInt(strPort, 10);
  if (!isIntegerInRange(port, PORT_MIN, PORT_MAX)) {
    console.log(
      `Expected an integer for 'port' between ${PORT_MIN} and ${PORT_MAX} and received: ${strPort}`
    );
    process.exit(1);
  }
  // The ngrok npm package parlance uses "addr" instead of "port".
  opts.addr = port;
}

// Graft in secrets from .env file to pass to ngrok, if present.
const auth = process.env.NGROK_AUTH;
if (auth) opts.auth = auth;

const authtoken = process.env.NGROK_AUTHTOKEN;
if (authtoken) opts.authtoken = authtoken;

(async () => {
  console.log("Opening connection with ngrok...");
  const url = await ngrok.connect(opts);

  console.log(`Connected to ngrok: ${url} `);

  // Add url so it can be interpolated from the message text containing "{url}"
  opts.url = url;
  opts.port = opts.addr;

  const telegram = config.telegram;
  const chatIds = telegram.chat_ids;
  const message = interpolate(telegram.message, opts);

  if (!chatIds || chatIds.length === 0) {
    console.log("No chat ids found in config.");
  } else {
    console.log("Calling Webhook...");
    for (const chatId of chatIds) {
      try {
        await sendMessage(chatId, message);
      } catch (e) {
        console.error(`Something went wrong: ${e.message}`)
      }
    }
    console.log("Success");
  }

  updateNotifier({pkg}).notify();
})();
