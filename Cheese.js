class Cheese {
    constructor({x, y}) {
        this.position = {
            x: x,
            y: y
        }
        this.collected = false;
    }
    update() {
        if (!this.collected) {
            let distance = Math.sqrt(
                Math.pow(this.position.x - mouse.position.x, 2) +
                Math.pow(this.position.y - mouse.position.y, 2)
            );
            if (distance < 32) {
                mouse.speed ++;
                this.collected = true;
            }
            this.draw();
        }
    }
    draw() {
        let scr = camera.pixelToScreenSpace(this.position);
        ctx.drawImage(cheeseimage, scr.x, scr.y);
    }
}