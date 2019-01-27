class Mouse {
  constructor(position={x:0,y:0}, velocity={x:1,y:0}, width=10, height=10) {
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.onGround = true;
  }

  draw() {

  }

  move() {
    newPos = {
      x:this.position.x+this.velocity.x,
      y:this.position.y+this.velocity.y
    };
    if (this.onGround) {
      this.position = newPos;
    } else {
      this.velocity.y += 0.1;
      if (isSolid(newPos.x, newPos.y)) {
        this.velocity.y = 0;
        this.onGround = true;
      }
    }
  }

  jump() {
    if (this.onGround) {
      this.velocity.y = -1;
      this.onGround = false;
    }
  }

  climb() {

  }

  teleport(position = this.position) {
    this.position = position;
  }

  setVelocity(velocity=this.velocity) {
    this.velocity = velocity;
    return this.velocity;
  }

  update() {
    move();
  }

}