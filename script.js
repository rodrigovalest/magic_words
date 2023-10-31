function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

let c = document.getElementById("gameboard");
let ctx = c.getContext("2d");
const boxes = [];
let tempo = 0;

function generateDropping() {
  // Para cada caixa no array, apagar o quadrado antigo e printar um novo
  boxes.forEach((box) => {
    // Remover a primeira box dentro de boxes, quando ela chegar no final da página (DETECTAR COLISÃO AQUI)
    if (box.y > 600) {
      boxes.splice(0, 1);
    }
  
    ctx.clearRect(box.x, box.y, 100, 20);
    box.y++;
    ctx.fillRect(box.x, box.y, 100, 20);

    console.log(boxes);
  });

  // Gerar novo bloco sempre quando o tempo for 200 e resetar o tempo
  if (tempo == 200) {
    const x = getRandomInt(30, 200);
    let y = 0;
    ctx.fillRect(x, y, 100, 20);
    boxes.push({ x, y });
    tempo = 0;
  }

  tempo++;
  requestAnimationFrame(generateDropping);
}

generateDropping();
