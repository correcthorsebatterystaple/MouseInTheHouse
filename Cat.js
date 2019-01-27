class Cat {
    constructor(position = {x:0,y:0}) {
        this.position = position;
        this.dx = 1;
    }
    update() {
        this.position.x += dx;
        if (isSolid(this.position.x+dx*100, this.position.y)) {
            this.dx *= -1;
        }
    }
}