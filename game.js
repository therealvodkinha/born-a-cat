// The story text lives in stories.js, the drawings in art.js, the rules
// of chance in rules.js, real cat facts in facts.js.
// This file only runs the game: screens, gauges, gestures, effects.
// New York comes in a later update.

const screens = {
  home: document.getElementById("home"),
  birth: document.getElementById("birth"),
  time: document.getElementById("time"),
  event: document.getElementById("event"),
  result: document.getElementById("result"),
  farewell: document.getElementById("farewell"),
  ending: document.getElementById("ending"),
};

let life = null; // the cat's whole life, see newLife() in rules.js

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
  setLook("marks", [...life.marks].join(" "));
  setLook("cond", conditionOf(life));
  const chapter = stepOf(life).chapterIndex;
  setLook("age", chapter <= 1 ? "kitten" : chapter === LIFE.length - 1 ? "old" : "adult");
  // the drawing grows with the cat, and gets fatter or thinner with food
  const size = 0.45 + 0.55 * Math.min(1.1, sizeOf(life) / 46);
  SOUND.size = size;
  SOUND.kitten = chapter <= 1;
  document.body.style.setProperty("--size", size.toFixed(3));
  document.body.style.setProperty("--fat", (1 + 0.07 * life.fed).toFixed(3));
}

function statePills() {
  const cond = conditionOf(life);
  const pills = [];
  if (cond !== "ok") pills.push(`<span class="pill cond-${cond}">${CONDITIONS[cond].label}</span>`);
  for (const mark of life.marks) {
    const info = MARKS[mark];
    if (info) pills.push(`<span class="pill ${info.good ? "good" : "bad"}">${info.label}</span>`);
  }
  return pills.join("");
}

// ------------------------------------------------------------
// The cat card: the cat, and its stats as little gauges.
// ------------------------------------------------------------
const GAUGES = [
  { key: "health", name: "Health" },
  { key: "happy", name: "Happiness" },
  { key: "strength", name: "Strength" },
];

function buildCard(card) {
  card.innerHTML =
    `<div class="mini-cat cat-slot">${CAT_SVG}<div class="hearts"></div></div>` +
    `<div class="gauges"><p class="card-name"></p>` +
    GAUGES.map(
      (g) =>
        `<div class="gauge" data-k="${g.key}"><span class="g-name">${g.name}</span>` +
        `<span class="g-bar"><i></i></span><b class="g-delta"></b></div>`
    ).join("") +
    `<p class="g-body"><span class="kg"></span> · <span class="cm"></span><b class="g-delta kg-delta"></b></p>` +
    `</div>`;
}

// Updates a card. With "change", the gauges first show the old values,
// then slide to the new ones, with the difference popping up.
function updateCard(card, change) {
  card.querySelector(".card-name").textContent = life.name;
  const set = () => {
    for (const g of GAUGES) {
      const v = life.stats[g.key];
      const el = card.querySelector(`[data-k="${g.key}"]`);
      el.querySelector("i").style.width = v + "%";
      el.classList.toggle("low", g.key !== "strength" && v <= 25);
    }
    card.querySelector(".kg").textContent = weightOf(life).toFixed(1) + " kg";
    card.querySelector(".cm").textContent = sizeOf(life) + " cm";
  };
  for (const d of card.querySelectorAll(".g-delta")) {
    d.textContent = "";
    d.className = d.className.replace(/ (up|down)/g, "");
  }
  if (!change) return set();

  // old values first
  for (const g of GAUGES) {
    const old = life.stats[g.key] - change[g.key];
    const i = card.querySelector(`[data-k="${g.key}"] i`);
    i.style.transition = "none";
    i.style.width = old + "%";
  }
  card.offsetWidth; // let the browser draw the old values
  for (const i of card.querySelectorAll(".g-bar i")) i.style.transition = "";
  requestAnimationFrame(() => {
    set();
    for (const g of GAUGES) {
      const n = change[g.key];
      if (!n) continue;
      const d = card.querySelector(`[data-k="${g.key}"] .g-delta`);
      d.textContent = (n > 0 ? "+" : "−") + Math.abs(n);
      d.classList.add(n > 0 ? "up" : "down");
    }
    if (change.kg) {
      const d = card.querySelector(".kg-delta");
      d.textContent = (change.kg > 0 ? "+" : "−") + Math.abs(change.kg).toFixed(1);
      d.classList.add(change.kg > 0 ? "up" : "down");
    }
  });
}

