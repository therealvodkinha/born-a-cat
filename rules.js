// The rules of a life: how events, outcomes and endings are drawn.
// No drawing or buttons here, so the same rules can be run thousands
// of times by tools/odds.js to measure how rare each ending is.

function pick(list, rng = Math.random) {
  return list[Math.floor(rng() * list.length)];
}

// An event, choice outcome or ending can only happen if its marks allow it.
function allowed(item, marks) {
  if (item.needs && !marks.has(item.needs)) return false;
  if (item.notIf && marks.has(item.notIf)) return false;
  return true;
}

function drawEvent(stage, marks, rng = Math.random) {
  const possible = stage.events.filter((e) => allowed(e, marks));
  // Follow-ups (events that need a mark) are favoured when they can happen.
  const followUps = possible.filter((e) => e.needs);
  return followUps.length && rng() < 0.7 ? pick(followUps, rng) : pick(possible, rng);
}

function rollChoice(choice, trait, rng = Math.random) {
  const bonus = (choice.bonus && choice.bonus[trait.id]) || 0;
  const chance = Math.min(0.95, Math.max(0.05, choice.chance + bonus));
  return rng() < chance;
}

function drawEnding(city, marks, goodCount, rng = Math.random) {
  const luck = goodCount * 2 >= STORIES[city].stages.length ? "lucky" : "unlucky";
  const endings = STORIES[city].endings.filter((e) => allowed(e, marks) && (!e.luck || e.luck === luck));
  // Endings with conditions win over the plain ones.
  const special = endings.filter((e) => e.needs || e.luck);
  return { ending: pick(special.length ? special : endings, rng), luck };
}

// How the cat is doing, from how its life has gone so far.
function conditionOf(goodCount, badCount) {
  const score = goodCount - badCount;
  if (score >= 2) return "strong";
  if (score <= -2) return "weak";
  return "ok";
}

// How rare an ending is, from its odds (0 to 1).
function rarityOf(odds) {
  if (odds < 0.02) return "legendary";
  if (odds < 0.1) return "rare";
  if (odds < 0.25) return "uncommon";
  return "common";
}

