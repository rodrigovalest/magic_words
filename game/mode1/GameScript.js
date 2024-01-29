//// Como deve Funcionar o Jogo

/// Loop Principal
// Cada Frame do jogo é uma ativação da funcao "step", e no fim da dela ela chama ela mesma de volta, sendo uma funcao ciclica
// Ela pode ser dividida em tres partes, o background, o persoagem e as palavras
// A cada fim do loop, é adicionado um ao "tempo", que funciona como o tempo global

/// Começar e Terminar o Jogo
// Quando se começa o Jogo, é chamada a funcao "playStop", no qual seta as variaveis para valor inicial para começar o jogo
// A funcao "gameover" é parecido com a funcao "step" em questao dela ser ciclica, e tambem que ela possui a parte background 
// sendo a mesma do "step", mas quando o jogo está começando ela para de ser ativada, ela ativa os botoes e desenha os pontos

/// Sistemas
// Palavras
// Existe uma classe chamada "word", com varias variaveis que alteram e diferenciam ela de outras, em um certo momento,
// ditado pela variavel "platCool", são criadas [3] "words", cada uma diferente da outra, se igualando somente no id
// no qual é alterado para o proximo conjuntos de "words". Essas "words" então são colocadas numa array, "droppingwords",
// e num frame, o jogo passara por todas as "words" dentro da array checando a sua posicao e desenhando no canvas.

// Digitacao
// Nesse modo de Jogo, temos o id da palavra, ele existe para obrigar o player a so digitar uma palavra por "Degrau"
// "Degrau" é simplesmente o nome que dei para o conjunto das tres plataformas que sao criadas ao mesmo tempo,
// elas sao criadas com o mesmo id, e na hora de digitar é conferido se o id que o player tem e o id da plataforma sao iguais
// O id do player (idcheck) começa do 0, e a cada geraçao de degrau ele aumenta em um, e o degrau é 
// Ex:  Começo do jogo -> idcount = 0 -> Criasse primeiro Degrau,idcount = 0, idcount vira 1
//      Criasse segundo Degrau,idcount = 1, idcount vira 2 e assim em diante
//      No Começo do jogo o jogador podeira digitar a palavra de qualquer degrau, indepedente do id, mas nesse caso vamos ignorar essa regra
//      O idcheck está como 0, caso o jogar quissesse digitar uma palavra do degrau com idcount 1, ele nao iria conseguir
//      Mas caso digitasse do degrau de idcount 0, iria funcionar, e seu idcheck seria o idcount da palavra digitada + 1
//      Para nao dar problemas no comeco do jogo ou na ressureicao

// Personagem
// - Animação
// A cada 5 frames do jogo, o proximo frame de animacao é acionado, e quando chega no quinto frame, o proximo voltara ao primeiro.
// - Posicao
// A tres estados onde um player pode estar : Na posicao inicial, jogando ou revivendo. Caso ele estiver jogando, a sua
// posicao será a posicao da "word" que ele digitou por ultimo ("lastTypedWord"). Se não, a posicao dele será na parte 
// de baixo da tela. Enquanto nao estiver jogando, a checa se ele esta na posição inicial (com terra embaixo) ou se reviveu,
// desenhando em baixo a imagem certa, isso conta tambem com o tempo que é necessario digitar uma palavra

// Background
// - Torre, Chao e nuvem pisante
// Diferença entre variaveis : gravity , down count e GroundY
// Os valores dos dois vao aumentando no momento em que o player começa a jogar, só que os dois afetam "objetos" diferentes
// DownCount afeta a torre e o chao, enquanto gravity afeta e nuvem pisante enquanto o player estiver jogando ou revivendo respectivamente, 
// essa diferença é feita para caso o player mova, a variavel gravidade possa voltar a posicao inicial sem afetar a posicao da torre e do chao
// Agora o GroundY é usado como base da posicao inicial para checar se é necessario desenhar o chao e a nuvem de acordo de uma funcao
// groundY + (gravity / 3) < (hCanvas + 100) -> Se o valor base mais o quanto que ele desceu é maior que a posicao mais baixa mais 100, ele para de desenhar

