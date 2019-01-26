const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext("2d");

const tilemap = document.getElementById("tilemap");

let width  = canvas.width;
let height = canvas.height;

let mouse = {
    x: 50,
    y: 50
};
let currentLevel;

function loadLevel(path) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            currentLevel = JSON.parse(this.responseText);
        }
    };
    xmlhttp.open("GET", "https://github.com/correcthorsebatterystaple/MouseInTheHouse/blob/master/"+path, true);
    xmlhttp.send();
}

function drawTile(xt, yt, xoff, yoff) {
    let tile = currentLevel.tiles[xt + yt*currentLevel.width];
    let x = xt*32 - xoff;
    let y = yt*32 - yoff;
    let id = tile.id;
    let sx = (tile.id % 8) * 32;
    let sy = Math.floor(tile.id/8);
    ctx.drawImage(tilemap, sx, sy, 32, 32, x, y);
}

class Camera {
    constructor() {
    }

    draw() {
        let xoff = mouse.x - width/2;
        let yoff = mouse.y - height/2;
        let x1t = Math.floor(xoff/32);
        let y1t = Math.floor(yoff/32);
        let tnx = Math.ceil(width/32)+1;
        let tny = Math.ceil(height/32)+1;
        for (let yt=y1t; yt<=y1t+tny; yt++) {
            for (let xt=x1t; xt<=x1t+tnx; xt++) {
                drawTile(xt, yt, xoff, yoff);
            }
        }
    }
}

loadLevel("./testlevel.json");
const camera = new Camera();


/*
{"id":16,"terrain":[],"probability":null,"properties":{},"animations":[],"objectGroups":[],"image":null,"gid":17}
*/