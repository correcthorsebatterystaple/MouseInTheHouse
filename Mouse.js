class Mouse {
  constructor(position={x:0,y:0}, velocity={x:1,y:0}, width=58, height=32) {
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.onGround = false;
    this.speed = 5;
    this.climbCounter = 30;
    this.facingLeft = false;
    this.bombcounter = 60*60;
  }

  draw() {
    if (this.facingLeft) {
      ctx.drawImage(mouseimageleft, canvas.width/2-this.width/2, canvas.height/2-this.height);
    } else {
      ctx.drawImage(mouseimage, canvas.width/2-this.width/2, canvas.height/2-this.height);
    }

    //draw the bomb counter
    let secondsleft = Math.floor(this.bombcounter/60).toString();
    if (secondsleft.length < 2) {
      secondsleft = '0'+secondsleft;
    }
    let milliseconds = Math.floor((this.bombcounter%60)*(100/60)).toString();
    if (milliseconds.length < 2) {
      milliseconds = '0'+milliseconds;
    }
    for (let i=0; i<secondsleft.length; i++) {
      ctx.drawImage(numbersimage, parseInt(secondsleft.charAt(i))*32, 0, 32, 32, 100+i*32, 100, 32, 32);
    }
    ctx.drawImage(numbersimage, 0, 32, 32, 32, 164, 100, 32, 32);
    for (let i=0; i<milliseconds.length; i++) {
      ctx.drawImage(numbersimage, parseInt(milliseconds.charAt(i))*32, 0, 32, 32, 164+32+i*32, 100, 32, 32);
    }
  }

  move() {
    if (this.controls.left) {
      this.facingLeft = true;
      this.velocity.x = -this.speed;
    } else if (this.controls.right) {
      this.facingLeft = false;
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

  explode() {
    //booms
  }

  update() {
    this.move();
    if (this.bombcounter == 0) {
      this.explode();
    } else {
      this.bombcounter--;
    }
  }

}