class Cat {
    constructor(position = {x:0,y:0}) {
        this.position = position;
        this.dx = 5;
    }
    update() {
        this.position.x += this.dx;
        if (isSolid(this.position.x+Math.sign(this.dx)*256, this.position.y-256)) {
            this.dx *= -1;
        }
        let distance = Math.sqrt(
            Math.pow(this.position.x - mouse.position.x, 2) +
            Math.pow(this.position.y - mouse.position.y, 2)
        );
        if (distance < 10) {
            window.location.href = "./yougoteaten.html";
        }
    }
    draw() {
        let scr = camera.pixelToScreenSpace(this.position);
        if (this.dx > 0) {
            ctx.drawImage(catimage, scr.x, scr.y-32);
        } else {
            ctx.drawImage(catimageleft, scr.x, scr.y-32);
        }
    }
}