// - Cor de Fundo e Espaço
// A cor de fundo será um azul, usando fillRect para "pintar" o fundo, e para fazer o sentimento de animacao, apaga-se a "tela", 
// e pinta tudo novamente com a posicao de todos os objetos alterados
// Caso o Player chegue na pontuação 500, ele chega no espaço, ou seja, a cor de fundo que está num azul vai se transformando no preto
// Quando o fundo Estiver preto, comece a desenhar as estrelas, fazendo elas aparecerem usando a opacidade
// Funciona tendo duas imagens, que ficam em ciclo descendo uma em cima da outra, se um chega no fim, volta para o começo

// - Nuvens do Background
// Existe uma classe nuvem de background, no qual as variaveis lidam com o tamanho das diferentes imagens de nuvens, alem de lidar com a posicao,
// Existe tembem uma array que contem arrays, e nesses arrays possuem as informaçoes que devem ser colocadas na criacao de uma nova nuvem, 
// para que possa criar uma nuvem com uma imagem diferente, a criacao funciona paracido com a criacao de "words",
// A cada 6 segundos +/- (na vida real, no jogo seria 350 frames) cria uma nuvem aleatoria, aletoriamente decidindo-se em qual
// lado a nuvem vai nascer, e colocando-se essa nuvem numa pilha, e cada frame é desenhado cada nuvem na tela

// Começo da Programacao

function CellKeyboard() {
    document.getElementById("mobiletext").focus();
}


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

//Funçao que randomiza uma string
function randomString(s) {
    return s.split("").sort(function () { return 0.5 - Math.random() }).join("");
}


// Escreve no canvas um texto com outline, podendo mudar o tamanho, a cor e a fonte, junto com o tamanho da linha
function drawStroked(text, x, y, font, stroke, fill, line) {
    ctx.font = font;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = line;
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
}

// Funcao que o volume dos audios de acordo com o valor do componente range no html
function SetVolume(value) {
    document.getElementById("volume_icon").textContent = "volume_up";
    idle_music.volume = (value / 100);
    pause_music.volume = (value / 100);
    gameover_music.volume = (value / 100);
    magic_sound.volume = (value / 100);
    muted = false;
}

// Funcao que caso nao esteja mutado guarda o valor do volume, muda o volume para zero, e muda o visual do componente
// Caso esteja, muda o visual e seta o volume para o valor guardado 
function mute() {
    if (!muted) {
        volume_value = document.getElementById("vol-control").value;
        SetVolume(0);
        document.getElementById("volume_icon").textContent = "volume_off";
        document.getElementById("vol-control").value = 0;
        muted = true;
    } else {
        document.getElementById("vol-control").value = volume_value
        SetVolume(volume_value);
    }

}

