// The story text lives in stories.js. This file only runs the game.
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

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function show(name) {
  for (const key in screens) screens[key].classList.toggle("hidden", key !== name);
  window.scrollTo(0, 0);
}

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
  document.getElementById("city-name").textContent = city;
  document.getElementById("city-line").textContent = STORIES[city].line;
  document.getElementById("trait-line").textContent = trait.line;
  show("birth");
}

function showEvent() {
  const stage = STORIES[city].stages[step];
  const possible = stage.events.filter(allowed);
  // Follow-ups (events that need a mark) are favoured when they can happen.
  const followUps = possible.filter((e) => e.needs);
  const event = followUps.length && Math.random() < 0.7 ? pick(followUps) : pick(possible);

  document.getElementById("event-count").textContent =
    stage.name + " · " + (step + 1) + "/" + STORIES[city].stages.length;
  document.getElementById("event-text").textContent = event.text;

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
}

function choose(choice) {
  const bonus = (choice.bonus && choice.bonus[trait.id]) || 0;
  const chance = Math.min(0.95, Math.max(0.05, choice.chance + bonus));
  const wentWell = Math.random() < chance;
  if (wentWell) goodCount++;
  const mark = wentWell ? choice.goodMark : choice.badMark;
  if (mark) marks.add(mark);
  document.getElementById("result-text").textContent = wentWell ? choice.good : choice.bad;
  show("result");
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
  document.getElementById("ending-title").textContent = ending.title;
  document.getElementById("ending-text").textContent = ending.text;
  show("ending");
}

document.getElementById("born-btn").addEventListener("click", beBorn);
document.getElementById("again-btn").addEventListener("click", beBorn);
document.getElementById("start-btn").addEventListener("click", showEvent);
document.getElementById("next-btn").addEventListener("click", next);
document.getElementById("restart-btn").addEventListener("click", beBorn);
