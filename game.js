// The story text lives in stories.js, the drawings in art.js, the rules
// of chance in rules.js, real cat facts in facts.js.
// This file only runs the game.
// New York comes in a later update.

const screens = {
  home: document.getElementById("home"),
  birth: document.getElementById("birth"),
  event: document.getElementById("event"),
  result: document.getElementById("result"),
  ending: document.getElementById("ending"),
};

let city = null;        // name of the city, e.g. "Rabat"
let trait = null;       // the cat's trait, from TRAITS
let step = 0;           // which life stage we are on
let goodCount = 0;      // how many choices went well
let badCount = 0;       // how many choices went badly
let marks = new Set();  // things the cat remembers (see "mark" in stories.js)

const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function show(name) {
  for (const key in screens) screens[key].classList.toggle("hidden", key !== name);
  window.scrollTo(0, 0);
}

// The look of the page: which city, which coat, how the cat feels.
function setLook(key, value) {
  if (value) document.body.dataset[key] = value;
  else delete document.body.dataset[key];
}

// Shows what happened to the cat: on the drawing, and as little stamps.
function showState() {
  setLook("marks", [...marks].join(" "));
  setLook("cond", conditionOf(goodCount, badCount));
}

function statePills() {
  const cond = conditionOf(goodCount, badCount);
  const pills = [];
  if (cond !== "ok") pills.push(`<span class="pill cond-${cond}">${CONDITIONS[cond].label}</span>`);
  for (const mark of marks) {
    const info = MARKS[mark];
    if (info) pills.push(`<span class="pill ${info.good ? "good" : "bad"}">${info.label}</span>`);
  }
  return pills.join("");
}

// Writes a text quickly, letter by letter, with short pauses after
// punctuation. Short texts appear at once, long ones never take more than
// about a second. The buttons only appear once the text is complete.
// A tap anywhere on the screen shows the whole text at once.
let typing = null;

function typeText(el, text) {
  if (typing) typing.finish();
  const screen = el.closest(".screen");
  if (calm || text.length < 70) {
    el.textContent = text;
    return;
  }
  screen.classList.add("waiting");
  const shown = document.createElement("span");
  const rest = document.createElement("span");
  rest.className = "rest";
  rest.textContent = text;
  el.replaceChildren(shown, rest);

  // when each letter appears, in milliseconds
  const perLetter = Math.min(8, 600 / text.length);
  const times = [];
  let t = 0;
  for (const c of text) {
    times.push(t);
    t += ".!?…".includes(c) ? 70 : ",;:—".includes(c) ? 25 : perLetter;
  }

  let i = 0;
  let frame = null;
  const start = performance.now() + 120;
  function tick(now) {
    while (i < text.length && times[i] <= now - start) i++;
    shown.textContent = text.slice(0, i);
    rest.textContent = text.slice(i);
    if (i >= text.length) return finish();
    frame = requestAnimationFrame(tick);
  }
  function finish() {
    cancelAnimationFrame(frame);
    el.textContent = text;
    screen.classList.remove("waiting");
    typing = null;
  }
  typing = { finish, screen };
  frame = requestAnimationFrame(tick);
}

document.addEventListener("pointerdown", (e) => {
  if (typing && typing.screen.contains(e.target)) typing.finish();
});

function beBorn() {
  city = pick(Object.keys(STORIES));
  trait = pick(TRAITS);
  step = 0;
  goodCount = 0;
  badCount = 0;
  marks = new Set();

  const coat = pick(COATS);
  document.body.style.cssText = coatStyle(coat);
  setLook("coat", coat.id);
  setLook("city", city);
  setLook("mood", "awake");
  setLook("tone", null);
  showState();
  document.getElementById("horizon").innerHTML = SKYLINES[city] || "";
  document.getElementById("scene-city").innerHTML = SKYLINES[city] || "";
  document.getElementById("confetti").replaceChildren();

  // the name of the city falls in letter by letter
  const name = document.getElementById("city-name");
  name.setAttribute("aria-label", city);
  name.replaceChildren(
    ...[...city].map((letter, n) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.setAttribute("aria-hidden", "true");
      span.style.animationDelay = 0.15 + n * 0.07 + "s";
      return span;
    })
  );
  document.getElementById("city-line").textContent = STORIES[city].line;
  document.getElementById("trait-line").textContent = trait.line;
  show("birth");
}

function showEvent() {
  const stages = STORIES[city].stages;
  const stage = stages[step];
  const event = drawEvent(stage, marks);

  setLook("mood", "awake");
  setLook("tone", null);
  document.getElementById("event-count").textContent =
    stage.name + " · " + (step + 1) + "/" + stages.length;

  // one paw per stage of life: done, now, still to come
  document.getElementById("paws").innerHTML = stages
    .map((s, n) => PAW_SVG.replace("<svg", `<svg class="${n < step ? "done" : n === step ? "now" : ""}"`))
    .join("");
  document.getElementById("status").innerHTML = statePills();

  const box = document.getElementById("choices");
  box.replaceChildren();
  event.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = choice.label;
    btn.addEventListener("click", () => choose(choice));
    box.appendChild(btn);
  });
  show("event");
  typeText(document.getElementById("event-text"), event.text);
}