//Quando o jogo acabar, ele roda essa função ciclica
function gameOverStep() {

    // Se o jogo reniciou apague a tela e saia da função
    if (!gameOver) {
        ctx.clearRect(0, 0, wCanvas, hCanvas);
        return;
    }
    // Adicione O "GameOver" na tela com os botoes e tire o item da pontuação do canto
    document.getElementById("gameover").style.display = "block";
    document.getElementById("textscore").style.display = "none";
    document.getElementById("powers").style.display = "none";

    // Quando o jogo acabar, a musica da jogatina é pausada e "rebobinada"
    idle_music.pause();
    idle_music.currentTime = 0;

    // Começo do Frame para desenhar a tela, apagando a tela
    ctx.clearRect(0, 0, wCanvas, hCanvas);

    // Se o Jogador passou dos 500 de pontuação, escurece a tela, mesmo que tenha perdido
    if (score >= 500) {
        red = red >= 0 ? red - 1 : 0;
        green = green >= 0 ? green - 1 : 0;
        blue = blue >= 0 ? blue - 1 : 0;
        updateBackground(red, green, blue);
    } else {
        // Senao, desenhe a tela de azul e adicione uma nuvem na pilha de nuvens
        updateBackground(red, green, blue);
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

    // Desenha o fundo com a cor setada anteriormente, sendo azul ou preto
    ctx.fillRect(0, 0, wCanvas, hCanvas);

    // Se a tela ta preta, vai aumentando o alpha da imagem das estrelas para que ela apareça
    if (red <= 0 && green <= 0 && blue <= 0) {
        bgOpacity = bgOpacity >= 1 ? 1 : bgOpacity + 0.01;
        ctx.globalAlpha = bgOpacity;
        ctx.drawImage(spaceBg, 0, 0, wCanvas, hCanvas, 0, spaceBgY[0], wCanvas, hCanvas);
        ctx.drawImage(spaceBg, 0, 0, wCanvas, hCanvas, 0, spaceBgY[1], wCanvas, hCanvas);
        spaceBgY[0] = spaceBgY[0] >= hCanvas ? -hCanvas : spaceBgY[0] += 1 / 5;
        spaceBgY[1] = spaceBgY[1] >= hCanvas ? -hCanvas : spaceBgY[1] += 1 / 5;
        ctx.globalAlpha = 1;
    }

    // Para cada nuvem da pilha, desenhe ela indo para a direcao oposta que ela nasceu
    cloudArray.forEach((cloudInst, index) => {
        ctx.drawImage(cloudSpriteBG, cloudInst.imageX, cloudInst.imageY, cloudInst.width, cloudInst.height,
            (cloudInst.x), cloudInst.y - 128, 256, 128);
        cloudInst.x += (0.5 * cloudInst.side);
        cloudInst.y += (getRandomInt(1, 10) / 10);
        if (cloudInst.y >= hCanvas + 60 || cloudInst.x >= wCanvas + 300 || cloudInst.x <= 0 - 300) {
            cloudArray.splice(index, 1);
        }
    })

    // Desenhe o castelo e o chao, mesmo que nao apareçam
    ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas, wCanvas / 4, (-hCanvas) + downCount / 3 + 10, wCanvas * 2, hCanvas * 2);
    ctx.drawImage(groundSprite, 0, 0, 600, 90, -20, hCanvas - 90 + downCount / 3, wCanvas + 80, 90);

    // Desenhe o Gameover e mais a pontuação final no meio da tela
    drawStroked("Game Over", wCanvas / 10, hCanvas / 3, "80px Fugaz One", 'black', 'white', 8);
    drawStroked("Pontuação Final : " + score, wCanvas / 7, hCanvas / 1.7, "36px Fugaz One", 'black', 'white', 8);

    // Comeaca um novo frame (chama a funcao de novo)
    requestAnimationFrame(gameOverStep);
}

// Preparação para começar o jogo
function playStop() {

    // Por causa do google, a musica so pode comecar quando hover pelo menos um clique na pagina, por isso
    // o jogo so pode comecar quando o player clicar no botao de comecar ( Para nao dar problemas do jogo comecar por outros meios)
    if (game_start) {
        // Faz desaparecer os botoes, ativa o pontuação do canto e coloca ela no 0
        document.getElementById("gameover").style.display = "none";
        document.getElementById("game_start").style.display = "none";
        document.getElementById("textscore").style.display = "flex";
        document.getElementById("powers").style.display = "flex";
        document.getElementById("score").textContent = 0;

        // Caso possa tocar musica, toque e rebobine a musica de gameover
        if (can_music_play) {
            idle_music.play();
            gameover_music.pause();
            gameover_music.currentTime = 0;
        }

        //Permite começar o jogo e Reseta o tempo
        gameOver = false;
        tempo = 0;

        //Variaveis do personagem para que ele fique na parte debaixo da tela com a terra embaixo dele
        onStarterPosition = true;
        revived = false;
        is_playing = false;
        downCount = 1;
        gravity = 1;
        timer_to_go = 0;
        character.x = wCanvas / 2 - spriteWitchWidth;
        character.y = hCanvas - spriteWitchHeight;

        //Limpa os conteudos da array das palavras a serem digitadas, que estao sendo digitadas e a ultima digitada
        droppingWords.length = 0;
        typingWord = "";
        lastTypedWord = "";

        //Id - Modo de jogo onde so pode digitar a proxima linha de palavras
        idcount = 0;
        idcheck = 0;

        //Reseta a velocidade das plataformas, o tempo no qual elas aparecem, a quantidade e a array das nuvens
        platSpeed = 5;
        platCool = 699;
        platCount = 3;
        cloudArray = [];

        //Reseta o score e power ups
        score = 0;
        shield = false;
        double_points = false;
        oneLife = false;
        powerupTimer = [0, 0];
        red = 135, green = 206, blue = 250, steps = 1;

        // Seta a Fonte padrão (para não dar problema no tamanho das palavras)
        ctx.fillStyle = "lightgray";
        ctx.font = "16px Blinker";

        //Começa a rodar o jogo
        step();
    }
}

