// Real facts about cats, with their source, so anyone can check them.
// Shown:
//  - under an outcome, when its event has "fact" (stories.js)
//  - on each chapter card ("Did you know?"), a fact the player hasn't seen yet
//  - on the ending card: the ending's own fact ("fact" in the ending, or
//    ENDING_FACTS by title) if not seen yet, otherwise a new one from the city
//    or from all facts.
// The game remembers which facts the player has seen (in this browser), so
// the same ones don't keep coming back. Add facts freely: more is better.

const FACTS = {
  streetKittens: {
    text: "Up to 3 in 4 kittens born outdoors die before they are six months old.",
    source: "AAFP, citing Nutter et al., JAVMA 2004",
    url: "https://catvets.com/wp-content/uploads/2024/01/FreeRoaming.pdf",
  },
  streetLife: {
    text: "A cat living on the street often doesn’t reach 5 years old. A pet cat in the UK lives 11.7 years on average.",
    source: "AAFP 2024 · Teng et al., RVC, J Feline Med Surg 2024",
    url: "https://phys.org/news/2024-05-life-reveals-longest-shortest-cats.html",
  },
  roads: {
    text: "Cats killed on the road die at 2.7 years old on average. Cats who die of anything else: 14 years.",
    source: "McDonald et al., RVC, J Small Anim Pract 2017",
    url: "https://rvc.ac.uk/vetcompass/news/mortality-due-to-trauma-in-cats",
  },
  females: {
    text: "Female cats live about 16 months longer than males.",
    source: "Teng et al., RVC, J Feline Med Surg 2024",
    url: "https://phys.org/news/2024-05-life-reveals-longest-shortest-cats.html",
  },
  territory: {
    text: "One street tom in Illinois patrolled 547 hectares. The average pet cat there: less than 2.",
    source: "Horn et al., University of Illinois, 2011",
    url: "https://news.illinois.edu/researchers-track-the-secret-lives-of-feral-and-free-roaming-house-cats/",
  },
  sleep: {
    text: "Pet cats spend 97% of their time asleep or barely moving. Street cats are very active 14% of the time, five times more.",
    source: "Horn et al., University of Illinois, 2011",
    url: "https://news.illinois.edu/researchers-track-the-secret-lives-of-feral-and-free-roaming-house-cats/",
  },
  japanIndoor: {
    text: "In Japan, cats that never go outside live 16.1 years on average. Cats that go out: 13.6.",
    source: "Japan Pet Food Association, 2020 survey",
    url: "https://www.wwdjapan.com/articles/1282316",
  },
  japanShelters: {
    text: "Japan put down 238,929 cats in 2004. In 2024: 4,866. Almost fifty times fewer.",
    source: "Ministry of the Environment, Japan",
    url: "https://www.env.go.jp/nature/dobutsu/aigo/2_data/statistics/dog-cat.html",
  },
  falls: {
    text: "Cats turn in the air to land on their feet. In a New York study of 132 cats that fell from buildings, 90% survived.",
    source: "Animal Medical Center, New York",
    url: "https://www.amcny.org/pet_health_library/high-rise-syndrome-in-cats",
  },
  lapping: {
    text: "Cats drink by touching the water with just the tip of the tongue, pulling up a little column, and biting it. About four times a second.",
    source: "Reis, Jung, Aristoff & Stocker, MIT, Science 2010",
    url: "https://thetech.com/2010/11/12/catlapp-v130-n53",
  },
  eartip: {
    text: "A street cat with the tip of one ear cut off has been neutered and vaccinated. The cut is made under anaesthesia, so other people know not to trap it again.",
    source: "Alley Cat Allies",
    url: "https://www.alleycat.org/community-cat-care/why-the-eartip-on-outdoor-cats/",
  },
  islam: {
    text: "Cats are welcome in mosques in many Muslim countries. The Prophet’s companion Abu Hurayra was nicknamed “father of the kitten”.",
    source: "Wikipedia, Islam and cats",
    url: "https://en.wikipedia.org/wiki/Islam_and_cats",
  },
  sweet: {
    text: "Cats can’t taste sweet things. The gene for the sweet taste receptor is broken in all cats, even lions and tigers.",
    source: "Li et al., PLoS Genetics 2005",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1183522/",
  },
  names: {
    text: "Cats recognise their own name, and tell it apart from other words. They mostly answer by moving their ears or head.",
    source: "Saito et al., University of Tokyo, Scientific Reports 2019",
    url: "https://www.u-tokyo.ac.jp/focus/en/press/z0508_00040.html",
  },
  voices: {
    text: "Cats can tell their owner’s voice from a stranger’s. They answer with their ears and head, not by coming. They heard you.",
    source: "Saito & Shinozuka, University of Tokyo, Animal Cognition 2013",
    url: "https://www.u-tokyo.ac.jp/focus/en/articles/a_00138.html",
  },
  blink: {
    text: "A slow blink is a cat smile. Cats blink slowly back at people who do it to them, and are more likely to come closer.",
    source: "Humphrey et al., University of Sussex, Scientific Reports 2020",
    url: "https://www.sussex.ac.uk/news/research?id=53423",
  },
  gotokuji: {
    text: "Gōtoku-ji temple in Tokyo claims the beckoning cat. A lord followed a temple cat’s waving paw just before lightning struck where he stood.",
    source: "Wikipedia, Gōtoku-ji",
    url: "https://en.wikipedia.org/wiki/G%C5%8Dtoku-ji",
  },
  nekomata: {
    text: "In Japanese folklore, a cat that lives very long grows a forked tail and becomes a nekomata. The oldest real cat on record, Creme Puff, lived to 38.",
    source: "Wikipedia, Nekomata · Guinness World Records",
    url: "https://en.wikipedia.org/wiki/Nekomata",
  },
  oldest: {
    text: "The oldest cat on record, Creme Puff, lived 38 years and 3 days, in Austin, Texas.",
    source: "Guinness World Records",
    url: "https://guinnessworldrecords.com/world-records/oldest-cat-ever",
  },
  pacing: {
    text: "Cats walk by moving both legs on one side, then both on the other. Most mammals don’t walk like that. Camels and giraffes do.",
    source: "Wikipedia, Cat",
    url: "https://en.wikipedia.org/wiki/Cat",
  },
  sleepHours: {
    text: "Cats sleep 12 to 16 hours a day. 13 to 14 hours on average.",
    source: "Wikipedia, Cat",
    url: "https://en.wikipedia.org/wiki/Cat",
  },
  hearing: {
    text: "Cats hear sounds up to 79 kHz. Humans stop at about 20. A mouse squeaking in the wall is loud to a cat.",
    source: "Wikipedia, Cat",
    url: "https://en.wikipedia.org/wiki/Cat",
  },
  nightVision: {
    text: "Cats can see with one sixth of the light humans need. A mirror layer behind their eyes gives the light a second chance. That’s why their eyes shine at night.",
    source: "Wikipedia, Cat",
    url: "https://en.wikipedia.org/wiki/Cat",
  },
  collarbone: {
    text: "A cat’s collarbones float free, attached to no other bone. It helps them squeeze through gaps and land softly.",
    source: "Wikipedia, Cat",
    url: "https://en.wikipedia.org/wiki/Cat",
  },
  origin: {
    text: "Every pet cat descends from the African wildcat. The oldest known cat buried with a human was found in Cyprus. It is about 9,500 years old.",
    source: "Wikipedia, Cat",
    url: "https://en.wikipedia.org/wiki/Cat",
  },
  meowHumans: {
    text: "Adult cats rarely meow to each other. The meow is mostly for humans. It’s probably a kitten habit they kept for us.",
    source: "Wikipedia, Cat communication",
    url: "https://en.wikipedia.org/wiki/Cat_communication",
  },
  tailUp: {
    text: "A tail held straight up, quivering a little, is a cat’s happiest hello.",
    source: "Wikipedia, Cat communication",
    url: "https://en.wikipedia.org/wiki/Cat_communication",
  },
  kneading: {
    text: "Kneading starts with kittens pressing their mother’s belly for milk. Adult cats keep doing it on soft things, often just before sleeping.",
    source: "Wikipedia, Cat communication",
    url: "https://en.wikipedia.org/wiki/Cat_communication",
  },
  chatter: {
    text: "Cats chatter and chirp at birds they can’t reach. The sound may imitate their prey.",
    source: "Wikipedia, Cat communication",
    url: "https://en.wikipedia.org/wiki/Cat_communication",
  },
  flehmen: {
    text: "When a cat sniffs with its mouth half open, it’s using a second nose: an organ in the roof of its mouth that reads the smells other cats leave.",
    source: "Wikipedia, Flehmen response",
    url: "https://en.wikipedia.org/wiki/Flehmen_response",
  },
  kittenEyes: {
    text: "Kittens are born with their eyes closed. They open them 7 to 10 days later.",
    source: "Wikipedia, Kitten",
    url: "https://en.wikipedia.org/wiki/Kitten",
  },
  litters: {
    text: "A mother cat usually has 2 to 5 kittens at once. Litters of more than ten have been seen.",
    source: "Wikipedia, Kitten",
    url: "https://en.wikipedia.org/wiki/Kitten",
  },
  egypt: {
    text: "In ancient Egypt, killing a cat was a serious crime. Around 60 BC, a crowd killed a Roman who had killed one, even though the king tried to stop them.",
    source: "Wikipedia, Cats in ancient Egypt",
    url: "https://en.wikipedia.org/wiki/Cats_in_ancient_Egypt",
  },
  mummies: {
    text: "In the 1880s, more than 200,000 mummified animals were found in a single Egyptian cemetery, at Beni Hasan. Most of them were cats.",
    source: "Wikipedia, Cats in ancient Egypt",
    url: "https://en.wikipedia.org/wiki/Cats_in_ancient_Egypt",
  },
  felicette: {
    text: "In 1963, a Paris street cat named Félicette flew to space. She went about 150 km up, for 13 minutes, and came back alive.",
    source: "Wikipedia, Félicette",
    url: "https://en.wikipedia.org/wiki/F%C3%A9licette",
  },
  tama: {
    text: "From 2007, a cat named Tama was stationmaster of Kishi station, in Japan. Passengers went up 17% in her first month. She had a Shinto funeral.",
    source: "Wikipedia, Tama (cat)",
    url: "https://en.wikipedia.org/wiki/Tama_(cat)",
  },
  tashirojima: {
    text: "On Tashirojima, a small Japanese island, cats outnumber people. In the middle of the island, there is a shrine to a cat.",
    source: "Wikipedia, Tashirojima",
    url: "https://en.wikipedia.org/wiki/Tashirojima",
  },
  maneki: {
    text: "A maneki-neko with its left paw up is said to call customers. The right paw calls money. To a Japanese eye, it’s beckoning, not waving.",
    source: "Wikipedia, Maneki-neko",
    url: "https://en.wikipedia.org/wiki/Maneki-neko",
  },
  stubbs: {
    text: "A cat named Stubbs was honorary mayor of Talkeetna, in Alaska, for 20 years.",
    source: "Wikipedia, Stubbs (cat)",
    url: "https://en.wikipedia.org/wiki/Stubbs_(cat)",
  },
  larry: {
    text: "Larry has been Chief Mouser at 10 Downing Street, in London, since 2011. Prime ministers come and go. Larry stays.",
    source: "Wikipedia, Larry (cat)",
    url: "https://en.wikipedia.org/wiki/Larry_(cat)",
  },
  hemingway: {
    text: "Hemingway’s house in Key West is home to about 50 descendants of his cats. About half have extra toes. The record for one cat is 29 toes.",
    source: "Wikipedia, Polydactyl cat",
    url: "https://en.wikipedia.org/wiki/Polydactyl_cat",
  },
  muezza: {
    text: "A story says the Prophet cut off his sleeve rather than wake his cat, Muezza, asleep on it. Historians doubt it. People still love telling it.",
    source: "Wikipedia, Muezza",
    url: "https://en.wikipedia.org/wiki/Muezza",
  },
  boxes: {
    text: "Shelter cats given a box to hide in got used to their new place faster, and were less stressed, than cats without one.",
    source: "Vinke et al., Utrecht University, 2014",
    url: "https://dspace.library.uu.nl/handle/1874/377363",
  },
  illusion: {
    text: "Cats will sit inside a square that isn’t there. Four corner shapes drawn on the floor are enough.",
    source: "Smith et al., Applied Animal Behaviour Science 2021",
    url: "https://www.smithsonianmag.com/smart-news/if-i-fits-i-sits-experiment-shows-felines-also-sit-illusory-boxes-180977681",
  },
  tongue: {
    text: "A cat’s tongue is covered in tiny hollow hooks. They scoop up saliva and push it deep into the fur, right down to the skin.",
    source: "Noel & Hu, Georgia Tech, PNAS 2018",
    url: "https://www.npr.org/2018/11/21/669294706/freaked-out-by-your-cats-scratchy-tongue-don-t-be-it-s-keeping-them-cleaner",
  },
  paws: {
    text: "Cats have a favourite paw. Most females are right-pawed. Most males are left-pawed.",
    source: "Wells et al., Queen’s University Belfast",
    url: "https://www.livescience.com/61517-cat-paw-dominance-study.html",
  },
};