// Little hearts flying out of the cat.
function hearts(card, count) {
  const box = card.querySelector(".hearts");
  box.replaceChildren();
  if (calm) return;
  for (let n = 0; n < count; n++) {
    const h = document.createElement("i");
    h.textContent = "♥";
    h.style.left = 20 + Math.random() * 60 + "%";
    h.style.animationDelay = 0.2 + n * 0.12 + "s";
    h.style.setProperty("--drift", (Math.random() * 40 - 20).toFixed(0) + "px");
    box.appendChild(h);
  }
}

// The whole screen shakes and flashes red when the cat gets hurt.
function hit() {
  if (calm) return;
  document.body.classList.remove("hit");
  document.body.offsetWidth;
  document.body.classList.add("hit");
  setTimeout(() => document.body.classList.remove("hit"), 700);
}

// ------------------------------------------------------------
// Text that types itself.
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// A life, step by step.
// ------------------------------------------------------------
function beBorn() {
  life = newLife(pick(Object.keys(STORIES)));
  const coat = COATS.find((c) => c.id === life.coat);
  [life.name, life.nameMeaning] = nameFor(life.city, coat.id);

  document.body.style.cssText = coatStyle(coat);
  setLook("coat", coat.id);
  setLook("city", life.city);
  setLook("mood", "awake");
  setLook("tone", null);
  showState();
  document.getElementById("horizon").innerHTML = SKYLINES[life.city] || "";
  document.getElementById("scene-city").innerHTML = SKYLINES[life.city] || "";
  document.getElementById("road-city").innerHTML = SKYLINES[life.city] || "";
  document.getElementById("confetti").replaceChildren();

  // the name of the city falls in letter by letter
  const name = document.getElementById("city-name");
  name.setAttribute("aria-label", life.city);
  name.replaceChildren(
    ...[...life.city].map((letter, n) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.setAttribute("aria-hidden", "true");
      span.style.animationDelay = 0.15 + n * 0.07 + "s";
      return span;
    })
  );
  document.getElementById("origin-line").textContent = STORIES[life.city].origins[life.origin];
  document.getElementById("breed-line").textContent = BREEDS[life.breed].line;
  document.getElementById("coat-line").textContent = COAT_LINES[coat.id] || "";
  rollOrigin();
  document.getElementById("trait-line").textContent = life.trait.line;
  document.getElementById("name-line").innerHTML = `They call you <strong>${life.name}</strong>`;
  document.getElementById("name-meaning").textContent = life.nameMeaning;
  show("birth");
  SOUND.music(life.city);
  SOUND.mood("day");
  SOUND.play("meow", 0.6);
}

// Where the cat is born is drawn like a lottery: the stamps flicker, then
// one lands. A tap lands it at once.
function rollOrigin() {
  const box = document.getElementById("origin");
  const stamp = document.getElementById("origin-stamp");
  const odds = document.getElementById("origin-odds");
  const ids = Object.keys(ORIGINS);
  const land = () => {
    clearInterval(rollOrigin.timer);
    clearTimeout(rollOrigin.stop);
    if (!box.classList.contains("rolling")) return;
    stamp.textContent = ORIGINS[life.origin].label;
    const chance = ORIGINS[life.origin].chance;
    odds.textContent = chance >= 0.5 ? `Like ${Math.round(chance * 100)}% of cats` : `Only ${Math.round(chance * 100)}% of cats start like this`;
    box.classList.remove("rolling");
    box.classList.add("landed");
    SOUND.play(life.origin === "home" ? "perfect" : "pop");
  };
  rollOrigin.land = land;
  box.classList.remove("landed");
  box.classList.add("rolling");
  odds.textContent = "";
  let n = 0;
  stamp.textContent = ORIGINS[ids[0]].label;
  rollOrigin.timer = setInterval(() => (stamp.textContent = ORIGINS[ids[++n % ids.length]].label), 110);
  rollOrigin.stop = setTimeout(land, calm ? 300 : 2200);
}
screens.birth.addEventListener("click", (e) => {
  if (!e.target.closest("button") && rollOrigin.land) rollOrigin.land();
});

