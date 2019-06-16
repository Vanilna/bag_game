var score = 0;
var hearts = 0;

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
        this.position.x = this.random(-200, -101);
        this.position.y = this.randomOfArray([62, 145, 228]);
    }
};

// Draw the enemy on the screen, required method for game
GameObject.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.position.x, this.position.y);
};

GameObject.prototype.randomOfArray = function (arr) {
    var random = this.random(0, arr.length - 1);
    return arr[random];
}

GameObject.prototype.random = function (min, max) {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
}

GameObject.prototype.checkCollisions = function (arr, callbackFunc, scoreSetCallback, scoreOrHartPoints, scoreCategory) {
    var chekedItemPositionX = this.position.x;
    var chekedItemPositionY = this.position.y;

    arr.forEach(function (item) {
        if ((item.position.x > (chekedItemPositionX - 80)
            && item.position.x < (chekedItemPositionX + 80))
            && item.position.y == chekedItemPositionY) {
            callbackFunc();
            if (scoreSetCallback) {
                scoreSetCallback(scoreOrHartPoints, scoreCategory);
            }
        } 
    });
}

////////////////////////////////////////////////////////////////////////////////////

var Enemy = function () {
    GameObject.call(this, 'images/enemy-bug.png', this.random(-100, 0), this.randomOfArray([62, 145, 228]), this.random(200, 350));
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.allEnemiesMaker = function (n) {
    var enemy,
        enemyArray = [];
    for (i = 0; i < n; i++) {
        enemy = new Enemy;
        enemyArray.push(enemy);
    }
    return enemyArray;
};

///////////////////////////////////////////////////////////////////////////////////

var Player = function () {
    GameObject.call(this, 'images/char-boy.png', 202, 394, 0);
}
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.handleInput = function (key) {
    if (key == 'left' && this.position.x != 0) {
        this.position.x -= 101;
    } else if (key == 'up' && this.position.y != -21) {
        this.position.y -= 83;
    } else if (key == 'right' && this.position.x != 404) {
        this.position.x += 101;
    } else if (key == 'down' && this.position.y != 394) {
        this.position.y += 83;
    }
    
    if (key == 'up' && this.position.y == -21) {
        this.setScore(5, 'score');
        this.resetPosition();
    }
}

Player.prototype.resetPosition = function () {
        player.position.x = 202;
        player.position.y = 394;
    }

Player.prototype.setScore = function (points, category) {
    if (category == 'score') {
        score = score + points;
        document.querySelector('#score-count').innerHTML = score;
    } else if (category == 'hearts') {
        hearts = hearts + points;
        document.querySelector('#heart-count').innerHTML = score;
    }
    
}

///////////////////////////////////////////////////////////////////////////////////

var Gem = function (color) {
    GameObject.call(this, `images/gem_${color}.png`,
        null, this.randomOfArray([62, 145, 228]), 0);
}
Gem.prototype = Object.create(GameObject.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.makeGems = function () {
    var arr = ['blue', 'green', 'orange'],
        gemArray = [],
        gem;
    arr.forEach(function (color) {
        gem = new Gem(color);
        gemArray.push(gem);
    });
    return gemArray;
}

Gem.prototype.colisionHendler = function () {
    this.position.x = null;
    
    setTimeout(function () {
        this.position.x = this.randomOfArray([0, 101, 202, 303, 404]);
    }, 5000);
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = Enemy.prototype.allEnemiesMaker(3);
var allGems = Gem.prototype.makeGems();


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
