let bg;

function preload() {
  // 注意：从 game/ 里访问 assets/，要返回上一层
  bg = loadImage('../assets/Background.PNG');
}

function setup() {
  createCanvas(900, 700);
}

function draw() {
  background(220);
  if (bg) image(bg, 0, 0, width, height);
}