// A new step: the cat grows, and walks across the screen while its age
// changes. At the start of a new chapter of life, the walk is followed by a
// true fact, and the player goes on when ready. Otherwise it goes on alone.
function startStep() {
  const step = stepOf(life);
  const prev = life.step === 0 ? null : STEPS[life.step - 1];
  const newChapter = !prev || prev.chapter !== step.chapter;
  beginStep(life);
  showState();
  setLook("mood", "awake");
  setLook("tone", null);

  const screen = screens.time;
  const age = document.getElementById("time-age");
  document.getElementById("time-chapter").textContent = newChapter ? step.chapter.name : "";
  age.textContent = prev ? prev.age : "Born";
  age.className = "";
  const fact = newChapter ? freshFact([], CITY_FACTS[life.city]) : null;
  document.getElementById("time-fact").innerHTML = fact
    ? `<b>Did you know?</b><br>${fact.text}<br><a href="${fact.url}" target="_blank" rel="noopener">${fact.source}</a>`
    : "";
  document.querySelector("#time .walker").innerHTML = WALK_SVG; // restarts the walk
  screen.classList.add("waiting");
  show("time");
  SOUND.mood("day");
  SOUND.play("steps", 0.1);
  if (Math.random() < 0.5) SOUND.play("city-" + life.city, 0.3);
  if (newChapter) SOUND.play("chapter", calm ? 0.6 : 2.6);

  const walk = calm ? 600 : 2600;
  clearTimeout(startStep.timer);
  clearTimeout(startStep.swap);
  startStep.swap = setTimeout(() => {
    age.textContent = step.age;
    age.className = "new-age";
  }, walk * 0.5);
  // the end of the walk, now or when the timer runs out
  startStep.skip = () => {
    clearTimeout(startStep.timer);
    clearTimeout(startStep.swap);
    startStep.skip = null;
    age.textContent = step.age;
    if (!age.className) age.className = "new-age";
    screen.classList.remove("waiting");
    screen.classList.add("skipped");
    if (!newChapter) showEvent();
  };
  screen.classList.remove("skipped");
  startStep.timer = setTimeout(() => {
    screen.classList.remove("waiting");
    if (startStep.skip) {
      startStep.skip = null;
      if (!newChapter) showEvent();
    }
  }, walk);
}

// A tap during the walk skips it. A tap on a chapter card goes on.
screens.time.addEventListener("click", (e) => {
  if (e.target.closest("a, button")) return;
  if (startStep.skip) startStep.skip();
  else showEvent();
});

function showEvent() {
  clearTimeout(startStep.timer);
  clearTimeout(startStep.swap);
  const step = stepOf(life);
  const event = drawEvent(life);

  setLook("mood", "awake");
  setLook("tone", null);
  document.getElementById("event-count").textContent = step.chapter.name + " · " + step.age;
  // one paw per step lived, never the ones still to come
  document.getElementById("paws").innerHTML = STEPS.slice(0, life.step + 1)
    .map((s, n) => PAW_SVG.replace("<svg", `<svg class="${n < life.step ? "done" : "now"}"`))
    .join("");
  updateCard(document.getElementById("event-card"));
  document.getElementById("status").innerHTML = statePills();

  const box = document.getElementById("choices");
  box.replaceChildren();
  box.classList.remove("hidden");
  document.getElementById("gesture").classList.add("hidden");
  event.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = choice.label;
    if (choice.gesture) btn.dataset.gesture = choice.gesture;
    btn.addEventListener("click", () => (choice.gesture ? startGesture(choice) : choose(choice, 0)));
    box.appendChild(btn);
  });
  show("event");
  showEvent.event = event;
  typeText(document.getElementById("event-text"), event.text);
  if (/\bdogs?\b/i.test(event.text)) SOUND.play("bark", 0.4);
}

