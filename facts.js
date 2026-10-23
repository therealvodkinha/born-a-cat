// Real facts about cats, shown in small on the ending card.
// Each one has its source, so anyone can check it.
// An ending shows its own fact if it has one (ENDING_FACTS, by title),
// otherwise a random fact of its city, otherwise a random general fact.

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
};

const ENDING_FACTS = {
  "Gone without a trace": "roads",
  "A cat with a home": "streetLife",
  "A small, warm apartment": "japanIndoor",
  "The old king of the market": "territory",
  "A long line of cats": "streetKittens",
  "Eyes of two colours": "streetKittens",
  "The night shift cat": "sleep",
};

const CITY_FACTS = {
  Rabat: ["streetLife", "females", "territory"],
  Tokyo: ["japanShelters", "japanIndoor", "females"],
};
