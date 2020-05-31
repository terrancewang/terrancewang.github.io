let max_speed = 0.5;
let size = 4;

function setup() {
  createCanvas(640, 480);
  flock = new Flock();
  for (var i = 0; i < 5; i++) {
    var x = random(10, 630);
    var y = random(10, 470);
    flock.addBoid(x, y);
  }
}

function mouseClicked() {
  flock.addBoid(mouseX, mouseY);
  return false;
}

function draw() {
  background(255);
  flock.update();

}

class Flock {
  constructor() {
    this.boids = [];
  }
  update() {
    for (var i=0; i < this.boids.length; i++) {
      this.boids[i].next()
    }
  }
  addBoid(x, y) {
     var boid = new Boid(x, y);
     this.boids.push(boid);
     print(this.boids.length);
  }
}

class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    var dx = random(-1, 1);
    var dy = random(-1, 1);
    var scale = max_speed / pow(pow(dx, 2) + pow(dy, 2), 0.5);
    this.velocity = createVector(dx * scale, dy * scale);
    //this.acceleration = random
  }

  next() {
    this.update();
    this.move();
    this.render();
  }
  update() {
    
  }
  move() {
    this.pos = p5.Vector.add(this.pos, this.velocity);
    if (this.pos.x > width) {this.pos.x = 0;}
    if (this.pos.x < 0) {this.pos.x = width;}
    if (this.pos.y > height) {this.pos.y = 0;}
    if (this.pos.y < 0) {this.pos.y = height;}
  }
  render() {
    strokeWeight(2)
    stroke('#A4CCD0')
    push();
    translate(this.pos);
    rotate(this.velocity.heading() + radians(90));
    triangle(0, -2*size, -size, 2*size, size, 2*size);
    pop();
  }
}
