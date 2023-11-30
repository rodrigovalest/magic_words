//Função que produz um número aleatorio entre dois numeros
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//Funçao que inverte uma string
function invert(s) {
    return s.split("").reverse().join("");
}

const fetchCredentials = async () => {
    let playerscore = score;
    let mode = "stairs";
    let credentials = {
        "score": playerscore,
        "mode": mode,
    }

    const response = await fetch("http://localhost:8000/web1-trabfinal/api/match/index.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        alert("Something went wrong. Try again!");
        return;
    }

    const data = await response.json();
    console.log(data);
};

function drawStroked(text, x, y) {
    ctx.font = "80px Jockey One"
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}

function gameOverStep() {
    if (!gameOver) {
        ctx.clearRect(0, 0, wCanvas, hCanvas);
        return;
    }
    document.getElementById("Voltar").style.display = "block";
    document.getElementById("Recomeçar").style.display = "block";

    ctx.clearRect(0, 0, wCanvas, hCanvas);
    console.log("gameOver")
    if (score >= 500) {
        red = red >= 0 ? red - 1 : 0;
        green = green >= 0 ? green - 1 : 0;
        blue = blue >= 0 ? blue - 1 : 0;
        updateBackground(red, green, blue);
    } else {

        updateBackground(166, 191, 207);
        if (tempo % 350 == 0 && !onStarterPosition) {
            let randomCloudSide = parseInt(Math.random() * 2);
            let randomCloud = getRandomInt(0, 5);
            let cloudObj = new Cloud(cloudBGImg[randomCloud][0], cloudBGImg[randomCloud][1], cloudBGImg[randomCloud][2],
                cloudBGImg[randomCloud][3]);
            if (randomCloudSide) {
                cloudObj.x = -256;
                cloudObj.side = 1;
            } else {
                cloudObj.x = wCanvas;
                cloudObj.side = -1;
            }
            cloudArray.push(cloudObj);
        }

    }
    if (red <= 0 && green <= 0 && blue <= 0) {
        bgOpacity = bgOpacity >= 1 ? 1 : bgOpacity + 0.01;
        ctx.globalAlpha = bgOpacity;
        ctx.drawImage(spaceBg, 0, 0, wCanvas, hCanvas, 0, spaceBgY[0], wCanvas, hCanvas);
        ctx.drawImage(spaceBg, 0, 0, wCanvas, hCanvas, 0, spaceBgY[1], wCanvas, hCanvas);
        spaceBgY[0] = spaceBgY[0] >= hCanvas ? -hCanvas : spaceBgY[0] += 1 / 5;
        spaceBgY[1] = spaceBgY[1] >= hCanvas ? -hCanvas : spaceBgY[1] += 1 / 5;
        ctx.globalAlpha = 1;
    }

    ctx.fillRect(0, 0, wCanvas, hCanvas);

    cloudArray.forEach((cloudInst, index) => {
        ctx.drawImage(cloudSpriteBG, cloudInst.imageX, cloudInst.imageY, cloudInst.width, cloudInst.height,
            (cloudInst.x), cloudInst.y - 128, 256, 128);
        cloudInst.x += (0.5 * cloudInst.side);
        cloudInst.y += (getRandomInt(1, 10) / 10);
        if (cloudInst.y >= hCanvas + 60 || cloudInst.x >= wCanvas + 300 || cloudInst.x <= 0 - 300) {
            cloudArray.splice(index, 1);
        }
    })

    ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas, wCanvas / 4, (-hCanvas) + downCount / 3 + 10, wCanvas * 2, hCanvas * 2);
    ctx.drawImage(groundSprite, 0, 0, 600, 90, -20, hCanvas - 90 + downCount / 3, wCanvas + 80, 90);

    drawStroked("Game Over", wCanvas / 5, hCanvas / 3);
    requestAnimationFrame(gameOverStep);
}

