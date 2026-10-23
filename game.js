// The story text lives in stories.js. This file only runs the game.
// New York comes in a later update.

const screens = {
  home: document.getElementById("home"),
  birth: document.getElementById("birth"),
  event: document.getElementById("event"),
  result: document.getElementById("result"),
  ending: document.getElementById("ending"),
};

let city = null;      // name of the city, e.g. "Rabat"
let step = 0;         // which event we are on
let goodCount = 0;    // how many choices went well

function show(name) {
  for (const key in screens) screens[key].classList.toggle("hidden", key !== name);
  window.scrollTo(0, 0);
}

function beBorn() {
  const names = Object.keys(STORIES);
  city = names[Math.floor(Math.random() * names.length)];
  step = 0;
  goodCount = 0;
  document.getElementById("city-name").textContent = city;
  document.getElementById("city-line").textContent = STORIES[city].line;
  show("birth");
}

function showEvent() {
  const event = STORIES[city].events[step];
  document.getElementById("event-count").textContent =
    "Chapter " + (step + 1) + " of " + STORIES[city].events.length;
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
  const wentWell = Math.random() < choice.chance;
  if (wentWell) goodCount++;
  document.getElementById("result-text").textContent = wentWell ? choice.good : choice.bad;
  show("result");
}

function next() {
  step++;
  if (step < STORIES[city].events.length) showEvent();
  else showEnding();
}

function showEnding() {
  const ending = STORIES[city].ending;
  const lucky = goodCount * 2 >= STORIES[city].events.length;
  document.getElementById("ending-title").textContent = ending.title;
  document.getElementById("ending-text").textContent = ending.text;
  document.getElementById("ending-last").textContent = lucky ? ending.lucky : ending.unlucky;
  show("ending");
}

document.getElementById("born-btn").addEventListener("click", beBorn);
document.getElementById("again-btn").addEventListener("click", beBorn);
document.getElementById("start-btn").addEventListener("click", showEvent);
document.getElementById("next-btn").addEventListener("click", next);
document.getElementById("restart-btn").addEventListener("click", beBorn);
