// Plays the game many times with random choices, and writes odds.js:
// how often each ending happens in each city.
// Run it again after changing stories.js:   node tools/odds.js
// Add --report to also print how long lives last and how cats die.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = vm.createContext({ Math });
for (const file of ["art.js", "stories.js", "rules.js", "rewards.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const { STORIES, STEPS, pick, newLife, beginStep, drawEvent, rollChoice, applyOutcome, endStep, drawEnding, averageSkill, lifeScore } =
  vm.runInContext(
    "({ STORIES, STEPS, pick, newLife, beginStep, drawEvent, rollChoice, applyOutcome, endStep, drawEnding, averageSkill, lifeScore })",
    context
  );

// One whole life with random choices. Returns the life and its ending.
function playOnce(city) {
  const life = newLife(city);
  do {
    beginStep(life);
    const event = drawEvent(life);
    if (!event) throw new Error(`${city}: no event left at step ${life.step} (${STEPS[life.step].age}) for a ${life.origin} cat with ${[...life.marks]}`);
    const choice = pick(event.choices);
    const { wentWell, died } = rollChoice(choice, life, choice.gesture ? averageSkill() : 0);
    applyOutcome(life, choice, wentWell, died);
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
  const stars = {}; // origin -> [1 star, 2, 3]
  const states = {};
  const young = {}; // origin -> [died before Adult, lives]
  const causes = {};
  for (let n = 0; n < LIVES; n++) {
    const { life, ending } = playOnce(city);
    if (life.death === "hurt") deaths["hurt at " + STEPS[life.step].chapter.name] = (deaths["hurt at " + STEPS[life.step].chapter.name] || 0) + 1;
    counts[ending.title] = (counts[ending.title] || 0) + 1;
    lengths[life.step + 1] = (lengths[life.step + 1] || 0) + 1;
    deaths[life.death] = (deaths[life.death] || 0) + 1;
    const result = lifeScore(life, ending);
    const y = (young[life.origin] = young[life.origin] || [0, 0]);
    y[1]++;
    if (life.death !== "age" && STEPS[life.step].chapterIndex <= 2) y[0]++;
    const cause = life.cause ? life.cause.id : "?";
    causes[cause] = (causes[cause] || 0) + 1;
    (stars[life.origin] = stars[life.origin] || [0, 0, 0])[result.stars - 1]++;
    states[life.origin + " " + result.state] = (states[life.origin + " " + result.state] || 0) + 1;
  }
  odds[city] = {};
  for (const e of STORIES[city].endings) odds[city][e.title] = +((counts[e.title] || 0) / LIVES).toFixed(4);
  if (report) {
    const pct = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, (v / LIVES * 100).toFixed(1) + "%"]));
    console.log(city, "\n  steps lived:", pct(lengths), "\n  death:", pct(deaths));
    for (const [origin, s] of Object.entries(stars)) {
      const n = s[0] + s[1] + s[2];
      console.log(`  ${origin} (${((n / LIVES) * 100).toFixed(0)}%): stars 1/2/3 = ${s.map((v) => ((v / n) * 100).toFixed(0) + "%").join(" / ")}`);
    }
    console.log("  end states:", pct(states));
    console.log("  causes of death:", pct(causes));
    const all = Object.values(stars).reduce((sum, v) => sum + v[2], 0);
    console.log(`  3 stars, all lives: ${((all / LIVES) * 100).toFixed(1)}%`);
    for (const [origin, [d, n]] of Object.entries(young))
      console.log(`  ${origin}: ${((d / n) * 100).toFixed(0)}% die before growing up (before Adult)`);
  }
}

const out =
  "// Made by tools/odds.js — do not edit by hand.\n" +
  "// How often each ending happens, over " + LIVES.toLocaleString("en") + " lives per city with random choices.\n" +
  "const ODDS = " + JSON.stringify(odds, null, 2) + ";\n";
fs.writeFileSync(path.join(root, "odds.js"), out);
console.log(out);