// ------------------------------------------------------------
// Gestures: some choices are not just a tap.
//   pounce: tap when the paw crosses the gold zone
//   hold:   keep your finger down until the circle is full
//   run:    tap as fast as you can
// Each one gives a "skill" bonus or malus to the chance (see GESTURES).
// ------------------------------------------------------------
function startGesture(choice) {
  document.getElementById("choices").classList.add("hidden");
  const panel = document.getElementById("gesture");
  panel.classList.remove("hidden");
  panel.dataset.kind = choice.gesture;
  const done = (skill, word) => {
    panel.querySelector(".g-verdict").textContent = word;
    if (skill > 0.1) SOUND.play("perfect");
    panel.classList.add("judged", skill > 0.1 ? "great" : skill > 0 ? "fine" : "poor");
    setTimeout(() => {
      panel.className = "gesture hidden";
      choose(choice, skill);
    }, 650);
  };
  panel.className = "gesture";
  ({ pounce: pounceGame, hold: holdGame, run: runGame })[choice.gesture](panel, choice, done);
}

function verdict(score) {
  if (score >= 1) return [0.2, "Perfect!"];
  if (score >= 0.5) return [0.05, "Not bad"];
  return [-0.1, "Too bad"];
}

function pounceGame(panel, choice, done) {
  const zone = 0.2 + Math.random() * 0.6; // centre of the gold zone, 0 to 1
  const width = 0.16;
  panel.innerHTML =
    `<p class="g-hint">${GESTURES.pounce.hint}</p>` +
    `<div class="track"><span class="zone" style="left:${(zone - width / 2) * 100}%;width:${width * 100}%"></span>` +
    `<span class="marker">${PAW_SVG}</span></div>` +
    `<button type="button" class="g-btn">${choice.label}!</button><p class="g-verdict"></p>`;
  const marker = panel.querySelector(".marker");
  const start = performance.now();
  const period = 1300; // ms for a full sweep there and back
  let x = 0;
  let frame;
  const tick = (now) => {
    const t = ((now - start) % period) / period;
    x = t < 0.5 ? t * 2 : 2 - t * 2;
    marker.style.left = x * 100 + "%";
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  panel.querySelector(".g-btn").addEventListener(
    "click",
    () => {
      cancelAnimationFrame(frame);
      const off = Math.abs(x - zone);
      const [skill, word] = verdict(off <= width / 2 ? 1 : off <= width ? 0.5 : 0);
      done(skill, word);
    },
    { once: true }
  );
}

function holdGame(panel, choice, done) {
  const needed = 1600; // ms
  panel.innerHTML =
    `<p class="g-hint">${GESTURES.hold.hint}</p>` +
    `<button type="button" class="g-btn hold-btn"><svg viewBox="0 0 100 100" class="ring"><circle cx="50" cy="50" r="44"/><circle class="fill" cx="50" cy="50" r="44" pathLength="100"/></svg><span>Hold</span></button>` +
    `<p class="g-verdict"></p>`;
  const btn = panel.querySelector(".g-btn");
  const fill = panel.querySelector(".fill");
  let start = null;
  let frame;
  let over = false;
  const finish = (fraction) => {
    if (over) return;
    over = true;
    cancelAnimationFrame(frame);
    btn.classList.remove("holding");
    done(...verdict(fraction >= 1 ? 1 : fraction >= 0.6 ? 0.5 : 0));
  };
  const tick = (now) => {
    const f = Math.min(1, (now - start) / needed);
    fill.style.strokeDashoffset = 100 - f * 100;
    if (f >= 1) return finish(1);
    frame = requestAnimationFrame(tick);
  };
  const down = (e) => {
    e.preventDefault();
    if (start !== null || over) return;
    start = performance.now();
    btn.classList.add("holding");
    frame = requestAnimationFrame(tick);
  };
  const up = () => {
    if (start === null) return;
    finish((performance.now() - start) / needed);
  };
  btn.addEventListener("pointerdown", down);
  btn.addEventListener("pointerup", up);
  btn.addEventListener("pointerleave", up);
  btn.addEventListener("pointercancel", up);
  btn.addEventListener("contextmenu", (e) => e.preventDefault());
  btn.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) down(e);
  });
  btn.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") up();
  });
}

