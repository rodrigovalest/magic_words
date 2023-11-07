function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function playStop() {
    if (gameOver) {
        document.getElementById("playStopButton").textContent = "Stop";
        gameOver = false;
        step();

        score = 0;
        document.getElementById("score").textContent = score;
        errors = 0;
        document.getElementById("errors").textContent = errors;
    } else {
        document.getElementById("playStopButton").textContent = "Play";
        gameOver = true;
    }
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

let tempo = 0;
let gameOver = false;
const droppingWords = [];

const Bg = new Image();
Bg.src = "images/night_background 1.png"
//ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas);

let canCloudGo = false;
let cloudX;
let cloudY;
let downCount = 0;
const cloudSprite = new Image();
cloudSprite.src = "images/cloudSprite.png";

Bg.src = "images/night_background 1.png";

const SpriteWitchIdle = new Image();
SpriteWitchIdle.src = "images/SpriteWitchIdle.png";
//ctx.drawImage(SpriteWitchIdle, 0, 0, 32, 42, 0, 0, 32 * 2, 42 * 2);

const SpriteWitchDamage = new Image();
SpriteWitchDamage.src = "images/SpriteWitchDamage.png";
//ctx.drawImage(SpriteWitchDamage, 0, 0, 32, 42, 0, 0, 32 * 2, 42 * 2);

const SpriteWitchCharge = new Image();
SpriteWitchCharge.src = "images/SpriteWitchCharge.png";
//ctx.drawImage(SpriteWitchCharge, 0, 0, 48, 48, 0, 0, 32 * 2.5, 42 * 2.5);

const spriteWitchWidth = 32;
const spriteWitchHeight = 48;
const spriteWitchChargeSize = 48;

const witchXScale = spriteWitchWidth * 2.5;
const witchYScale = spriteWitchHeight * 2.5;

function drawWitchFrame(witchSprite, frameY, canvasX, canvasY) {
    ctx.drawImage(witchSprite, 0, frameY * spriteWitchHeight,
        spriteWitchWidth, spriteWitchHeight, canvasX, canvasY, witchXScale, witchYScale);
}
function drawWitchChargeFrame(frameY, canvasX, canvasY) {
    ctx.drawImage(SpriteWitchCharge, 0, frameY * spriteWitchChargeSize,
        spriteWitchChargeSize, spriteWitchChargeSize, canvasX, canvasY, witchXScale, witchYScale);
}

let cycleLoop = 5;
let currentLoopIndex = 0;
let frameCount = 3;

const character = {
    x: wCanvas / 2 - spriteWitchWidth,
    y: hCanvas - spriteWitchHeight,
    playing: false
}

class classWord {
    constructor(word, x, y, width) {
        this.word = word;
        this.x = x;
        this.y = y;
        this.typed = false;
        this.width = width;
    }
}

function step() {
    ctx.clearRect(0, 0, wCanvas, hCanvas);
    ctx.drawImage(Bg, 0, 0, wCanvas, hCanvas);

    if (gameOver) {
        droppingWords.length = 0;
        //lastTypedWord = null;
        tempo = 0;

        character.playing = false;
        character.x = wCanvas / 2;
        character.y = hCanvas - 40;

        ctx.clearRect(0, 0, wCanvas, hCanvas);
        return;
    }

    if (tempo % 5 == 0) {
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop) {
            currentLoopIndex = 0;
        }
    }

    character.playing = typingWord != "" ? true : false;

    if (!character.playing) {
        cycleLoop = 5;
        //ctx.clearRect(character.x, character.y - 70, witchXScale, witchYScale);
        drawWitchFrame(SpriteWitchIdle, currentLoopIndex, character.x, character.y - 105);
    } else {
        drawWitchChargeFrame(currentLoopIndex, character.x, character.y - 105);
    }

    if (tempo % 300 == 0) {
        let word = new classWord(words[getRandomInt(0, words.length - 1)], getRandomInt(20, 480), 0);
        word.width = ctx.measureText(word.word).width;
        droppingWords.push(word);
        console.log(droppingWords);
    }

    droppingWords.forEach((word, index) => {
        if (word.y > (hCanvas + 60)) {
            ctx.fillRect(word.x - 10, word.y + 10, word.width + 20, -35);
            droppingWords.splice(index, 1);
            console.log("Deleted");
        } else {
            word.y++;
            ctx.drawImage(cloudSprite, 0, 0, 221, 93, word.x - 15 + ((word.width - 30) / 2), word.y + 6, 64, 38);
            if (word.typed == false) {
                ctx.fillStyle = "rgba(226, 221, 224, 0.7)"
                ctx.fillRect(word.x - 15, word.y + 6, word.width + 30, -25);
                ctx.fillStyle = "black";
                ctx.font = "16px Arial";
                ctx.fillText(word.word, word.x, word.y);
                ctx.fillStyle = "red";
                ctx.font = "16px Arial";
                ctx.fillText(typingWord, word.x, word.y);
            } else {
                character.y = word.y + 6;
                console.log(character.y);
                character.x = word.x - 20 + ((word.width - 30) / 2);
            }
        }
        if ((character.y >= (hCanvas + 10))) {
            playStop();
            gameOver = true;
            ctx.clearRect(0, 0, wCanvas, hCanvas);
            return;
          }
    });
    if (!canCloudGo) {
        downCount = 0;
        cloudX = character.x;
        cloudY = character.y;
        ctx.drawImage(cloudSprite, 0, 0, 221, 93, character.x + spriteWitchWidth / 8, character.y, 64, 38);
    } else if (canCloudGo && cloudY + (downCount / 3) < (hCanvas + 10)) {
        ctx.drawImage(cloudSprite, 0, 0, 221, 93, cloudX + spriteWitchWidth / 8, cloudY + downCount / 3, 64, 38);
        downCount++;
    }
    tempo++;
    requestAnimationFrame(step);
}

let typingWord = "";
document.addEventListener("keypress", function (event) {
    let keyPressed = event.key.toLowerCase();
    if (keyPressed == "enter") {
        keyPressed = "";
    }
    typingWord += keyPressed;
    console.log(typingWord);

    if (droppingWords.length >= 0 && !gameOver) {
        let currentWordIndex;

        for (let i = 0; i < droppingWords.length; i++) {
            if (!droppingWords[i].typed) {
                currentWordIndex = i;
                break;
            }
        }
        const nextWord = droppingWords[currentWordIndex];

        if (typingWord == nextWord.word) {
            typingWord = "";
            nextWord.typed = true;
            droppingWords[currentWordIndex] = nextWord;
            canCloudGo = true;
        }
    }
});
document.addEventListener("keydown", function (event) {
    let Backkey = event.key.toLowerCase();
    if (Backkey == "backspace") {
        typingWord = typingWord.slice(0, -1);
    }
    console.log(typingWord);
});





step();