// Pausar
function pause() {
    // Se o jogo Comecou e se esta pausado, despause, pare a musica de pause, muda a cor do botao, tira a tela de pause
    // E comeca ou a musica normal ou de game over e comeca o step, se foi game over, gameoverstep 
    if (game_start) {
        if (paused) {
            paused = false
            pause_music.pause();
            document.getElementById("pause_icon").textContent = "pause"
            document.getElementById("pause").style.backgroundColor = "white";
            document.getElementById("pause").style.color = "black";
            document.getElementById("pause_screen").style.display = "none";
            if (!gameOver && can_music_play) {
                idle_music.play();
                step();
            } else if (gameOver && can_music_play) {
                gameover_music.play();
                gameOverStep();
            }
        } else {
            // Se nao pause o jogo, muda o botao, pause as musicas e comeca a musica de pause
            paused = true;
            document.getElementById("pause_icon").textContent = "play_arrow"
            document.getElementById("pause").style.backgroundColor = "black";
            document.getElementById("pause").style.color = "white";
            document.getElementById("pause_screen").style.display = "flex";
            if (!gameOver) {
                idle_music.pause();
            } else {
                gameover_music.pause();
            }
            if (can_music_play) {
                pause_music.play();
            }
        }
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

//Pega o ID e contexto do Canvas para serem Utilizadose o tamanho do canvas
let c = document.getElementById("gameboard");
let ctx = c.getContext("2d");
const wCanvas = c.width;
const hCanvas = c.height;

//Variaveis de tempo, permissão para jogar , Array que guarda as palavras a serem digitadas (wrds)
//A palavra que está sendo digitada pelo player e a ultima palavra que foi digitada pelo player, alem do pause
let tempo = 0;
let gameOver = false;
const droppingWords = [];
let typingWord = "";
let lastTypedWord = "";
let paused = false;
let game_start = false;

//Audio
let can_music_play = true;
const idle_music = document.getElementById("idle_music");
const gameover_music = document.getElementById("gameover_music");
const pause_music = document.getElementById("pause_music");
let muted = false;
let volume_value = 100;
const magic_sound = document.getElementById("magic_sound");

//Seta a imagem da Torre
const Bg = new Image();
Bg.src = "../images/Tower.png"

// imagem do espaço
const spaceBg = new Image();
spaceBg.src = "../images/SpaceBg.png";

//Opacidade da imagem do espaço, utilizado para fazer elas aparecerem 
// Posiçao y das duas imagens do espaço, sendo ja setado as posicão iniciais das estrelas,sendo uma em cima da outra
// Utilizado para fazer o espaço se mover de cima para baixo
var bgOpacity = 0;
var spaceBgY = [0, - hCanvas];

//Variaveis de Cor iniciais e funcao para transormar em fillstyle
var red = 135, green = 206, blue = 250, steps = 1;
function updateBackground(red, green, blue) {
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
}

//Seta as variaveis da situação onde o jogador ainda não saiu do chão/nuvem inicial , a posicão da nuvem inicial, e o seu movimento para baixo
let onStarterPosition = true;
let revived = false;
let cloudX;
let groundY;
let downCount = 3;
let timer_to_go = 0;
let is_playing = false;
let gravity = 1;

//Seta a imagem da nuvem que fica passando no Background
const cloudSpriteBG = new Image();
cloudSpriteBG.src = "../images/CloudBG.png";

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

//Seta a imagem da nuvem pisavel
const cloudSprite = new Image();
cloudSprite.src = "../images/CloudSprite.png";

//Seta a imagem da bruxinha parada
const SpriteWitchIdle = new Image();
SpriteWitchIdle.src = "../images/SpriteWitchIdle.png";

//Seta a imagem da bruxinha fazendo magia
const SpriteWitchCharge = new Image();
SpriteWitchCharge.src = "../images/SpriteWitchCharge.png";

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
        spriteWitchChargeSize, spriteWitchChargeSize, canvasX - 20, canvasY - 5, witchXScale * 1.5, witchYScale);
}