function runGame(panel, choice, done) {
  const goal = 12;
  const time = 2500; // ms, from the first tap
  panel.innerHTML =
    `<p class="g-hint">${GESTURES.run.hint}</p>` +
    `<div class="track run"><span class="run-fill"></span><span class="marker">${PAW_SVG}</span></div>` +
    `<button type="button" class="g-btn">Run!</button><p class="g-verdict"></p>`;
  const fill = panel.querySelector(".run-fill");
  const marker = panel.querySelector(".marker");
  const btn = panel.querySelector(".g-btn");
  let taps = 0;
  let timer = null;
  const finish = () => {
    clearTimeout(timer);
    btn.disabled = true;
    done(...verdict(taps >= goal ? 1 : taps >= goal * 0.6 ? 0.5 : 0));
  };
  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    if (!timer) timer = setTimeout(finish, time);
    taps++;
    const f = Math.min(1, taps / goal);
    fill.style.width = f * 100 + "%";
    marker.style.left = f * 100 + "%";
    btn.classList.remove("bump");
    btn.offsetWidth;
    btn.classList.add("bump");
    if (taps >= goal) finish();
  });
}

// ------------------------------------------------------------
// What happens after a choice.
// ------------------------------------------------------------
function choose(choice, skill) {
  const condBefore = conditionOf(life);
  const { wentWell, factors, text } = rollChoice(choice, life, skill);
  const { change, mark } = applyOutcome(life, choice, wentWell);
  const cond = conditionOf(life);

  // why it went like that: the trait, the stats, the past, the gesture
  document.getElementById("factors").innerHTML = factors
    .filter((f) => f.label)
    .map((f) => `<span class="factor ${f.delta > 0 ? "plus" : "minus"}">${f.delta > 0 ? "+" : "−"} ${f.label}</span>`)
    .join("");

  // what the cat just won or lost
  const gains = [];
  if (mark && MARKS[mark]) {
    const info = MARKS[mark];
    gains.push(`<p class="gain ${info.good ? "good" : "bad"}">${info.good ? "+ " : ""}${info.label}</p>`);
  }
  if (cond !== condBefore && CONDITIONS[cond].gained) {
    gains.push(`<p class="gain ${cond === "strong" ? "good" : "bad"}">${CONDITIONS[cond].label}</p>`);
    gains.push(`<p class="gain-line">${CONDITIONS[cond].gained}</p>`);
  }
  document.getElementById("gains").innerHTML = gains.join("");

  const fact = FACTS[showEvent.event.fact];
  if (fact) markFactSeen(showEvent.event.fact);
  document.getElementById("event-fact").innerHTML = fact
    ? `<b>True story</b> ${fact.text} <a href="${fact.url}" target="_blank" rel="noopener">${fact.source}</a>`
    : "";

  setLook("mood", wentWell ? "happy" : "sad");
  setLook("tone", wentWell ? "good" : "bad");
  showState();
  const card = document.getElementById("result-card");
  updateCard(card, change);
  if (change.happy >= 10) hearts(card, Math.min(6, Math.round(change.happy / 3)));
  else card.querySelector(".hearts").replaceChildren();
  if (change.health <= -20) hit();

  // what you hear: the outcome, then the cat itself
  if (change.health <= -20) SOUND.play("hit");
  else SOUND.play(wentWell ? "good" : "bad");
  if (/\bdogs?\b/i.test(text)) SOUND.play("bark", 0.2);
  if (/hiss/i.test(choice.label)) SOUND.play("hiss", 0.25);
  else if (change.happy >= 10) SOUND.play("purr", 0.4);
  else if (wentWell && Math.random() < 0.35) SOUND.play("meow", 0.4);
  if (mark) SOUND.play("pop", 0.6);

  const nextBtn = document.getElementById("next-btn");
  nextBtn.textContent = life.death ? "…" : "Continue";
  show("result");
  typeText(document.getElementById("result-text"), text);
}

function next() {
  if (endStep(life)) startStep();
  else showFarewell();
}

