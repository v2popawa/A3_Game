// --------------------------------------------------
// Level 1 - Visual clue case
// Unique mechanic: magnify visual evidence
// --------------------------------------------------

let suspects1 = [
  {
    name: "Mia",
    isCulprit: false,
    expression: "Keeps steady eye contact and stands completely still.",
    magnifiedClue:
      "No dye marks, no torn threads, and no cash fibers on the sleeves.",
  },
  {
    name: "Derek",
    isCulprit: true,
    expression: "Avoids your gaze and keeps rubbing the right cuff.",
    magnifiedClue:
      "A faint red bank dye stain is caught in the cuff stitching.",
  },
  {
    name: "Luis",
    isCulprit: false,
    expression: "Looks annoyed, but not especially worried.",
    magnifiedClue:
      "Only outdoor dust on the shoes. Nothing connects him to the bank floor.",
  },
];

let level1Stage = "intro";
let level1Mode = "lineup";
let selected1 = null;
let message1 = "";
let magnifyMessage1 = "";
let convictMode1 = false;

function getLevel1Buttons() {
  return {
    begin: { x: width / 2, y: height * 0.74, w: 220, h: 52 },
    convict: { x: width / 2, y: height * 0.84, w: 220, h: 50 },
    back: { x: width * 0.14, y: height * 0.12, w: 120, h: 46 },
    magnify: { x: width / 2, y: height * 0.82, w: 220, h: 50 },
  };
}

function drawLevel1() {
  background(70, 78, 96);

  if (level1Stage === "intro") {
    drawLevel1Intro();
  } else if (level1Mode === "lineup") {
    drawLevel1Lineup();
  } else {
    drawLevel1Inspect();
  }

  drawFooterMessage(message1);
}

function drawLevel1Intro() {
  const buttons = getLevel1Buttons();

  drawCenteredPanel(
    "Level 1: Bank Robbery",
    "This case is all about observation.\n\n" +
      "Inspect each suspect closely.\n" +
      "Use Magnify to catch tiny visual details.\n" +
      "There is no questioning in this level.\n\n" +
      "Convict the robber when the physical clue gives them away.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel1Lineup() {
  const buttons = getLevel1Buttons();
  const positions = getLineupPositions(suspects1.length);

  drawCaseHeader(
    "Level 1: Bank Robbery",
    convictMode1
      ? "Convict mode: click the robber."
      : "Visual case: inspect suspects and use Magnify.",
  );

  for (let i = 0; i < suspects1.length; i++) {
    const fillColor = convictMode1 ? [170, 80, 80] : [170, 170, 170];
    drawSuspectToken(
      positions[i].x,
      positions[i].y,
      86,
      suspects1[i].name,
      fillColor,
    );
  }

  drawButton(buttons.convict, convictMode1 ? "Cancel" : "Convict");
}

function drawLevel1Inspect() {
  const buttons = getLevel1Buttons();
  const suspect = suspects1[selected1];

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "Look for a visual tell, then magnify the detail.",
  );

  push();
  fill(210);
  noStroke();
  ellipse(width / 2, height * 0.38, 190);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.025);
  text(
    suspect.expression,
    width / 2 - width * 0.24,
    height * 0.55,
    width * 0.48,
    70,
  );

  if (magnifyMessage1) {
    textSize(min(width, height) * 0.022);
    text(
      "Magnify: " + magnifyMessage1,
      width / 2 - width * 0.3,
      height * 0.64,
      width * 0.6,
      90,
    );
  }
  pop();

  drawButton(buttons.back, "Back");
  drawButton(buttons.magnify, "Magnify");
}

function level1MousePressed() {
  if (transitionPending) return;

  const buttons = getLevel1Buttons();

  if (level1Stage === "intro") {
    if (isOverButton(buttons.begin)) {
      level1Stage = "play";
    }
    return;
  }

  if (level1Mode === "lineup") {
    if (isOverButton(buttons.convict)) {
      convictMode1 = !convictMode1;
      message1 = convictMode1 ? "Select the robber." : "";
      return;
    }

    const positions = getLineupPositions(suspects1.length);

    for (let i = 0; i < suspects1.length; i++) {
      if (dist(mouseX, mouseY, positions[i].x, positions[i].y) < 43) {
        if (convictMode1) {
          finishCase(
            suspects1[i].isCulprit,
            "Correct! The bank dye gives the robber away.",
            "Wrong suspect! The real robber slips away.",
            "level2",
            (msg) => {
              message1 = msg;
            },
          );
        } else {
          selected1 = i;
          level1Mode = "inspect";
          magnifyMessage1 = "";
          message1 = "";
        }
        return;
      }
    }
  } else {
    if (isOverButton(buttons.back)) {
      level1Mode = "lineup";
      magnifyMessage1 = "";
      return;
    }

    if (isOverButton(buttons.magnify)) {
      magnifyMessage1 = suspects1[selected1].magnifiedClue;
    }
  }
}

function resetLevel1() {
  level1Stage = "intro";
  level1Mode = "lineup";
  selected1 = null;
  message1 = "";
  magnifyMessage1 = "";
  convictMode1 = false;
}
