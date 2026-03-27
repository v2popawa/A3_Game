let suspects1 = [
  { x: 150, y: 300, lying: false },
  { x: 350, y: 300, lying: true },
  { x: 550, y: 300, lying: true },
];

let level1Stage = "intro";
let level1Mode = "lineup";

let selected1 = null;
let message1 = "";

let convictMode1 = false;

function drawLevel1() {
  background(80);

  if (level1Stage === "intro") drawLevel1Intro();
  else if (level1Mode === "lineup") drawLevel1Lineup();
  else drawLevel1Inspect();

  fill(255);
  text(message1, 250, 550);
}

function drawLevel1Intro() {
  fill(255);
  text("Case 1: Bank Robbery", 260, 120);

  rect(300, 400, 200, 50);
  text("Begin", 360, 430);
}

function drawLevel1Lineup() {
  for (let i = 0; i < suspects1.length; i++) {
    if (convictMode1) fill(255, 100, 100);
    else fill(180);

    ellipse(suspects1[i].x, suspects1[i].y, 80);
  }

  fill(255);

  if (convictMode1) {
    text("Click a suspect to CONVICT", 250, 100);
  } else {
    text("Click a suspect to inspect", 250, 100);
  }

  // Convict button
  fill(100);
  rect(350, 450, 120, 40);
  fill(255);
  text("Convict", 365, 475);
}

function drawLevel1Inspect() {
  let s = suspects1[selected1];

  fill(200);
  ellipse(width / 2, 250, 200);

  fill(255);
  text("Inspecting suspect", 280, 100);

  if (s.lying) {
    text("They look nervous.", 300, 400);
  } else {
    text("They look calm.", 310, 400);
  }

  fill(100);
  rect(50, 50, 100, 40);
  fill(255);
  text("Back", 75, 75);
}

function level1MousePressed() {
  if (level1Stage === "intro") {
    if (mouseX > 300 && mouseX < 500 && mouseY > 400 && mouseY < 450)
      level1Stage = "lineup";
    return;
  }

  if (level1Mode === "lineup") {
    // If in convict mode → click suspect to decide
    if (convictMode1) {
      for (let i = 0; i < suspects1.length; i++) {
        if (dist(mouseX, mouseY, suspects1[i].x, suspects1[i].y) < 40) {
          if (!suspects1[i].lying) {
            message1 = "Correct!";
            setTimeout(() => (currentScreen = "level2"), 1000);
          } else {
            message1 = "Wrong suspect!";
            setTimeout(() => {
              resetLevel1();
              resetLevel2();
              resetLevel3();
              currentScreen = "start";
            }, 1000);
          }
        }
      }
      return;
    }

    // Normal click → inspect
    for (let i = 0; i < suspects1.length; i++) {
      if (dist(mouseX, mouseY, suspects1[i].x, suspects1[i].y) < 40) {
        selected1 = i;
        level1Mode = "inspect";
        return;
      }
    }

    // Convict button
    if (mouseX > 350 && mouseX < 470 && mouseY > 450 && mouseY < 490) {
      convictMode1 = true;
      message1 = "Select a suspect to convict.";
    }
  } else {
    if (mouseX > 50 && mouseX < 150 && mouseY > 50 && mouseY < 90) {
      level1Mode = "lineup";
    }
  }
}

function resetLevel1() {
  level1Stage = "intro";
  level1Mode = "lineup";
  selected1 = null;
  message1 = "";
  convictMode1 = false;
}
