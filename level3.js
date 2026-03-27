// --------------------------------------------------
// Level 3 - Final case
// Keeps features from earlier levels:
// - inspect
// - magnify
// - convict
// - ask question
// - evidence board
//
// Adds new Level 3 features:
// - notebook
// - forensics
// --------------------------------------------------

let suspects3 = [
  {
    name: "Noah",
    isCulprit: false,
    appearance: "Uniform is tidy. Sleeves are rolled evenly.",
    magnifiedClue: "Bus lint on the cuff, but no gray toner dust.",
    interview: "My shift ended at 9:00, and I caught the bus straight home.",
    boardNote: "Transit stamp places Noah at the bus stop by 9:07 PM.",
    notebook: "Bus pass stamped 9:07 PM. Timeline checks out.",
  },
  {
    name: "Riley",
    isCulprit: false,
    appearance: "Jacket hem is muddy from the loading bay.",
    magnifiedClue:
      "Mud and gravel from outside, nothing from the records room carpet.",
    interview: "I heard the scream from the loading bay and ran over.",
    boardNote: "Security guard confirms Riley was near the loading dock.",
    notebook: "Boot print pattern matches the loading bay only.",
  },
  {
    name: "Casey",
    isCulprit: true,
    appearance: "Dark blazer. Right cuff looks recently brushed clean.",
    magnifiedClue: "A faint gray powder is trapped inside the right cuff seam.",
    interview: "I never went near the records room tonight.",
    boardNote: "Casey changed the timeline twice during questioning.",
    notebook: "Changed the story twice about where they were after 8:30.",
  },
  {
    name: "Jamie",
    isCulprit: false,
    appearance:
      "Front desk uniform still has a clipped visitor badge attached.",
    magnifiedClue: "Badge clip scratch and pen ink, but no toner residue.",
    interview: "I stayed at the front desk until police arrived.",
    boardNote: "Badge log shows Jamie remained at reception.",
    notebook: "Reception camera confirms Jamie stayed at the desk.",
  },
];

let level3Stage = "intro";
let level3Mode = "lineup";
let selected3 = null;

let message3 = "";
let askMessage3 = "";
let magnifyMessage3 = "";

let convictMode3 = false;

let showNotebook3 = false;
let showForensics3 = false;
let showBoard3 = false;

let forensicsLeft3 = 1;
let forensicMessage3 = "";
let questioned3 = [false, false, false, false];

function getLevel3Buttons() {
  return {
    begin: { x: width / 2, y: height * 0.74, w: 220, h: 52 },
    board: { x: width * 0.3, y: height * 0.84, w: 160, h: 50 },
    forensics: { x: width * 0.5, y: height * 0.84, w: 170, h: 50 },
    convict: { x: width * 0.7, y: height * 0.84, w: 160, h: 50 },
    back: { x: width * 0.12, y: height * 0.12, w: 110, h: 44 },
    magnify: { x: width * 0.38, y: height * 0.84, w: 160, h: 50 },
    ask: { x: width * 0.56, y: height * 0.84, w: 160, h: 50 },
    notebook: { x: width * 0.74, y: height * 0.84, w: 160, h: 50 },
  };
}

function drawLevel3() {
  background(38, 48, 60);

  if (level3Stage === "intro") {
    drawLevel3Intro();
  } else if (level3Mode === "lineup") {
    drawLevel3Lineup();
  } else {
    drawLevel3Inspect();
  }

  if (showNotebook3) drawNotebook3();
  if (showForensics3) drawForensicsPanel3();
  if (showBoard3) drawBoard3();

  drawFooterMessage(message3);
}

function drawLevel3Intro() {
  const buttons = getLevel3Buttons();

  drawCenteredPanel(
    "Level 3: Murder Case",
    "Level 3 keeps everything from the earlier levels.\n\n" +
      "You can inspect, magnify, question, and review the evidence board.\n" +
      "Now you also get notebook notes and one forensic check.\n\n" +
      "Use every tool together before you convict.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel3Lineup() {
  const buttons = getLevel3Buttons();
  const positions = getLineupPositions(suspects3.length);

  drawCaseHeader(
    "Level 3: Murder Case",
    convictMode3
      ? "Convict mode: click the killer."
      : "All previous tools stay active here, plus notebook and forensics.",
  );

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.022);
  text(`Forensics left: ${forensicsLeft3}`, width / 2, height * 0.22);
  pop();

  for (let i = 0; i < suspects3.length; i++) {
    let fillColor = [170, 170, 170];
    if (questioned3[i]) fillColor = [90, 150, 210];
    if (convictMode3) fillColor = [170, 80, 80];

    drawSuspectToken(
      positions[i].x,
      positions[i].y,
      78,
      suspects3[i].name,
      fillColor,
    );
  }

  drawButton(buttons.board, "Board");
  drawButton(buttons.forensics, "Forensics");
  drawButton(buttons.convict, convictMode3 ? "Cancel" : "Convict");
}

