// Plays the game many times with random choices, and writes odds.js:
// how often each ending happens in each city.
// Run it again after changing stories.js:   node tools/odds.js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = vm.createContext({ Math });
for (const file of ["stories.js", "rules.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const { STORIES, TRAITS, pick, drawEvent, rollChoice, drawEnding } = vm.runInContext(
  "({ STORIES, TRAITS, pick, drawEvent, rollChoice, drawEnding })",
  context
);

const LIVES = 200000;
const odds = {};
for (const city of Object.keys(STORIES)) {
  const counts = {};
  for (let n = 0; n < LIVES; n++) {
    const trait = pick(TRAITS);
    const marks = new Set();
    let good = 0;
    for (const stage of STORIES[city].stages) {
      const choice = pick(drawEvent(stage, marks).choices);
      const wentWell = rollChoice(choice, trait);
      if (wentWell) good++;
      const mark = wentWell ? choice.goodMark : choice.badMark;
      if (mark) marks.add(mark);
    }
    const { ending } = drawEnding(city, marks, good);
    counts[ending.title] = (counts[ending.title] || 0) + 1;
  }
  odds[city] = {};
  for (const e of STORIES[city].endings) odds[city][e.title] = +((counts[e.title] || 0) / LIVES).toFixed(4);
}

const out =
  "// Made by tools/odds.js — do not edit by hand.\n" +
  "// How often each ending happens, over " + LIVES.toLocaleString("en") + " lives per city with random choices.\n" +
  "const ODDS = " + JSON.stringify(odds, null, 2) + ";\n";
fs.writeFileSync(path.join(root, "odds.js"), out);
console.log(out);
