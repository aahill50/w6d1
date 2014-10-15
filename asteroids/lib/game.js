(function () {

  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  if (typeof Asteroids.Game === "undefined") {
    Asteroids.Game = {};
  }

  var NUM_ASTEROIDS = 15;
  var NUM_STARS = 75;

  var Game = Asteroids.Game = function (dim_x, dim_y) {
    this.dim_x = dim_x;
    this.dim_y = dim_y;
    this.num_asteroids = NUM_ASTEROIDS;
    this.asteroids = this.addAsteroids();
    this.stars = this.addStars();
    this.ship = new Asteroids.Ship(this.randomPosition(), this)
    this.bullets = [];
    this.allObjects = this.getAllObjects();
  };

  Game.prototype.getAllObjects = function () {
    return this.asteroids.concat(this.bullets).concat(this.ship).concat(this.stars);
  };

  Game.prototype.addAsteroids = function () {
    var asteroids = [];
    var game = this;

    for (var i = 0; i < NUM_ASTEROIDS; i++) {
      var ast = new Asteroids.Asteroid(game.randomPosition(), this);
      asteroids.push(ast);
    };
    return asteroids;
  };
  
  Game.prototype.addStars = function () {
    var stars = [];
    var game = this;

    for (var i = 0; i < NUM_STARS; i++) {
      var star = new Asteroids.Star(game.randomPosition(), this);
      stars.push(star);
    };
    return stars;
  };


  Game.prototype.randomPosition = function () {
    var x = Math.floor(Math.random() * (this.dim_x));
    var y = Math.floor(Math.random() * (this.dim_y));
    return [x,y];
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, this.dim_x, this.dim_y);
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, this.dim_x, this.dim_y);

    this.allObjects.forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    this.allObjects.forEach(function (object) {
      object.move();
    });
  };

  Game.prototype.wrap = function (pos, radius) {
    var x = pos[0]; // % this.dim_x;
    var y = pos[1]; //% this.dim_y;
    var r = radius;

    if (x + r < 0) {
      var new_x = this.dim_x + r;
    } else if (x - r > this.dim_x) {
      var new_x = 0 - r
    } else{
      var new_x = x;
    }

    if (y + r < 0) {
      var new_y = this.dim_y + r;
    } else if (y - r > this.dim_y) {
      var new_y = 0 - r;
    } else {
      var new_y = y;
    }

    return [new_x,new_y];
  };

  Game.prototype.checkCollisions = function () {
    this.allObjects.forEach(function (object) {
      this.allObjects.forEach(function (otherObject) {
        if (object !== otherObject) {
          if (object.isCollidedWith(otherObject)) {
            // window.alert("COLLISION");
            object.collideWith(otherObject);
          }
        }
      }.bind(this));
    }.bind(this));
  };

  Game.prototype.step = function () {
    this.allObjects = this.getAllObjects();
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.remove = function (movingObject) {
    for (var i = 0; i < this.allObjects.length; i++) {
      if (this.allObjects[i] === movingObject) {
        this.allObjects.splice(i,1);
        if (movingObject instanceof Asteroids.Asteroid) {
          this.asteroids.splice(i,1);
        } else if(movingObject instanceof Asteroids.Bullet) {
          this.bullets.splice(this.asteroids.length - i, 1);
        }

        // console.log(this.allObjects.length);
      }
    };
  };
})();