function playStop() {

    document.getElementById("Voltar").style.display = "none";
    document.getElementById("Recomeçar").style.display = "none";
    //Permite começar o jogo e Reseta o tempo
    gameOver = false;
    tempo = 0;

    //Cria uma nuvem para o personagem ficar no começo do jogo enquanto estiver parado e Posiciona o Player no centro-baixo da tela
    onStarterPosition = true;
    character.x = wCanvas / 2 - spriteWitchWidth;
    character.y = hCanvas - spriteWitchHeight;

    //Limpa os conteudos da array das palavras a serem digitadas, que estao sendo digitadas e a ultima digitada
    droppingWords.length = 0;
    typingWord = "";
    lastTypedWord = "";

    //Reseta a velocidade das plataformas e a array das nuvens
    platSpeed = 5;
    cloudArray = [];

    //Reseta o score
    score = 0;

    platCount = getRandomInt(1, 3);
    ctx.fillStyle = "lightgray";
    ctx.font = "16px Arial";

    //Começa a rodar o jogo
    step();
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

//Variaveis de tempo, permissão para jogar , Array que guarda as palavras a serem digitadas (wrds)
//A palavra que está sendo digitada pelo player e a ultima palavra que foi digitada pelo player
let tempo = 0;
let gameOver = false;
const droppingWords = [];
let typingWord = "";
let lastTypedWord = "";

//Seta a imagem de fundo
const Bg = new Image();
Bg.src = "../images/Tower.png"
//ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas);

const spaceBg = new Image();
spaceBg.src = "../images/SpaceBg.png";

//Opacidade da BG - utilizado para fazer coisas aparecerem e a posicão iniciais das estrelas,sendo uma em cima da outra
var bgOpacity = 0;
var spaceBgY = [0, - hCanvas];

//Variaveis de Cor e passos(utilizado quando que trocar entre varias cores)
var red = 166, green = 191, blue = 207, steps = 1;

//Funcão para mudar a cor um um valor da RGB e a outra que utiliza de variaveis para criar uma cor RGB
function changeColor(color, increase) {
    return increase ? color + 1 : color - 1;
}
function updateBackground(red, green, blue) {
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
}

//Seta a imagem da nuvem
const cloudSprite = new Image();
cloudSprite.src = "../images/CloudSprite.png";

//Seta as variaveis da situação onde o jogador ainda não saiu do chão/nuvem inicial , a posicão da nuvem inicial, e o seu movimento para baixo
let onStarterPosition = true;
let cloudX;
let groundY;
let downCount = 3;

//Seta a imagem da nuvem que fica passando no Background
const cloudSpriteBG = new Image();
cloudSpriteBG.src = "../images/CloudBG.png";
//ctx.drawImage(cloudSpriteBG, 0, 0, wCanvas, hCanvas);

//Classe que é utilizada para Criar as instancias das nuvens do Background, tendo como variaveis
//imageX, imageY, width, height: Temos varias nuvens dentro da imagem, essas variaveis serao utilizadas para escolehr qual sera utilizada
//x,y,side : utilizada para a movimentacao dessas nuvens
class Cloud {
    constructor(imageX, imageY, width, height) {
        this.imageX = imageX;
        this.imageY = imageY;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.side = 1;
    }
}

//Arrays que apontam para as posicoes da imagem das nuvem para tirar cada nuvem individualmente e 
//a outra array para guardar as futuras instancias das nuvens
const cloudBGImg = [
    [0, 0, 70, 50],
    [70, 0, 70, 50],
    [0, 50, 60, 30],
    [60, 50, 60, 42],
    [0, 80, 60, 50],
    [60, 92, 60, 50],
]
let cloudArray = [];


//Seta a imagem do Chao
const groundSprite = new Image();
groundSprite.src = "../images/Ground.png";

//Seta a imagem da bruxinha parada
const SpriteWitchIdle = new Image();
SpriteWitchIdle.src = "../images/SpriteWitchIdle.png";
//ctx.drawImage(SpriteWitchIdle, 0, 0, 32, 42, 0, 0, 32 * 2, 42 * 2);

//Seta a imagem da bruxinha tomando dano
const SpriteWitchDamage = new Image();
SpriteWitchDamage.src = "../images/SpriteWitchDamage.png";
//ctx.drawImage(SpriteWitchDamage, 0, 0, 32, 42, 0, 0, 32 * 2, 42 * 2);

//Seta a imagem da bruxinha fazendo magia
const SpriteWitchCharge = new Image();
SpriteWitchCharge.src = "../images/SpriteWitchCharge.png";
//ctx.drawImage(SpriteWitchCharge, 0, 0, 48, 48, 0, 0, 32 * 2.5, 42 * 2.5);

const SpriteWitchPuff = new Image();
SpriteWitchPuff.src = "../images/Puff.png";
//ctx.drawImage(SpriteWitchCharge, 0, 0, 48, 48, 0, 0, 32 * 2.5, 42 * 2.5);


//Seta as dimensoes da imagem da bruxinha.Sendo um especial para ela fazendo magia
const spriteWitchWidth = 32;
const spriteWitchHeight = 48;
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
function drawWitchPuff(frameX, canvasX, canvasY) {
    ctx.drawImage(SpriteWitchPuff, frameX * 64, 0,
        64, 72, canvasX, canvasY, 64 * 2, 72 * 2);
}

//Variaveis para animação de frames -Quantos frames por segundo;
//Qual o tamanho da animação(Quantos frames tem); Frame atual da animação
let frameCount = 5;
let cycleLoop = 5;
let currentLoopIndex = 0;

//Objeto do player contendo onde ele ta e se esta digitando/jogando
const character = {
    x: wCanvas / 2 - spriteWitchWidth,
    y: hCanvas - spriteWitchHeight,
    playing: false
}

//Variaveis para tipos de plataformas - Onelife: Mais uma vida; scoreMult & speedMult: Multiplicadores para pontuação e "gravidade";
// powerupTimer: Temporizador para alguns powers; activatePower: Se um power esta ativo;
// types: array com todos os tipos, onde é retirado o tipo, por isso os varios tipos normais, para aumentar a chance de ser um bloco normal
let oneLife = false;
let scoreMult = 1;
let speedMult = 1;
let powerupTimer = 0;
let activatePower = false;
let types = ["2x", "+1", "Shield", "Reverse", "NoVogals", "Death", "Normal", "Normal", "Normal", "Normal"];

//Classe que é utilizada para criar objetos Word
//Word tem: a palavra em si, a posição no canvas, se foi digitada e o seu tamanho, alem de sua velocidade, tipo, cores de sua caixa e texto
class classWord {
    constructor(word, x, y, speed, type) {
        this.word = word;
        this.x = x;
        this.y = y;
        this.typed = false;
        this.width = 0;
        this.id = "";
        this.speed = speed;
        this.type = type;
        this.boxColor = "rgba(226, 221, 224, 0.7)";
        this.textColor = "black";
        this.isPlayerOn = false;
    }
}

//Pre-seta 3 locais distantes entre si utilizados para a criação de plataformas, uma variavel utilizada para escolher o local
//E a velocidade da plataforma
const platPlaces = [(wCanvas / 3) - 70, (wCanvas / 2), (wCanvas / 1.5) + 64];
let platChoosePlace = 0;
let platSpeed = 8;
let platCount = 0;


function step() {

    ctx.fillStyle = "lightgray";
    ctx.font = "16px Arial";
    //Limpa o Canvas e desenha o background
    ctx.clearRect(0, 0, wCanvas, hCanvas);

    //Caso o Player chegue na pontuação 500, ele chega no espaço, ou seja, a cor de fundo que está num azul vai se transformando no preto
    if (score >= 500) {
        red = red >= 0 ? red - 1 : 0;
        green = green >= 0 ? green - 1 : 0;
        blue = blue >= 0 ? blue - 1 : 0;
        updateBackground(red, green, blue);
    } else {

        //Caso não, a cor de fundo será um azul, e cada 6 segundos +/- cria uma nuvem aleatoria, joga um cara ou coroa para decidir
        // Se a nuvem vai nascer em qual lado, e adicione ela na array que fará o processo de animar ela
        updateBackground(166, 191, 207);
        if (tempo % 350 == 0 && !onStarterPosition) {
            let randomCloudSide = parseInt(Math.random() * 2);
            let randomCloud = getRandomInt(0, 5);
            let cloudObj = new Cloud(cloudBGImg[randomCloud][0], cloudBGImg[randomCloud][1], cloudBGImg[randomCloud][2],
                cloudBGImg[randomCloud][3]);
            if (randomCloudSide) {
                cloudObj.x = -256;
                cloudObj.side = 1;
            } else {
                cloudObj.x = wCanvas;
                cloudObj.side = -1;
            }
            cloudArray.push(cloudObj);
        }

    }

    //Quando o fundo Estiver preto, comece a desenhar as estrelas, fazendo elas aparecerem usando a opacidade
    //Funciona tendo duas imagens, que ficam em ciclo descendo uma em cima da outra, se um chega no fim, volta para o começo
    if (red <= 0 && green <= 0 && blue <= 0) {
        bgOpacity = bgOpacity >= 1 ? 1 : bgOpacity + 0.01;
        ctx.globalAlpha = bgOpacity;
        ctx.drawImage(spaceBg, 0, 0, wCanvas, hCanvas, 0, spaceBgY[0], wCanvas, hCanvas);
        ctx.drawImage(spaceBg, 0, 0, wCanvas, hCanvas, 0, spaceBgY[1], wCanvas, hCanvas);
        spaceBgY[0] = spaceBgY[0] >= hCanvas ? -hCanvas : spaceBgY[0] += 1 / 5;
        spaceBgY[1] = spaceBgY[1] >= hCanvas ? -hCanvas : spaceBgY[1] += 1 / 5;
        ctx.globalAlpha = 1;
    }

    //Desenha o Fundo
    ctx.fillRect(0, 0, wCanvas, hCanvas);

    //Para cada Instacia de nuvem na array, crie uma nuvemBG,fazendo que ela vá para direita ou esquerda dependendo do valor de cloudInst.side
    //e para baixo, caso chegue nas extremidades apague da array para parar de animar-la 
    cloudArray.forEach((cloudInst, index) => {
        ctx.drawImage(cloudSpriteBG, cloudInst.imageX, cloudInst.imageY, cloudInst.width, cloudInst.height,
            (cloudInst.x), cloudInst.y - 128, 256, 128);
        cloudInst.x += (0.5 * cloudInst.side);
        cloudInst.y += (getRandomInt(1, 10) / 10);
        if (cloudInst.y >= hCanvas + 60 || cloudInst.x >= wCanvas + 300 || cloudInst.x <= 0 - 300) {
            cloudArray.splice(index, 1);
        }
    })

    //Desenha o Background : Noite estrelada ou castelo
    ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas, wCanvas / 4, (-hCanvas) + downCount / 3 + 10, wCanvas * 2, hCanvas * 2);

    //Quando o tempo chegar num tempo especifico, crie entre 1 e 3 word, com tipo aleatorio, velocidade e local
    //e adicione ela na array wrds, depois cheque o tipo dela e mude as suas cores (e textos)
    if (tempo % 300 == 0) {

        //Há tres possiveis locais onde uma plataforma pode cair, para que cada uma não fique uma em cima da outra
        //No começo do jogo um desses locais é escolhido como o local da plaforma de inicio ...
        platChoosePlace = getRandomInt(0, 2);
        platCount = getRandomInt(1, 4);
        for (let j = 0; j < platCount; j++) {

            //Cria uma instancia de uma palavra
            let word = new classWord(words[getRandomInt(0, words.length - 1)], platPlaces[platChoosePlace], 0, platSpeed / 10,
                types[getRandomInt(0, types.length)]);

            //A cada ciclo,vai aumentando a velocidade que as palavras vão diminuindo em 0.1
            if (platSpeed <= 20) {
                platSpeed += 0.1;
            }

            //... E ja que podem ser criados até 3 plataformas,o seguite codigo funciona para fazer um ciclo, caso aconteça
            //que seja criado tres plataformas, os tres locais serão utilizados
            platChoosePlace = platChoosePlace >= 2 ? 0 : platChoosePlace + 1;

            //Switch que funciona para setar os as palavras de algumas plataformas, como tambem as cores dos textos das plataformas
            switch (word.type) {

                //Em caso que mudam a palavra, afetam diretamente a palavra
                case "Reverse":
                    word.word = invert(word.word);
                    word.textColor = "Maroon";
                    break;
                case "NoVogals":
                    word.word = word.word.replace(/[aeiou]/gi, '');
                    word.textColor = "purple";
                    break;

                case "Death":
                    word.textColor = "red";
                    break;
                case "+1":
                    word.textColor = "green";
                    break;
                case "2x":
                    word.textColor = "SlateGray";
                    break;
                case "Shield":
                    word.textColor = "deeppink";
                    break;
                default:
                    break;
            }

            //Mede o tamanho da palavra para ser escrita no canvas e a palavra é adicionada na array para ser animada no jogo
            word.width = ctx.measureText(word.word).width;
            droppingWords.push(word);
        }
    }

    //Para cada item que tem na array wrds
    droppingWords.forEach((word, index) => {

        //Se essa word chegar no chão do canvas apague ela do canvas e da array
        if (word.y > (hCanvas + 60)) {
            ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);
            droppingWords.splice(index, 1);
            console.log("Deleted");

        } else {

            //Se ela ainda está no jogo, faz ela cair pouco a pouco, e Desenhe a nuvem em baixo da palavra
            word.y += word.speed * speedMult;
            ctx.drawImage(cloudSprite, 0, 0, 221, 93, word.x - 15 + ((word.width - 30) / 2), word.y + 6, 64, 38);

            //Se a palavra ainda não foi digitada, desenhe...
            if (word.typed == false) {
                //Um retangulo
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.roundRect(word.x - 15, word.y + 6, word.width + 30, -25, [20]);
                ctx.stroke();
                ctx.fill();

                //A word
                ctx.fillStyle = word.textColor;
                ctx.font = "16px Jockey One";
                ctx.fillText(word.word, word.x, word.y);

                //E a palavra que está sendo digitada pelo player em vermelho em cima da word
                ctx.fillStyle = "red";
                ctx.font = "16px Jockey One";
                ctx.fillText(typingWord, word.x, word.y);
            }
        }

        //Se o power up for ativo
        if (activatePower) {
            //Se for do typo 2x, dobra os ganhos pontos, se for protecao, diminui a velocidade da gravidade das plataformas
            if (word.type == "2x") {
                scoreMult = 2;
            } else if (word.type == "Shield") {
                speedMult = 0.5;
            }

            //Roda o timer, quando chegar num tempo especifico acaba o power up
            if (powerupTimer < 360) {
                powerupTimer++;
            } else {
                powerupTimer = 0;
                activatePower = 0;
            }
        } else {

            //Se o Power up estiver desligado, seta aos valores normais
            if (word.type == "2x") {
                scoreMult = 1;
            } else if (word.type == "Shield") {
                speedMult = 1;
            }
        }
    });

    //Se a ultima palavra que foi digitada, ou ligue o power up, ou ganhe uma vida
    switch (lastTypedWord.type) {
        case "+1":
            oneLife = true;
            break;
        case "2x":
            activatePower = true;
            break;
        case "Shield":
            activatePower = true;
    }

    //Se o jogador chegou no na parte debaixo do canvas ou digitou a palavra que mata, ele perde e a tela é limpada
    if (character.y > (hCanvas + 60) || lastTypedWord.type == "Death") {

        //Se ele tiver mais uma vida, ele volta para a posicão inicial
        if (oneLife) {
            onStarterPosition = true;
            oneLife = false;
        } else {
            console.log("Acabou");
            //playStop();
            gameOver = true;
            fetchCredentials();
            gameOverStep();
            //ctx.clearRect(0, 0, wCanvas, hCanvas);
            return;
        }
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

    //Se é para estar na posição incial
    if (onStarterPosition) {

        //Desenha o Chão e o coloca o player na parte de baixo no meio da tela
        downCount = 3;
        character.x = wCanvas / 2 - spriteWitchWidth;
        character.y = hCanvas - 70;
        groundY = character.y;
        ctx.drawImage(groundSprite, 0, 0, 600, 90, -20, hCanvas - 90, wCanvas + 80, 90);

    } else if (!onStarterPosition && groundY + (downCount / 3) < (hCanvas + 10)) {

        //Se não comece a levar o chão para baixo e desenhar coloca o player na nuvem no qual ele digitou 
        ctx.drawImage(groundSprite, 0, 0, 600, 90, -20, hCanvas - 90 + downCount / 3, wCanvas + 80, 90);
        downCount++;
        character.y = lastTypedWord.y + 6;
        character.x = lastTypedWord.x - 20 + ((lastTypedWord.width - 30) / 2);
    } else {

        //E se o chão ja sumiu, só coloca o player na nuvem no qual ele digitou
        character.y = lastTypedWord.y + 6;
        character.x = lastTypedWord.x - 20 + ((lastTypedWord.width - 30) / 2);
        downCount++;
    }


    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(10, 10, 110, 20);
    ctx.stroke();
    ctx.fill();

    //A word
    ctx.fillStyle = "black";
    ctx.font = "16px Jockey One";
    ctx.fillText("Pontuação :", 20, 25);
    ctx.fillText(score, 105, 25);

    tempo++;
    requestAnimationFrame(step);
}

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

    //Se a array wrds não estiver vazia e o jogo estiver rodando
    if (droppingWords.length >= 0 && !gameOver) {

        //Para cada item da array
        for (let k = 0; k < droppingWords.length; k++) {

            //Se A palavra que esta sendo digitada é igual a alguma palavra dentro da array & ela nao foi digitada
            if (typingWord == droppingWords[k].word && droppingWords[k].typed != true) {

                //Adiciona a pontuação
                score += 10 * scoreMult;
                //Reseta a string que esta sendo digitada,confirma que essa palavra foi digitada, essa palavra digitada é guardada
                //Ja que ele ira mudar de posicao, ele nao esta mais na posicao inicial
                typingWord = "";
                droppingWords[k].typed = true;
                console.log(lastTypedWord);
                if (lastTypedWord != "" || lastTypedWord != null || lastTypedWord != undefined) {
                    console.log(lastTypedWord, lastTypedWord.speed);
                    lastTypedWord.speed = 10;
                }
                lastTypedWord = droppingWords[k];
                onStarterPosition = false;


            }
        }
    }
});

//Caso o player digite "backspace", apague a ultima letra da palavra que está sendo digitada
document.addEventListener("keydown", function (event) {
    let Backkey = event.key.toLowerCase();
    if (Backkey == "backspace") {
        typingWord = typingWord.slice(0, -1);
    }
});

playStop();