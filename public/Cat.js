class Cat {
    constructor(position = {x:0,y:0}) {
        this.position = position;
        this.dx = 5;
        this.killer = false;
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
        if (distance < 32 && !this.killer) {
            window.location.href = "./yougoteaten.html";
            this.killer = true;
        }
    }
    draw() {
        let scr = camera.pixelToScreenSpace(this.position);
        if (this.dx > 0) {
            ctx.drawImage(catimage, scr.x-64, scr.y-32);
        } else {
            ctx.drawImage(catimageleft, scr.x-64, scr.y-32);
        }
    }
}