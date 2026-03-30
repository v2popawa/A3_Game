// --------------------------------------------------
// Level 2 - Interview case
// Full-screen lineup background
// Name boxes under each suspect are the clickable targets
// Highlighting happens on the name boxes
// --------------------------------------------------

let suspects2 = [
  {
    name: "Taylor",
    isCulprit: false,
    cropCenterX: 0.17,
    expression: "Looks alert but composed.",
    magnifiedClue:
      "A clean bracelet clasp and no velvet fibers on the sleeves.",
    answer: "I was at the florist at 8:10. I still have the printed receipt.",
    boardNote: "Receipt timestamp matches 8:10 PM.",
  },
  {
    name: "Jordan",
    isCulprit: true,
    cropCenterX: 0.4,
    expression: "Keeps glancing away and tightening their jaw.",
    magnifiedClue:
      "A tiny strand of black velvet is caught near the cuff seam.",
    answer: "I stayed outside the gallery the whole time.",
    boardNote:
      "Parking camera shows Jordan re-entering the gallery at 8:12 PM.",
  },
  {
    name: "Avery",
    isCulprit: false,
    cropCenterX: 0.63,
    expression: "Looks irritated, not frightened.",
    magnifiedClue:
      "Only catering glitter from the gift table, nothing from the necklace case.",
    answer: "I was packing the gift table when security shouted.",
    boardNote: "A staff member confirms Avery was beside the exit display.",
  },
  {
    name: "Morgan",
    isCulprit: false,
    cropCenterX: 0.86,
    expression: "Tired eyes, steady voice.",
    magnifiedClue:
      "Phone screen smudge and lipstick trace, but no display-case residue.",
    answer: "I stepped outside for a phone call before the lights flickered.",
    boardNote: "Phone log shows a three-minute call beginning at 8:07 PM.",
  },
];

let level2Stage = "intro";
let level2Mode = "lineup";
let selected2 = null;

let message2 = "";
let askMessage2 = "";
let magnifyMessage2 = "";

let convictMode2 = false;
let showBoard2 = false;
let questioned2 = [false, false, false, false];

// --------------------------------------------------
// Button layout
// --------------------------------------------------

function getLevel2NameButtons() {
  const y = height * 0.91;
  const w = min(width * 0.16, 165);
  const h = 48;

  return [
    { x: width * 0.17, y, w, h },
    { x: width * 0.4, y, w, h },
    { x: width * 0.63, y, w, h },
    { x: width * 0.86, y, w, h },
  ];
}

function getLevel2Buttons() {
  const lineupRow = getButtonRow(2, height * 0.8, 180, 50, 30);
  const inspectRow = getButtonRow(3, height * 0.8, 160, 50, 22);

  return {
    begin: { x: width / 2, y: height * 0.74, w: 220, h: 52 },

    // lineup mode
    board: lineupRow[0],
    convict: lineupRow[1],

    // inspect mode
    back: { x: width * 0.12, y: height * 0.1, w: 110, h: 44 },
    magnify: inspectRow[0],
    ask: inspectRow[1],
    boardInspect: inspectRow[2],
  };
}

function getLevel2NameButton(index) {
  return getLevel2NameButtons()[index];
}

// --------------------------------------------------
// Drawing helpers
// --------------------------------------------------

function drawLevel2Background() {
  push();
  imageMode(CORNER);

  if (level2Sprite && level2Sprite.width > 0) {
    image(level2Sprite, 0, 0, width, height);
  } else {
    background(58, 72, 88);
  }

  pop();
}

function drawLevel2ZoomedSuspect(suspect) {
  push();
  imageMode(CORNER);

  if (level2Sprite && level2Sprite.width > 0) {
    const srcW = level2Sprite.width * 0.28;
    const srcH = level2Sprite.height;
    const centerX = level2Sprite.width * suspect.cropCenterX;
    const sx = constrain(centerX - srcW / 2, 0, level2Sprite.width - srcW);

    image(level2Sprite, 0, 0, width, height, sx, 0, srcW, srcH);
  } else {
    background(58, 72, 88);
  }

  pop();
}

function drawLevel2Overlay(alpha = 85) {
  push();
  fill(0, alpha);
  noStroke();
  rect(0, 0, width, height);
  pop();
}

function drawLevel2NameButton(button, label, index) {
  const hovered = isOverButton(button);
  const isSelected = selected2 === index && !convictMode2;
  const isQuestioned = questioned2[index] && !convictMode2;
  const dangerMode = convictMode2;

  let fillColor = [80, 110, 170];

  if (dangerMode) fillColor = [160, 70, 70];
  else if (isSelected) fillColor = [70, 145, 210];
  else if (isQuestioned) fillColor = [70, 130, 95];
  else if (hovered) fillColor = [100, 135, 195];

  drawButton(button, label, fillColor);
}

// --------------------------------------------------
// Main draw
// --------------------------------------------------

function drawLevel2() {
  background(58, 72, 88);

  if (level2Stage === "intro") {
    drawLevel2Intro();
  } else if (level2Mode === "lineup") {
    drawLevel2Lineup();
  } else {
    drawLevel2Inspect();
  }

  if (showBoard2) {
    drawLevel2Board();
  }

  drawFooterMessage(message2);
}