function choose(choice) {
  const condBefore = conditionOf(goodCount, badCount);
  const wentWell = rollChoice(choice, trait);
  if (wentWell) goodCount++;
  else badCount++;
  const mark = wentWell ? choice.goodMark : choice.badMark;
  const isNew = mark && !marks.has(mark);
  if (mark) marks.add(mark);
  const cond = conditionOf(goodCount, badCount);

  // what the cat just won or lost
  const gains = [];
  if (isNew && MARKS[mark]) {
    const info = MARKS[mark];
    gains.push(`<p class="gain ${info.good ? "good" : "bad"}">${info.good ? "+ " : ""}${info.label}</p>`);
  }
  if (cond !== condBefore && CONDITIONS[cond].gained) {
    gains.push(`<p class="gain ${cond === "strong" ? "good" : "bad"}">${CONDITIONS[cond].label}</p>`);
    gains.push(`<p class="gain-line">${CONDITIONS[cond].gained}</p>`);
  }
  document.getElementById("gains").innerHTML = gains.join("");

  setLook("mood", wentWell ? "happy" : "sad");
  setLook("tone", wentWell ? "good" : "bad");
  showState();
  show("result");
  typeText(document.getElementById("result-text"), wentWell ? choice.good : choice.bad);
}

function next() {
  step++;
  if (step < STORIES[city].stages.length) showEvent();
  else showEnding();
}

// Endings already found, kept in this browser only.
function rememberEnding(title) {
  let found = {};
  try {
    found = JSON.parse(localStorage.getItem("born-a-cat:found")) || {};
  } catch (e) {}
  const list = found[city] || [];
  const isNew = !list.includes(title);
  if (isNew) list.push(title);
  found[city] = list;
  try {
    localStorage.setItem("born-a-cat:found", JSON.stringify(found));
  } catch (e) {}
  return { count: list.length, isNew };
}

function factFor(ending) {
  const key = ENDING_FACTS[ending.title] || pick(CITY_FACTS[city] || Object.keys(FACTS));
  return FACTS[key];
}

function oddsLine(odds) {
  if (!odds) return "";
  if (odds >= 0.2) return `<strong>${Math.round(odds * 100)}%</strong> of lives in ${city} end like this`;
  return `Only <strong>1 life in ${Math.round(1 / odds)}</strong> in ${city} ends like this`;
}

function throwConfetti(count) {
  const box = document.getElementById("confetti");
  box.replaceChildren();
  if (calm) return;
  for (let n = 0; n < count; n++) {
    const bit = document.createElement("i");
    bit.style.left = Math.random() * 100 + "%";
    bit.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    bit.style.animationDelay = Math.random() * 1.5 + "s";
    bit.style.scale = 0.6 + Math.random();
    if (n % 3 === 0) bit.style.background = "var(--accent)";
    box.appendChild(bit);
  }
}

function showEnding() {
  const { ending, luck } = drawEnding(city, marks, goodCount);
  const odds = (ODDS[city] || {})[ending.title];
  const rarity = odds ? rarityOf(odds) : "common";
  const found = rememberEnding(ending.title);
  const fact = factFor(ending);

  setLook("mood", "asleep");
  setLook("tone", luck === "lucky" ? null : "bad");
  showState();

  const card = document.getElementById("end-card");
  card.dataset.rarity = rarity;
  document.getElementById("rarity").textContent =
    { common: "Ending", uncommon: "Uncommon ending", rare: "★ Rare ending ★", legendary: "★ Legendary ending ★" }[rarity];
  document.getElementById("end-city").textContent = "A cat of " + city;
  document.getElementById("ending-title").textContent = ending.title;
  document.getElementById("odds").innerHTML = oddsLine(odds);
  document.getElementById("end-status").innerHTML = statePills();
  document.getElementById("fact").innerHTML = fact
    ? `<b>Real cats</b><br>${fact.text}<br><a href="${fact.url}" target="_blank" rel="noopener">${fact.source}</a>`
    : "";
  document.getElementById("found").innerHTML =
    (found.isNew ? '<span class="new">New ending!</span> · ' : "") +
    `Endings found in ${city}: ${found.count} / ${STORIES[city].endings.length}`;

  show("ending");
  if (rarity === "rare") throwConfetti(40);
  if (rarity === "legendary") throwConfetti(90);
  typeText(document.getElementById("ending-text"), ending.text);
}

// Draw the cat everywhere it appears, with a coat for the home screen.
document.querySelectorAll(".cat-slot").forEach((slot) => (slot.innerHTML = CAT_SVG));
document.body.style.cssText = coatStyle(COATS[0]);

document.getElementById("born-btn").addEventListener("click", beBorn);
document.getElementById("again-btn").addEventListener("click", beBorn);
document.getElementById("start-btn").addEventListener("click", showEvent);
document.getElementById("next-btn").addEventListener("click", next);
document.getElementById("restart-btn").addEventListener("click", beBorn);
