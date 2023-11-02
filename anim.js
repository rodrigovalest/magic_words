let img = new Image();
img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
img.onload = function() {
  init();
};

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

function init() {
  ctx.drawImage(img, 0, 0, 16, 18, 10, 10, 120, 180);
}