const ENDING_FACTS = {
  "Asleep in the shade": "streetLife",
  "A rice ball on the bench": "streetLife",
  "A cat with a home": "streetLife",
  "A small, warm apartment": "japanIndoor",
  "The old king of the market": "territory",
  "A long line of cats": "streetKittens",
  "Eyes of two colours": "streetKittens",
  "The night shift cat": "sleep",
  "Too small for Rabat": "streetKittens",
  "Like the cherry blossoms": "streetKittens",
  "Older than the tram": "oldest",
  "A cat nobody kept": "streetLife",
  "Star of the alley": "japanShelters",
};

const CITY_FACTS = {
  Rabat: ["streetLife", "females", "territory", "islam", "muezza", "egypt", "mummies", "origin"],
  Tokyo: ["japanShelters", "japanIndoor", "females", "tama", "tashirojima", "maneki", "gotokuji", "names", "voices"],
};

// Facts the player has already seen, kept in this browser only.
const seenFacts = new Set(
  (() => {
    try {
      return JSON.parse(localStorage.getItem("born-a-cat:facts")) || [];
    } catch (e) {
      return [];
    }
  })()
);

function markFactSeen(key) {
  seenFacts.add(key);
  try {
    localStorage.setItem("born-a-cat:facts", JSON.stringify([...seenFacts]));
  } catch (e) {}
}

// A fact the player hasn't seen yet: the first key in "wanted" that is new,
// otherwise a new one from "pool", otherwise from all facts. Once every
// fact has been seen, they all become new again.
function freshFact(wanted = [], pool = []) {
  const unseen = (keys) => keys.filter((k) => FACTS[k] && !seenFacts.has(k));
  let key = unseen(wanted)[0];
  if (!key) {
    const fromPool = unseen(pool);
    const any = fromPool.length ? fromPool : unseen(Object.keys(FACTS));
    if (!any.length) {
      seenFacts.clear();
      return freshFact(wanted, pool);
    }
    key = any[Math.floor(Math.random() * any.length)];
  }
  markFactSeen(key);
  return FACTS[key];
}
