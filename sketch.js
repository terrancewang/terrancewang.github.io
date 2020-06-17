let max_speed = 5;
let size = 4;
let nearby = 70;
let fr = 30
let slider;

// p5js code

function setup() {
  var canvasDiv = document.getElementById('sketch-holder')
  var width = canvasDiv.offsetWidth - 10
  var height = canvasDiv.offsetHeight - 10
  var canvas = createCanvas(width, height);
  canvas.parent('sketch-holder');

  sliderSeparation = createSlider(0, 100, 50);
  sliderSeparation.parent('slider-holder')
  sliderSeparation.style('width', '80px');
  sliderSeparation.addClass('slider');

  sliderAlignment = createSlider(0, 100, 50);
  sliderAlignment.parent('slider-holder')
  sliderAlignment.style('width', '80px');
  sliderAlignment.addClass('slider');

  sliderCohesion = createSlider(0, 100, 50);
  sliderCohesion.parent('slider-holder')
  sliderCohesion.style('width', '80px');
  sliderCohesion.addClass('slider');
  
  flock = new Flock();
  for (var i = 0; i < 50; i++) {
    var x = random(20, width - 20);
    var y = random(20, height - 20);
    flock.addBoid(x, y);
  }
  frameRate(30)
}

function mouseClicked() {
  flock.addBoid(mouseX, mouseY);
  return false;
}

function draw() {
  background(255);
  flock.update();
  //print(frameRate())
}

function windowResized() {
  var canvasDiv = document.getElementById('sketch-holder')
  var width = canvasDiv.offsetWidth - 10
  var height = canvasDiv.offsetHeight - 10
  print(width)
  print(height)
  print('resize')
  resizeCanvas(width, height);
}


class Flock {
  constructor() {
    this.boids = [];
  }

  update() {
    for (var i = 0; i < this.boids.length; i++) {
      var near = [];
      for (var j = 0; j < this.boids.length; j++) {
        if (i != j) {
          if (p5.Vector.dist(this.boids[j].pos, this.boids[i].pos) < nearby) {
            // add a check to see if boid is in blind spot of self
            if (this.boids[j].pos.angleBetween(this.boids[i].pos) < 145
            && this.boids[j].pos.angleBetween(this.boids[i].pos) > -145) {
              near.push(this.boids[j])
            }
          }
        }
      }
      var separ = createVector(0, 0)
      var angle = createVector(0, 0)
      var avg = createVector(0, 0)

      // separation scaling factor
      var x = 0.4
      // alignment scaling factor
      var y = 0.4
      // cohesion scaling factor
      var z = 0.4
      for (var n = 0; n < near.length; n++) {  
        // separation
        var force = p5.Vector.sub(this.boids[i].pos, near[n].pos)
        force.div(p5.Vector.dist(this.boids[i].pos, near[n].pos))
        separ.add(force)

        //alignment    

        angle.add(near[n].velocity)

        //cohesion 
        avg.add(near[n].pos)
      }

      separ.normalize()
      separ.mult(x)
      this.boids[i].acceleration.add(separ)

      if (near.length != 0) {
        angle.div(near.length)
        angle.normalize()
        angle.mult(y)
        this.boids[i].acceleration.add(angle)
      }

      // scale cohesion force
      if (near.length != 0) {
        avg.div(near.length)
        var cohes = p5.Vector.sub(avg, this.boids[i].pos)
        cohes.normalize()
        cohes.mult(z)
        this.boids[i].acceleration.add(cohes)
      }
      this.boids[i].next()
    }
  }

  addBoid(x, y) {
     var boid = new Boid(x, y);
     this.boids.push(boid);
  }
}

class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    var dx = random(-max_speed, max_speed);
    var dy = random(-max_speed, max_speed);
    this.velocity = createVector(dx, dy);
    this.acceleration = p5.Vector.div(this.velocity, 2)
  }

  next() {
    this.move();
    this.render();
  }

  move() {
    this.velocity.add(this.acceleration);
    var rdx = random(-1, 1) * random(-1, 1)
    var rdy = random(-1, 1) * random(-1, 1)
    this.velocity.add(createVector(rdx, rdy))
    
    this.velocity.limit(max_speed)
    
    this.pos = p5.Vector.add(this.pos, this.velocity);
    if (this.pos.x > width) {this.pos.x = 0;}
    if (this.pos.x < 0) {this.pos.x = width;}
    if (this.pos.y > height) {this.pos.y = 0;}
    if (this.pos.y < 0) {this.pos.y = height;}

    this.acceleration = p5.Vector.div(this.velocity, 2)

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