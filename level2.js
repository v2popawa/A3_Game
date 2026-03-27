let suspects2 = [
  { x: 120, y: 300, lying: true },
  { x: 280, y: 300, lying: false },
  { x: 440, y: 300, lying: true },
  { x: 600, y: 300, lying: true },
];

let level2Stage = "intro";
let level2Mode = "lineup";

let selected2 = null;
let message2 = "";
let askMessage2 = "";

let revealsLeft2 = 3;
let revealedIndex2 = null;

let convictMode2 = false;

function drawLevel2() {
  background(60);

  if (level2Stage === "intro") drawLevel2Intro();
  else if (level2Mode === "lineup") drawLevel2Lineup();
  else drawLevel2Inspect();

  fill(255);
  text(message2, 250, 550);
}

function drawLevel2Intro() {
  fill(255);
  textSize(20);
  text("Case 2: Jewelry Theft", 250, 120);

  textSize(16);
  text("A necklace was stolen.\nFour suspects are being questioned.", 240, 250);

  fill(100);
  rect(300, 400, 200, 50);
  fill(255);
  text("Begin", 360, 430);
}

function drawLevel2Lineup() {
  fill(255);
  text(
    convictMode2 ? "Click a suspect to CONVICT" : "Click a suspect to inspect",
    230,
    100,
  );

  for (let i = 0; i < suspects2.length; i++) {
    if (revealedIndex2 === i) fill(0, 255, 0);
    else if (convictMode2) fill(255, 100, 100);
    else fill(180);

    ellipse(suspects2[i].x, suspects2[i].y, 70);
  }

  // Buttons
  fill(100);
  rect(300, 450, 120, 40); // Reveal
  rect(450, 450, 120, 40); // Convict

  fill(255);
  text("Reveal", 320, 475);
  text("Convict", 465, 475);

  text("Reveals left: " + revealsLeft2, 50, 100);
}

function drawLevel2Inspect() {
  let s = suspects2[selected2];

  fill(200);
  ellipse(width / 2, 250, 200);

  fill(255);
  text("Inspecting suspect", 280, 100);

  if (s.lying) {
    text("They seem nervous.", 300, 350);
  } else {
    text("They seem calm.", 310, 350);
  }

  text(askMessage2, 250, 400);

  // Buttons
  fill(100);
  rect(50, 50, 100, 40); // Back
  rect(300, 450, 200, 40); // Ask

  fill(255);
  text("Back", 75, 75);
  text("Ask Question", 320, 475);
}

function level2MousePressed() {
  if (level2Stage === "intro") {
    if (mouseX > 300 && mouseX < 500 && mouseY > 400 && mouseY < 450) {
      level2Stage = "lineup";
    }
    return;
  }

  if (level2Mode === "lineup") {
    // CONVICT MODE
    if (convictMode2) {
      for (let i = 0; i < suspects2.length; i++) {
        if (dist(mouseX, mouseY, suspects2[i].x, suspects2[i].y) < 35) {
          if (!suspects2[i].lying) {
            message2 = "Correct!";
            setTimeout(() => (currentScreen = "level3"), 1000);
          } else {
            message2 = "Wrong suspect!";
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

    // CLICK SUSPECT → INSPECT
    for (let i = 0; i < suspects2.length; i++) {
      if (dist(mouseX, mouseY, suspects2[i].x, suspects2[i].y) < 35) {
        selected2 = i;
        level2Mode = "inspect";
        askMessage2 = "";
        return;
      }
    }

    // REVEAL
    if (mouseX > 300 && mouseX < 420 && mouseY > 450 && mouseY < 490) {
      if (revealsLeft2 <= 0) {
        message2 = "No reveals left.";
        return;
      }

      revealsLeft2--;

      for (let i = 0; i < suspects2.length; i++) {
        if (!suspects2[i].lying) revealedIndex2 = i;
      }

      message2 = "Truth revealed.";
    }

    // ENTER CONVICT MODE
    if (mouseX > 450 && mouseX < 570 && mouseY > 450 && mouseY < 490) {
      convictMode2 = true;
      message2 = "Select a suspect to convict.";
    }
  } else {
    // BACK
    if (mouseX > 50 && mouseX < 150 && mouseY > 50 && mouseY < 90) {
      level2Mode = "lineup";
    }

    // ASK
    if (mouseX > 300 && mouseX < 500 && mouseY > 450 && mouseY < 490) {
      if (suspects2[selected2].lying) {
        askMessage2 = "They hesitate and avoid eye contact...";
      } else {
        askMessage2 = "They answer clearly and confidently.";
      }
    }
  }
}

function resetLevel2() {
  level2Stage = "intro";
  level2Mode = "lineup";
  selected2 = null;
  message2 = "";
  askMessage2 = "";
  revealsLeft2 = 3;
  revealedIndex2 = null;
  convictMode2 = false;
}