// Before the ending card: a quiet moment. The screen goes dark, the cat
// curls up and falls asleep, a few words appear one by one.
const FAREWELLS = {
  early: ["You are so small, and so tired.", "Your mother curls around you. It’s warm. Her heartbeat is the last thing you hear."],
  cut: ["You are very tired.", "You find a quiet spot, out of the wind. You curl up. You purr a little, just for yourself."],
  age: ["You are old now, and the sun is warm.", "You curl up in your favourite spot. Your breathing slows down. You are not afraid."],
  ancient: ["You have seen everything a cat can see.", "You curl up one last time, slowly, as if you had all the time in the world. You do."],
};

function showFarewell() {
  const result = drawEnding(life);
  showFarewell.result = result;
  const step = stepOf(life);
  const kind =
    life.death === "hurt" ? (step.chapterIndex <= 1 ? "early" : "cut") : life.step === STEPS.length - 1 ? "ancient" : "age";
  const [one, two] = FAREWELLS[kind];
  document.getElementById("farewell-1").textContent = one;
  document.getElementById("farewell-2").textContent = two;
  document.getElementById("farewell-3").textContent = `${life.name} · ${ageAtDeath(life)}`;

  setLook("mood", "asleep");
  setLook("tone", "night");
  const screen = screens.farewell;
  screen.classList.add("waiting");
  show("farewell");
  SOUND.mood("day");
  SOUND.music("farewell");
  SOUND.play("purr", 0.5);
  clearTimeout(showFarewell.timer);
  screen.classList.remove("skipped");
  showFarewell.timer = setTimeout(() => screen.classList.remove("waiting"), calm ? 300 : 4200);
}

// A tap on the farewell shows all of it at once.
screens.farewell.addEventListener("click", (e) => {
  if (e.target.closest("button")) return;
  clearTimeout(showFarewell.timer);
  screens.farewell.classList.remove("waiting");
  screens.farewell.classList.add("skipped");
});

// ------------------------------------------------------------
// The end.
// ------------------------------------------------------------
// Endings already found, kept in this browser only.
function rememberEnding(title) {
  let found = {};
  try {
    found = JSON.parse(localStorage.getItem("born-a-cat:found")) || {};
  } catch (e) {}
  const list = found[life.city] || [];
  const isNew = !list.includes(title);
  if (isNew) list.push(title);
  found[life.city] = list;
  try {
    localStorage.setItem("born-a-cat:found", JSON.stringify(found));
  } catch (e) {}
  const total = Object.values(found).reduce((sum, l) => sum + l.length, 0);
  return { count: list.length, isNew, total };
}

function factFor(ending) {
  return freshFact([ending.fact || ENDING_FACTS[ending.title]], CITY_FACTS[life.city]);
}

