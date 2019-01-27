class Mouse {
  constructor(position={x:0,y:0}, velocity={x:1,y:0}, width=32, height=32) {
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.onGround = false;
    this.speed = 2;
  }

  draw() {
  }

  move() {
    if (this.controls.left) {
      this.velocity.x = -this.speed;
    } else if (this.controls.right) {
      this.velocity.x = this.speed;
    } else {
      this.velocity.x = 0;
    }
    if (this.controls.jump) {
      this.jump();
    }
    let newPos = {
      x:this.position.x+this.velocity.x,
      y:this.position.y+this.velocity.y
    };
    this.position = newPos; 
    
    if (!this.onGround) {
      this.velocity.y += 0.5;
      if (isSolid(newPos.x, newPos.y)) {
        this.velocity.y = 0;
        this.onGround = true;
      }
    } else {
      if (!isSolid(this.position.x, this.position.y+1)) {
        this.onGround = false;
      }
    }
    while(isSolid(this.position.x, this.position.y)) {
      this.position.y -= 1;
      this.onGround = true;
    }
  }

  jump() {
    if (this.onGround) {
      this.velocity.y = -10;
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
    this.move();
  }

}