class Mouse {
  constructor(position={x:0,y:0}, velocity={x:1,y:0}, width=32, height=32) {
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.onGround = false;
    this.speed = 2;
    this.climbCounter = 30;
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

     //climb
    if (this.controls.up) {
      if (this.climbCounter > 0) {
        console.log(this.climbCounter);
        this.climbCounter--;
        newPos = {
          x:this.position.x+this.velocity.x,
          y:this.position.y-6
        };
      } else if (this.climbCounter == 0) {
        this.climbCounter = -100;
      }
    } else {
      if (this.climbCounter < 30)
        this.climbCounter++;
    }

    let currPos = {
      x:this.position.x,
      y:this.position.y
    };

    // incremental moving for y
    if (newPos.y < currPos.y) {
      for (let i = currPos.y; i>newPos.y; i--) {
        if (!isSolid(this.position.x, i)) {
          this.position.y = i;
        } else {
          break;
        }
      }
    } else if ( newPos.y > currPos.y) {
      for (let i = currPos.y; i<newPos.y; i++) {
        if (!isSolid(this.position.x, i)) {
          this.position.y = i;
        } else {
          this.onGround = true;
          break;
        }
      }
    }

    // incremental moving for x
    if (newPos.x < currPos.x) {
      for (let i = currPos.x; i>=newPos.x; i--) {
        if (!isSolid(i-this.width/2, this.position.y)) {
          this.position.x = i;
        } else {
          break;
        }
      }
    } else if ( newPos.x > currPos.x) {
      for (let i = currPos.x; i<=newPos.x; i++) {
        if (!isSolid(i+this.width/2, this.position.y)) {
          this.position.x = i;
        } else {
          break;
        }
      }
    }

    // falling
    if (!this.onGround) {
      this.velocity.y += 0.5;
    }

  }

  jump() {
    if (this.onGround) {
      this.velocity.y = -10;
      this.onGround = false;
    }
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