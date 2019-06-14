// Enemies our player must avoid
var GameObject = function (image, x, y, speed) {
    this.sprite = image;
    this.position = { x: parseInt(x, 10), y: parseInt(y, 10) };
    this.speed = speed;
}

GameObject.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.position.x <= 505) {
        this.position.x += (this.speed * dt);
    } else {
        this.position.x = this.random(-200,-101);
        this.position.y = this.randomY();
    }

    
};

// Draw the enemy on the screen, required method for game
GameObject.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.position.x, this.position.y);
};

GameObject.prototype.randomY = function () {
    var yPositions = [59, 143, 227];
    var random = this.random(0,2);
    return yPositions[random];
}

GameObject.prototype.random = function (min, max) {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
}

var Enemy = function () {
    GameObject.call(this, 'images/enemy-bug.png', this.random(-100,0), this.randomY(), this.random(200,500));
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;



var allEnemiesMaker = function (n) {
    var enemy,
        enemyArray = [];
    for (i = 0; i < n; i++) {
        enemy = new Enemy;
        enemyArray.push(enemy);
    }
    return enemyArray;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    GameObject.call(this, 'images/char-boy.png', 205, 380, 2);
}
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

/*Player.prototype.handleInput() = function () {

}*/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = allEnemiesMaker(3);
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
