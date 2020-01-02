const argv = require('yargs').argv;
const config = require('./config.js')(argv)
const log = require('./infr/log.js')(config)
const hass = require('./backend/hass.js');

hass.init(log, config.hass_url, config.hass_llat);


console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));

var entityFilter = process.argv[2]
var match = new RegExp(entityFilter);
showData = function() {
    var states = hass.states();
    for (var i=0; i < states.length; ++i) {
        if (match.test(states[i].entity_id)) {
            console.log(JSON.stringify(states[i], null, 2))
        }
    }
}

setTimeout(showData, 500);
setInterval(showData, 10000);
