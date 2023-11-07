//Função que produz um número aleatorio entre dois numeros
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// Iniciar e terminar o jogo (mudar texto do button e zerar scores)
function playStop() {
    // Se o jogo estiver acabado/não começado e a função for chamado...
    if (gameOver) {
        //Muda o Texto para stop
        document.getElementById("playStopButton").textContent = "Stop";
        //Permite começar o jogo
        gameOver = false;
        //Reseta o tempo
        tempo = 0;
        //Cria uma nuvem para o personagem ficar no começo do jogo enquanto estiver parado
        canCloudGo = false;
        //Posiciona o Player no centro-baixo da tela
        character.x = wCanvas / 2 - spriteWitchWidth;
        character.y = hCanvas - spriteWitchHeight;
        //Limpa os conteudos da array das palavras a serem digitadas
        droppingWords.length = 0;
        //Começa a rodar o jogo
        step();

        //Reseta o score
        score = 0;
        document.getElementById("score").textContent = score;
        errors = 0;
        document.getElementById("errors").textContent = errors;
    } else {
        //Se o jogo estiver rodando e a função for chamado...
        //Muda o Texto para play
        document.getElementById("playStopButton").textContent = "Play";
        //Não permite o jogo começar
        gameOver = true;
    }
}

//Array das palavras - [Futuro banco de dados]
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

//Pega o ID e contexto do Canvas para serem Utilizados
let c = document.getElementById("gameboard");
let ctx = c.getContext("2d");

//Pega o tamanho do canvas
const wCanvas = c.width;
const hCanvas = c.height;

//Variaveis de tempo, permissão para jogar e
//Array que guarda as palavras a serem digitadas (wrds)
let tempo = 0;
let gameOver = false;
const droppingWords = [];

//Seta a imagem de fundo
const Bg = new Image();
Bg.src = "images/night_background 1.png"
//ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas);

//Seta as variaveis da nuvem inicial onde o player começa o jogo
//E seu movimento
let canCloudGo = false;
let cloudX;
let cloudY;
let downCount = 0;

//Seta a imagem da nuvem
const cloudSprite = new Image();
cloudSprite.src = "images/cloudSprite.png";

//Seta a imagem da bruxinha parada
const SpriteWitchIdle = new Image();
SpriteWitchIdle.src = "images/SpriteWitchIdle.png";
//ctx.drawImage(SpriteWitchIdle, 0, 0, 32, 42, 0, 0, 32 * 2, 42 * 2);

//Seta a imagem da bruxinha tomando dano
const SpriteWitchDamage = new Image();
SpriteWitchDamage.src = "images/SpriteWitchDamage.png";
//ctx.drawImage(SpriteWitchDamage, 0, 0, 32, 42, 0, 0, 32 * 2, 42 * 2);

//Seta a imagem da bruxinha fazendo magia
const SpriteWitchCharge = new Image();
SpriteWitchCharge.src = "images/SpriteWitchCharge.png";
//ctx.drawImage(SpriteWitchCharge, 0, 0, 48, 48, 0, 0, 32 * 2.5, 42 * 2.5);

//Seta as dimensoes da imagem da bruxinha
const spriteWitchWidth = 32;
const spriteWitchHeight = 48;
//Sendo um especial para ela fazendo magia
const spriteWitchChargeSize = 48;

//Variaveis para as dimensoes da imagem da bruxinha que ira aparecer no canvas
const witchXScale = spriteWitchWidth * 2.5;
const witchYScale = spriteWitchHeight * 2.5;

//Função para desenhar um sprite da bruxinha, contendo o seu frame
//Para uma melhor explicação tem o site https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3
function drawWitchFrame(witchSprite, frameY, canvasX, canvasY) {
    ctx.drawImage(witchSprite, 0, frameY * spriteWitchHeight,
        spriteWitchWidth, spriteWitchHeight, canvasX, canvasY, witchXScale, witchYScale);
}
///Função para desenhar um sprite da bruxinha fazendo magia, contendo o seu frame
function drawWitchChargeFrame(frameY, canvasX, canvasY) {
    ctx.drawImage(SpriteWitchCharge, 0, frameY * spriteWitchChargeSize,
        spriteWitchChargeSize, spriteWitchChargeSize, canvasX, canvasY, witchXScale, witchYScale);
}

//Variaveis para animação de frames
//Quantos frames por segundo
let frameCount = 5;
//Qual o tamanho da animação(Quantos frames tem)
let cycleLoop = 5;
//Frame atual da animação
let currentLoopIndex = 0;

//Objeto do player contendo onde ele ta e se esta digitando/jogando
const character = {
    x: wCanvas / 2 - spriteWitchWidth,
    y: hCanvas - spriteWitchHeight,
    playing: false
}

//Classe que é utilizada para criar objetos Word
//Word tem: a palavra em si, a posição no canvas, se foi digitada e o seu tamanho
class classWord {
    constructor(word, x, y, width) {
        this.word = word;
        this.x = x;
        this.y = y;
        this.typed = false;
        this.width = width;
    }
}

