const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext("2d");

const tilemap = document.getElementById("tilemap");

let width  = canvas.width;
let height = canvas.height;

let currentLevel;

let controls = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false
}
let mouse = new Mouse({x: 14*32, y:40*32}, {x:0,y:0});
document.addEventListener('keydown', event => {
    if (event.keyCode == 97-32) {
        controls.left = true;
    } else if (event.keyCode == 100-32) {
        controls.right = true;
    } else if (event.keyCode == 119-32) {
        controls.up = true;
    } else if (event.keyCode == 115-32) {
        controls.down = true;
    } else if (event.keyCode == 32) {
        controls.jump = true;
    }
});
document.addEventListener('keyup', event => {
    if (event.keyCode == 97-32) {
        controls.left = false;
    } else if (event.keyCode == 100-32) {
        controls.right = false;
    } else if (event.keyCode == 119-32) {
        controls.up = false;
    } else if (event.keyCode == 115-32) {
        controls.down = false;
    } else if (event.keyCode == 32) {
        controls.jump = false;
    }
});

const collisionlayer = 0;
function isSolid(x, y, space="screen") {
    if (space=="screen") {
        if (currentLevel.layers[collisionlayer].tiles[Math.floor(x/32)%currentLevel.width + Math.floor(y/32)*currentLevel.width]) {
            return true;
        } else {
            return false;
        }
    } else if (space=="tile") {
        if (currentLevel.layers[collisionlayer].tiles[x%currentLevel.width + y*currentLevel.width]) {
            return true;
        } else {
            return false;
        }
    }
}

function loadLevel(path, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            currentLevel = JSON.parse(this.responseText);
            callback();
        }
    };
    xmlhttp.open("GET", "https://raw.githubusercontent.com/correcthorsebatterystaple/MouseInTheHouse/master/"+path, true);
    xmlhttp.send();
}

function drawTile(xt, yt, xoff, yoff, layer) {
    let tile = currentLevel.layers[layer].tiles[xt%currentLevel.width + yt*currentLevel.width];
    if (!tile) return;
    let x = xt*32 - xoff;
    let y = yt*32 - yoff;
    let id = tile.id;
    let sx = (id % 8) * 32;
    let sy = Math.floor(id/8)*32;
    ctx.drawImage(tilemap, sx, sy, 32, 32, x, y, 32, 32);
}

class Camera {
    constructor() {
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let xoff = mouse.position.x - width/2;
        let yoff = mouse.position.y - height/2;
        let x1t = Math.floor(xoff/32);
        let y1t = Math.floor(yoff/32);
        let tnx = Math.ceil(width/32)+1;
        let tny = Math.ceil(height/32)+1;
        for (let yt=y1t; yt<=y1t+tny; yt++) {
            for (let xt=x1t; xt<=x1t+tnx; xt++) {
                for (let layer = 1; layer < currentLevel.layers.length; layer++) {
                    drawTile(xt, yt, xoff, yoff, layer);
                }
            }
        }
    }
}

function update() {
    camera.draw();
    mouse.controls = controls;
    mouse.draw();
    mouse.update();
    ctx.fillStyle = "rgb(200, 170, 80)";
    ctx.fillRect(width/2-16, height/2-32, 32, 32);
    requestAnimationFrame(update);
}

loadLevel("./testlevel.json", () => {
    update();
});
const camera = new Camera();



/*
{"id":16,"terrain":[],"probability":null,"properties":{},"animations":[],"objectGroups":[],"image":null,"gid":17}
*/