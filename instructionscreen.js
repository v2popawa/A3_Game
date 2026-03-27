function drawInstructions() {
  background(20);

  fill(255);
  textAlign(CENTER);

  textSize(24);
  text("Instructions", width / 2, 100);

  textSize(16);
  text(
    "Click a suspect to inspect them.\n" +
      "Use Magnify to study expressions.\n" +
      "Use Reveal carefully.\n" +
      "Use Convict to make your final choice.",
    width / 2,
    250,
  );

  rect(300, 450, 200, 50);
  fill(0);
  text("Back", 400, 480);
}

function instructionsMousePressed() {
  if (mouseX > 300 && mouseX < 500 && mouseY > 450 && mouseY < 500) {
    currentScreen = "start";
  }
}
