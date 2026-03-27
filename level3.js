// --------------------------------------------------
// Level 3 - Final case
// Unique mechanic: notebook + one forensic clue
// --------------------------------------------------

let suspects3 = [
  {
    name: "Noah",
    isCulprit: false,
    appearance: "Uniform is tidy. Sleeves are rolled evenly.",
    interview: "My shift ended at 9:00, and I caught the bus straight home.",
    notebook: "Bus pass stamped 9:07 PM. Timeline checks out.",
  },
  {
    name: "Riley",
    isCulprit: false,
    appearance: "Jacket hem is muddy from the loading bay.",
    interview: "I heard the scream from the loading bay and ran over.",
    notebook: "Security guard confirms Riley was near the loading dock.",
  },
  {
    name: "Casey",
    isCulprit: true,
    appearance: "Dark blazer. Right cuff looks recently brushed clean.",
    interview: "I never went near the records room tonight.",
    notebook: "Changed the story twice about where they were after 8:30.",
  },
  {
    name: "Jamie",
    isCulprit: false,
    appearance:
      "Front desk uniform still has a clipped visitor badge attached.",
    interview: "I stayed at the front desk until police arrived.",
    notebook: "Badge log shows Jamie remained at reception.",
  },
];

let level3Stage = "intro";
let level3Mode = "lineup";
let selected3 = null;
let message3 = "";
let askMessage3 = "";
let convictMode3 = false;

let showNotebook3 = false;
let showForensics3 = false;
let forensicsLeft3 = 1;
let forensicMessage3 = "";

function getLevel3Buttons() {
  return {
    begin: { x: width / 2, y: height * 0.74, w: 220, h: 52 },
    forensics: { x: width * 0.4, y: height * 0.84, w: 190, h: 50 },
    convict: { x: width * 0.62, y: height * 0.84, w: 180, h: 50 },
    back: { x: width * 0.14, y: height * 0.12, w: 120, h: 46 },
    ask: { x: width * 0.46, y: height * 0.82, w: 180, h: 50 },
    notebook: { x: width * 0.66, y: height * 0.82, w: 180, h: 50 },
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

  drawFooterMessage(message3);
}

function drawLevel3Intro() {
  const buttons = getLevel3Buttons();

  drawCenteredPanel(
    "Level 3: Murder Case",
    "Final case.\n\n" +
      "Inspect appearances, interview suspects, and open notebook notes.\n" +
      "You have one forensic clue for the whole case.\n" +
      "Use it carefully.\n\n" +
      "Combine all evidence before you convict.",
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
      : "Use notebook evidence and one forensic clue.",
  );

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.022);
  text(`Forensics left: ${forensicsLeft3}`, width / 2, height * 0.22);
  pop();

  for (let i = 0; i < suspects3.length; i++) {
    const fillColor = convictMode3 ? [170, 80, 80] : [170, 170, 170];
    drawSuspectToken(
      positions[i].x,
      positions[i].y,
      78,
      suspects3[i].name,
      fillColor,
    );
  }

  drawButton(buttons.forensics, "Forensics");
  drawButton(buttons.convict, convictMode3 ? "Cancel" : "Convict");
}

function drawLevel3Inspect() {
  const buttons = getLevel3Buttons();
  const suspect = suspects3[selected3];

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "Compare appearance, interview, and notebook notes.",
  );

  push();
  fill(210);
  noStroke();
  ellipse(width / 2, height * 0.33, 180);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.022);
  text(
    "Appearance: " + suspect.appearance,
    width / 2 - width * 0.3,
    height * 0.5,
    width * 0.6,
    70,
  );

  if (askMessage3) {
    text(
      "Interview: " + askMessage3,
      width / 2 - width * 0.3,
      height * 0.61,
      width * 0.6,
      90,
    );
  }
  pop();

  drawButton(buttons.back, "Back");
  drawButton(buttons.ask, "Interview");
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

  const buttons = getLevel3Buttons();

  if (level3Stage === "intro") {
    if (isOverButton(buttons.begin)) {
      level3Stage = "play";
    }
    return;
  }

  if (level3Mode === "lineup") {
    if (isOverButton(buttons.forensics)) {
      if (forensicsLeft3 <= 0) {
        message3 = "No forensic checks left.";
      } else {
        forensicsLeft3--;
        forensicMessage3 =
          "Lab report: toner dust was found on the killer's right cuff.";
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
          askMessage3 = "";
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

    if (isOverButton(buttons.ask)) {
      askMessage3 = suspects3[selected3].interview;
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
  convictMode3 = false;
  showNotebook3 = false;
  showForensics3 = false;
  forensicsLeft3 = 1;
  forensicMessage3 = "";
}