function drawLevel2Intro() {
  const buttons = getLevel2Buttons();

  drawCenteredPanel(
    "Level 2: Jewelry Theft",
    "Level 2 keeps the tools from Level 1.\n\n" +
      "You can still inspect and magnify suspects.\n" +
      "Now you can also question them and compare what you learn on the evidence board.\n\n" +
      "Click a suspect's name to inspect them.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel2Lineup() {
  const buttons = getLevel2Buttons();

  drawLevel2Background();
  drawLevel2Overlay(70);

  drawCaseHeader(
    "Level 2: Jewelry Theft",
    convictMode2
      ? "Convict mode: click a suspect name to make your final choice."
      : "Click a suspect name to inspect. Use Board to compare statements.",
  );

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.022);
  text(
    `Statements recorded: ${questioned2.filter(Boolean).length}/${suspects2.length}`,
    width / 2,
    height * 0.19,
  );
  pop();

  const nameButtons = getLevel2NameButtons();
  for (let i = 0; i < suspects2.length; i++) {
    drawLevel2NameButton(nameButtons[i], suspects2[i].name, i);
  }

  drawButton(buttons.board, "Board");
  drawButton(buttons.convict, convictMode2 ? "Cancel" : "Convict");
}

function drawLevel2Inspect() {
  const buttons = getLevel2Buttons();
  const suspect = suspects2[selected2];

  drawLevel2ZoomedSuspect(suspect);
  drawLevel2Overlay(95);

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "Use Magnify, Ask, and Board. You can also switch suspects by clicking another name.",
  );

  push();
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.022);
  text(
    "Visual read: " + suspect.expression,
    width / 2 - width * 0.3,
    height * 0.54,
    width * 0.6,
    60,
  );

  if (magnifyMessage2) {
    text(
      "Magnify: " + magnifyMessage2,
      width / 2 - width * 0.32,
      height * 0.65,
      width * 0.64,
      80,
    );
  }

  if (askMessage2) {
    text(
      "Statement: " + askMessage2,
      width / 2 - width * 0.32,
      height * 0.77,
      width * 0.64,
      90,
    );
  }

  pop();

  drawButton(buttons.back, "Back");
  drawButton(buttons.magnify, "Magnify");
  drawButton(buttons.ask, questioned2[selected2] ? "Asked" : "Ask");
  drawButton(buttons.boardInspect, "Board");

  const nameButtons = getLevel2NameButtons();
  for (let i = 0; i < suspects2.length; i++) {
    drawLevel2NameButton(nameButtons[i], suspects2[i].name, i);
  }
}

// --------------------------------------------------
// Evidence board
// --------------------------------------------------

function drawLevel2Board() {
  push();
  fill(0, 190);
  noStroke();
  rect(0, 0, width, height);

  rectMode(CENTER);
  fill(245);
  stroke(255);
  strokeWeight(2);

  const panelW = min(width * 0.78, 760);
  const panelH = min(height * 0.72, 480);
  rect(width / 2, height / 2, panelW, panelH, 16);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.035);
  text("Evidence Board", width / 2, height / 2 - panelH * 0.38);

  textSize(min(width, height) * 0.021);
  textLeading(26);

  const startY = height / 2 - panelH * 0.22;

  for (let i = 0; i < suspects2.length; i++) {
    const line = questioned2[i]
      ? `${suspects2[i].name}: ${suspects2[i].boardNote}`
      : `${suspects2[i].name}: no statement recorded yet.`;

    text(line, width / 2, startY + i * 58);
  }

  textSize(min(width, height) * 0.018);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.36);
  pop();
}

// --------------------------------------------------
// Mouse handling
// --------------------------------------------------

function level2MousePressed() {
  if (transitionPending) return;

  if (showBoard2) {
    showBoard2 = false;
    return;
  }

  const buttons = getLevel2Buttons();

  if (level2Stage === "intro") {
    if (isOverButton(buttons.begin)) {
      level2Stage = "play";
    }
    return;
  }

  if (level2Mode === "lineup") {
    if (isOverButton(buttons.board)) {
      showBoard2 = true;
      return;
    }

    if (isOverButton(buttons.convict)) {
      convictMode2 = !convictMode2;
      message2 = convictMode2 ? "Click a suspect name to convict." : "";
      return;
    }

    for (let i = 0; i < suspects2.length; i++) {
      if (isOverButton(getLevel2NameButton(i))) {
        if (convictMode2) {
          finishCase(
            suspects2[i].isCulprit,
            "Correct! Jordan's story and the velvet fiber give it away.",
            "Wrong suspect!",
            "level3",
            (msg) => {
              message2 = msg;
            },
          );
        } else {
          selected2 = i;
          level2Mode = "inspect";
          askMessage2 = questioned2[i] ? suspects2[i].answer : "";
          magnifyMessage2 = "";
          message2 = "";
        }
        return;
      }
    }
  } else {
    if (isOverButton(buttons.back)) {
      level2Mode = "lineup";
      return;
    }

    if (isOverButton(buttons.magnify)) {
      magnifyMessage2 = suspects2[selected2].magnifiedClue;
      return;
    }

    if (isOverButton(buttons.ask)) {
      questioned2[selected2] = true;
      askMessage2 = suspects2[selected2].answer;
      message2 = "Statement recorded to the board.";
      return;
    }

    if (isOverButton(buttons.boardInspect)) {
      showBoard2 = true;
      return;
    }

    for (let i = 0; i < suspects2.length; i++) {
      if (isOverButton(getLevel2NameButton(i))) {
        selected2 = i;
        askMessage2 = questioned2[i] ? suspects2[i].answer : "";
        magnifyMessage2 = "";
        message2 = "";
        return;
      }
    }
  }
}

// --------------------------------------------------
// Reset
// --------------------------------------------------

function resetLevel2() {
  level2Stage = "intro";
  level2Mode = "lineup";
  selected2 = null;
  message2 = "";
  askMessage2 = "";
  magnifyMessage2 = "";
  convictMode2 = false;
  showBoard2 = false;
  questioned2 = [false, false, false, false];
}