function oddsLine(odds) {
  if (!odds) return "";
  if (odds >= 0.2) return `<strong>${Math.round(odds * 100)}%</strong> of lives in ${life.city} end like this`;
  return `Only <strong>1 life in ${Math.round(1 / odds)}</strong> in ${life.city} ends like this`;
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
  clearTimeout(showFarewell.timer);
  const { ending, luck } = showFarewell.result;
  const odds = (ODDS[life.city] || {})[ending.title];
  const rarity = odds ? rarityOf(odds) : "common";
  const found = rememberEnding(ending.title);
  const reward = rewardLife(life, ending, found.total);
  const fact = factFor(ending);

  setLook("mood", "asleep");
  setLook("tone", luck === "lucky" ? null : "bad");
  showState();

  const card = document.getElementById("end-card");
  card.dataset.rarity = rarity;
  document.getElementById("rarity").textContent =
    { common: "Ending", uncommon: "Uncommon ending", rare: "★ Rare ending ★", legendary: "★ Legendary ending ★" }[rarity];
  const kind = (life.breed === "mixed" ? "" : BREEDS[life.breed].label + " ") + ORIGINS[life.origin].label.toLowerCase();
  document.getElementById("end-city").textContent = `${life.name}, ${kind}, born in ${life.city}`;
  document.getElementById("ending-title").textContent = ending.title;
  document.getElementById("odds").innerHTML = oddsLine(odds);
  document.getElementById("end-life").innerHTML =
    `Lived <strong>${ageAtDeath(life)}</strong> · ${weightOf(life).toFixed(1)} kg · ` +
    `${life.good} good ${life.good === 1 ? "day" : "days"}, ${life.bad} bad ${life.bad === 1 ? "day" : "days"}`;
  document.getElementById("end-status").innerHTML = statePills();
  document.getElementById("stars").innerHTML = [1, 2, 3]
    .map((n) => `<span class="${n <= reward.stars ? "on" : ""}">★</span>`)
    .join("");
  document.getElementById("stars").setAttribute("aria-label", `${reward.stars} out of 3 stars`);
  document.getElementById("journey-line").textContent = reward.line;
  const born = ORIGINS[life.origin].label.toLowerCase();
  document.getElementById("score-line").innerHTML =
    `Life score <strong>${reward.score}</strong> · ` +
    (reward.record ? `<span class="new">New record for a ${born}!</span>` : `Best for a ${born}: ${reward.best}`);
  document.getElementById("awards").innerHTML = reward.newAwards
    .map(
      (a) =>
        `<p class="award"><span class="award-new">★ New award</span>` +
        `<span class="award-title">${a.title}</span><span class="award-text">${a.text}</span></p>`
    )
    .join("");
  document.getElementById("fact").innerHTML = fact
    ? `<b>Real cats</b><br>${fact.text}<br><a href="${fact.url}" target="_blank" rel="noopener">${fact.source}</a>`
    : "";
  document.getElementById("found").innerHTML =
    (found.isNew ? '<span class="new">New ending!</span> · ' : "") +
    `Endings found in ${life.city}: ${found.count} · Awards: ${reward.awardCount}`;

  // what goes on the picture to share (see share.js)
  showEnding.card = {
    name: life.name,
    city: life.city,
    title: ending.title,
    rarity,
    odds: oddsLine(odds).replace(/<[^>]+>/g, ""),
    born: `${ORIGINS[life.origin].label.toLowerCase()}, born in ${life.city}`,
    lived: `${"★".repeat(reward.stars)}${"☆".repeat(3 - reward.stars)} · Lived ${ageAtDeath(life)} · ${weightOf(life).toFixed(1)} kg`,
    marks: [...life.marks].map((m) => MARKS[m]).filter(Boolean),
  };
  document.getElementById("share-note").textContent = "";

  show("ending");
  if (rarity === "rare" || rarity === "legendary" || reward.newAwards.length) SOUND.play("rare", 0.3);
  if (rarity === "rare") throwConfetti(40);
  if (rarity === "legendary") throwConfetti(90);
  typeText(document.getElementById("ending-text"), ending.text);
}

// Draw the cat everywhere it appears, with a coat for the home screen.
document.querySelectorAll(".cat-slot").forEach((slot) => (slot.innerHTML = CAT_SVG));
document.querySelectorAll(".cat-card").forEach(buildCard);
document.body.style.cssText = coatStyle(COATS[0]);

document.getElementById("born-btn").addEventListener("click", beBorn);
document.getElementById("again-btn").addEventListener("click", beBorn);
document.getElementById("start-btn").addEventListener("click", startStep);
document.getElementById("time-btn").addEventListener("click", showEvent);
document.getElementById("farewell-btn").addEventListener("click", showEnding);
document.getElementById("next-btn").addEventListener("click", next);
document.getElementById("restart-btn").addEventListener("click", beBorn);
document.getElementById("share-btn").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const note = document.getElementById("share-note");
  btn.disabled = true;
  note.textContent = "Drawing your card…";
  try {
    note.textContent = await shareCard(showEnding.card);
  } catch (err) {
    note.textContent = "Sorry, the picture could not be made on this browser.";
  }
  btn.disabled = false;
});

// Every button makes a small paper sound. The sound button turns it all off.
document.addEventListener("click", (e) => {
  if (e.target.closest("button") && !e.target.closest("#mute-btn")) SOUND.play("click");
});
const muteBtn = document.getElementById("mute-btn");
const showMute = () => {
  muteBtn.classList.toggle("off", SOUND.muted);
  muteBtn.setAttribute("aria-label", SOUND.muted ? "Turn sound on" : "Turn sound off");
};
muteBtn.addEventListener("click", () => {
  SOUND.toggle();
  showMute();
  if (!SOUND.muted) SOUND.play("meow");
});
showMute();
