// The rules of a life: how events, outcomes, stats and endings work.
// No drawing or buttons here, so the same rules can be run thousands
// of times by tools/odds.js to measure how rare each ending is.

function pick(list, rng = Math.random) {
  return list[Math.floor(rng() * list.length)];
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Picks a key of { key: weight }, weights in any unit.
function pickWeighted(weights, rng = Math.random) {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  let r = rng() * entries.reduce((sum, [, w]) => sum + w, 0);
  for (const [key, w] of entries) if ((r -= w) < 0) return key;
  return entries[entries.length - 1][0];
}

// The steps of a life, in order: [{ chapter, chapterIndex, age, kg, cm, risk }].
const STEPS = LIFE.flatMap((chapter, chapterIndex) =>
  chapter.steps.map((s) => ({ ...s, chapter, chapterIndex }))
);

// What an outcome does to the cat when the story doesn't say.
const DEFAULT_FX = {
  good: { happy: 6 },
  bad: { happy: -6, health: -5 },
};

// A new cat: first where it is born, then its breed, its coat and its trait.
function newLife(city, rng = Math.random) {
  const origin = pickWeighted(Object.fromEntries(Object.entries(ORIGINS).map(([id, o]) => [id, o.chance])), rng);
  const breedOdds = { ...ORIGINS[origin].breeds };
  for (const id in breedOdds) if (BREEDS[id].cities && !BREEDS[id].cities.includes(city)) delete breedOdds[id];
  const breed = pickWeighted(breedOdds, rng);
  const coats = COATS.filter((c) => !BREEDS[breed].coats || BREEDS[breed].coats.includes(c.id));
  const life = {
    city,
    origin,          // where it was born, from ORIGINS
    breed,           // from BREEDS
    coat: pick(coats, rng).id, // id of the coat, from COATS in art.js
    trait: pick(TRAITS, rng),
    step: 0,
    stats: { ...START_STATS },
    fed: 0,          // -4 (starving) to +4 (fat and happy); fades a little each step
    build: (0.9 + rng() * 0.2) * (BREEDS[breed].build || 1), // born small or big
    growth: 0,       // extra size from eating well while young
    marks: new Set(ORIGINS[origin].marks),
    seen: new Set(), // events already lived
    good: 0,
    bad: 0,
    death: null,     // null, "hurt" (health reached 0), "ill" or "age"
    cause: null,     // what killed it: { id (from CAUSES), age, caught }
    ills: {},        // hidden illnesses: { id: age when caught, step }
    lowest: 100,     // the worst health it lived through
    happySum: 0,     // happiness after each step, added up (for the average)
  };
  for (const key of ["health", "happy", "strength"]) {
    const add = (ORIGINS[origin].stats[key] || 0) + (BREEDS[breed].stats[key] || 0);
    life.stats[key] = clamp(life.stats[key] + add, 0, 100);
  }
  return life;
}

// An event or ending can only happen if its marks allow it.
function allowed(item, marks) {
  if (item.needs && !marks.has(item.needs)) return false;
  if (item.notIf && marks.has(item.notIf)) return false;
  return true;
}

function stepOf(life) {
  return STEPS[life.step];
}

// At the start of each step, the cat grows or ages, and gets hungry.
function beginStep(life) {
  const step = stepOf(life);
  const fx = { ...(step.chapter.each || {}) };
  const hunger = ORIGINS[life.origin].hunger;
  if (hunger && step.chapterIndex <= 2) life.fed = clamp(life.fed - hunger, -4, 4);
  if (life.fed <= -3) fx.health = (fx.health || 0) - 8;
  addStats(life, fx);
  life.fed -= Math.sign(life.fed);
}

function drawEvent(life, rng = Math.random) {
  const events = STORIES[life.city].chapters[stepOf(life).chapter.name];
  const possible = events.filter(
    (e) => allowed(e, life.marks) && !life.seen.has(e) && (!e.origin || e.origin === life.origin)
  );
  // Events about where the cat was born come first.
  const fromBirth = possible.filter((e) => e.origin);
  // Follow-ups (events that need a mark) are favoured when they can happen.
  const followUps = possible.filter((e) => e.needs);
  const event = fromBirth.length
    ? pick(fromBirth, rng)
    : followUps.length && rng() < 0.7
      ? pick(followUps, rng)
      : pick(possible, rng);
  life.seen.add(event);
  return event;
}

// Does a modifier (see "mods" in stories.js) apply to this cat right now?
function modApplies(mod, life) {
  if (!allowed(mod, life.marks)) return false;
  if (mod.coat && mod.coat !== life.coat) return false;
  if (mod.breed && mod.breed !== life.breed) return false;
  if (mod.origin && mod.origin !== life.origin) return false;
  if (mod.cond && mod.cond !== conditionOf(life)) return false;
  return true;
}

const TRAIT_NAMES = { brave: "Brave", shy: "Shy", curious: "Curious", clever: "Clever" };

// Marks that mean a human took to the cat. A breed's "charm" helps to win them.
const HUMAN_MARKS = ["home", "girl", "baker", "konbini", "parklady", "famous"];

// How likely a choice is to go well for THIS cat, and why.
// "skill" is the bonus from the gesture (see GESTURES), 0 if none.
// Returns { chance, factors: [{ label, delta }], mods: [the mods that apply] }.
function chanceOf(choice, life, skill = 0) {
  const factors = [];
  const add = (label, delta) => {
    if (delta) factors.push({ label, delta });
  };
  add(TRAIT_NAMES[life.trait.id], (choice.bonus && choice.bonus[life.trait.id]) || 0);
  if (choice.stat) {
    const v = life.stats[choice.stat];
    const delta = Math.round(((v - 50) / 250) * 100) / 100;
    const name = choice.stat === "strength" ? ["Strong", "Not strong yet"] : ["Healthy", "Sick"];
    add(delta >= 0 ? name[0] : name[1], delta);
  }
  // A limping cat is slower at anything physical. A weak cat too.
  const physical = choice.stat === "strength" || choice.gesture === "run" || choice.gesture === "pounce";
  if (physical && life.marks.has("limp")) add(MARKS.limp.label, -0.1);
  if (physical && conditionOf(life) === "weak") add(CONDITIONS.weak.label, -0.1);
  const breed = BREEDS[life.breed];
  if (physical) add(breed.physicalWhy, breed.physical);
  if (HUMAN_MARKS.includes(choice.goodMark) && !life.marks.has(choice.goodMark)) add(breed.charmWhy, breed.charm);
  const mods = (choice.mods || []).filter((m) => modApplies(m, life));
  for (const m of mods) add(m.why || "", m.chance || 0);
  add(skill > 0.2 ? "Perfect timing" : skill > 0 ? "Good timing" : "Bad timing", skill);

  const total = factors.reduce((sum, f) => sum + f.delta, choice.chance);
  return { chance: clamp(total, 0.05, 0.95), factors, mods };
}

// How likely a bad outcome of this choice is to kill this cat (see "deadly").
// A cat born in a home is safer; a healthy cat survives more often.
function deathChance(choice, life) {
  if (!choice.deadly) return 0;
  const shape = 1.5 - life.stats.health / 100; // 1 at health 50
  return clamp(choice.deadly.chance * ORIGINS[life.origin].danger * shape, 0, 0.95);
}

// Rolls the dice. Returns { wentWell, died, factors, text }: the text can change
// with the cat's past, coat or condition (see "mods").
function rollChoice(choice, life, skill = 0, rng = Math.random) {
  const { chance, factors, mods } = chanceOf(choice, life, skill);
  const wentWell = rng() < chance;
  const died = !wentWell && rng() < deathChance(choice, life);
  const key = wentWell ? "good" : "bad";
  const special = mods.find((m) => m[key]);
  const text = died ? choice.deadly.text : special ? special[key] : choice[key];
  return { wentWell, died, factors, text };
}

// The gestures some choices ask for, instead of a simple tap.
// In tools/odds.js, players are assumed to be average at them.
const GESTURES = {
  pounce: { hint: "Tap when the paw is in the gold zone" },
  hold: { hint: "Hold still, and let go in the gold" },
  run: { hint: "Tap as fast as you can" },
};

// What an average player gets from a gesture (used by tools/odds.js).
function averageSkill(rng = Math.random) {
  const r = rng();
  return r < 0.35 ? 0.4 : r < 0.7 ? 0.1 : -0.3;
}

function addStats(life, fx) {
  for (const key of ["health", "happy", "strength"]) {
    if (fx[key]) life.stats[key] = clamp(life.stats[key] + fx[key], 0, 100);
  }
  if (fx.food) {
    life.fed = clamp(life.fed + fx.food, -4, 4);
    if (stepOf(life).chapterIndex <= 2) life.growth = clamp(life.growth + fx.food * 0.012, -0.08, 0.08);
  }
}

// Applies what happened. Returns what changed, to show it on screen.
function applyOutcome(life, choice, wentWell, died = false, rng = Math.random) {
  const before = { ...life.stats, kg: weightOf(life) };
  const fx = { ...DEFAULT_FX[wentWell ? "good" : "bad"], ...(wentWell ? choice.goodFx : choice.badFx) };
  addStats(life, fx);
  if (wentWell) life.good++;
  else life.bad++;

  const mark = died ? null : wentWell ? choice.goodMark : choice.badMark;
  const isNew = !!mark && !life.marks.has(mark);
  if (mark) life.marks.add(mark);
  const age = stepOf(life).age;
  if (died) life.stats.health = 0;
  if (life.stats.health <= 0) {
    life.death = "hurt";
    const id = died ? choice.deadly.cause : choice.cause || (life.fed <= -2 ? "hunger" : "worn");
    life.cause = { id, age };
  }
  catchIllness(life, choice.catches, wentWell, rng);
  life.lowest = Math.min(life.lowest, life.stats.health);
  life.happySum += life.stats.happy;

  const change = {};
  for (const key of ["health", "happy", "strength"]) change[key] = life.stats[key] - before[key];
  change.kg = +(weightOf(life) - before.kg).toFixed(1);
  return { change, mark: isNew ? mark : null };
}

// A choice can pass on an illness, whatever the player sees (see "catches").
function catchIllness(life, catches, wentWell, rng = Math.random) {
  if (!catches || life.death || life.ills[catches.ill]) return;
  if (catches.on && catches.on !== (wentWell ? "good" : "bad")) return;
  if (ILLNESSES[catches.ill].vaccine && life.origin !== "street") return;
  if (rng() < catches.chance) life.ills[catches.ill] = { age: stepOf(life).age, step: life.step };
}

// Hidden illnesses do their work between steps. Returns true if one kills.
function sufferIllnesses(life, rng = Math.random) {
  const step = stepOf(life);
  for (const [id, caught] of Object.entries(life.ills)) {
    const ill = ILLNESSES[id];
    if (life.step <= caught.step || step.chapterIndex < ill.from) continue;
    if (ill.drain) addStats(life, { health: ill.drain });
    if (rng() < ill.risk || life.stats.health <= 0) {
      life.death = "ill";
      life.stats.health = 0;
      life.cause = { id, age: step.age, caught: caught.age };
      return true;
    }
  }
  return false;
}

// After each step: illnesses may kill, and old cats may die in their sleep.
// Returns true if the life goes on.
function endStep(life, rng = Math.random) {
  if (life.death) return false;
  if (sufferIllnesses(life, rng)) return false;
  const step = stepOf(life);
  if (step.risk) {
    let risk = step.risk * (1.6 - life.stats.health / 100);
    if (life.marks.has("home")) risk *= 0.8;
    if (step.risk >= 1 || rng() < risk) {
      life.death = "age";
      life.cause = { id: "age", age: step.age };
      return false;
    }
  }
  life.step++;
  return true;
}

// How the cat's life ends.
//   when: "early"   died before growing up (Newborn, Kitten)
//         "cut"     died hurt or sick, later in life
//         "ancient" lived through the very last step
//         (none)    died of old age
function drawEnding(life, rng = Math.random) {
  const step = stepOf(life);
  let when = null;
  // Health running out in old age is just old age (but a car is still a car).
  if (life.death === "hurt" && step.chapterIndex === LIFE.length - 1 && CAUSES[life.cause.id].kind === "worn") {
    life.death = "age";
    life.cause = { id: "age", age: step.age };
  }
  if (life.death === "hurt" || life.death === "ill") when = step.chapterIndex <= 1 ? "early" : "cut";
  else if (life.step === STEPS.length - 1) when = "ancient";

  const kind = life.cause ? CAUSES[life.cause.id].kind : "age";
  const all = STORIES[life.city].endings.filter((e) => allowed(e, life.marks));
  // A life cut short is told by the way it ended, when the city has an ending for it.
  const told = all.filter((e) => e.cause === kind && (when === "early" || when === "cut"));
  if (told.length) return { ending: pick(told, rng), luck: "unlucky" };
  const endings = all.filter((e) => !e.cause && (e.when || null) === when);
  // Endings with conditions win over the plain ones.
  const special = endings.filter((e) => e.needs || e.mood);
  const moodOk = special.filter((e) => !e.mood || (e.mood === "sad") === (life.stats.happy < 35));
  const ending = pick(moodOk.length ? moodOk : endings.filter((e) => !e.needs && !e.mood), rng);
  return { ending, luck: when === "early" || when === "cut" || life.stats.happy < 35 ? "unlucky" : "lucky" };
}

// How the cat looks, from its stats.
function conditionOf(life) {
  const { health, happy } = life.stats;
  if (health <= 30) return "weak";
  if (health >= 75 && happy >= 60) return "strong";
  return "ok";
}

function weightOf(life) {
  const step = stepOf(life);
  return +(step.kg * life.build * (1 + life.growth) * (1 + 0.06 * life.fed)).toFixed(1);
}

function sizeOf(life) {
  return Math.round(stepOf(life).cm * life.build * (1 + life.growth));
}

// How old the cat was when it died, in words.
function ageAtDeath(life) {
  return stepOf(life).age;
}

// What killed the cat: "Hit by the tram. Died at 1 year."
function causeLine(life) {
  const cause = life.cause || { id: "age", age: ageAtDeath(life) };
  return `${CAUSES[cause.id].line.replace("{caught}", cause.caught || cause.age)}. Died at ${cause.age}.`;
}

// How rare an ending is, from its odds (0 to 1).
function rarityOf(odds) {
  if (odds < 0.02) return "legendary";
  if (odds < 0.1) return "rare";
  if (odds < 0.25) return "uncommon";
  return "common";
}
