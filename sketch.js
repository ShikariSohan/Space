let bg;
let score = 0;
let keyStack = [];
let keyStackDiv;
let scoreCard;
let bubbles = [];
let arrow;
let bullets = [];
let gift = [];
let keyIconMap = {
  37: "/public/left.png",
  38: "/public/up.png",
  39: "/public/right.png",
  40: "/public/down.png",
  32: "/public/space.png",
  13: "/public/enter.png",
};

function preload() {
  bg = loadImage("/public/bg.gif");
  arrow = loadImage("/public/arrow.png");
}

arrowLocation = 0;

function setup() {
  var cnv = createCanvas(800, 800);
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  keyStackDiv = createDiv("");
  keyStackDiv.position(
    (windowWidth - width) / 2,
    (windowHeight - height) / 2 + height + 10
  );
  keyStackDiv.style("border", "2px solid black");

  scoreCard = createDiv("Score: 0");
  scoreCard.position(
    (windowWidth - width) / 2 + width - 120,
    (windowHeight - height) / 2 + height + 10
  );
  scoreCard.style("font-size", "18px");
  scoreCard.style("font-family", "Pixel, Arial, sans-serif");
  scoreCard.style("color", "white");
  scoreCard.style("background-color", "#333");
  scoreCard.style("padding", "8px");

  for (let i = 0; i < 10; i++) {
    bubbles.push({
      x: random(0, width),
      y: random(0, 150),
      size: random(10, 50),
      speed: random(0.5, 3),
      gift: random(-10, 50),
    });
  }
  arrowLocation = width / 2;
}

function draw() {
  background(bg);
  checkKeyEffect();
  updateKeyStackDiv();
  updateScoreCard();
  drawBubbles();
  drawArrow();
  checkBullets();
  drawBullets();
  keyDownCheck();
  checkGifts();
  drawGifts();
}

function checkGifts() {
  for (let i = 0; i < gift.length; i++) {
    let giftItem = gift[i];
    let d = dist(giftItem.x, giftItem.y, arrowLocation + 25, 700);
    if (d < 25) {
      gift.splice(i, 1);
      score += giftItem.value;
    }
    if (giftItem.y > height) {
      gift.splice(i, 1);
    }
  }
}

function drawGifts() {
  for (let i = 0; i < gift.length; i++) {
    let giftItem = gift[i];
    giftItem.y += giftItem.speed;
    fill(255, 0, 0);
    ellipse(giftItem.x, giftItem.y, 20, 20);
    fill(255);
    let val = round(giftItem.value);
    text(val, giftItem.x - 20, giftItem.y - 20);
  }
}

function checkBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    bullet.y -= bullet.speed;
    for (let j = 0; j < bubbles.length; j++) {
      let bubble = bubbles[j];
      let d = dist(bullet.x, bullet.y, bubble.x, bubble.y);
      if (d < bubble.size / 2) {
        bubbles.splice(j, 1);
        bullets.splice(i, 1);
        gift.push({
          x: bubble.x,
          y: bubble.y,
          value: bubble.gift,
          speed: random(0.5, 3),
        });
      }
    }
    if (bullet.y < 0) {
      bullets.splice(i, 1);
    }
  }
}

function drawBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    fill(255, 0, 0);
    rect(bullet.x, bullet.y, 5, bullet.size);
  }
}

function drawArrow() {
  image(arrow, arrowLocation, 700, 50, 50);
}

function checkKeyEffect() {
  for (let i = 0; i < keyStack.length; i++) {
    let key = keyStack[i];
    if (frameCount - key.effect > 60) {
      keyStack.splice(i, 1);
    }
  }
}

function drawBubbles() {
  for (let i = 0; i < bubbles.length; i++) {
    let bubble = bubbles[i];
    bubble.x += bubble.speed;
    if (bubble.x > width || bubble.x < 0) {
      bubble.speed *= -1;
    }
    fill(152, 54, 174, 90);
    noStroke();
    ellipse(bubble.x, bubble.y, bubble.size, bubble.size);
  }
}

function keyDownCheck() {
  if (keyIsDown(37)) {
    arrowLocation -= 5;
  }
  if (keyIsDown(39)) {
    arrowLocation += 5;
  }
  if (arrowLocation < 0) {
    arrowLocation = 0;
  }
  if (arrowLocation > width) {
    arrowLocation = width - 50;
  }
}

function keyPressed() {
  if (keyCode == 32) {
    bullets.push({
      x: arrowLocation + 25,
      y: 700,
      size: 10,
      speed: 5,
    });
  }
  let codes = Object.keys(keyIconMap);
  if (codes.indexOf(keyCode.toString()) === -1) {
    return;
  }
  if (keyStack.length > 10) {
    keyStack.shift();
  }
  keyStack.push({
    keyCode: keyCode,
    effect: frameCount,
  });
}

function updateKeyStackDiv() {
  keyStackDiv.html("");
  for (let i = 0; i < keyStack.length; i++) {
    let key = keyStack[i];
    let img = keyIconMap[key.keyCode];
    if (img) {
      let imgElement = createImg(img, "key image");
      imgElement.size(25, 25);
      keyStackDiv.child(imgElement);
    }
  }
}

function updateScoreCard() {
  scoreCard.html("Score: " + round(score));
}
