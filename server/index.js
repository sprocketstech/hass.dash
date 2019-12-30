"use strict";

const util = require('util');
const argv = require('yargs').argv;
const config = require('./config.js')(argv)
const log = require('./infr/log.js')(config)
const webserver = require('./webserver.js')(log, config)
const apis = require('./apis/index.js')(config, webserver);

log.debug("Started, serving dashboards....")

console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));