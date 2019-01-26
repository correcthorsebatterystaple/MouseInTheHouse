const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext("2d");

const tilemap = document.getElementById("tilemap");

let width  = canvas.width;
let height = canvas.height;

let mouse = {
    x: 14*32,
    y: 40*32
};
let currentLevel;

const collisionlayer = 0;
function isSolid(x, y, space="screen") {
    if (space=="screen") {
        if (currentLevel.layers[collisionlayer].tiles[Math.floor(x/32) + Math.floor(y/32)*currentLevel.width]) {
            return true;
        } else {
            return false;
        }
    } else if (space=="tile") {
        if (currentLevel.layers[collisionlayer].tiles[x + y*currentLevel.width]) {
            return true;
        } else {
            return false;
        }
    }
}

function loadLevel(path) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            currentLevel = JSON.parse(this.responseText);
            camera.draw();
        }
    };
    xmlhttp.open("GET", "https://raw.githubusercontent.com/correcthorsebatterystaple/MouseInTheHouse/master/"+path, true);
    xmlhttp.send();
}

function drawTile(xt, yt, xoff, yoff, layer) {
    let tile = currentLevel.layers[layer].tiles[xt + yt*currentLevel.width];
    console.log(`${layer} ${xt + yt*currentLevel.width}`);
    if (!tile) return;
    let x = xt*32 - xoff;
    let y = yt*32 - yoff;
    let id = tile.id;
    console.log(tile.id);
    let sx = (id % 8) * 32;
    let sy = Math.floor(id/8)*32;
    ctx.drawImage(tilemap, sx, sy, 32, 32, x, y, 32, 32);
}

for (let id=0; id<9; id++) {
    let x = 0;
    let y = 0;
    let sx = (id % 8) * 32;
    let sy = Math.floor(id/8);
    ctx.drawImage(tilemap, sx, sy, 32, 32, x, y, 32, 32);
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
                for (let layer = 0; layer < currentLevel.layers.length; layer++) {
                    drawTile(xt, yt, xoff, yoff, layer);
                }
            }
        }
    }
}

loadLevel("./testlevel.json");
const camera = new Camera();


/*
{"id":16,"terrain":[],"probability":null,"properties":{},"animations":[],"objectGroups":[],"image":null,"gid":17}
*/