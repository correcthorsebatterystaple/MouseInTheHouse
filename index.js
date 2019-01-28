const express = require('express');
const tmx = require('tmx-parser');
const app = express();

app.listen(8000, () => {
    console.log("App started.");
});
app.use(express.static('public'));

app.get('/maps/:mapname', (req, res) => {
    console.log(req.params.mapname);
    const filename = './maps/'+req.params.mapname+'.tmx';
    tmx.parseFile(filename, (err, map)=> {
        if (err) {
            console.log(err);
            res.redirect('/');
            return;
        }
        console.log("converting map");
    
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
        console.log("map converted");
        res.send(JSON.stringify(jase));
    })
})