//Função principal do jogo, tem multiplas utilidades como:
//Desenhar e animarno canvas todos os componentes
//Criar e adicionar novas palavras na array wrds
//Checar se o player Perdeu o jogo, está digitando
function step() {
    //Limpa o Canvas e desenha o background
    ctx.clearRect(0, 0, wCanvas, hCanvas);
    ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas);

    //Se o jogo acabou,limpa a tela e sai da função
    if (gameOver) {
        ctx.clearRect(0, 0, wCanvas, hCanvas);
        return;
    }

    //Se tempo chegou em um multiplo de Framecount - Proximo frame
    if (tempo % frameCount == 0) {
        //Vai pro proximo frame da imagem
        currentLoopIndex++;
        //Se ele chegou no ultimo frame, começa do primeiro frame
        if (currentLoopIndex >= cycleLoop) {
            currentLoopIndex = 0;
        }
    }

    //Caso o jogador não tenha nada digitado, ele não está jogando, e o oposto tbm vale
    character.playing = typingWord != "" ? true : false;

    //Se o jogado não estiver jogando, desenhe ele parado
    if (!character.playing) {
        cycleLoop = 5;
        drawWitchFrame(SpriteWitchIdle, currentLoopIndex, character.x, character.y - 105);
    } else {
        //Se não, desenhe ele fazendo magia 
        cycleLoop = 5;
        drawWitchChargeFrame(currentLoopIndex, character.x, character.y - 105);
    }

    //Quando o tempo chegar num tempo especifico, crie uma word
    //e adicione ela na array wrds
    if (tempo % 200 == 0) {
        let word = new classWord(words[getRandomInt(0, words.length - 1)], getRandomInt(20, 480), 0);
        word.width = ctx.measureText(word.word).width;
        droppingWords.push(word);
        console.log(droppingWords);
    }

    //Para cada item que tem na array wrds
    droppingWords.forEach((word, index) => {
        //Se essa word chegar no chão do canvas apague ela do canvas e da array
        if (word.y > (hCanvas + 60)) {
            ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);
            droppingWords.splice(index, 1);
            console.log("Deleted");
            //E se ela não tinha sido digitada, acabe com o jogo
            if (word.typed == false) {
                playStop();
                gameOver = true;
                ctx.clearRect(0, 0, wCanvas, hCanvas);
                return;
            }
        } else {
            //Se ela ainda está no jogo, faz ela cair um pouco
            word.y++;
            //Desenhe a nuvem em baixo da palavra
            ctx.drawImage(cloudSprite, 0, 0, 221, 93, word.x - 15 + ((word.width - 30) / 2), word.y + 6, 64, 38);
            //Se a palavra ainda não foi digitada, desenhe..
            if (word.typed == false) {
                //Um retangulo
                ctx.fillStyle = "rgba(226, 221, 224, 0.7)"
                ctx.fillRect(word.x - 15, word.y + 6, word.width + 30, -25);
                //A word
                ctx.fillStyle = "black";
                ctx.font = "16px Arial";
                ctx.fillText(word.word, word.x, word.y);
                //E a palavra que está sendo digitada pelo player em vermelho em cima da word
                ctx.fillStyle = "red";
                ctx.font = "16px Arial";
                ctx.fillText(typingWord, word.x, word.y);
            } else {
                //Se foi, desenhe mova a posição do player para em cima da nuvem,
                //para ela ser desenhada com o codigo lá em cima
                character.y = word.y + 6;
                character.x = word.x - 20 + ((word.width - 30) / 2);
            }
        }
    });

    //Se o jogador chegou no na parte debaixo do canvas, ele perde e a tela é limpada
    if (character.y > (hCanvas + 60)) {
        playStop();
        gameOver = true;
        ctx.clearRect(0, 0, wCanvas, hCanvas);
        return;
    }

    //Se a nuvem não pode ir
    if (!canCloudGo) {
        //Desenha ela embaixo do player no meio da dela no começo do jogo
        downCount = 0;
        cloudX = character.x;
        cloudY = character.y;
        ctx.drawImage(cloudSprite, 0, 0, 221, 93, character.x + spriteWitchWidth / 8, character.y, 64, 38);
    } else if (canCloudGo && cloudY + (downCount / 3) < (hCanvas + 10)) {
        //Se ela pode ir, desenhe ela com o y indo para baixo a cada vez que a funcão step for chamada
        ctx.drawImage(cloudSprite, 0, 0, 221, 93, cloudX + spriteWitchWidth / 8, cloudY + downCount / 3, 64, 38);
        downCount++;
    }
    //Tempo do jogo avança
    tempo++;
    //Recomeça essa função
    requestAnimationFrame(step);
}

//A palavra que está sendo digitada pelo player
let typingWord = "";
//Caso o player digite uma letra
document.addEventListener("keypress", function (event) {
    //Transforma essa letra em minuscula
    let keyPressed = event.key.toLowerCase();
    //Se for enter faz nada
    if (keyPressed == "enter") {
        keyPressed = "";
    }
    //Adiciona essa letra na ultima posição da string da palavra que esta sendo digitada
    typingWord += keyPressed;
    console.log(typingWord);

    //Se a array wrds não estiver vazia e o jogo estiver rodando
    if (droppingWords.length >= 0 && !gameOver) {
        //Cria o index da palavra que está sendo checada se foi digitada ou não
        let currentWordIndex;

        //Checa item a item da wrds checando se ela foi digitada
        for (let i = 0; i < droppingWords.length; i++) {
            if (!droppingWords[i].typed) {
                //Se ela não foi...
                currentWordIndex = i;
                break;
            }
        }
        //A proxima palavra a ser digitada será essa
        const nextWord = droppingWords[currentWordIndex];

        //Se a palavra que está sendo digitada for igual a palavra
        //que é a proxima a ser digitada
        if (typingWord == nextWord.word) {
            //Reseta a string
            typingWord = "";
            //Essa word/palavra que é a proxima a ser digitada, diz para ela 
            //que a mesma foi digitada
            nextWord.typed = true;
            //droppingWords[currentWordIndex] = nextWord;
            canCloudGo = true;
        }
    }
});
//Caso o player digite "backspace", apague a ultima letra da palavra que está sendo digitada
document.addEventListener("keydown", function (event) {
    let Backkey = event.key.toLowerCase();
    if (Backkey == "backspace") {
        typingWord = typingWord.slice(0, -1);
    }
    console.log(typingWord);
});





//step();