const SpritePuff = new Image();
SpritePuff.src = "../images/puff_5.png"
let puff_timer = -1;
let can_puff = false;

function drawPuff(frameX, canvasX, canvasY) {
    ctx.drawImage(SpritePuff, frameX * 32, 0, 32, 32, canvasX, canvasY, 32 * 4, 32 * 4);
}

//Variaveis para animação de frames -Quantos frames por segundo;
//Qual o tamanho da animação(Quantos frames tem); Frame atual da animação
let frameCount = 5;
let cycleLoop = 5;
let currentLoopIndex = 0;

//Objeto do player contendo onde ele ta e se esta digitando
const character = {
    x: wCanvas / 2 - spriteWitchWidth,
    y: hCanvas - spriteWitchHeight,
    playing: false
}

// Variaveis de id, usado para garantir que o player so possa escolhe a nuvem que esteja na fileira de nuvens acima dele
let idcount = 0;
let idcheck = 0;

//Variaveis para tipos de plataformas - Onelife: Mais uma vida; scoreMult & speedMult: Multiplicadores para pontuação e "gravidade";
// powerupTimer: Temporizador para powers, um sendo o shield, o outro de pontuacao
// types: array com todos os tipos, onde é retirado o tipo, por isso os varios tipos normais, para aumentar a chance de ser um bloco normal
// Variaveis para checar se o shield ou dobro de pontos esta ativo
let oneLife = false;
let shield = false;
let double_points = false;
let scoreMult = 1;
let speedMult = 1;
let powerupTimer = [0, 0];
let activatePower = false;
let types = ["2x", "+1", "Shield", "Shuffle", "NoVogals", "Death", "Normal", "Normal", "Normal", "Normal"];

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
        this.textColor = "white";
        this.isPlayerOn = false;
    }
}

//Pre-seta 3 locais distantes entre si utilizados para a criação de plataformas, uma variavel utilizada para escolher o local
//A velocidade da plataforma e o tempo que cada plataforma aparece, setado no 699 pois o conter inicial é ativado no 700
const platPlaces = [(wCanvas / 3) - 70, (wCanvas / 2), (wCanvas / 1.5) + 64];
let platChoosePlace = 0;
let platSpeed = 5;
let platCount = 0;
let platCool = 699;

