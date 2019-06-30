var score = 0;
var hearts = 0;

var GameObject = function (image, x, y, speed, type, inProgress) {
    this.sprite = image;
    this.position = { x: parseInt(x, 10), y: parseInt(y, 10) };
    this.speed = speed;
    this.type = type;
    this.inProgress = inProgress;
}

GameObject.prototype.update = function (dt) {
    if (this.position.x <= 505) {
        this.position.x += (this.speed * dt);
    } else {
        this.position.x = this.random(-200, -101);
        this.position.y = this.randomOfArray([62, 145, 228]);
    }
};

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

GameObject.prototype.checkCollisions = function (arr) {
    var checkedItem = this;

    arr.forEach(function (item) {
        if ((item.position.x > (checkedItem.position.x - 40)
            && item.position.x < (checkedItem.position.x + 40))
            && item.position.y == checkedItem.position.y) {
            if (item.type == 'enemy') {
                checkedItem.reactOnColision(item.type, -3);
            } else if (item.type == 'gem') {
                item.reactOnColision();
                checkedItem.reactOnColision(item.type, 1);
            }
        }
    });

}

////////////////////////////////////////////////////////////////////////////////////

var Enemy = function () {
    GameObject.call(this, 'images/enemy-bug.png', this.random(-100, 0),
        this.randomOfArray([62, 145, 228]), this.random(200, 350), 'enemy');
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
    GameObject.call(this, 'images/char-boy.png', 202, 394, 0, 'player');
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
        this.reactOnColision('water', 5);
    }
}

Player.prototype.reactOnColision = function (target, points) {
    this.setScore(target, points);
    if (target !== 'gem') {
        this.position.x = 202;
        this.position.y = 394;
    }
}

Player.prototype.setScore = function (target, points) {
    if (target == 'water' || target == 'enemy') {
        score = score + points;
        document.querySelector('#score-count').innerHTML = score;
    } else if (target = 'gems') {
        hearts = hearts + points;
        document.querySelector('#heart-count').innerHTML = hearts;
    }
}

///////////////////////////////////////////////////////////////////////////////////

var Gem = function (color) {
    GameObject.call(this, `images/gem_${color}.png`,
        this.randomOfArray([0, 101, 202, 303, 404]), this.randomOfArray([62, 145, 228]), 0, 'gem', false);
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

Gem.prototype.reactOnColision = function () {
    var gem = this;
    this.position.x = undefined;

    if (!gem.inProgress) {
        setTimeout(function () {
            gem.inProgress = true;
            gem.position.x = gem.randomOfArray([0, 101, 202, 303, 404]);
            gem.position.y = gem.randomOfArray([62, 145, 228]);
        }, 5000);
    }
}

/////////////////////////////////////////////////////////////////////////////////

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
