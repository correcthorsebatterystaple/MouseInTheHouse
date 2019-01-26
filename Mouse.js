class Mouse {
  constructor(position={x:0,y:0}, velocity={x:1,y:0}) {
    this.position = position;
    this.velocity = velocity;
    this.onGround = true;
  }

  draw() {

  }

  move(velocity=this.velocity) {
    this.velocity = velocity;
    return this.velocity;
  }

  jump() {
    if (!this.onGround) {
      this.onGround = false;
      this.velocity.y = 1;
    }
  }

  climb() {

  }

  teleport(position = this.position) {
    this.position = position;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (!this.onGround) {
      this.velocity.y -= 0.1;
      if (this.velocity.y <= 0) {
        this.velocity.y = 0;
        this.onGround = true;
      }
    }
  }

}