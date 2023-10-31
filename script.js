function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

let c = document.getElementById("gameboard");
let ctx = c.getContext("2d");

const boxes = [];
let tempo = 0;

const character = {
  x: 300,
  y: 560,
  default: true
}
ctx.fillRect(character.x, character.y, 40, 40);

function generateDropping() {
  // Para cada caixa no array, apagar o quadrado antigo e printar um novo
  boxes.forEach((box, index) => {
    // Remover a primeira box dentro de boxes, quando ela chegar no final da página (DETECTAR COLISÃO AQUI)
    if (box.y > 600) {
      boxes.splice(index, 1);
    }

    // Mover character para a ultima caixa caindo
    if (index == 0 && box.y > 400) {
      ctx.clearRect(character.x, character.y, 40, 40);
      character.y = box.y - 40;
      character.x = box.x + 30;
      ctx.fillRect(character.x, character.y, 40, 40);
    }
  
    ctx.clearRect(box.x, box.y, 100, 20);
    box.y++;
    ctx.fillRect(box.x, box.y, 100, 20);
  });

  // Gerar novo bloco no lado direito sempre quando o tempo for 100
  if (tempo == 100) {
    const x = getRandomInt(330, 480);
    let y = 0;
    ctx.fillRect(x, y, 100, 20);
    boxes.push({ x, y });
  }

  // Gerar novo bloco no lado esquerdo sempre quando o tempo for 200 e resetar o tempo
  if (tempo == 200) {
    const x = getRandomInt(30, 200);
    let y = 0;
    ctx.fillRect(x, y, 100, 20);
    boxes.push({ x, y });
    tempo = 0;
  }

  if (boxes[0]?.y < 50) {
    if (character.default == false) {
      box
    }
  }

  tempo++;
  requestAnimationFrame(generateDropping);
}

generateDropping();
