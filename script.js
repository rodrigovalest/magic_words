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

const img = new Image();
const scale = 0.3;
const spriteWidth = 256;
const spriteHeight = 256;
const scaledWidth = scale * spriteWidth;
const scaledHeight = scale * spriteHeight;
img.src = "SpriteWizard.png";
img.onload = function() {
  init();
};

function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(img,
                frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight,
                canvasX, canvasY -35, scaledWidth, scaledHeight);
}

const cycleLoop = [0,1,2,1];
let currentLoopIndex = 0;
let frameCount = 3;

function step() {
  frameCount++;
  if (frameCount < 3) {
    window.requestAnimationFrame(step);
    return;
  }
  frameCount = 0;
  ctx.clearRect(character.x, character.y-35, scaledWidth, scaledHeight);
  drawFrame(cycleLoop[currentLoopIndex], 0, character.x, character.y);
  currentLoopIndex++;
  if (currentLoopIndex >= cycleLoop.length) {
    currentLoopIndex = 0;
  }
  window.requestAnimationFrame(step);
}
// function init() {
//   window.requestAnimationFrame(step);
// }

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

  if (tempo%5 == 0) {
    currentLoopIndex ++;
    if (currentLoopIndex >= cycleLoop.length) {
      currentLoopIndex = 0;
    }
  }

  // Desenhar o local padrão do personagem
  if (!character.playing)
  {
    ctx.clearRect(character.x, character.y-35, scaledWidth, scaledHeight);
    //ctx.fillRect(character.x, character.y, 40, 40);
    drawFrame(cycleLoop[currentLoopIndex], 0, character.x , character.y);
    //window.requestAnimationFrame(step);
  }
  // Para cada palavra caindo...
  droppingWords.forEach((word, index) => {
    // Remover palavra da array se ela chegar no final
    if (word.y > (hCanvas + 40)) {
      droppingWords.splice(index, 1);
    }

    // Fazer personagem acompanhar a queda da ultima palavra digitada
    if (word == lastTypedWord) {
      ctx.clearRect(character.x, character.y-35, scaledWidth, scaledHeight);
      //drawFrame(0, 0, character.x, character.y);
      character.y = word.y - 65;
      character.x = word.x - 7;
      //ctx.fillRect(character.x, character.y, 40, 40);
      
      drawFrame(cycleLoop[currentLoopIndex], 0, character.x , character.y);
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
    word.y++;
    
    word.typed == false ? ctx.fillStyle = "gray" : ctx.fillStyle = "blue"; 
    ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);

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