// Frame do Jogo (funcao ciclica)
function step() {

    // Se o jogo esta pausado ou terminado, saia da funcao
    if (paused || gameOver) {
        return;
    }

    // Seta a Fonte padrão (para não dar problema no tamanho das palavras)
    ctx.fillStyle = "lightgray";
    ctx.font = "16px Blinker";

    //Limpa o Canvas para desenhar o background
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
        updateBackground(red, green, blue);
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

    //Desenha o Fundo
    ctx.fillRect(0, 0, wCanvas, hCanvas);

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

    //Desenha o Background castelo descendo com o down Count e quando passa do damanho do canvas x3, para de desenhar
    if (groundY + (downCount / 3) < (hCanvas * 3)) {
        ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas, wCanvas / 4, (-hCanvas) + downCount / 3 + 10, wCanvas * 2, hCanvas * 2);
    }


    // (1101 - (Math.floor(platSpeed) * 100)) - Pequena funcao que leva em conta a velocidade das plataformas para a criacao de plataformas
    //Quando o tempo chegar num tempo especifico, crie entre 1 e 3 word, com tipo aleatorio, velocidade e local
    //e adicione ela na array wrds, depois cheque o tipo dela e mude as suas cores (e textos)
    if (platCool >= (1101 - (Math.floor(platSpeed) * 100))) {

        //Há tres possiveis locais onde uma plataforma pode cair, para que cada uma não fique uma em cima da outra
        //No começo do jogo um desses locais é escolhido como o local da plaforma de inicio ...
        platChoosePlace = getRandomInt(0, 2);

        for (let j = 0; j < platCount; j++) {

            //Cria uma instancia de uma palavra
            let word = new classWord(words[getRandomInt(0, words.length - 1)], platPlaces[platChoosePlace], 0, platSpeed / 10,
                types[getRandomInt(0, types.length)]);

            //A cada ciclo,vai aumentando a velocidade que as palavras vão descendo
            if (platSpeed <= 10) {
                platSpeed += 0.05;
            }

            //... E ja que podem ser criados até 3 plataformas,o seguite codigo funciona para fazer um ciclo, caso aconteça
            //que seja criado tres plataformas, os tres locais serão utilizados
            platChoosePlace = platChoosePlace >= 2 ? 0 : platChoosePlace + 1;

            //Switch que funciona para setar os as palavras de algumas plataformas, como tambem as cores dos textos das plataformas
            switch (word.type) {
                //Em caso que mudam a palavra, afetam diretamente a palavra
                case "Shuffle":
                    word.word = invert(word.word);
                    word.textColor = "violet";
                    break;
                case "NoVogals":
                    word.word = randomString(word.word);
                    word.textColor = "Salmon";
                    break;
                case "Death":
                    word.textColor = "red";
                    break;
                case "+1":
                    word.textColor = "limegreen";
                    break;
                case "2x":
                    word.textColor = "yellow";
                    break;
                case "Shield":
                    word.textColor = "cyan";
                    break;
                default:
                    break;
            }

            //Mede o tamanho da palavra para ser escrita no canvas e a palavra é adicionada na array para ser animada no jogo
            // Seta o id da palavra e coloca ela na pilha das palavras que vao cair
            word.width = ctx.measureText(word.word).width;
            word.id = idcount;
            droppingWords.push(word);
        }

        // Aumenta o id e reinicia o timer para criar uma nova plataforma
        idcount++;
        platCool = 0;
    }

    //Para cada item que tem na array wrds
    droppingWords.forEach((word, index) => {

        //Se essa word chegar no chão do canvas apague ela do canvas e da array
        if (word.y > (hCanvas + 60)) {
            ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);
            droppingWords.splice(index, 1);
        } else {

            //Se ela ainda está no jogo, faz ela cair pouco a pouco, e Desenhe a nuvem em baixo da palavra
            word.y += word.speed * speedMult;
            ctx.drawImage(cloudSprite, 0, 0, 221, 93, word.x - 15 + ((word.width - 30) / 2), word.y + 6, 64, 38);

            //Se a palavra ainda não foi digitada, desenhe...
            if (word.typed == false) {
                //Um retangulo em volta da word
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.roundRect(word.x - 15, word.y + 6, word.width + 30, -25, [20]);
                ctx.stroke();
                ctx.fill();

                //A word em si
                drawStroked(word.word, word.x, word.y, "16px Blinker", 'black', word.textColor, 4);

                //E a palavra que está sendo digitada pelo player em vermelho em cima da word
                drawStroked(typingWord, word.x, word.y, "16px Blinker", 'black', 'gray', 4);
            }
        }

        // Se o id da ultima palavra digitada for igual a id da word, sendo que ela nao foi digitada, aumente a sua velocidade para desaparecer da tela
        if (lastTypedWord.id == word.id && word.typed != true) {
            word.speed = 15;
        }
    });

    // Se possui power up, mostra no GUI e faz aleteracao, se nao volte ao normal
    if (shield) {
        document.getElementById("shield").style.display = "block";
        speedMult = 0.5;
    } else {
        speedMult = 1;
        document.getElementById("shield").style.display = "none";
    }

    if (double_points) {
        document.getElementById("duas_vezes").style.display = "block";
        scoreMult = 2;
    } else {
        scoreMult = 1;
        document.getElementById("duas_vezes").style.display = "none";
    }

    // Timers dos powerups
    if (powerupTimer[0] > 0) {
        powerupTimer[0]--;
    } else {
        shield = false;
    }
    if (powerupTimer[1] > 0) {
        powerupTimer[1]--;
    } else {
        double_points = false;
    }

    // Liga o Gui da vida
    document.getElementById("vida").style.display = oneLife ? "block" : "none";

    //Se tempo chegou em um multiplo de Framecount - Proximo frame
    if (tempo % frameCount == 0) {

        //Vai pro proximo frame da imagem
        currentLoopIndex++;

        //Se ele chegou no ultimo frame, começa do primeiro frame
        if (currentLoopIndex >= cycleLoop) {
            currentLoopIndex = 0;
        }

        // Se fumaça pode aparecer (O player digitou uma palavra) anime a fumaca até todos os frames acontecerem, ai reseta o timer 
        // e faz com que a fumaca nao continue
        if (can_puff) {
            puff_timer++;
            if (puff_timer >= 4) {
                puff_timer = -1;
                can_puff = false;
            }
        }
    }

    //Caso o jogador não tenha nada digitado, ele não está jogando, e o oposto tbm vale
    character.playing = typingWord != "" ? true : false;

    //Se o jogado não estiver digitando, desenhe ele parado, se não, desenhe ele fazendo magia , e desenhe a fumaca em cima dele
    // (pode ou nao aparecer algo)
    if (!character.playing) {
        drawWitchFrame(SpriteWitchIdle, currentLoopIndex, character.x, character.y - 105);
        drawPuff(puff_timer, character.x - 25, character.y - 110)
    } else {
        drawWitchChargeFrame(currentLoopIndex, character.x, character.y - 105);
        drawPuff(puff_timer, character.x - 25, character.y - 110)
    }

    // Se ele comecou o jogo, o tempo de ir fica no 0 e a posicao do personagem é igual da "word" que ele digitou
    // Se nao, o timer de ir começa a contar, a posicao é a inical na parte de baixo da tela
    if (is_playing) {
        timer_to_go = 0;
        character.y = lastTypedWord.y + 12;
        character.x = lastTypedWord.x - 20 + ((lastTypedWord.width - 30) / 2);
    } else {
        timer_to_go++;
        character.x = wCanvas / 2 - spriteWitchWidth;
        character.y = hCanvas - 70 + gravity / 3;
        groundY = character.y;
        cloudX = character.x;
    }

    // Se o timer de ir chegou ou o player comecou a jogar o "mundo" começa a ir para baixo
    // Agora o GroundY é usado como base da posicao inicial para checar se é necessario desenhar o chao e a nuvem de acordo de uma funcao
    // groundY + (gravity / 3) < (hCanvas + 100) -> Se o valor base mais o quanto que ele desceu é maior que a posicao mais baixa mais 100, ele para de desenhar
    // Se ele para de desenhar entao ele nao esta mais revivendo e nem na posicao inicial
    if (timer_to_go >= 650 || is_playing) {
        gravity++;
        downCount++;
        if (onStarterPosition && groundY + (gravity / 3) < (hCanvas + 100)) {
            ctx.drawImage(groundSprite, 0, 0, 600, 90, -20, hCanvas - 90 + downCount / 3, wCanvas + 80, 90);
        } else if (revived && groundY + (gravity / 3) < (hCanvas + 100)) {
            ctx.drawImage(cloudSprite, 0, 0, 221, 93, cloudX + spriteWitchWidth / 5, hCanvas - 90 + gravity / 3, 64, 38);
        } else {
            onStarterPosition = false;
            revived = false;
        }
    } else {
        // Mas caso isso for falso, desenhe o chao/nuvem parado, e a gravidade no valor inicial
        gravity = 1;
        if (onStarterPosition) {
            ctx.drawImage(groundSprite, 0, 0, 600, 90, -20, hCanvas - 90 + downCount / 3, wCanvas + 80, 90);
        } else if (revived) {
            ctx.drawImage(cloudSprite, 0, 0, 221, 93, cloudX + spriteWitchWidth / 5, character.y - 4, 64, 38);
        }
    }

    // Se o Player foi debaixo da tela
    if (character.y > (hCanvas + 60)) {
        //Se ele tiver mais uma vida, ele volta para a posicão inicial revivendo e nao tem mais uma vida, e ele nao esta mais na "partida"
        // Se nao gameover
        if (oneLife) {
            is_playing = false;
            revived = true;
            gravity = 1;
            oneLife = false;
        } else {
            console.log("Acabou");
            gameOver = true;
            // fetchCredentials();
            gameOverStep();
            if (can_music_play) {
                gameover_music.play();
            }
            return;
        }
    }

    //Tempo do jogo avança,timer da criacao de plataformas avanca e Recomeça essa função
    platCool++;
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

                //Se a palavra ter o mesmo id na progressao, ou ele estao no comeco do jogo ou revivendo
                if (droppingWords[k].id == idcheck || onStarterPosition || revived) {

                    //Adiciona a pontuação
                    score += 10 * scoreMult;
                    document.getElementById("score").textContent = score;

                    // Toca um efeito sonoro e ativa a fumaça
                    magic_sound.currentTime = 0;
                    magic_sound.play();
                    can_puff = true;

                    //Reseta a string que esta sendo digitada,confirma que essa palavra foi digitada, essa palavra digitada é guardada
                    // Muda o tipo da "word" digitada, fazendo ela uma palavra digitada
                    typingWord = "";
                    droppingWords[k].typed = true;

                    // Antes de mudar a ultima palavra digitada, a gente tem que fazer que a plataforma no qual o player esta caia imediatamente
                    // Entao caso tenha uma ultima palavra digitada, quando uma nova palavra for digitada ela ira cair rapidamente
                    if (lastTypedWord != "" || lastTypedWord != null || lastTypedWord != undefined) {
                        lastTypedWord.speed = 15;
                    }

                    // Variavel qeu guardara a ultima word digitada e fala pro jogo que enfim, a "partida" esta rolando
                    lastTypedWord = droppingWords[k];
                    is_playing = true;

                    // Checa o power up da palavra e muda algo dependendo do powerup
                    switch (lastTypedWord.type) {
                        case "+1":
                            oneLife = true;
                            break;
                        case "2x":
                            double_points = true;
                            powerupTimer[1] = 1400;
                            break;
                        case "Shield":
                            shield = true;
                            powerupTimer[0] = 600;
                            break;
                        case "Death":
                            //Se ele tiver mais uma vida, ele volta para a posicão inicial revivendo e nao tem mais uma vida, e ele nao esta mais na "partida"
                            // Se nao gameover
                            if (oneLife) {
                                is_playing = false;
                                revived = true;
                                gravity = 1;
                                oneLife = false;
                            } else {
                                console.log("Acabou");
                                gameOver = true;
                                // fetchCredentials();
                                gameOverStep();
                                if (can_music_play) {
                                    gameover_music.play();
                                }
                                return;
                            }
                            break;
                    }
                    // Muda o id para informar que somente as palavras do proximo degrau poderao ser digitadas
                    idcheck = lastTypedWord.id + 1;
                }
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

// playStop();