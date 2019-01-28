const tmx = require('tmx-parser');
const fs = require('fs');

const filename = process.argv[2];
const mapname  = filename.substring(0, filename.length-4);

tmx.parseFile(filename, (err, map)=> {
    if (err) throw err;

    // Code from https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    const jase = JSON.stringify(map, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });

    // My code again
    fs.writeFile(mapname+'.json', jase, (err) => {
        if (err) throw err;
        console.log("Done.");
    });
})