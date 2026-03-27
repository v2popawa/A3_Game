let suspects3 = [
  { x: 100, y: 300, lying: true, note: "No alibi. Changed story twice." },
  { x: 250, y: 300, lying: true, note: "Seen near scene." },
  { x: 400, y: 300, lying: false, note: "Confirmed at work." },
  { x: 550, y: 300, lying: true, note: "Nervous behavior." },
];

let level3Stage = "intro";
let level3Mode = "lineup";

let selected3 = null;
let message3 = "";
let askMessage3 = "";

let revealsLeft3 = 1;
let revealedIndex3 = null;

let convictMode3 = false;
let showNotebook = false;

function drawLevel3() {
  background(40);

  if (level3Stage === "intro") drawLevel3Intro();
  else if (level3Mode === "lineup") drawLevel3Lineup();
  else drawLevel3Inspect();

  fill(255);
  text(message3, 250, 550);
}

function drawLevel3Intro() {
  fill(255);
  text("Case 3: Murder Case", 250, 120);

  fill(100);
  rect(300, 400, 200, 50);
  fill(255);
  text("Begin", 360, 430);
}

function drawLevel3Lineup() {
  fill(255);
  text(
    convictMode3 ? "Click a suspect to CONVICT" : "Click a suspect to inspect",
    230,
    100,
  );

  for (let i = 0; i < suspects3.length; i++) {
    if (revealedIndex3 === i) fill(0, 255, 0);
    else if (convictMode3) fill(255, 100, 100);
    else fill(180);

    ellipse(suspects3[i].x, suspects3[i].y, 70);
  }

  fill(100);
  rect(300, 450, 120, 40); // Reveal
  rect(450, 450, 120, 40); // Convict

  fill(255);
  text("Reveal", 320, 475);
  text("Convict", 465, 475);

  text("Reveals left: " + revealsLeft3, 50, 100);
}

function drawLevel3Inspect() {
  let s = suspects3[selected3];

  fill(200);
  ellipse(width / 2, 250, 200);

  fill(255);
  text("Inspecting suspect", 280, 100);

  if (s.lying) {
    text("They look nervous.", 300, 320);
  } else {
    text("They look calm.", 310, 320);
  }

  text(askMessage3, 250, 370);

  // Buttons
  fill(100);
  rect(50, 50, 100, 40); // Back
  rect(300, 450, 200, 40); // Ask
  rect(600, 50, 150, 40); // Notebook

  fill(255);
  text("Back", 75, 75);
  text("Ask Question", 320, 475);
  text("Notebook", 620, 75);

  if (showNotebook) drawNotebook();
}

function drawNotebook() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  rect(150, 150, 500, 300);

  fill(0);
  text("Notebook", 350, 180);
  text(suspects3[selected3].note, 200, 250, 400);
}

function level3MousePressed() {
  if (showNotebook) {
    showNotebook = false;
    return;
  }

  if (level3Stage === "intro") {
    if (mouseX > 300 && mouseX < 500 && mouseY > 400 && mouseY < 450) {
      level3Stage = "lineup";
    }
    return;
  }

  if (level3Mode === "lineup") {
    // CONVICT MODE
    if (convictMode3) {
      for (let i = 0; i < suspects3.length; i++) {
        if (dist(mouseX, mouseY, suspects3[i].x, suspects3[i].y) < 35) {
          if (!suspects3[i].lying) {
            message3 = "Correct!";
            setTimeout(() => (currentScreen = "win"), 1000);
          } else {
            message3 = "Wrong suspect!";
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

    // CLICK → INSPECT
    for (let i = 0; i < suspects3.length; i++) {
      if (dist(mouseX, mouseY, suspects3[i].x, suspects3[i].y) < 35) {
        selected3 = i;
        level3Mode = "inspect";
        askMessage3 = "";
        return;
      }
    }

    // REVEAL
    if (mouseX > 300 && mouseX < 420 && mouseY > 450 && mouseY < 490) {
      if (revealsLeft3 <= 0) return;

      revealsLeft3--;

      for (let i = 0; i < suspects3.length; i++) {
        if (!suspects3[i].lying) revealedIndex3 = i;
      }
    }

    // ENTER CONVICT MODE
    if (mouseX > 450 && mouseX < 570 && mouseY > 450 && mouseY < 490) {
      convictMode3 = true;
      message3 = "Select a suspect to convict.";
    }
  } else {
    // BACK
    if (mouseX > 50 && mouseX < 150 && mouseY > 50 && mouseY < 90) {
      level3Mode = "lineup";
    }

    // ASK
    if (mouseX > 300 && mouseX < 500 && mouseY > 450 && mouseY < 490) {
      if (suspects3[selected3].lying) {
        askMessage3 = "Their story has inconsistencies...";
      } else {
        askMessage3 = "Their story checks out.";
      }
    }

    // NOTEBOOK
    if (mouseX > 600 && mouseX < 750 && mouseY > 50 && mouseY < 90) {
      showNotebook = true;
    }
  }
}

function resetLevel3() {
  level3Stage = "intro";
  level3Mode = "lineup";
  selected3 = null;
  message3 = "";
  askMessage3 = "";
  revealsLeft3 = 1;
  revealedIndex3 = null;
  convictMode3 = false;
  showNotebook = false;
}
