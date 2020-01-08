/* jshint ignore:start*/
"use strict";

var https = require('https');
var fs = require('fs');
var totalDLs = 1;

var index = [];

var download = function(url, fname) {
    var file = fs.createWriteStream(fname);
    var request = https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(() => {
                --totalDLs;
            });

        });
    });
}

var request = https.get('https://bootswatch.com/api/4.json', function(response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        var obj = JSON.parse(str);
        for (var i in obj.themes) {
            var theme = obj.themes[i];
            var newFname = theme.name.toLowerCase() + ".min.css";
            console.log("Downloading theme " + theme.name + " from " + theme.cssMin + " to " + newFname);
            download(theme.cssMin, newFname);
            index.push({
                name: theme.name,
                stylesheet: newFname,
            });
            ++totalDLs;
        }
        --totalDLs;
    });
});


var closeOut = function() {
    var jsonContent = JSON.stringify(index);
    fs.writeFile("themes.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });
};

(function wait () {
    if (totalDLs > 0) {
        setTimeout(wait, 1000);
    } else {
        closeOut();
    }
 })();

/* jshint ignore:end*/
