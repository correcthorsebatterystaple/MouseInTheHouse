class Hole {
    constructor(hole1 = {x:0,y:0}, hole2 = {x:0,y:0}, mouse) {
        this.hole[1] = hole1;
        this.hole[2] = hole2;
        this.mouse = mouse;
    }

    checkTouching(hole) {
        let otherhole = !(hole-1)+1;
        if (mouse.justTeleported &&
            mouse.x < this.hole[hole].x+mouse.width &&
            mouse.x > this.hole[hole].x-mouse.width &&
            mouse.y < this.hole[hole].y+mouse.height &&
            mouse.y > this.hole[hole].y-mouse.height) 
        {
            mouse.teleport(this.hole[otherhole]);
            mouse.justTeleported = true;
        } else {
            mouse.justTeleported = false;
        }
    }

    update() {
        this.checkTouching(1);
        this.checkTouching(2);
    }
}