function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const words = [
  "abacaxi",
  "bala",
  "carro",
  "dedo",
  "elefante",
  "faca",
  "gato",
  "hamburguer",
  "igreja",
  "jornal",
  "kilo",
  "limao",
  "maca",
  "nave",
  "oculos",
  "pato",
  "queijo",
  "rato",
  "sapato",
  "tijolo",
  "uva",
  "vela",
  "waffle",
  "xadrez",
  "yoga",
  "zebra",
  "amigo",
  "bolo",
  "cavalo",
  "dente",
  "eletrico",
  "foguete",
  "garfo",
  "hotel",
  "jacare",
  "kiwi",
  "lampada",
  "mochila",
  "navio",
  "orquidea",
];

let c = document.getElementById("gameboard");
let ctx = c.getContext("2d");

const wCanvas = c.width;
const hCanvas = c.height;

const droppingWords = [];
let lastTypedWord;

let gameOver = true;
let tempo = 0;

let score = 0;
let errors = 0;

const character = {
  x: wCanvas / 2,
  y: hCanvas - 40,
  playing: false
}

const Bg = new Image();
Bg.src = "url(pxArt.png)";

const SpriteWitchIdle = new Image();
SpriteWitchIdle.src = "images/SpriteWitchIdle.png";
ctx.drawImage(SpriteWitchIdle,0,0,32,42,0,0,32*2,42*2);


const SpriteWitchDamage = new Image();
SpriteWitchDamage.src = "images/SpriteWitchDamage.png";
ctx.drawImage(SpriteWitchDamage,0,0,32,42,0,0,32*2,42*2);

const SpriteWitchCharge = new Image();
SpriteWitchCharge.src = "images/SpriteWitchCharge.png";
ctx.drawImage(SpriteWitchCharge,0,0,48,48,0,0,32*2.5,42*2.5);

const spriteWitchWidth = 32;
const spriteWitchHeight = 48;
const spriteWitchChargeSize = 48;

const witchXScale = spriteWitchWidth * 2.5;
const witchYScale = spriteWitchHeight * 2.5;

function drawWitchFrame(witchSprite, frameY, canvasX, canvasY) {
  ctx.drawImage(witchSprite, 0, frameY * spriteWitchHeight, 
    spriteWitchWidth, spriteWitchHeight, canvasX, canvasY, witchXScale, witchYScale);
}
function drawWitchChargeFrame(frameY, canvasX, canvasY) {
  ctx.drawImage(SpriteWitchCharge, 0, frameY * spriteWitchChargeSize, 
    spriteWitchChargeSize, spriteWitchChargeSize, canvasX, canvasY, witchXScale, witchYScale);
}
const cloudSprite = new Image();
cloudSprite.src = "images/cloudSprite.png";

let cycleLoop = 5;
let currentLoopIndex = 0;
let frameCount = 3;

