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
let gameOver = false;
let lastTypedWord;
let tempo = 0;
const character = {
  x: wCanvas / 2,
  y: hCanvas - 40,
  playing: false
}
ctx.fillRect(character.x, character.y, 40, 40);

function generateDropping() {
  if (gameOver) {
    ctx.clearRect(0, 0, wCanvas, hCanvas);
    return;
  }

  // Para cada palavra caindo...
  droppingWords.forEach((word, index) => {
    // Remover palavra da array se ela chegar no final
    if (word.y > (hCanvas + 40)) {
      droppingWords.splice(index, 1);
    }

    // Terminar o jogo
    if ((character.y >= (hCanvas - 40) && character.playing) || (index == 0 && word.y >= (hCanvas - 10))) {
      droppingWords.length = 0;
      character.playing = false;
      tempo = 0;
      countLetter = 0;
      lastTypedWord = null;
      gameOver = true;

      ctx.clearRect(0, 0, wCanvas, hCanvas);
    }

    // Fazer personagem acompanhar a queda da ultima palavra digitada
    if (word == lastTypedWord) {
      ctx.clearRect(character.x, character.y, 40, 40);
      character.y = word.y - 65;
      character.x = word.x - 10;
      ctx.fillRect(character.x, character.y, 40, 40);
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

  if (droppingWords.length > 0) {
    let currentWord;

    for (let i = 0; i < droppingWords.length; i++) {
      if (!droppingWords[i].typed) {
        currentWord = droppingWords[i];
        break;
      }
    }

    if (currentWord) {
      const nextLetter = currentWord.word.charAt(countLetter);

      if (keyPressed === nextLetter) {
        countLetter++;

        if (countLetter === currentWord.word.length) {
          countLetter = 0;
          currentWord.typed = true;
          lastTypedWord = currentWord;
          character.playing = true;
        }
      }
    }
  }
});
