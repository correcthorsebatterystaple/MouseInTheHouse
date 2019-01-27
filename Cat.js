class Cat {
    constructor(position = {x:0,y:0}) {
        this.position = position;
        this.dx = 1;
    }
    update() {
        this.position.x += this.dx;
        if (isSolid(this.position.x+this.dx*100, this.position.y)) {
            this.dx *= -1;
        }
    }
    draw() {
        let scr = camera.pixelToScreenSpace(this.position);
        ctx.drawImage(catimage, scr.x, scr.y);
    }
}