function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function Blob(x, y, r,color) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0, 0);
  this.color = [color[0],color[1],color[2]]
  this.mass = 0

  this.update = function() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.div(50);
    // newvel.setMag(3);
    newvel.limit(3);
    this.vel.lerp(newvel, 0.1);
    this.pos.add(this.vel);
  };

  this.eats = function(other){
    var distance = p5.Vector.dist(this.pos,other.pos);
    if ( distance < this.r + other.r ){

        var sum = PI * this.r * this.r + (PI * other.r * other.r)*0.2;  // сумма площадей нашей капли и той что сьели
        this.r = sqrt(sum/PI); // area = pi * r^2 => r = sqrt(area/pi)
        this.mass += 1;
        return true
    } else {
        return false
    }
  }

  this.eats_enemy = function(other){
    if ( Math.round((blob.pos.x-other.x)**2) + Math.round((blob.pos.y-other.y)**2) < blob.r**2 ) { // формула принодлежности точки к окружности 
      if ( other.r > 11 && blob.r > 11 ) {
        var sum = PI * this.r * this.r + (PI * other.r * other.r)*0.2;  // сумма площадей нашей капли и той что сьели
          this.r = sqrt(sum/PI); // area = pi * r^2 => r = sqrt(area/pi)
          return true
      }
    } else {
        return false
    }
} 



// граница
  this.constrain = function() {
    blob.pos.x = constrain(blob.pos.x, -5 * width , 5 * width);
    blob.pos.y = constrain(blob.pos.y, -5 * height, 5 * height);
  };

  this.show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  };
}
