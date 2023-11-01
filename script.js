function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

let c = document.getElementById("gameboard");
let ctx = c.getContext("2d");

const droppingWords = [];
let tempo = 0;

const character = {
  x: 300,
  y: 560
}
ctx.fillRect(character.x, character.y, 40, 40);

function generateDropping() {
  droppingWords.forEach((word, index) => {
    if (word.y > 630) {
      droppingWords.splice(index, 1);
    }

    if (index == 0 && word.y > 400) {
      ctx.clearRect(character.x, character.y, 40, 40);
      character.y = word.y - 65;
      character.x = word.x - 10;
      ctx.fillRect(character.x, character.y, 40, 40);
    }
  
    ctx.clearRect(word.x - 10, word.y, word.width + 20, -25);
    word.y++;

    ctx.fillStyle = "gray";
    ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(word.word, word.x, word.y);
  });

  if (tempo == 100) {
    const x = getRandomInt(330, 480);
    let y = 0;
    let word = "hello";
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(word, x, y);
    let width = ctx.measureText(word).width;
    droppingWords.push({ x, y, width, word });

    ctx.fillStyle = "gray";
    ctx.fillRect(x - 10, y, width + 20, -15);
  }

  if (tempo == 200) {
    const x = getRandomInt(30, 200);
    let y = 0;
    let word = "hello";
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(word, x, y);
    let width = ctx.measureText(word).width;
    droppingWords.push({ x, y, width, word });
    tempo = 0;

    ctx.fillStyle = "gray";
    ctx.fillRect(x - 10, y, width + 20, -15);
  }

  tempo++;
  requestAnimationFrame(generateDropping);
}

generateDropping();
