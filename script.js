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

function generateDropping() {
  if (gameOver) {
    ctx.clearRect(0, 0, wCanvas, hCanvas);
    return;
  }

  // Desenhar o local padrão do personagem
  if (!character.playing)
    ctx.fillRect(character.x, character.y, 40, 40);

  // Para cada palavra caindo...
  droppingWords.forEach((word, index) => {
    // Remover palavra da array se ela chegar no final
    if (word.y > (hCanvas + 40)) {
      droppingWords.splice(index, 1);
    }

    // Fazer personagem acompanhar a queda da ultima palavra digitada
    if (word == lastTypedWord) {
      ctx.clearRect(character.x, character.y, 40, 40);
      character.y = word.y - 65;
      character.x = word.x - 10;
      ctx.fillRect(character.x, character.y, 40, 40);
    }

    // Terminar o jogo (se o personagem cair no fim do mapa ou se ele não digitar nada no começo do jogo)
    if ((character.y >= (hCanvas - 40) && character.playing) || (index == 0 && word.y >= (hCanvas - 10) && !character.playing)) {
      playStop();
      gameOver = true;
      droppingWords.length = 0;
      character.playing = false;
      tempo = 0;
      lastTypedWord = null;
      ctx.clearRect(0, 0, wCanvas, hCanvas);
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

  if (droppingWords.length > 0) {
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

function playStop() {
  // Iniciar e terminar o jogo (respectivamente)
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