function drawLevel3Inspect() {
  const buttons = getLevel3Buttons();
  const suspect = suspects3[selected3];

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "Magnify, interview, and notebook all work together here.",
  );

  push();
  fill(210);
  noStroke();
  ellipse(width / 2, height * 0.32, 180);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.022);

  text(
    "Visual read: " + suspect.appearance,
    width / 2 - width * 0.3,
    height * 0.46,
    width * 0.6,
    60,
  );

  if (magnifyMessage3) {
    text(
      "Magnify: " + magnifyMessage3,
      width / 2 - width * 0.3,
      height * 0.56,
      width * 0.6,
      70,
    );
  }

  if (askMessage3) {
    text(
      "Interview: " + askMessage3,
      width / 2 - width * 0.3,
      height * 0.68,
      width * 0.6,
      85,
    );
  }

  pop();

  drawButton(buttons.back, "Back");
  drawButton(buttons.magnify, "Magnify");
  drawButton(buttons.ask, questioned3[selected3] ? "Asked" : "Interview");
  drawButton(buttons.notebook, "Notebook");
}

function drawNotebook3() {
  push();
  fill(0, 180);
  noStroke();
  rect(0, 0, width, height);

  rectMode(CENTER);
  fill(248, 245, 230);
  stroke(255);
  strokeWeight(2);

  const panelW = min(width * 0.72, 680);
  const panelH = min(height * 0.52, 360);
  rect(width / 2, height / 2, panelW, panelH, 16);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.034);
  text("Notebook", width / 2, height / 2 - panelH * 0.32);

  textSize(min(width, height) * 0.023);
  textLeading(28);
  text(
    suspects3[selected3].notebook,
    width / 2 - panelW * 0.35,
    height / 2 - panelH * 0.08,
    panelW * 0.7,
    panelH * 0.34,
  );

  textSize(min(width, height) * 0.018);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.32);
  pop();
}

function drawForensicsPanel3() {
  push();
  fill(0, 180);
  noStroke();
  rect(0, 0, width, height);

  rectMode(CENTER);
  fill(240);
  stroke(255);
  strokeWeight(2);

  const panelW = min(width * 0.74, 700);
  const panelH = min(height * 0.44, 300);
  rect(width / 2, height / 2, panelW, panelH, 16);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.034);
  text("Forensics", width / 2, height / 2 - panelH * 0.28);

  textSize(min(width, height) * 0.023);
  textLeading(28);
  text(
    forensicMessage3,
    width / 2 - panelW * 0.35,
    height / 2 - panelH * 0.02,
    panelW * 0.7,
    panelH * 0.3,
  );

  textSize(min(width, height) * 0.018);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.28);
  pop();
}

function drawBoard3() {
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

  const startY = height / 2 - panelH * 0.22;

  for (let i = 0; i < suspects3.length; i++) {
    const line = questioned3[i]
      ? `${suspects3[i].name}: ${suspects3[i].boardNote}`
      : `${suspects3[i].name}: interview not recorded yet.`;

    text(line, width / 2, startY + i * 58);
  }

  textSize(min(width, height) * 0.018);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.36);
  pop();
}

function level3MousePressed() {
  if (transitionPending) return;

  if (showNotebook3) {
    showNotebook3 = false;
    return;
  }

  if (showForensics3) {
    showForensics3 = false;
    return;
  }

  if (showBoard3) {
    showBoard3 = false;
    return;
  }

  const buttons = getLevel3Buttons();

  if (level3Stage === "intro") {
    if (isOverButton(buttons.begin)) {
      level3Stage = "play";
    }
    return;
  }

  if (level3Mode === "lineup") {
    if (isOverButton(buttons.board)) {
      showBoard3 = true;
      return;
    }

    if (isOverButton(buttons.forensics)) {
      if (forensicsLeft3 <= 0) {
        message3 = "No forensic checks left.";
      } else {
        forensicsLeft3--;
        forensicMessage3 =
          "Lab report: gray toner dust was found on the killer's right cuff.";
        showForensics3 = true;
        message3 = "Forensic clue added.";
      }
      return;
    }

    if (isOverButton(buttons.convict)) {
      convictMode3 = !convictMode3;
      message3 = convictMode3 ? "Select the killer." : "";
      return;
    }

    const positions = getLineupPositions(suspects3.length);

    for (let i = 0; i < suspects3.length; i++) {
      if (dist(mouseX, mouseY, positions[i].x, positions[i].y) < 39) {
        if (convictMode3) {
          finishCase(
            suspects3[i].isCulprit,
            "Correct! Casey is the killer.",
            "Wrong suspect! The case goes cold.",
            "win",
            (msg) => {
              message3 = msg;
            },
          );
        } else {
          selected3 = i;
          level3Mode = "inspect";
          askMessage3 = questioned3[i] ? suspects3[i].interview : "";
          magnifyMessage3 = "";
          message3 = "";
        }
        return;
      }
    }
  } else {
    if (isOverButton(buttons.back)) {
      level3Mode = "lineup";
      return;
    }

    if (isOverButton(buttons.magnify)) {
      magnifyMessage3 = suspects3[selected3].magnifiedClue;
      return;
    }

    if (isOverButton(buttons.ask)) {
      questioned3[selected3] = true;
      askMessage3 = suspects3[selected3].interview;
      message3 = "Interview recorded to the board.";
      return;
    }

    if (isOverButton(buttons.notebook)) {
      showNotebook3 = true;
      return;
    }
  }
}

function resetLevel3() {
  level3Stage = "intro";
  level3Mode = "lineup";
  selected3 = null;
  message3 = "";
  askMessage3 = "";
  magnifyMessage3 = "";
  convictMode3 = false;
  showNotebook3 = false;
  showForensics3 = false;
  showBoard3 = false;
  forensicsLeft3 = 1;
  forensicMessage3 = "";
  questioned3 = [false, false, false, false];
}
