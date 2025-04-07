const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
const fps = 60;

let backgnd_img = new Image();
backgnd_img.src = "backgroundSprite.png";

let themeMusic = [
  'MetalDub.mp3',
  'dubLogo.mp3',
  'pixelDubstep.mp3'
];

let keys = {};

class Player {
  constructor() {
    this.pos = {
      x: 50,
      y: 120
    }
    this.vel = {
      x: 0,
      y: 0
    }
    this.width = (35*2);
    this.height = (100*2);
    this.img = new Image();
    this.img.src = "newJaspser.png";
    this.turn = 1;
    this.rotate = 0;
    this.offsetX = this.width / 2;
    this.offsetY = this.height / 2;
  }

  move() {
    if (keys.w) {
      this.vel.y = -5;
      this.rotate = -90;
    }

    if (keys.a) {
      this.vel.x = -5;
      this.turn = -1;
    }

    if (keys.s) {
      this.vel.y = 5;
      this.rotate = 90;
    }

    if (keys.d) {
      this.vel.x = 5;
      this.turn = 1;
    }

    if (!keys.d && !keys.a) {
      this.vel.x = 0;
    }

    if (!keys.w && !keys.s) {
      this.vel.y = 0;
      this.rotate = 0;
    }

    if (this.pos.x >= (canvas.width/2) - this.width) {
      this.pos.x = (canvas.width/2) - this.width;
    };
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.move();
    c.save();
    c.translate((this.pos.x + this.offsetX), (this.pos.y + this.offsetY));
    c.rotate(this.rotate);
    c.translate(-(this.pos.x + this.offsetX), -(this.pos.y + this.offsetY));
    c.scale(this.turn, 1);
    c.drawImage(this.img, this.pos.x*this.turn, this.pos.y, this.width*this.turn, this.height);
    c.restore();
  }
}

class Cheeseburger {
  constructor(x, y, velX) {
    this.pos = {
      x: x,
      y: y
    }
    this.vel = {
      x: velX, 
      y: 0
    }
    this.width = (51);
    this.height= (44);
    this.angle = 0;
    this.offsetX = (this.width / 2);
    this.offsetY = (this.height / 2);
    this.outside = false;
    this.image = new Image();
    this.image.src = "cheeseburgerSpriteSUPER.png";
  }

  rotateCheeseburger() {
    this.angle += 0.1;
  }

  collision() {
    if (this.pos.x > canvas.width + 50) {
      this.outside = true;
    }
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    this.rotateCheeseburger();
    this.collision();

    c.fillStyle = 'orange';
    c.save();
    c.translate((this.pos.x + this.offsetX), (this.pos.y + this.offsetY));
    c.rotate(this.angle);
    c.translate(-(this.pos.x + this.offsetX), -(this.pos.y + this.offsetY));
    c.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
    c.restore();
  }
}

class Enemys {

}

let player = new Player();

function keyHandler(event) {
  if (event.type == 'keydown') keys[event.key] = true;
  if (event.type == 'keyup') keys[event.key] = false;
}

let cheeseburgers = [];
let delay = 0;
function shootCheeseburger() {
  if (delay <= 0 && keys[' ']) {
    let offsetX = 0;
    let offsetY = 0;
    let newVelY = 0;

    if (player.turn == -1) {
      newVelY = -5;
      offsetX = ((player.pos.x - player.width) - 10);
      offsetY = ((player.pos.y + player.height / 2) - 10);
    } else {
      newVelY = 5;
      offsetX = ((player.pos.x + player.width) - 10);
      offsetY = ((player.pos.y + player.height / 2) - 10);
    }

    let cheeseburger = new Cheeseburger(offsetX, offsetY, newVelY);
    cheeseburgers.push(cheeseburger);
    delay = 10;
  }
}

let song = '';
let audio = 0;
function chooseSong() {
  song = new Audio(themeMusic[audio]);
  song.controls = true;
  song.volume = 0.1;
}

function run() {
  shootCheeseburger();
  if (delay >= 0) delay--;
  
  if (song.ended) {
    chooseSong();
    audio += 1;
    if (audio == themeMusic.length) {
      audio = 0;
    }
  }

  if (!song == '') {
    song.play();
  }
}

function render() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(backgnd_img, 0, 0, canvas.width, canvas.height);

  player.update();

  cheeseburgers.forEach((cheeseburger, i) => {
    cheeseburger.update();

    if (cheeseburger.outside) {
      cheeseburgers.splice(i, 1);
      i--;
    }
  })
}

setInterval(() => {
  run();
  render();
}, 1000/fps)

chooseSong();

document.addEventListener('keydown', keyHandler);
document.addEventListener('keyup', keyHandler);