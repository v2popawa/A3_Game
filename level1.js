// --------------------------------------------------
// Level 1 - Visual clue case
// Uses one lineup background image
// Names are the clickable targets for inspect / convict
// --------------------------------------------------

let suspects1 = [
  {
    name: "Mia",
    isCulprit: false,
    spriteIndex: 0,
    expression: "Looks calm and steady.",
    magnifiedClue:
      "No dye marks, no torn threads, and no cash fibers on the sleeves.",
  },
  {
    name: "Derek",
    isCulprit: true,
    spriteIndex: 1,
    expression: "Looks tense and uneasy.",
    magnifiedClue:
      "A faint red bank dye stain is caught in the cuff stitching.",
  },
  {
    name: "Luis",
    isCulprit: false,
    spriteIndex: 2,
    expression: "Looks serious, but not fearful.",
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
  const nameRow = getButtonRow(3, height * 0.86, 150, 50, 22);

  return {
    begin: { x: width / 2, y: height * 0.74, w: 220, h: 52 },
    convict: { x: width / 2, y: height * 0.93, w: 220, h: 48 },
    back: { x: width * 0.12, y: height * 0.12, w: 110, h: 44 },
    magnify: { x: width / 2, y: height * 0.9, w: 220, h: 48 },

    name0: nameRow[0],
    name1: nameRow[1],
    name2: nameRow[2],
  };
}

function getLevel1NameButton(index) {
  const buttons = getLevel1Buttons();
  if (index === 0) return buttons.name0;
  if (index === 1) return buttons.name1;
  return buttons.name2;
}

function drawLevel1NameButton(button, label, index) {
  const hovered = isOverButton(button);
  const isSelected = selected1 === index && !convictMode1;
  const isDanger = convictMode1;

  let fillColor = [80, 110, 170];

  if (isDanger) fillColor = [160, 70, 70];
  else if (isSelected) fillColor = [70, 145, 210];
  else if (hovered) fillColor = [100, 135, 195];

  drawButton(button, label, fillColor);
}

function drawLevel1LineupImage() {
  push();
  imageMode(CORNER);

  if (level1Sprite && level1Sprite.width > 0) {
    image(level1Sprite, 0, 0, width, height);
  } else {
    background(80);
  }

  pop();
}

function drawLevel1ZoomedSuspect(suspect) {
  push();
  imageMode(CORNER);

  if (level1Sprite && level1Sprite.width > 0) {
    const srcW = level1Sprite.width / 3;
    const srcH = level1Sprite.height;
    const sx = suspect.spriteIndex * srcW;

    image(level1Sprite, 0, 0, width, height, sx, 0, srcW, srcH);
  } else {
    background(80);
  }

  pop();
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
      "Study the lineup image carefully.\n" +
      "Click a suspect's name to inspect them.\n" +
      "Use Magnify to catch a small clue.\n\n" +
      "When ready, press Convict and choose the final suspect by name.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel1Lineup() {
  const buttons = getLevel1Buttons();

  drawCaseHeader(
    "Level 1: Bank Robbery",
    convictMode1
      ? "Convict mode: click a suspect name to make your final choice."
      : "Click a suspect name to inspect the lineup image.",
  );

  drawLevel1LineupImage();

  for (let i = 0; i < suspects1.length; i++) {
    drawLevel1NameButton(getLevel1NameButton(i), suspects1[i].name, i);
  }

  drawButton(buttons.convict, convictMode1 ? "Cancel" : "Convict");
}

function drawLevel1Inspect() {
  const buttons = getLevel1Buttons();
  const suspect = suspects1[selected1];

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "The lineup image is zoomed in. Use Magnify for the key detail.",
  );

  drawLevel1ZoomedSuspect(suspect);

  push();
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.024);
  text(
    "Observed read: " + suspect.expression,
    width / 2 - width * 0.3,
    height * 0.63,
    width * 0.6,
    55,
  );

  if (magnifyMessage1) {
    text(
      "Magnify: " + magnifyMessage1,
      width / 2 - width * 0.32,
      height * 0.74,
      width * 0.64,
      90,
    );
  }
  pop();

  drawButton(buttons.back, "Back");
  drawButton(buttons.magnify, "Magnify");

  // keep name buttons visible in inspect mode too
  for (let i = 0; i < suspects1.length; i++) {
    drawLevel1NameButton(getLevel1NameButton(i), suspects1[i].name, i);
  }
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
      message1 = convictMode1 ? "Click a suspect name to convict." : "";
      return;
    }

    for (let i = 0; i < suspects1.length; i++) {
      if (isOverButton(getLevel1NameButton(i))) {
        if (convictMode1) {
          finishCase(
            suspects1[i].isCulprit,
            "Correct! Derek had the bank dye clue.",
            "Wrong suspect!",
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
      return;
    }

    // allow switching inspect target by clicking names
    for (let i = 0; i < suspects1.length; i++) {
      if (isOverButton(getLevel1NameButton(i))) {
        selected1 = i;
        magnifyMessage1 = "";
        return;
      }
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
