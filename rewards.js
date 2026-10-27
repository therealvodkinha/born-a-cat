// How well the cat did with the life it was given: a score out of 100,
// one to three stars, a line that compares where it started and where it
// ended, a best score for each place of birth, and awards to collect.
// No drawing here, so tools/odds.js can measure how hard the stars are.

// Where the cat ended up, in one word.
function endStateOf(life, ending) {
  const marks = life.marks;
  // died before growing up (before Adult), whatever killed it
  if (life.death !== "age" && stepOf(life).chapterIndex <= 2) return "early";
  if (marks.has("left") || marks.has("forgotten")) return "left";
  if (life.stats.happy < 35) return "alone";
  if (marks.has("home")) return "home";
  if (marks.has("boss") || marks.has("gang") || marks.has("famous")) return "respected";
  if (HUMAN_MARKS.some((m) => marks.has(m)) || marks.has("kittens")) return "loved";
  return "free";
}

// One line per place of birth and end state. The rules of THE VOICE apply
// (see stories.js): funny first, no moral.
const JOURNEYS = {
  street: {
    early: "Born in the street. The street was too big, too soon.",
    left: "Born in the street, found a home, lost it again. Still further than most.",
    alone: "Born in the street, gone from the street. You never really caught a break.",
    home: "Born in a box in the street. Died on a cushion. Not bad at all.",
    respected: "Born in the street. Ended up running it.",
    loved: "Born in the street. By the end, half the street knew your name.",
    free: "Born in the street, lived in the street, free the whole way.",
  },
  shelter: {
    early: "Born in a shelter. Kind hands, short life.",
    left: "From the shelter to a home, and out again. The volunteers would hate to hear it.",
    alone: "Born in a shelter, and nobody really came for you. You did it alone, more or less.",
    home: "Born in a cage. Died in a home. Exactly what the volunteers hoped for.",
    respected: "A shelter kitten with a clipped ear who became a legend.",
    loved: "Nobody adopted you. Lots of people loved you anyway.",
    free: "Born in a shelter, ended up in the street. You made it work.",
  },
  home: {
    early: "Born in a home, gone very early. They kept your basket.",
    left: "Born with everything. Ended with nothing. You had it all, and it slipped away.",
    alone: "Born in a home, and still unhappy at the end. You had a head start and didn’t use it.",
    home: "Born on a sofa, died on the same sofa. You had everything, and you kept it.",
    respected: "A house cat who went out and became the boss of the street. Nobody saw that coming.",
    loved: "Born spoiled, stayed spoiled. Everyone loved you anyway.",
    free: "Born in a home, but the street was more fun.",
  },
};

// How much each end state is worth, and how hard each start is.
const STATE_POINTS = { early: 0, left: -5, alone: -10, home: 12, respected: 10, loved: 7, free: 3 };
const ORIGIN_HANDICAP = { street: 1.1, shelter: 1, home: 0.96 };

// The score, out of 100. Living long, being happy, collecting good marks,
// and ending well, counted against how hard the start was.
function lifeScore(life, ending) {
  const state = endStateOf(life, ending);
  const lived = (life.step + 1) / STEPS.length;
  const happy = life.happySum / (life.step + 1) / 100;
  const goodMarks = [...life.marks].filter((m) => MARKS[m] && MARKS[m].good).length;
  const raw = 40 * lived + 30 * happy + Math.min(20, 7 * goodMarks) + STATE_POINTS[state];
  const score = clamp(Math.round(raw * ORIGIN_HANDICAP[life.origin]), 0, 100);
  const stars = score >= 89 ? 3 : score >= 65 ? 2 : 1;
  return { score, stars, state, line: JOURNEYS[life.origin][state] };
}

// ------------------------------------------------------------
// Awards. Each one is earned once, and stays (in this browser).
//   test(life, ending, result, seen) : true when this life earns it.
//   seen = { cities: [...], endings: number } from earlier lives.
// ------------------------------------------------------------
const AWARDS = [
  { id: "rags", title: "From nothing", text: "Born in the street, died with a home.", test: (l, e, r) => l.origin === "street" && r.state === "home" },
  { id: "second", title: "Second chance", text: "Born in a shelter, adopted.", test: (l) => l.origin === "shelter" && l.marks.has("home") },
  { id: "spoiled", title: "Spoiled for life", text: "Born in a home, kept it, and stayed happy.", test: (l, e, r) => l.origin === "home" && r.state === "home" && r.stars === 3 },
  { id: "fall", title: "Fall from grace", text: "Born in a home, ended with nothing.", test: (l, e, r) => l.origin === "home" && (r.state === "left" || r.state === "alone") },
  { id: "nine", title: "Nine lives", text: "Almost died, then lived to be old.", test: (l) => l.lowest <= 10 && l.death === "age" },
  { id: "ancient", title: "Older than everyone", text: "Lived through the very last step.", test: (l, e) => e.when === "ancient" },
  { id: "boss", title: "The boss", text: "Became king of the market.", test: (l) => l.marks.has("boss") },
  { id: "parent", title: "Family", text: "Had kittens.", test: (l) => l.marks.has("kittens") },
  { id: "big", title: "Big cat", text: "Weighed 6.5 kg or more.", test: (l) => weightOf(l) >= 6.5 },
  { id: "tough", title: "Tough as old boots", text: "Five bad days or more, and still died of old age.", test: (l) => l.bad >= 5 && l.death === "age" },
  { id: "stars", title: "A life well lived", text: "Three stars.", test: (l, e, r) => r.stars === 3 },
  { id: "purebred", title: "Fancy", text: "Born with a breed.", test: (l) => l.breed !== "mixed" },
  { id: "cities", title: "Two cities", text: "Lived a life in Rabat and one in Tokyo.", test: (l, e, r, seen) => ["Rabat", "Tokyo"].every((c) => c === l.city || seen.cities.includes(c)) },
  { id: "collector", title: "Collector", text: "Found ten different endings.", test: (l, e, r, seen) => seen.endings >= 10 },
];

// Kept in this browser: earned awards, best scores per place of birth,
// and cities lived in.
function loadRecords() {
  try {
    return { awards: [], best: {}, cities: [], ...JSON.parse(localStorage.getItem("born-a-cat:records")) };
  } catch (e) {
    return { awards: [], best: {}, cities: [] };
  }
}

// Works out the reward for this life and saves it.
// Returns { score, stars, state, line, best, record, newAwards, awardCount }.
function rewardLife(life, ending, endingsFound) {
  const result = lifeScore(life, ending);
  const records = loadRecords();
  const seen = { cities: records.cities, endings: endingsFound };
  const newAwards = AWARDS.filter((a) => !records.awards.includes(a.id) && a.test(life, ending, result, seen));
  records.awards.push(...newAwards.map((a) => a.id));
  const before = records.best[life.origin];
  const record = before !== undefined && result.score > before;
  records.best[life.origin] = Math.max(before || 0, result.score);
  if (!records.cities.includes(life.city)) records.cities.push(life.city);
  try {
    localStorage.setItem("born-a-cat:records", JSON.stringify(records));
  } catch (e) {}
  return { ...result, best: records.best[life.origin], record, newAwards, awardCount: records.awards.length };
}
