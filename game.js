// The story text lives in stories.js, the drawings in art.js.
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
let marks = new Set();  // things the cat remembers (see "mark" in stories.js)

const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function show(name) {
  for (const key in screens) screens[key].classList.toggle("hidden", key !== name);
  window.scrollTo(0, 0);
}

// The look of the page: which city, which coat, how the cat feels.
function setLook(key, value) {
  if (value) document.body.dataset[key] = value;
  else delete document.body.dataset[key];
}

// Writes a text letter by letter, with small pauses after punctuation.
// The buttons of the screen only appear once the text is complete.
// A tap anywhere on the screen shows the whole text at once.
let typing = null;

function typeText(el, text) {
  if (typing) typing.finish();
  const screen = el.closest(".screen");
  if (calm) {
    el.textContent = text;
    return;
  }
  screen.classList.add("waiting");
  const shown = document.createElement("span");
  const rest = document.createElement("span");
  rest.className = "rest";
  rest.textContent = text;
  el.replaceChildren(shown, rest);

  let i = 0;
  let timer = null;
  function tick() {
    i++;
    shown.textContent = text.slice(0, i);
    rest.textContent = text.slice(i);
    if (i >= text.length) return finish();
    const c = text[i - 1];
    const pause = ".!?…".includes(c) ? 280 : ",;:—".includes(c) ? 120 : 18;
    timer = setTimeout(tick, pause);
  }
  function finish() {
    clearTimeout(timer);
    el.textContent = text;
    screen.classList.remove("waiting");
    typing = null;
  }
  typing = { finish, screen };
  timer = setTimeout(tick, 350);
}

document.addEventListener("pointerdown", (e) => {
  if (typing && typing.screen.contains(e.target)) typing.finish();
});

// An event, choice outcome or ending can only happen if its marks allow it.
function allowed(item) {
  if (item.needs && !marks.has(item.needs)) return false;
  if (item.notIf && marks.has(item.notIf)) return false;
  return true;
}

function beBorn() {
  city = pick(Object.keys(STORIES));
  trait = pick(TRAITS);
  step = 0;
  goodCount = 0;
  marks = new Set();

  const coat = pick(COATS);
  document.body.style.cssText = coatStyle(coat);
  setLook("coat", coat.id);
  setLook("city", city);
  setLook("mood", "awake");
  setLook("tone", null);
  document.getElementById("horizon").innerHTML = SKYLINES[city] || "";
  document.getElementById("scene-city").innerHTML = SKYLINES[city] || "";

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
  const possible = stage.events.filter(allowed);
  // Follow-ups (events that need a mark) are favoured when they can happen.
  const followUps = possible.filter((e) => e.needs);
  const event = followUps.length && Math.random() < 0.7 ? pick(followUps) : pick(possible);

  setLook("mood", "awake");
  setLook("tone", null);
  document.getElementById("event-count").textContent =
    stage.name + " · " + (step + 1) + "/" + stages.length;

  // one paw per stage of life: done, now, still to come
  document.getElementById("paws").innerHTML = stages
    .map((s, n) => PAW_SVG.replace("<svg", `<svg class="${n < step ? "done" : n === step ? "now" : ""}"`))
    .join("");

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
  const bonus = (choice.bonus && choice.bonus[trait.id]) || 0;
  const chance = Math.min(0.95, Math.max(0.05, choice.chance + bonus));
  const wentWell = Math.random() < chance;
  if (wentWell) goodCount++;
  const mark = wentWell ? choice.goodMark : choice.badMark;
  if (mark) marks.add(mark);
  setLook("mood", wentWell ? "happy" : "sad");
  setLook("tone", wentWell ? "good" : "bad");
  show("result");
  typeText(document.getElementById("result-text"), wentWell ? choice.good : choice.bad);
}

function next() {
  step++;
  if (step < STORIES[city].stages.length) showEvent();
  else showEnding();
}

function showEnding() {
  const luck = goodCount * 2 >= STORIES[city].stages.length ? "lucky" : "unlucky";
  const endings = STORIES[city].endings.filter((e) => allowed(e) && (!e.luck || e.luck === luck));
  // Endings with conditions win over the plain ones.
  const special = endings.filter((e) => e.needs || e.luck);
  const ending = pick(special.length ? special : endings);
  setLook("mood", "asleep");
  setLook("tone", luck === "lucky" ? null : "bad");
  document.getElementById("ending-title").textContent = ending.title;
  show("ending");
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
