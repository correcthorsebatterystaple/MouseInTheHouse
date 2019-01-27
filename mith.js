const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext("2d");

const tilemap = document.getElementById("tilemap");
const bgimage = document.getElementById("bg");

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
            currentLevel.holes = [];
            let x = 0, y = 0;
            currentLevel.layers[collisionlayer].tiles.forEach(tile => {
                if (tile) {
                    if (tile.id == 128) {
                        mouse.x = x;
                        mouse.y = y;
                    }
                    if (tile.id >= 64 && tile.id < 128) {
                        if (tile.id % 2 == 0) {
                            currentLevel.holes[(tile.id-64)/2] = new Hole(
                                {x: x, y: y}, {x: 0, y: 0}, mouse
                            );
                        } else {
                            currentLevel.holes[Math.ceil((tile.id-64)/2)].hole2 = {
                                x: x, y: y
                            };
                        }
                    }
                }
                x++;
                if (x==currentLevel.width) {
                    y++;
                    x=0;
                }
            })
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
        this.xoff = 0;
        this.yoff = 0;
    }

    draw() {
        ctx.drawImage(bgimage, 0, 0);
        this.xoff = mouse.position.x - width/2;
        this.yoff = mouse.position.y - height/2;
        this.x1t = Math.floor(this.xoff/32);
        this.y1t = Math.floor(this.yoff/32);
        this.tnx = Math.ceil(width/32)+1;
        this.tny = Math.ceil(height/32)+1;
        for (let yt=this.y1t; yt<=this.y1t+this.tny; yt++) {
            for (let xt=this.x1t; xt<=this.x1t+this.tnx; xt++) {
                for (let layer = 1; layer < currentLevel.layers.length; layer++) {
                    drawTile(xt, yt, this.xoff, this.yoff, layer);
                }
            }
        }
    }

    tileToScreenSpace({x, y}) {
        if(!this.xoff) this.draw();
        x *= 32;
        x -= this.xoff;
        y *= 32;
        y -= this.yoff;
        return {x:x,y:y};
    }

    pixelToScreenSpace({x, y}) {
        if(!this.xoff) this.draw();
        return {x:x-xoff,y:y-yoff};
    }
}

function update() {
    camera.draw();
    mouse.controls = controls;
    mouse.draw();
    mouse.update();
    currentLevel.holes.forEach(hole => {
        hole.update();
    })
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