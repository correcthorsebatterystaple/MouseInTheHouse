const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext("2d");

const tilemap = document.getElementById("tilemap");
const bgimage = document.getElementById("bg");
const mouseimage = document.getElementById('mouse');
const mouseimageleft = document.getElementById('mouseleft');
const numbersimage = document.getElementById('numbers');
const catimage = document.getElementById('cat');

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
let mouse = new Mouse({x: 28*32, y:40*32}, {x:0,y:0});
let cat = new Cat({x:0,y:0});
let president = new President({x:0,y:0});
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
        let tile = currentLevel.layers[collisionlayer].tiles[Math.floor(x/32)%currentLevel.width + Math.floor(y/32)*currentLevel.width];
        if (tile && tile.id == 56) {
            return true;
        } else {
            return false;
        }
    } else if (space=="tile") {
        let tile = currentLevel.layers[collisionlayer].tiles[x%currentLevel.width + y*currentLevel.width];
        if (tile && tile.id == 56) {
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
                    if (tile.id == 128) { //start
                        mouse.x = x;
                        mouse.y = y;
                        mouse.position.x = x*32;
                        mouse.position.y = y*32-8;
                    }
                    if (tile.id == 129) { //president
                        president.position.x = x*32;
                        president.position.y = y*32;
                    }
                    if (tile.id == 130) { // cat
                        cat.position.x = x*32;
                        cat.position.y = y*32;
                    }
                    if (tile.id >= 64 && tile.id < 128) {
                        //let index = Math.floor((tile.id-64)/2);
                        if (tile.id % 2 == 0) {
                            let index = (tile.id-64)/2;
                            if (currentLevel.holes[index]) {
                                currentLevel.holes[index].hole[1] = {x:x*32,y:y*32};
                            } else {
                                currentLevel.holes[index] = new Hole(
                                    {x: x*32, y: y*32}, {x: 0, y: 0}, mouse
                                );
                            }
                        } else {
                            let index = (tile.id-65)/2;
                            if (currentLevel.holes[index]) {
                                currentLevel.holes[index].hole[2] = {x:x*32,y:y*32};
                            } else {
                                currentLevel.holes[index] = new Hole(
                                    {x: 0, y: 0}, {x: x*32, y: y*32}, mouse
                                );
                            }
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
        ctx.drawImage(bgimage, 0, 0, width, height);
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
        return {x:x-this.xoff,y:y-this.yoff};
    }
}

function update() {
    camera.draw();
    mouse.controls = controls;
    mouse.draw();
    mouse.update();
    cat.update();
    cat.draw();
    currentLevel.holes.forEach(hole => {
        hole.update();
    });
    requestAnimationFrame(update);
}

loadLevel("./Map-2-2.json", () => {
    update();
});
const camera = new Camera();



/*
{"id":16,"terrain":[],"probability":null,"properties":{},"animations":[],"objectGroups":[],"image":null,"gid":17}
*/