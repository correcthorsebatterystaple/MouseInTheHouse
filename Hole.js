class Hole {
    constructor(hole1 = {x:0,y:0}, hole2 = {x:0,y:0}, mouse) {
        this.hole = [];
        this.hole[1] = hole1;
        this.hole[2] = hole2;
        this.mouse = mouse;
    }

    checkTouching(hole) {
        let otherhole = !(hole-1)+1;
        if (!mouse.justTeleported) {
            if (
                mouse.position.x < this.hole[hole].x+mouse.width/2 &&
                mouse.position.x > this.hole[hole].x-mouse.width/2 &&
                mouse.position.y < this.hole[hole].y+mouse.height/2 &&
                mouse.position.y > this.hole[hole].y-mouse.height/2
            ) {
                mouse.position.x = this.hole[otherhole].x;
                mouse.position.y = this.hole[otherhole].y;
                mouse.justTeleported = true;
                setTimeout(()=>{mouse.justTeleported=false}, 2000);
            }
        }
    }

    update() {
        this.checkTouching(1);
        this.checkTouching(2);
    }
}