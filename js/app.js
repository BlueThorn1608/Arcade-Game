'use strict';
var lives = 10;
var score = 0;

$('#life').html("<h1>" + lives + "<h1>");
$('#fscore').html("<h1>" + score + "<h1>");

//random speed generating fucntion
function speed() {
    return Math.random() * (400 - 300) + 100;
}


// Enemies our player must avoid
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed();
    this.hitbox = {
        x : this.x, 
        y : this.y, 
        width : 100, 
        height : 60
    };
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x > 500) {
        this.x = 0;
        this.speed = speed();
    }
    this.x = this.x + this.speed * dt;
    this.makebox();
    return this.x;
};

//updates the box on the enemy
Enemy.prototype.makebox = function() {
    this.hitbox.x = this.x;
    this.hitbox.y = this.y + 80;
};

Enemy.prototype.drawbox = function(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    var X = this.hitbox.x;
    var Y = this.hitbox.y;
    var W = this.hitbox.width;
    var H = this.hitbox.height;
    this.drawbox(X, Y, W, H, "green");
};

// Now write your own player class
var Player = function() {
    this.sprite = "images/char-boy.png";
    this.x = 200;
    this.y = 400;
    this.width = 70;
    this.height = 80;
    this.boxX = this.x + 30;
    this.boxY = this.y + 60;
};

//function to draw box around player 
Player.prototype.drawbox = function(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.drawbox(this.boxX, this.boxY, this.width, this.height, "blue");
};

//puts the player back to start
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

Player.prototype.updatebox = function() {
    this.boxX = this.x + 20;
    this.boxY = this.y + 60;
};


Player.prototype.win = function() {
    score += 1000;
    score *= lives;
    //lives ++; does not work
    $('#game').empty();
    $('#game').append("<h1>" + "You Win !" + "</h1>");
}

Player.prototype.update = function () {
    if (this.x < 0)
        this.x = 0;
    else if(this.x > 400)
        this.x = 400;
        
    if (this.y < 0){
        this.reset();
        this.win();
    }
    else if (this.y > 400) 
        this.y = 400;

    if(this.y < 400){
       score++;
       $('#fscore').html("<h1>" + score + "<h1>");
    }
    this.updatebox();
    this.checkcollisions();
};

// This class requires an update(), render() 
Player.prototype.checkcollisions = function(){
    var playerBox = {
        x : this.boxX, y : this.boxY, width : this.width, height : this.height
    };
    var length = allEnemies.length;
    for(var i = 0; i < length; i++){
        var rect1 = playerBox;
        var rect2 = allEnemies[i].hitbox;
        //check collision
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
            lives--;
            $('#life').html("<h1>" + lives + "<h1>");
            this.render();
            this.reset();
            if(lives === 0){
              $('#game').append("<h1> You Lose ! </h1>");
            }
        }
    }
};

// a handleInput() method.
Player.prototype.handleInput = function(keys) {
    switch (keys) {
        case 'right' : 
            this.x += 100;
            break;
        case 'left' :
            this.x -= 100;
            break;
        case 'up' :
            this.y -= 80;
            break;
        case 'down' :
            this.y += 80;
            break;
    }

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy1 = new Enemy(-250, 60);
var enemy2 = new Enemy(-450, 150);
var enemy3 = new Enemy(0, 225);
var allEnemies = [enemy1, enemy2, enemy3];
var player = new Player(200, 400);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
