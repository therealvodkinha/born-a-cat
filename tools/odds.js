// Plays the game many times with random choices, and writes odds.js:
// how often each ending happens in each city.
// Run it again after changing stories.js:   node tools/odds.js
// Add --report to also print how long lives last and how cats die.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = vm.createContext({ Math });
for (const file of ["art.js", "stories.js", "rules.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const { STORIES, STEPS, COATS, pick, newLife, beginStep, drawEvent, rollChoice, applyOutcome, endStep, drawEnding, averageSkill } =
  vm.runInContext(
    "({ STORIES, STEPS, COATS, pick, newLife, beginStep, drawEvent, rollChoice, applyOutcome, endStep, drawEnding, averageSkill })",
    context
  );

// One whole life with random choices. Returns the life and its ending.
function playOnce(city) {
  const life = newLife(city, pick(COATS).id);
  do {
    beginStep(life);
    const event = drawEvent(life);
    if (!event) throw new Error(`${city}: no event left at step ${life.step} (${STEPS[life.step].age})`);
    const choice = pick(event.choices);
    const { wentWell } = rollChoice(choice, life, choice.gesture ? averageSkill() : 0);
    applyOutcome(life, choice, wentWell);
  } while (endStep(life));
  return { life, ending: drawEnding(life).ending };
}

const LIVES = 200000;
const report = process.argv.includes("--report");
const odds = {};
for (const city of Object.keys(STORIES)) {
  const counts = {};
  const lengths = {};
  const deaths = {};
  for (let n = 0; n < LIVES; n++) {
    const { life, ending } = playOnce(city);
    if (life.death === "hurt") deaths["hurt at " + STEPS[life.step].chapter.name] = (deaths["hurt at " + STEPS[life.step].chapter.name] || 0) + 1;
    counts[ending.title] = (counts[ending.title] || 0) + 1;
    lengths[life.step + 1] = (lengths[life.step + 1] || 0) + 1;
    deaths[life.death] = (deaths[life.death] || 0) + 1;
  }
  odds[city] = {};
  for (const e of STORIES[city].endings) odds[city][e.title] = +((counts[e.title] || 0) / LIVES).toFixed(4);
  if (report) {
    const pct = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, (v / LIVES * 100).toFixed(1) + "%"]));
    console.log(city, "\n  steps lived:", pct(lengths), "\n  death:", pct(deaths));
  }
}

const out =
  "// Made by tools/odds.js — do not edit by hand.\n" +
  "// How often each ending happens, over " + LIVES.toLocaleString("en") + " lives per city with random choices.\n" +
  "const ODDS = " + JSON.stringify(odds, null, 2) + ";\n";
fs.writeFileSync(path.join(root, "odds.js"), out);
console.log(out);
