let currentScreen = "start";

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(30);

  if (currentScreen === "start") drawStart();
  else if (currentScreen === "instructions") drawInstructions();
  else if (currentScreen === "level1") drawLevel1();
  else if (currentScreen === "level2") drawLevel2();
  else if (currentScreen === "level3") drawLevel3();
  else if (currentScreen === "win") drawWin();
}

function mousePressed() {
  if (currentScreen === "start") startMousePressed();
  else if (currentScreen === "instructions") instructionsMousePressed();
  else if (currentScreen === "level1") level1MousePressed();
  else if (currentScreen === "level2") level2MousePressed();
  else if (currentScreen === "level3") level3MousePressed();
  else if (currentScreen === "win") winMousePressed();
}