function generateDropping() {
  if (gameOver) {
    droppingWords.length = 0;
    lastTypedWord = null;
    tempo = 0;

    character.playing = false;
    character.x = wCanvas / 2;
    character.y = hCanvas - 40;

    ctx.clearRect(0, 0, wCanvas, hCanvas);
    return;
  }

  if (tempo % 5 == 0) {
    currentLoopIndex++;
    if (currentLoopIndex >= cycleLoop) {
      currentLoopIndex = 0;
    }
  }

  // Desenhar o local padrão do personagem
  if (!character.playing) {
    cycleLoop = 5;
    //ctx.drawImage(SpriteWitchCharge,0,48*2,48,48,0,0,32*2.5,42*2.5);
    //ctx.clearRect(character.x, character.y - 35, scaledWidth, scaledHeight);
    ctx.clearRect(character.x, character.y - 70, witchXScale, witchYScale);
    //ctx.fillRect(character.x, character.y, 40, 40);
    //drawPlayerFrame(cycleLoop[currentLoopIndex], 0, character.x, character.y);
    drawWitchFrame(SpriteWitchIdle,currentLoopIndex,character.x, character.y - 70);
    //window.requestAnimationFrame(step);
  }
  // Para cada palavra caindo...
  droppingWords.forEach((word, index) => {
    // Remover palavra da array se ela chegar no final
    if (word.y > (hCanvas + 40)) {
      ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);
      droppingWords.splice(index, 1);
    }

    // Fazer personagem acompanhar a queda da ultima palavra digitada
    if (word == lastTypedWord) {
      cycleLoop=4;
      //ctx.clearRect(character.x, character.y - 35, scaledWidth, scaledHeight);
      //drawFrame(0, 0, character.x, character.y);
      ctx.clearRect(character.x, character.y - 70, witchXScale, witchYScale);
      character.y = word.y - 65;
      character.x = word.x - 7;
      //ctx.fillRect(character.x, character.y, 40, 40);

      //drawPlayerFrame(cycleLoop[currentLoopIndex], 0, character.x, character.y);
      
      drawWitchChargeFrame(currentLoopIndex, character.x, character.y -70)
      //window.requestAnimationFrame(step);
    }

    // Terminar o jogo (se o personagem cair no fim do mapa ou se ele não digitar nada no começo do jogo)
    if ((character.y >= (hCanvas - 40) && character.playing) || (index == 0 && word.y >= (hCanvas - 10) && !character.playing)) {
      playStop();
      gameOver = true;
      ctx.clearRect(0, 0, wCanvas, hCanvas);
      return;
    }

    // Fazer queda da palavra (e sua caixa cinza ou azul caso já tenha sido digitada)
    ctx.clearRect(word.x - 10, word.y + 10, word.width + 25, -35);
    ctx.clearRect(word.x - 10, word.y - 64, 64, 38);
    word.y++;
    //ctx.drawImage(cloudSprite,0,0,221,93,word.x - 10,word.y + 10,30,128);

    word.typed == false ? ctx.fillStyle = "gray" : ctx.fillStyle = "blue";
    ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);
    ctx.drawImage(cloudSprite,0,0,221,93,word.x - 10,word.y - 64,64,38);

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(word.word, word.x, word.y);
  });

  // Gerar novas palavras (nos dois lados)
  if (tempo == 100 || tempo == 200) {
    let x;

    if (tempo == 100) {
      x = getRandomInt(330, 480);
    } else {
      x = getRandomInt(30, 200);
      tempo = 0;
    }
    let y = 0;
    let word = words[getRandomInt(0, words.length - 1)];;

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(word, x, y);

    let width = ctx.measureText(word).width;
    let typed = false;

    droppingWords.push({ x, y, width, word, typed });

    ctx.fillStyle = "gray";
    ctx.fillRect(x - 10, y, width + 20, -15);
  }

  tempo++;
  requestAnimationFrame(generateDropping);
}

generateDropping();

// Evento de detecção de letras digitadas no teclado
// Verifica a última palavra que ainda não foi digitada (letra por letra, em ordem)
let countLetter = 0;
document.addEventListener("keydown", function (event) {
  const keyPressed = event.key.toLowerCase();
  console.log(event);

  if (gameOver)
    countLetter = 0;

  if (droppingWords.length > 0 && !gameOver) {
    let currentWordIndex;

    for (let i = 0; i < droppingWords.length; i++) {
      if (!droppingWords[i].typed) {
        currentWordIndex = i;
        break;
      }
    }

    const nextWord = droppingWords[currentWordIndex];
    const nextLetter = nextWord.word.charAt(countLetter);

    if (keyPressed === nextLetter) {
      countLetter++;

      score++;
      document.getElementById("score").textContent = score;

      if (countLetter === nextWord.word.length) {
        countLetter = 0;
        lastTypedWord = nextWord;
        character.playing = true;

        nextWord.typed = true;
        droppingWords[currentWordIndex] = nextWord;
      }
    } else {
      errors++;
      document.getElementById("errors").textContent = errors;
    }
  }
});

// Iniciar e terminar o jogo (mudar texto do button e zerar scores)
function playStop() {
  if (gameOver) {
    document.getElementById("playStopButton").textContent = "Stop";
    gameOver = false;
    generateDropping();

    score = 0;
    document.getElementById("score").textContent = score;
    errors = 0;
    document.getElementById("errors").textContent = errors;
  } else {
    document.getElementById("playStopButton").textContent = "Play";
    gameOver = true;
  }
}