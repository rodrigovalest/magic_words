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

// Iniciar e terminar o jogo (mudar texto do button e zerar scores)
function playStop() {

    // Se o jogo estiver acabado/não começado e a função for chamado...
    if (gameOver) {

        //Muda o Texto para stop
        document.getElementById("playStopButton").textContent = "Stop";
        
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
        //Id - Modo de jogo onde so pode digitar a proxima linha de palavras
        // idcount = 0;
        // idcheck = 0;

        //Reseta o score
        score = 0;
        document.getElementById("score").textContent = score;
        // errors = 0;
        // document.getElementById("errors").textContent = errors;

        //Começa a rodar o jogo
        step();
    } else {
        //Se o jogo estiver rodando e a função for chamado - Limpa a tela,muda o Texto para play, e termina o jogo 
        ctx.clearRect(0, 0, wCanvas, hCanvas);
        document.getElementById("playStopButton").textContent = "Play";
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

//Variaveis de tempo, permissão para jogar , Array que guarda as palavras a serem digitadas (wrds)
//A palavra que está sendo digitada pelo player e a ultima palavra que foi digitada pelo player
let tempo = 0;
let gameOver = true;
const droppingWords = [];
let typingWord = "";
let lastTypedWord = "";

//Seta a imagem de fundo
const Bg = new Image();
Bg.src = "images/night_background 1.png"
//ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas);

//Seta a imagem da nuvem
const cloudSprite = new Image();
cloudSprite.src = "images/cloudSprite.png";

//Seta as variaveis da nuvem inicial onde o player começa o jogo E seu movimento
let onStarterPosition = true;
let cloudX;
let cloudY;
let downCount = 0;

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

//let idcount = 0; //Usado Para outro tipo de jogo
//let idcheck = 0;

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
        //this.id = id;
        this.speed = speed;
        this.type = type;
        this.boxColor = "rgba(226, 221, 224, 0.7)";
        this.textColor = "black";
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

    //Quando o tempo chegar num tempo especifico, crie entre 1 e 3 word, com x,speed e tipo aleatorio
    //e adicione ela na array wrds, depois cheque o tipo dela e mude as suas cores (e textos)
    if (tempo % 300 == 0) {
        for (let j = 0; j < getRandomInt(1, 3); j++) {
            let word = new classWord(words[getRandomInt(0, words.length - 1)], getRandomInt(20, 480), 0, getRandomInt(5, 10) / 10,
                types[getRandomInt(0, types.length)]);
            word.width = ctx.measureText(word.word).width;
            switch (word.type) {
                case "Reverse":
                    word.word = invert(word.word);
                    word.boxColor = "Black";
                    word.textColor = "White";
                    break;
                case "NoVogals":
                    word.word = word.word.replace(/[aeiou]/gi, '');
                    word.boxColor = "green";
                    word.textColor = "blue";
                    break;
                case "Death":
                    word.boxColor = "red";
                    word.textColor = "black";
                    break;
                case "+1":
                    word.boxColor = "white";
                    word.textColor = "green";
                    break;
                case "2x":
                    word.boxColor = "yellow";
                    word.textColor = "black";
                    break;
                case "Shield":
                    word.boxColor = "lightblue";
                    word.textColor = "gray";
                    break;
                default:
                    break;
            }

            droppingWords.push(word);
            console.log(droppingWords);
        }
        //idcount++;
    }

    //Para cada item que tem na array wrds
    droppingWords.forEach((word, index) => {

        //Se essa word chegar no chão do canvas apague ela do canvas e da array
        if (word.y > (hCanvas + 60)) {
            ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);
            droppingWords.splice(index, 1);
            console.log("Deleted");
            //E se ela não tinha sido digitada, acabe com o jogo - Modo Hard/Impossivel - Outro modo de jogo
            // if (word.typed == false) {
            //     playStop();
            //     gameOver = true;
            //     ctx.clearRect(0, 0, wCanvas, hCanvas);
            //     return;
            // }
        } else {

            //Se ela ainda está no jogo, faz ela cair pouco a pouco, e Desenhe a nuvem em baixo da palavra
            word.y += word.speed * speedMult;
            ctx.drawImage(cloudSprite, 0, 0, 221, 93, word.x - 15 + ((word.width - 30) / 2), word.y + 6, 64, 38);

            //Se a palavra ainda não foi digitada, desenhe...
            if (word.typed == false) {
                //Um retangulo
                ctx.fillStyle = word.boxColor;
                ctx.fillRect(word.x - 15, word.y + 6, word.width + 30, -25);

                //A word
                ctx.fillStyle = word.textColor;
                ctx.font = "16px Arial";
                ctx.fillText(word.word, word.x, word.y);

                //E a palavra que está sendo digitada pelo player em vermelho em cima da word
                ctx.fillStyle = "red";
                ctx.font = "16px Arial";
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
            playStop();
            gameOver = true;
            ctx.clearRect(0, 0, wCanvas, hCanvas);
            return;
        }
    }

    //Se é para estar na posição incial
    if (onStarterPosition) {

        //Desenha a nuvem e o coloca o player na parte de baixo no meio da tela
        downCount = 0;
        character.x = wCanvas / 2 - spriteWitchWidth;
        character.y = hCanvas - spriteWitchHeight;
        cloudX = character.x;
        cloudY = character.y;
        ctx.drawImage(cloudSprite, 0, 0, 221, 93, character.x + spriteWitchWidth / 8, character.y, 64, 38);

    } else if (!onStarterPosition && cloudY + (downCount / 3) < (hCanvas + 10)) {

        //Se não comece a levar a nuvem para baixo e desenhar coloca o player na nuvem no qual ele digitou
        ctx.drawImage(cloudSprite, 0, 0, 221, 93, cloudX + spriteWitchWidth / 8, cloudY + downCount / 3, 64, 38);
        downCount++;
        character.y = lastTypedWord.y + 6;
        character.x = lastTypedWord.x - 20 + ((lastTypedWord.width - 30) / 2);
    } else {

        //E se a nuvem ja sumiu, só coloca o player na nuvem no qual ele digitou
        character.y = lastTypedWord.y + 6;
        character.x = lastTypedWord.x - 20 + ((lastTypedWord.width - 30) / 2);
    }

    //Tempo do jogo avança e Recomeça essa função
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
    //console.log(typingWord);

    //Se a array wrds não estiver vazia e o jogo estiver rodando
    if (droppingWords.length >= 0 && !gameOver) {
        
        //Para cada item da array
        for (let k = 0; k < droppingWords.length; k++) {
            //console.log(idcheck);
            //Se A palavra que esta sendo digitada é igual a alguma palavra dentro da array & ela nao foi digitada
            if (typingWord == droppingWords[k].word && droppingWords[k].typed != true) {
                //if (droppingWords[k].id == idcheck) { - Outro modo de jogo

                //Adiciona a pontuação
                score += 10 * scoreMult;
                document.getElementById("score").textContent = score;

                //Reseta a string que esta sendo digitada,confirma que essa palavra foi digitada, essa palavra digitada é guardada
                //Ja que ele ira mudar de posicao, ele nao esta mais na posicao inicial
                typingWord = "";
                droppingWords[k].typed = true;
                lastTypedWord = droppingWords[k];
                onStarterPosition = false;

                //idcheck++;
                //}
            }

        }

        //Modo Alternativo de Checagem para outro modo
        // //Cria o index da palavra que está sendo checada se foi digitada ou não
        // let currentWordIndex;
        // //Checa item a item da wrds checando se ela foi digitada
        // for (let i = 0; i < droppingWords.length; i++) {
        //     if (!droppingWords[i].typed) {
        //         //Se ela não foi...
        //         currentWordIndex = i;
        //         break;
        //     }
        // }
        // //A proxima palavra a ser digitada será essa
        // const nextWord = droppingWords[currentWordIndex];

        // //Se a palavra que está sendo digitada for igual a palavra
        // //que é a proxima a ser digitada
        // if (typingWord == nextWord.word) {
        //     //Reseta a string
        //     typingWord = "";
        //     //Essa word/palavra que é a proxima a ser digitada, diz para ela 
        //     //que a mesma foi digitada
        //     nextWord.typed = true;
        //     //droppingWords[currentWordIndex] = nextWord;
        //     onStarterPosition = true;
        // }
    }
});
//Caso o player digite "backspace", apague a ultima letra da palavra que está sendo digitada
document.addEventListener("keydown", function (event) {
    let Backkey = event.key.toLowerCase();
    if (Backkey == "backspace") {
        typingWord = typingWord.slice(0, -1);
    }
    //console.log(typingWord);
});

