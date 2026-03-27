// --------------------------------------------------
// Shared UI + flow helpers
// Keeps UI logic separate from game logic
// --------------------------------------------------

let transitionPending = false;

// Draw a standard button
function drawButton(button, label, fillColor = [80, 110, 170]) {
  push();
  rectMode(CENTER);
  stroke(255);
  strokeWeight(2);
  fill(fillColor[0], fillColor[1], fillColor[2]);
  rect(button.x, button.y, button.w, button.h, 12);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(button.textSize || 18);
  text(label, button.x, button.y);
  pop();
}

// Mouse hit test for a centered button
function isOverButton(button) {
  return (
    mouseX > button.x - button.w / 2 &&
    mouseX < button.x + button.w / 2 &&
    mouseY > button.y - button.h / 2 &&
    mouseY < button.y + button.h / 2
  );
}

// Shared centered briefing panel for each level
function drawCenteredPanel(title, body, buttonLabel, button) {
  const panelW = min(width * 0.75, 720);
  const panelH = min(height * 0.62, 420);
  const panelX = width / 2;
  const panelY = height / 2;

  push();
  fill(0, 170);
  noStroke();
  rect(0, 0, width, height);
  pop();

  // Panel
  push();
  rectMode(CENTER);
  stroke(255);
  strokeWeight(2);
  fill(24, 30, 44, 245);
  rect(panelX, panelY, panelW, panelH, 18);
  pop();

  // Text
  push();
  fill(255);
  textAlign(CENTER, CENTER);

  const titleSize = min(width, height) * 0.045;
  const bodySize = min(width, height) * 0.024;
  const lineGap = 28;

  textSize(titleSize);

  let lines = body.split("\n");
  let visibleLines = [];

  // keep blank lines for spacing
  for (let i = 0; i < lines.length; i++) {
    visibleLines.push(lines[i]);
  }

  const bodyHeight = visibleLines.length * lineGap;
  const totalBlockHeight = 40 + 24 + bodyHeight;
  // 40 = title area, 24 = space between title and body

  let startY = panelY - totalBlockHeight / 2;

  // Title
  textSize(titleSize);
  text(title, panelX, startY + 20);

  // Body
  textSize(bodySize);
  let bodyStartY = startY + 40 + 24;

  for (let i = 0; i < visibleLines.length; i++) {
    text(visibleLines[i], panelX, bodyStartY + i * lineGap);
  }

  pop();

  drawButton(button, buttonLabel);
}

// Standard case header
function drawCaseHeader(title, subtitle = "") {
  push();
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.04);
  text(title, width / 2, height * 0.1);

  if (subtitle) {
    textSize(min(width, height) * 0.022);
    text(subtitle, width / 2, height * 0.1);
  }
  pop();
}

// Shared suspect placement so layout stays centered on any canvas size
function getLineupPositions(count) {
  const y = height * 0.5;
  const left = width * 0.18;
  const right = width * 0.82;

  if (count === 1) return [{ x: width / 2, y }];

  const step = (right - left) / (count - 1);
  const positions = [];

  for (let i = 0; i < count; i++) {
    positions.push({ x: left + i * step, y });
  }

  return positions;
}

// Draw a simple suspect token
function drawSuspectToken(x, y, size, name, fillColor) {
  push();
  noStroke();
  fill(fillColor[0], fillColor[1], fillColor[2]);
  ellipse(x, y, size);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(max(14, size * 0.16));
  text(name, x, y + size * 0.95);
  pop();
}

// Shared footer message area
function drawFooterMessage(message) {
  if (!message) return;

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.024);
  text(message, width / 2, height * 0.92);
  pop();
}

// Shared outcome handler to avoid repeated copied transition logic
function finishCase(
  isCorrect,
  successMessage,
  failureMessage,
  nextScreen,
  setMessage,
) {
  if (transitionPending) return;

  transitionPending = true;
  setMessage(isCorrect ? successMessage : failureMessage);

  setTimeout(() => {
    if (isCorrect) {
      currentScreen = nextScreen;
    } else {
      resetAllLevels();
      currentScreen = "start";
    }

    transitionPending = false;
  }, 900);
}

// Reset every level from one place
function resetAllLevels() {
  resetLevel1();
  resetLevel2();
  resetLevel3();
}
