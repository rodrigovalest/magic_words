function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

let c = document.getElementById("gameboard");
let ctx = c.getContext("2d");

const words = [
  "abacate",
  "amor",
  "amigo",
  "animal",
  "ano",
  "azul",
  "casa",
  "celular",
  "cor",
  "dia",
  "emprego",
  "escola",
  "espada",
  "festa",
  "floresta",
  "fogo",
  "frio",
  "gato",
  "homem",
  "mulher"  
];
const boxes = [];
let tempo = 0;


function generateDropping() {
  // Para cada caixa no array, apagar o quadrado antigo e printar um novo
  boxes.forEach((box, index) => {
    // Remover a primeira box dentro de boxes, quando ela chegar no final da página (DETECTAR COLISÃO AQUI)
    if (box.y > 600) {
      boxes.splice(index, 1);
    }
  
    ctx.clearRect(box.x, box.y, box.wordWidth, -40);
    box.y++;
    ctx.fillText(box.word, box.x, box.y);
  });

  // Gerar novo bloco no lado direito sempre quando o tempo for 100
  if (tempo == 100) {
    const x = getRandomInt(330, 480);
    let y = 0;
    let word = "hello";
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(word, x, y);
    let wordWidth = ctx.measureText(word).width;
    boxes.push({ x, y, wordWidth, word });
  }

  // Gerar novo bloco no lado esquerdo sempre quando o tempo for 200 e resetar o tempo
  if (tempo == 200) {
    const x = getRandomInt(30, 200);
    let y = 0;
    let word = "hello";
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(word, x, y);
    let wordWidth = ctx.measureText(word).width;
    boxes.push({ x, y, wordWidth, word });
    tempo = 0;
  }

  tempo++;
  requestAnimationFrame(generateDropping);
}

generateDropping();
