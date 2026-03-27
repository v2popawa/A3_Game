// --------------------------------------------------
// Level 2 - Interview case
// Unique mechanic: record statements and compare them
// --------------------------------------------------

let suspects2 = [
  {
    name: "Taylor",
    isCulprit: false,
    answer: "I was at the florist at 8:10. I still have the printed receipt.",
    boardNote: "Receipt timestamp matches 8:10 PM.",
    demeanor:
      "Answers quickly and includes small details without being prompted.",
  },
  {
    name: "Jordan",
    isCulprit: true,
    answer: "I stayed outside the gallery the whole time.",
    boardNote:
      "Parking camera shows Jordan re-entering the gallery at 8:12 PM.",
    demeanor: "Repeats the same sentence too carefully, like it was rehearsed.",
  },
  {
    name: "Avery",
    isCulprit: false,
    answer: "I was packing the gift table when security shouted.",
    boardNote: "A staff member confirms Avery was beside the exit display.",
    demeanor: "Sounds irritated, but the story stays consistent.",
  },
  {
    name: "Morgan",
    isCulprit: false,
    answer: "I stepped outside for a phone call before the lights flickered.",
    boardNote: "Phone log shows a three-minute call beginning at 8:07 PM.",
    demeanor: "Does not like being questioned, but the timeline lines up.",
  },
];

let level2Stage = "intro";
let level2Mode = "lineup";
let selected2 = null;
let message2 = "";
let askMessage2 = "";
let convictMode2 = false;
let showBoard2 = false;
let questioned2 = [false, false, false, false];

function getLevel2Buttons() {
  return {
    begin: { x: width / 2, y: height * 0.74, w: 220, h: 52 },
    board: { x: width * 0.42, y: height * 0.84, w: 180, h: 50 },
    convict: { x: width * 0.62, y: height * 0.84, w: 180, h: 50 },
    back: { x: width * 0.14, y: height * 0.12, w: 120, h: 46 },
    ask: { x: width / 2, y: height * 0.82, w: 240, h: 50 },
  };
}

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
    "This case is about statements.\n\n" +
      "Question suspects one by one.\n" +
      "Open the board to compare what you have recorded.\n" +
      "One story breaks against the timeline.\n\n" +
      "Use the contradictions to convict the thief.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel2Lineup() {
  const buttons = getLevel2Buttons();
  const positions = getLineupPositions(suspects2.length);
  const recordedCount = questioned2.filter(Boolean).length;

  drawCaseHeader(
    "Level 2: Jewelry Theft",
    convictMode2
      ? "Convict mode: click the thief."
      : "Question suspects and compare the evidence board.",
  );

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.022);
  text(
    `Statements recorded: ${recordedCount}/${suspects2.length}`,
    width / 2,
    height * 0.22,
  );
  pop();

  for (let i = 0; i < suspects2.length; i++) {
    let fillColor = [170, 170, 170];

    if (questioned2[i]) fillColor = [90, 150, 210];
    if (convictMode2) fillColor = [170, 80, 80];

    drawSuspectToken(
      positions[i].x,
      positions[i].y,
      78,
      suspects2[i].name,
      fillColor,
    );
  }

  drawButton(buttons.board, "Board");
  drawButton(buttons.convict, convictMode2 ? "Cancel" : "Convict");
}

function drawLevel2Inspect() {
  const buttons = getLevel2Buttons();
  const suspect = suspects2[selected2];

  drawCaseHeader(
    "Interviewing " + suspect.name,
    "Record the statement and compare it against the board.",
  );

  push();
  fill(210);
  noStroke();
  ellipse(width / 2, height * 0.35, 180);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.022);
  text(
    suspect.demeanor,
    width / 2 - width * 0.28,
    height * 0.52,
    width * 0.56,
    70,
  );

  if (askMessage2) {
    textSize(min(width, height) * 0.022);
    text(
      "Statement: " + askMessage2,
      width / 2 - width * 0.3,
      height * 0.63,
      width * 0.6,
      95,
    );
  }
  pop();

  drawButton(buttons.back, "Back");
  drawButton(
    buttons.ask,
    questioned2[selected2] ? "Recorded" : "Record Statement",
  );
}

function drawLevel2Board() {
  push();
  fill(0, 180);
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

  let startY = height / 2 - panelH * 0.22;

  for (let i = 0; i < suspects2.length; i++) {
    const line = questioned2[i]
      ? `${suspects2[i].name}: ${suspects2[i].boardNote}`
      : `${suspects2[i].name}: statement not recorded yet.`;

    text(line, width / 2, startY + i * 58);
  }

  textSize(min(width, height) * 0.018);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.36);
  pop();
}

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
      message2 = convictMode2 ? "Select the thief." : "";
      return;
    }

    const positions = getLineupPositions(suspects2.length);

    for (let i = 0; i < suspects2.length; i++) {
      if (dist(mouseX, mouseY, positions[i].x, positions[i].y) < 39) {
        if (convictMode2) {
          finishCase(
            suspects2[i].isCulprit,
            "Correct! Jordan's story breaks against the evidence.",
            "Wrong suspect! The necklace is never recovered.",
            "level3",
            (msg) => {
              message2 = msg;
            },
          );
        } else {
          selected2 = i;
          level2Mode = "inspect";
          askMessage2 = questioned2[i] ? suspects2[i].answer : "";
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

    if (isOverButton(buttons.ask)) {
      questioned2[selected2] = true;
      askMessage2 = suspects2[selected2].answer;
      message2 = "Statement recorded to the board.";
    }
  }
}

function resetLevel2() {
  level2Stage = "intro";
  level2Mode = "lineup";
  selected2 = null;
  message2 = "";
  askMessage2 = "";
  convictMode2 = false;
  showBoard2 = false;
  questioned2 = [false, false, false, false];
}
