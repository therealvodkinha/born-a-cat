// ============================================================
// STORIES — this is the file to edit to change the game's text.
// ============================================================
//
// HOW A GAME WORKS
// 1. The cat is born in a random city, in a random place (see ORIGINS:
//    the street, a shelter or a home), with a breed (BREEDS), a coat and
//    a trait (TRAITS). Where it is born changes how the life starts.
// 2. A life goes through the chapters of LIFE (Newborn, Kitten...).
//    Each chapter has one or more steps (an age). At each step, ONE event
//    of that chapter is drawn at random, never the same one twice.
// 3. Each choice can go well or badly (chance + trait bonus).
// 4. Each outcome changes the cat's stats: health, happiness, strength,
//    and food (which changes its weight). If health reaches 0, the cat dies.
//    Old cats can also die in their sleep between steps (see "risk").
// 5. Some outcomes leave a "mark" (something the cat remembers).
//    Marks unlock follow-up events later, and special endings.
//
// EVENT
//   text    : what happens. Short sentences.
//   needs   : (optional) only possible if the cat has this mark
//   notIf   : (optional) impossible if the cat has this mark
//   origin  : (optional) only for cats born there: "street", "shelter" or "home".
//             These events come first when they can happen.
//   fact    : (optional) a real cat fact from facts.js, shown under the outcome
//   scene   : (optional) where it happens, one of the city's "scenes": its
//             painting is shown like a photo behind the cat
//   choices : the buttons (2 or 3)
//
// CHOICE
//   label    : the button text
//   chance   : how likely it goes well (0.5 = one time out of two)
//   bonus    : (optional) chance added or removed for a trait, e.g. { brave: 0.2, shy: -0.2 }
//   stat     : (optional) "strength" or "health": a strong (or healthy) cat does better
//   gesture  : (optional) the player must do something to try it, and doing it well helps:
//              "pounce" (tap at the right moment), "hold" (let go at the right moment),
//              "run" (tap fast). See GESTURES in rules.js.
//   mods     : (optional) the same choice works differently for different cats.
//              A list of { needs / notIf / coat / cond, chance, why, good, bad }:
//                needs, notIf : a mark the cat has, or doesn't have
//                coat         : "ginger", "black", "grey tabby", "white", "calico", "tuxedo"
//                breed        : "mixed", "persian", "mainecoon", "bobtail" (see BREEDS)
//                origin       : "street", "shelter", "home"
//                cond         : "strong", "ok" or "weak" (how the cat is doing)
//                chance       : added to the chance, e.g. 0.2 or -0.15
//                why          : shown to the player, e.g. "Battle scars"
//                good, bad    : (optional) a different text for this cat
//   good     : what happens if it goes well
//   bad      : what happens if it goes badly
//   goodFx   : (optional) what it changes, e.g. { health: 10, happy: 5, strength: 5, food: 2 }
//   badFx    : (optional) same, if it goes badly
//              Without goodFx: happy +6. Without badFx: happy -6, health -5.
//              health -40 or more can kill a young cat. Use it for real danger only.
//   goodMark : (optional) mark left if it goes well
//   badMark  : (optional) mark left if it goes badly
//
// ENDING
//   title, text
//   needs / notIf : (optional) same as events
//   when  : (optional) "early"   the cat died before growing up
//                      "cut"     the cat died hurt or sick, later in life
//                      "ancient" the cat lived through the very last step
//                      no "when" = the cat died of old age
//   mood  : (optional) "sad" = only if the cat ended its life unhappy
//   If several special endings are possible, one is drawn at random.
//   Endings with no condition are only used when no special ending fits.
//
// MARKS (below TRAITS) gives each mark a name, shown on screen as the cat's
// state: what it has, what happened to it. "good" ones are shown in colour.
//
// After changing chances, effects, events or endings, run:  node tools/odds.js
// It plays 200,000 lives per city and updates odds.js (how rare each ending is).
//
// Rules: keep the quotes " " around each text, and the comma at the end of each line.
// Inside a text, use ’ (curly apostrophe) and “ ” (curly quotes).
//
// THE VOICE
// - The cat has strong opinions, and they are often wrong (cat logic).
// - One precise, real detail beats three pretty words: a brand, a time, a sound.
// - Funny first. The sad part comes in a small detail, never explained.
// - No moral at the end of a sentence. No “you will remember this forever”.
// - Short sentences. Two or three per text is plenty.

// How every cat starts (0 to 100).
const START_STATS = { health: 50, happy: 55, strength: 10 };

// The chapters of a life, the same in every city.
//   steps : one per event, with the cat's age, and its normal weight (kg)
//           and length (cm, nose to tail base) at that age
//   each  : what happens to the stats at every step of the chapter
//   risk  : chance to die in its sleep after that step (1 = always)
const LIFE = [
  {
    name: "Newborn",
    each: { strength: 5 },
    steps: [{ age: "3 weeks", kg: 0.4, cm: 14 }],
  },
  {
    name: "Kitten",
    each: { strength: 10, health: 5 },
    steps: [
      { age: "2 months", kg: 1.0, cm: 22 },
      { age: "6 months", kg: 2.6, cm: 36 },
    ],
  },
  {
    name: "Young",
    each: { strength: 12, health: 5 },
    steps: [
      { age: "1 year", kg: 3.6, cm: 42 },
      { age: "2 years", kg: 4.1, cm: 45 },
    ],
  },
  {
    name: "Adult",
    each: { strength: 4 },
    steps: [
      { age: "4 years", kg: 4.4, cm: 46 },
      { age: "6 years", kg: 4.5, cm: 46 },
    ],
  },
  {
    name: "Hard times",
    each: { strength: -5 },
    steps: [
      { age: "8 years", kg: 4.4, cm: 46 },
      { age: "10 years", kg: 4.2, cm: 46 },
    ],
  },
  {
    name: "Old age",
    each: { strength: -12, health: -10 },
    steps: [
      { age: "13 years", kg: 4.0, cm: 45, risk: 0.5 },
      { age: "16 years", kg: 3.6, cm: 44, risk: 0.9 },
      { age: "19 years", kg: 3.2, cm: 43, risk: 1 },
    ],
  },
];

const TRAITS = [
  { id: "brave", line: "You are brave. You once hissed at a bus. The bus didn’t notice. You count it as a win." },
  { id: "shy", line: "You are shy. Your favourite place in the world is under things." },
  { id: "curious", line: "You are curious. Every open door is an invitation. Every closed door is an insult." },
  { id: "clever", line: "You are clever. You know which humans are soft before they know it themselves." },
];

// Said on the birth screen, under the trait. One line per coat (see COATS in art.js).
const COAT_LINES = {
  ginger: "Ginger fur. Most ginger cats are boys. You have the attitude, at least.",
  black: "Black fur. Some people cross the street when they see you. In Japan, they’d call you lucky.",
  "grey tabby": "Grey stripes, and an M on your forehead. Every tabby has one. Nobody knows what it stands for.",
  white: "White fur. Lovely in photos. A disaster in mud.",
  calico: "Three colours. Almost every calico is a girl. You are very proud of this.",
  tuxedo: "Black, with a white shirt. You look dressed for a wedding at all times.",
};

// Where the cat is born. This is drawn first, before anything else.
//   chance : how often (they add up to 1)
//   label  : the stamp on the birth screen
//   stats  : added to START_STATS
//   marks  : marks the cat starts with
//   breeds : how likely each breed is, for a cat born here (see BREEDS)
// What the birth screen says about each place is in each city (“origins”).
const ORIGINS = {
  street: {
    chance: 0.6,
    label: "Street cat",
    stats: { strength: 4 },
    marks: [],
    breeds: { mixed: 96, persian: 2, bobtail: 2 },
  },
  shelter: {
    chance: 0.25,
    label: "Shelter cat",
    stats: { health: 10, happy: -5 },
    marks: [],
    breeds: { mixed: 82, persian: 8, mainecoon: 5, bobtail: 5 },
  },
  home: {
    chance: 0.15,
    label: "House cat",
    stats: { health: 15, happy: 10, strength: -4 },
    marks: ["home"],
    breeds: { mixed: 45, persian: 25, mainecoon: 20, bobtail: 10 },
  },
};

// Breeds. Most cats in the world have none (“mixed”).
//   line     : shown at birth, under the breed's name
//   coats    : (optional) the coats this breed can have (see COATS in art.js);
//              one each for now, the one in its pictures (CAT_PICTURES in art.js)
//   cities   : (optional) only born in these cities
//   stats    : added to the starting stats
//   build    : (optional) how big the cat grows (1 = normal)
//   physical : chance added to physical choices (pounce, run, strength)
//   charm    : chance added to choices that win a human (a home, a friend)
const BREEDS = {
  mixed: {
    label: "No breed", // no line: most cats have no breed, nothing to say
    line: "",
    stats: { health: 5 },
    physical: 0,
    charm: 0,
  },
  persian: {
    label: "Persian",
    coats: ["white"],
    line: "Flat face, long fur, the look of a disappointed duchess.",
    stats: { health: -5, happy: 5 },
    physical: -0.1,
    physicalWhy: "Flat face, short breath",
    charm: 0.15,
    charmWhy: "Pretty face",
  },
  mainecoon: {
    label: "Maine Coon",
    coats: ["grey tabby"],
    line: "The biggest breed of house cat. You will be enormous.",
    stats: { strength: 8 },
    build: 1.3,
    physical: 0.1,
    physicalWhy: "Big paws",
    charm: 0.05,
    charmWhy: "Fluffy",
  },
  bobtail: {
    label: "Japanese Bobtail",
    cities: ["Tokyo"],
    coats: ["calico"],
    line: "A pom-pom tail, like the lucky cat in shop windows.",
    stats: { strength: 3 },
    physical: 0.05,
    physicalWhy: "Quick on your feet",
    charm: 0.1,
    charmWhy: "Lucky cat",
  },
};

// What each mark looks like on screen. "good: true" = something the cat won.
const MARKS = {
  baker: { label: "The baker’s cat", good: true },
  gang: { label: "Respected", good: true },
  scar: { label: "Battle scars" },
  girl: { label: "Loved by a girl", good: true },
  flour: { label: "Banned from the bakery" },
  limp: { label: "Limping" },
  kittens: { label: "Parent", good: true },
  home: { label: "Has a home", good: true },
  boss: { label: "King of the market", good: true },
  left: { label: "Left behind" },
  konbini: { label: "Night shift friend", good: true },
  parklady: { label: "The park lady’s favourite", good: true },
  forgotten: { label: "Forgotten" },
  eartip: { label: "Clipped ear", good: true },
  famous: { label: "On television", good: true },
};

// How the cat feels, from its health and happiness.
const CONDITIONS = {
  strong: { label: "Strong and well fed", gained: "You feel strong. Your coat shines. Other cats move aside a little." },
  ok: { label: "Getting by", gained: "" },
  weak: { label: "Thin and sick", gained: "Your nose is warm and dry. You sleep more than you should." },
};

const STORIES = {
  // ==========================================================
  Rabat: {
    line: "Warm stones, the smell of the sea, and a hundred cats who all think they own the place.",
    origins: {
      street: "A cardboard box behind a bakery. Your mother is somewhere. Probably.",
      shelter: "A shelter cage. Clean blankets, and forty dogs next door.",
      home: "A laundry basket in a house. A family before you have teeth.",
    },
    // the painted places, in img/scenes/rabat-<id>.webp, with the words
    // written under the photo
    scenes: {
      shelter: "The shelter",
      home: "Home",
      bakery: "The bakery",
      roofs: "The rooftops",
      port: "The port",
      walls: "The Oudayas",
      market: "The market",
      tram: "Avenue Mohammed V",
      fountain: "The fountain",
      ramadan: "The mosque street",
    },
    chapters: {
      // --------------------------------------------------------
      Newborn: [
        {
          origin: "shelter",
          scene: "shelter",
          text: "You are born in cage number 7 of a shelter on the edge of Rabat. Forty dogs bark in the next room. A volunteer writes your birthday on a piece of tape, and spells it wrong.",
          choices: [
            {
              label: "Climb the cage door",
              gesture: "hold",
              chance: 0.55,
              bonus: { curious: 0.2, brave: 0.1 },
              stat: "strength",
              good: "You get to the top bar and stay there, shaking, very proud. The volunteer takes a photo. It goes on the shelter’s Facebook page. Eleven likes.",
              bad: "You get halfway and fall on your sister. She will remember this.",
              goodFx: { happy: 8, strength: 5 },
              badFx: { health: -6 },
            },
            {
              label: "Sleep on the volunteer’s sleeve",
              chance: 0.7,
              bonus: { shy: 0.1, clever: 0.1 },
              good: "She doesn’t move for an hour. She misses her bus. She says it’s fine. You sleep through all of it.",
              bad: "Her phone rings. She has to go. The cage is colder without her sleeve.",
              goodFx: { happy: 10, health: 4 },
            },
          ],
        },
        {
          origin: "shelter",
          scene: "shelter",
          text: "The vet comes on Tuesdays. Today is Tuesday. He has cold hands, a very small needle, and a radio playing Oum Kalthoum in his pocket.",
          choices: [
            {
              label: "Hide behind your mother",
              chance: 0.5,
              bonus: { shy: 0.2 },
              good: "Your mother gives him a look. He does you last, very gently. Vaccinated. You sulk until dinner.",
              bad: "Your mother is not as big as you thought. He finds you in two seconds. You scream like it’s the end. It takes one second.",
              goodFx: { health: 12 },
              badFx: { health: 8, happy: -8 },
            },
            {
              label: "Bite him",
              chance: 0.4,
              bonus: { brave: 0.3, shy: -0.2 },
              good: "You bite his thumb with your two teeth. He laughs. “This one will survive anything,” he says, and writes something on your tape.",
              bad: "He doesn’t even notice. Needle, done, next. Your teeth are not ready yet.",
              goodFx: { health: 12, strength: 4, happy: 6 },
              badFx: { health: 8, happy: -6 },
            },
          ],
        },
        {
          origin: "home",
          scene: "home",
          text: "You are born in a laundry basket in a house in Agdal. The youngest daughter has already named you three times. Her grandmother says no cats on the sofa. She says it on the sofa, holding you.",
          choices: [
            {
              label: "Climb onto the grandmother",
              chance: 0.6,
              bonus: { brave: 0.1, clever: 0.2 },
              good: "She pretends to complain for a whole episode of her series. Then she gives you a piece of chicken from the tagine. You are hers now.",
              bad: "She puts you back in the basket, with dignity. “Cats live outside.” Her own cat, it turns out, lived to twenty.",
              goodFx: { food: 2, happy: 8 },
              badFx: { happy: -5 },
            },
            {
              label: "Stay in the warm laundry",
              chance: 0.75,
              bonus: { shy: 0.2 },
              good: "Clean socks, warm from the sun. You sleep for two days. It’s the best bed you will ever have, and you don’t know it yet.",
              bad: "Someone folds the laundry with you inside. They find you at dinner, in a drawer, very offended.",
              goodFx: { health: 6, happy: 6 },
              badFx: { happy: -6 },
            },
          ],
        },
        {
          origin: "home",
          scene: "home",
          text: "The television is on all day. Football. Every time Raja scores, the uncle jumps up and screams, and you fly out of your basket.",
          choices: [
            {
              label: "Scream back",
              chance: 0.55,
              bonus: { brave: 0.2 },
              good: "The uncle stops, looks at you, and laughs until he coughs. From now on, you watch every match on his knee. You don’t understand the rules. Neither does the referee.",
              bad: "Nobody hears you. Raja scores again. You fly again.",
              goodFx: { happy: 10 },
              badFx: { happy: -5, health: -3 },
            },
            {
              label: "Hide under the sofa",
              chance: 0.8,
              bonus: { shy: 0.2 },
              good: "Under the sofa: a lost earring, a dried date, and peace. You decide this is your office.",
              bad: "Under the sofa is the dust of ten years. You sneeze for a day.",
              goodFx: { health: 4 },
            },
          ],
        },
        {
          origin: "street",
          scene: "bakery",
          text: "You are the size of a msemen. Your mother left “for five minutes” this morning. Above you, the baker pulls down his shutter. It sounds like the end of the world.",
          choices: [
            {
              label: "Scream until he looks down",
              chance: 0.6,
              bonus: { brave: 0.1, shy: -0.2 },
              good: "He sighs like a man who already feeds four cats. Bread in milk. A cardboard box. He belongs to you now.",
              bad: "The scooters are louder than you. You sleep against the oven wall. It’s still warm. That’s something.",
              goodFx: { food: 2, health: 5, happy: 8 },
              badFx: { food: -1, health: -8 },
              goodMark: "baker",
            },
            {
              label: "Wait in silence for your mother",
              chance: 0.45,
              good: "She comes back at dawn with a sardine head and a long-day face. She stays a little longer than usual.",
              bad: "She doesn’t come back. You wait two days. Waiting, it turns out, is not a meal.",
              goodFx: { food: 1, happy: 8 },
              badFx: { food: -2, health: -15, happy: -10 },
            },
          ],
        },
        {
          origin: "street",
          scene: "roofs",
          text: "A seagull lands on the wall above your nest. Rabat’s seagulls are the size of a small dog. It is counting you and your sisters.",
          choices: [
            {
              label: "Puff up and hiss",
              gesture: "hold",
              chance: 0.4,
              bonus: { brave: 0.3, shy: -0.2 },
              stat: "strength",
              good: "You puff up to twice your size. Still very small. The gull decides you’re not worth it and leaves for the beach.",
              bad: "It doesn’t care how big you look. When it flies off, there are only two of you left. You sleep very close after that.",
              goodFx: { happy: 10, strength: 5 },
              badFx: { health: -45, happy: -15 },
            },
            {
              label: "Squeeze into the crack in the wall",
              gesture: "hold",
              chance: 0.7,
              bonus: { shy: 0.2 },
              good: "The gull pecks at the stones, screams something rude, and gives up. You stay in the crack until dark.",
              bad: "You are safe in the crack. One of your sisters was too slow. The nest is bigger now, and colder.",
              badFx: { happy: -15, health: -5 },
            },
          ],
        },
        {
          text: "You open your eyes for the first time. They are blue. Every kitten’s are, at first. The world is blurry, loud, and smells strongly of fish.",
          choices: [
            {
              label: "Crawl toward the smell",
              chance: 0.5,
              bonus: { curious: 0.2 },
              good: "It’s your mother’s mouth, full of fish. Excellent first discovery. Ten out of ten.",
              bad: "You crawl out of the box and fall off the step. It’s a small step. It feels like a cliff.",
              goodFx: { food: 1, happy: 8 },
              badFx: { health: -12 },
            },
            {
              label: "Stay in the warm pile",
              chance: 0.8,
              bonus: { shy: 0.1 },
              good: "Four brothers and sisters, all breathing at once. You decide the world can wait a week.",
              bad: "Your brother sleeps on your face all afternoon. You learn early that family is complicated.",
              goodFx: { health: 5, happy: 6 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      Kitten: [
        {
          origin: "shelter",
          scene: "shelter",
          text: "Adoption day. A girl and her father walk past the cages. The father says they are “just looking”. He has already put a blanket in the car.",
          choices: [
            {
              label: "Push your face against the bars",
              chance: 0.45,
              bonus: { brave: 0.1, shy: -0.2, curious: 0.1 },
              good: "The girl puts one finger through the bars. You hold it with both paws. The father sighs. That night, you sleep in a house in Souissi, with a radiator.",
              bad: "They take your sister. The shelter is full. A week later, the volunteers clip your ear and let you go in the street by the shelter. They are very kind about it.",
              goodFx: { happy: 15, health: 6, food: 2 },
              badFx: { happy: -10 },
              goodMark: "home",
              badMark: "eartip",
            },
            {
              label: "Stay at the back of the cage",
              chance: 0.3,
              bonus: { shy: 0.15, clever: 0.1 },
              good: "The girl walks past the cute ones and stops at you. “That one looks like he thinks a lot.” You don’t. But you go home with them anyway.",
              bad: "Nobody sees you at the back. A week later, the volunteers clip your ear and let you go in the street by the shelter. A man at the café starts calling you “the new one”.",
              goodFx: { happy: 15, health: 6, food: 2 },
              badFx: { happy: -10 },
              goodMark: "home",
              badMark: "eartip",
            },
          ],
        },
        {
          origin: "home",
          scene: "home",
          text: "The front door is open. The plumber is fixing the sink and complaining about the last plumber. Outside: the whole street, and it smells of grilled sardines.",
          choices: [
            {
              label: "Go and see",
              chance: 0.55,
              bonus: { curious: 0.2, brave: 0.1 },
              good: "You do the tour: the hanout, the garage, the warm hood of a Dacia. You’re back for dinner. Nobody noticed. You do this every day for the rest of your life.",
              bad: "A car honks. You run the wrong way for twenty minutes. The daughter finds you at night under a car, three streets away. She cries more than you do.",
              goodFx: { happy: 12, strength: 5 },
              badFx: { health: -12, happy: -8 },
            },
            {
              label: "Watch from the doorstep",
              chance: 0.8,
              bonus: { shy: 0.2, clever: 0.1 },
              good: "A street cat walks past and looks at you like you’re a cushion. You decide to stay a cushion a bit longer.",
              bad: "The plumber closes the door on your tail. He says sorry to you, very seriously. Your tail does not accept.",
              goodFx: { health: 3 },
              badFx: { health: -5 },
            },
          ],
        },
        {
          scene: "port",
          text: "A tourist on the Corniche kneels in front of you. Her camera is bigger than your whole family. She goes “psspsspss” with a terrible accent.",
          choices: [
            {
              label: "Sit and pose",
              chance: 0.6,
              bonus: { curious: 0.2, shy: -0.2 },
              good: "Click. She laughs, says something in German, and leaves half a sandwich. Your face will be on a fridge in Munich for ten years.",
              bad: "Forty photos. Zero sandwich. She leaves very happy. You leave very hungry.",
              goodFx: { food: 2, happy: 8 },
              badFx: { food: -1 },
            },
            {
              label: "Run under a bench",
              chance: 0.8,
              good: "She slides a triangle of La Vache qui rit under the bench and walks away. You eat it. Most of the foil too.",
              bad: "You trip on the curb and land in a puddle. A pigeon saw everything. It looks embarrassed for you.",
              goodFx: { food: 1 },
            },
          ],
        },
        {
          scene: "walls",
          text: "Your mother is teaching you to hunt, by the old city walls. A lizard sleeps on a hot stone. It looks delicious and a bit stupid.",
          choices: [
            {
              label: "Jump on it",
              gesture: "pounce",
              chance: 0.5,
              bonus: { brave: 0.2, clever: 0.1 },
              stat: "strength",
              good: "You land on it with four paws and your whole heart. Your mother looks at you for a long time. Pride, probably.",
              bad: "The lizard leaves its tail in your mouth and runs. The tail keeps wiggling. You keep it. It counts.",
              goodFx: { food: 2, strength: 8, happy: 8 },
            },
            {
              label: "Watch your mother do it",
              chance: 0.7,
              bonus: { clever: 0.2 },
              good: "She waits. She waits more. She moves only when the lizard blinks. From now on, you hunt exactly like her.",
              bad: "She misses too. You both walk home pretending you weren’t hungry.",
              goodFx: { food: 1, strength: 5 },
              badFx: { food: -1 },
            },
          ],
        },
        {
          fact: "falls",
          scene: "roofs",
          text: "A roof terrace in the medina. Washing lines, a satellite dish, and a pigeon on the very edge. It hasn’t seen you.",
          choices: [
            {
              label: "Pounce",
              gesture: "pounce",
              chance: 0.35,
              bonus: { brave: 0.1, clever: 0.1 },
              stat: "strength",
              good: "You miss the pigeon and fall three floors. In the air, your body turns on its own. Feet first. You land in a pile of carpets and walk off like you meant it.",
              bad: "You miss the pigeon and fall three floors. You turn in the air and land on your feet. Your feet are not happy about it.",
              goodFx: { happy: 10, strength: 5 },
              badFx: { health: -40, happy: -8 },
              badMark: "limp",
            },
            {
              label: "Stalk it slowly",
              gesture: "hold",
              chance: 0.6,
              bonus: { clever: 0.2, shy: 0.1 },
              good: "One paw. Then another. The pigeon finally sees you and leaves. You pretend you were stretching.",
              bad: "A woman comes up to hang her washing. She screams. You run. The pigeon stays.",
              goodFx: { strength: 6 },
            },
          ],
        },
        {
          fact: "lapping",
          scene: "fountain",
          text: "The fountain in the square. Water runs out of a brass tap all day. You are very thirsty, and very small.",
          choices: [
            {
              label: "Drink from the basin",
              chance: 0.7,
              good: "Your tongue barely touches the water. It pulls up a little column, and you snap it. Again and again, very fast. You are a genius.",
              bad: "A boy splashes you on purpose. You drink anyway, soaked and furious.",
              goodFx: { health: 6 },
            },
            {
              label: "Drink straight from the tap",
              chance: 0.4,
              bonus: { curious: 0.2, brave: 0.1 },
              good: "Water up the nose, water in the ears, and a crowd of children cheering. Worth it.",
              bad: "You slip into the basin. You come out twice as small and twice as angry.",
              goodFx: { health: 4, happy: 10 },
              badFx: { health: -20, happy: -8 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      Young: [
        {
          text: "Three days of rain. Every dry corner near the market is taken. The best one belongs to a huge orange tom who terrorises everyone, humans included.",
          choices: [
            {
              label: "Take his spot",
              chance: 0.3,
              bonus: { brave: 0.2, shy: -0.2 },
              stat: "strength",
              good: "You are small, but furious. Furious is a size too. He leaves. The other cats look at you differently now.",
              bad: "He takes a piece of your ear as a souvenir. You keep the notch for life. It makes you look experienced.",
              goodFx: { strength: 8, happy: 10 },
              badFx: { health: -25, strength: 3 },
              goodMark: "gang",
              badMark: "scar",
            },
            {
              label: "Slip under a parked car",
              chance: 0.7,
              good: "The engine is still warm. Under an old Dacia that smells of oranges and petrol, you sleep better than in weeks.",
              bad: "At six in the morning, the car starts. You run, soaked and screaming, all the way to the river.",
              goodFx: { health: 6 },
            },
          ],
        },
        {
          scene: "walls",
          text: "A little girl crouches near the Oudayas. She holds out her hand very slowly, like it’s a big responsibility. Her mother is calling her, louder each time.",
          choices: [
            {
              label: "Let her pet you",
              mods: [
                { cond: "weak", chance: 0.15, why: "Thin and sick", good: "She sees how thin you are. The next day, she comes back with a sardine sandwich and a serious face. Every day after that, at four o’clock." },
              ],
              chance: 0.6,
              bonus: { shy: -0.2, curious: 0.1 },
              good: "She pets you against the fur. You allow it. She comes back every day after school. You start waiting for her at four o’clock.",
              bad: "Her mother pulls her away. “Don’t touch, they have fleas.” Rude. Also true.",
              goodFx: { happy: 15, food: 1 },
              goodMark: "girl",
            },
            {
              label: "Run",
              chance: 0.8,
              good: "Nobody owns you. Nobody will ever disappoint you. It’s a good system, mostly.",
              bad: "You run straight into three boys with a stick. From now on, hands are guilty until proven innocent.",
              badFx: { health: -12, happy: -10 },
            },
          ],
        },
        {
          needs: "baker",
          scene: "bakery",
          text: "The baker leaves the back door open at night now. Between the flour bags, something is moving. Something small, with a tail.",
          choices: [
            {
              label: "Hunt the mouse",
              gesture: "pounce",
              chance: 0.6,
              bonus: { brave: 0.1, clever: 0.1 },
              stat: "strength",
              good: "In the morning, the mouse is at his feet, presented with care. He laughs and calls you “Khobza”. It means bread. You’ll take it.",
              bad: "You beat the mouse but lose to a bag of flour. The baker finds a completely white cat. He does not laugh.",
              goodFx: { food: 2, happy: 10 },
              badMark: "flour",
            },
            {
              label: "Sleep by the warm oven",
              chance: 0.8,
              good: "You sleep like a king. In the morning, a little bowl of milk. Nobody mentions it.",
              bad: "The baker’s wife finds you asleep on her dough. The broom comes out. Some people have no sense of humour.",
              goodFx: { food: 1, health: 5 },
              badMark: "flour",
            },
          ],
        },
        {
          scene: "tram",
          text: "The tram rings its bell. On the other side of the tracks, the fish guy is throwing out what he couldn’t sell. Five cats have seen it.",
          choices: [
            {
              // Traffic is what kills most young street cats (median age 2.7 years
              // for cats killed on the road, RVC study 2017), so this is a bad bet.
              label: "Cross now",
              mods: [
                { needs: "limp", bad: "Your bad leg is too slow for the tram. Again. You make it across, barely, and the sardine is gone." },
              ],
              gesture: "run",
              chance: 0.4,
              bonus: { brave: 0.1, clever: 0.1 },
              good: "Between the wheels, over the rails. You arrive first. The best sardine is yours.",
              bad: "The tram catches your back leg. You make it across. The sardine went to someone else.",
              goodFx: { food: 2, happy: 8 },
              badFx: { health: -40, happy: -10 },
              badMark: "limp",
            },
            {
              label: "Wait for the tram to pass",
              chance: 0.7,
              bonus: { clever: 0.2 },
              good: "While the others fight over the first fish, you find the one under the stall. Nobody saw. You tell nobody.",
              bad: "By the time you cross, there is nothing left but the smell.",
              goodFx: { food: 2 },
              badFx: { food: -1 },
            },
          ],
        },
        {
          scene: "market",
          text: "Outside the hanout, six cats sit in a row on the step, like customers. The owner gives scraps to whoever looks the most tragic.",
          choices: [
            {
              label: "Look as tragic as possible",
              mods: [
                { cond: "weak", chance: 0.3, why: "Thin and sick", good: "You don’t even need to act. The owner sees your ribs and gives you the end of the mortadella. Plus cheese." },
              ],
              chance: 0.5,
              bonus: { clever: 0.2, shy: -0.1 },
              good: "Ears down, one paw slightly raised. Award-winning. You get the end of the mortadella. The other six will never forgive you.",
              bad: "A thin old cat with one eye sits next to you. You never stood a chance.",
              goodFx: { food: 2, happy: 6 },
              badFx: { food: -1 },
            },
            {
              label: "Slip inside behind a customer",
              gesture: "run",
              chance: 0.4,
              bonus: { brave: 0.2, curious: 0.1 },
              good: "Between the crates of Coca, a packet of biscuits “fell”. You eat it in the street. Delicious.",
              bad: "“Barra!” You run out, straight into the road. A car brakes. You sit on the other side, washing your paw. Your heart disagrees.",
              goodFx: { food: 2, happy: 8 },
              badFx: { health: -20, happy: -8 },
            },
          ],
        },
        {
          scene: "tram",
          text: "You fall asleep in the open boot of a petit taxi. You wake up in Salé, on the other side of the river. Nothing smells right.",
          choices: [
            {
              label: "Walk home",
              mods: [
                { needs: "baker", good: "Two days. One bridge. You follow the smell of the sea, then the smell of your bakery. The baker says “Fin kunti?” Where were you? Like a worried father." },
              ],
              chance: 0.5,
              bonus: { clever: 0.2, curious: 0.1 },
              stat: "strength",
              good: "Two days. One bridge. You follow the smell of the sea, then the smell of your bakery. Nobody noticed you were gone. Rude.",
              bad: "You get lost for a week. You find your way back at last, thinner, with opinions about Salé.",
              goodFx: { happy: 10, strength: 6 },
              badFx: { food: -3, health: -12 },
            },
            {
              label: "Wait for the taxi to go back",
              chance: 0.5,
              bonus: { shy: 0.1 },
              good: "The driver finds you at the end of his shift. “You again?” He drops you at the Bab el Had stop, like a customer.",
              bad: "The taxi leaves without you. You make a new life in Salé for a while. It’s fine. You’d never admit it.",
              goodFx: { happy: 8 },
              badFx: { happy: -10, food: -1 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      Adult: [
        {
          scene: "roofs",
          text: "Spring. A tabby with green eyes has been staring at you from the next roof for three evenings. Either she likes you or she wants your roof.",
          choices: [
            {
              label: "Follow her",
              mods: [
                { cond: "strong", chance: 0.15, why: "Strong and well fed", good: "Your coat shines. She doesn’t hesitate. Two months later, four kittens are born in a broken washing machine." },
              ],
              chance: 0.6,
              bonus: { brave: 0.1, shy: -0.1 },
              good: "Two months later, four kittens are born in a broken washing machine. One has your face, and already your attitude.",
              bad: "She leads you to her territory, where her brother is waiting. You come home with a bleeding nose.",
              goodFx: { happy: 15 },
              badFx: { health: -15 },
              goodMark: "kittens",
            },
            {
              label: "Stay on your own roof",
              chance: 0.7,
              good: "You watch her from your roof, a satellite dish in between. Some loves work better at a distance.",
              bad: "Another tom follows her. You hear them all night. You hate the moon.",
            },
          ],
        },
        {
          needs: "girl",
          scene: "walls",
          text: "The girl comes back with a shoebox full of holes. “My father finally said yes.” She has been repeating it all the way here.",
          choices: [
            {
              label: "Climb into the box",
              chance: 0.7,
              bonus: { curious: 0.2, shy: -0.2 },
              good: "You fall asleep before the taxi moves. You wake up in a house in Souissi. There is a radiator. A radiator.",
              bad: "In the taxi, the panic comes all at once. You jump out at a red light. She shouts your name. You didn’t know you had one.",
              goodFx: { happy: 15, health: 10, food: 2 },
              badFx: { happy: -12 },
              goodMark: "home",
            },
            {
              label: "Look at her, then walk away",
              chance: 0.9,
              good: "Maybe the street is your home. She still visits, a bit less often, always with something in her pocket.",
              bad: "She doesn’t come back. You wait at four o’clock for a few more weeks, in case she’s late.",
            },
          ],
        },
        {
          needs: "gang",
          scene: "market",
          text: "The big orange tom is getting slow. He sleeps more than he terrorises. The young cats are looking at you. The fish market could be yours.",
          choices: [
            {
              label: "Take his place",
              chance: 0.5,
              bonus: { brave: 0.2 },
              stat: "strength",
              good: "One fight. Short, loud, fair. From now on, the fishmongers keep the heads for you.",
              bad: "He is old, but not that old. You lose, in front of everyone. A seagull enjoys it.",
              goodFx: { happy: 12, food: 2 },
              badFx: { health: -20, happy: -10 },
              goodMark: "boss",
            },
            {
              label: "Let him finish his reign",
              chance: 0.8,
              good: "He dies that winter, in his spot, in the sun. Nobody takes his exact spot. Not even you.",
              bad: "While you were being respectful, a cat from the other market took over.",
            },
          ],
        },
        {
          fact: "eartip",
          notIf: "eartip",
          text: "A van parks in your street. A volunteer puts tuna in metal cages, doors wide open. It smells like a trap. It also smells like tuna.",
          choices: [
            {
              label: "Go in for the tuna",
              chance: 0.65,
              bonus: { curious: 0.1 },
              good: "Three days later, you’re back. Vaccinated, a bit lighter in places, with the tip of one ear cut off. You look like a veteran.",
              bad: "The vet frightens you so much you stop eating for a week. Even tuna. Even tuna.",
              goodFx: { health: 20, food: 1 },
              badFx: { food: -2, happy: -10 },
              goodMark: "eartip",
            },
            {
              label: "Watch from the roof",
              chance: 0.7,
              bonus: { clever: 0.2, shy: 0.1 },
              good: "The others come back healthy, with a cut ear. Next time, maybe. Probably not.",
              bad: "You stay up there so long that the others eat all the tuna. Even the tuna outside the cages.",
              badFx: { food: -1 },
            },
          ],
        },
        {
          fact: "islam",
          scene: "ramadan",
          text: "Friday. The muezzin calls. The big doors of the mosque are open, and inside there are carpets. Kilometres of soft carpet.",
          choices: [
            {
              label: "Walk in like you belong",
              mods: [
                { coat: "white", chance: 0.1, why: "White fur", good: "An old man smiles. “A white cat in the mosque. Baraka.” He moves his mat to make room. You sleep through the whole sermon." },
              ],
              chance: 0.7,
              bonus: { brave: 0.1, curious: 0.1 },
              good: "Nobody chases you. An old man moves his prayer mat a little, to make room. You sleep through the whole sermon.",
              bad: "A young guard carries you out with great care, like a lost shoe.",
              goodFx: { happy: 12, health: 4 },
            },
            {
              label: "Wait outside for the shoes to come out",
              chance: 0.6,
              bonus: { clever: 0.1 },
              good: "After prayer, three different men give you bread. Fridays are now your favourite day.",
              bad: "Everyone is in a hurry for couscous. Nobody sees you. Fridays are overrated.",
              goodFx: { food: 2 },
            },
          ],
        },
        {
          fact: "sweet",
          scene: "ramadan",
          text: "Ramadan. At sunset, the whole street stops to eat at once. On a tray by a door, a pile of chebakia, shining with honey.",
          choices: [
            {
              label: "Steal one",
              gesture: "pounce",
              chance: 0.5,
              bonus: { clever: 0.2, brave: 0.1 },
              good: "You run off with a chebakia. You lick it. Honey tastes of nothing. You eat the butter part and leave the rest, deeply confused.",
              bad: "The grandmother sees you. A slipper flies. It hits. She has had sixty years of practice.",
              goodFx: { happy: 6 },
              badFx: { health: -6, happy: -6 },
            },
            {
              label: "Wait for the harira",
              chance: 0.7,
              good: "A boy pours a little harira into a lid, with a piece of meat in it. Ramadan is your favourite month.",
              bad: "The harira is too hot. You burn your tongue and sulk until midnight.",
              goodFx: { food: 2, happy: 8 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      "Hard times": [
        {
          fact: "lapping",
          scene: "fountain",
          text: "August. The heat sits on Rabat like a fat cat on a newspaper. Every bowl of water in the street is dry.",
          choices: [
            {
              label: "Try the café terrace",
              mods: [
                { coat: "black", chance: -0.15, why: "Black fur in August", bad: "Black fur, in August, in Rabat. You are basically a solar panel. You wait for night under a plastic chair, dizzy." },
              ],
              chance: 0.6,
              good: "The waiter sees you staring at his ice bucket. He sighs and fills a saucer in the shade. Every afternoon until September.",
              bad: "The terrace is full and the waiter has a broom. You wait for night under a plastic chair, dizzy.",
              goodFx: { health: 8 },
              badFx: { health: -15 },
            },
            {
              label: "Follow the man washing cars",
              chance: 0.5,
              bonus: { curious: 0.2, clever: 0.1 },
              good: "He sprays you “by accident”. You hate it with your whole body. You also feel alive.",
              bad: "He chases you away. You find a drip under an air conditioner. It tastes like metal.",
              goodFx: { health: 8, happy: 4 },
              badFx: { health: -10 },
            },
          ],
        },
        {
          text: "Night, on the beach. Three stray dogs have smelled you. They spread out slowly, like they practised.",
          choices: [
            {
              label: "Run for the rocks",
              gesture: "run",
              chance: 0.55,
              bonus: { clever: 0.2 },
              good: "You squeeze between two rocks. No dog fits. They bark for an hour, then get bored. Dogs always get bored.",
              bad: "You make it, but one of them caught your tail. It never stands quite straight again.",
              badFx: { health: -25 },
              badMark: "scar",
            },
            {
              label: "Stand your ground and hiss",
              mods: [
                { needs: "boss", chance: 0.2, why: "King of the market", good: "The biggest dog sees who you are. Even dogs have heard of the king of the market. They leave." },
                { needs: "scar", chance: 0.1, why: "Battle scars", good: "The biggest dog looks at your torn ear. He decides not to find out how you got it." },
              ],
              gesture: "hold",
              chance: 0.3,
              bonus: { brave: 0.3 },
              stat: "strength",
              good: "The biggest dog hesitates. Then they all leave, slowly, as if it was their idea.",
              bad: "You fight. You live. That’s all you will ever say about that night.",
              goodFx: { happy: 12, strength: 5 },
              badFx: { health: -30 },
              badMark: "scar",
            },
          ],
        },
        {
          text: "Someone in the building is fed up with rats. Little blue grains appear in the corners of the stairwell. They smell almost like food.",
          choices: [
            {
              label: "Taste them",
              chance: 0.2,
              bonus: { clever: -0.1 },
              good: "One lick, and you know. You spit, you foam, you live. You never go near that stairwell again.",
              bad: "You are sick for days, under a car, burning. You come out very thin.",
              goodFx: { health: -10, happy: -4 },
              badFx: { health: -30, food: -2 },
            },
            {
              label: "Leave them alone",
              chance: 0.8,
              bonus: { clever: 0.15 },
              good: "Something about the smell is wrong. You trust your nose. Your nose has never lied to you.",
              bad: "You leave them alone. A younger cat doesn’t. You don’t see him again.",
              badFx: { happy: -12 },
            },
          ],
        },
        {
          needs: "home",
          scene: "home",
          text: "Boxes everywhere. The family is moving to Marseille. At night they argue in the kitchen. Your name keeps coming up.",
          choices: [
            {
              label: "Sleep inside a moving box",
              chance: 0.6,
              bonus: { clever: 0.1, curious: 0.1 },
              good: "The girl finds you in the box marked “KITCHEN” and laughs through her tears. “Okay. Okay. You’re coming.”",
              bad: "They give you to the neighbour on the third floor. She buys the good food. It is not the same.",
              badFx: { happy: -20 },
              badMark: "left",
            },
            {
              label: "Stay next to the girl all night",
              chance: 0.5,
              good: "Her father watches you two from the doorway. In the morning, he comes back with a carrier and acts like it was his idea.",
              bad: "On the last day, they leave you outside with a bag of food. The girl doesn’t look back. She can’t.",
              badFx: { happy: -25, food: -1 },
              badMark: "left",
            },
          ],
        },
        {
          needs: "kittens",
          text: "One of your kittens has stopped eating. It sleeps all day. The other three are hungry, and very loud about it.",
          choices: [
            {
              label: "Curl around the sick one",
              chance: 0.5,
              good: "For two days, you don’t move. On the third, it bites your ear. It’s going to be fine. It’s going to be annoying.",
              bad: "You keep it warm until the end. The others found food alone. They are a little more grown up now.",
              goodFx: { happy: 12, food: -1 },
              badFx: { happy: -15, food: -2 },
            },
            {
              label: "Go hunt for everyone",
              gesture: "pounce",
              chance: 0.5,
              bonus: { clever: 0.1, brave: 0.1 },
              stat: "strength",
              good: "You bring back a whole fish, almost as big as you. By the end of the week, the sick one is stealing from the others.",
              bad: "When you come back, the sick one is gone. The others eat. You eat too. That’s how it works up here.",
              goodFx: { happy: 12, food: 1 },
              badFx: { happy: -15 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      "Old age": [
        {
          needs: "baker",
          notIf: "home",
          scene: "bakery",
          text: "Your legs complain in the morning now. The baker is gone. His son runs the shop. He has the same sigh.",
          choices: [
            {
              label: "Go back to the bakery",
              chance: 0.6,
              good: "He looks at you for a long second. “You’re my father’s cat.” He puts an old cushion by the oven. It’s yours.",
              bad: "New sign, new owner, new broom. You get chased from the place where you got your name.",
              goodFx: { happy: 12, health: 6, food: 1 },
              badMark: "flour",
            },
            {
              label: "Watch from across the street",
              chance: 0.8,
              good: "Every morning, the son leaves bread on the step without looking up. He knows. You know he knows.",
              bad: "Nobody notices you over there. People walk past with their bread. That’s fine too.",
              goodFx: { food: 1, happy: 8 },
              badMark: "flour",
            },
          ],
        },
        {
          notIf: "home",
          scene: "port",
          text: "The wind from the sea is colder this year. Or you are. The fishermen at the port know your face now.",
          choices: [
            {
              label: "Stay by the boats",
              mods: [
                { needs: "boss", chance: 0.2, why: "King of the market", good: "The fishermen still keep the heads for you. Kings don’t retire. They just sit closer to the boats." },
              ],
              chance: 0.6,
              good: "They share their scraps and their complaints about diesel. You watch the waves for hours. It’s enough.",
              bad: "The boats go out less this winter. You get thin, slowly, the way old cats do.",
              goodFx: { food: 2, happy: 6 },
              badFx: { food: -2, health: -8 },
            },
            {
              label: "Find a warm wall in the old city",
              chance: 0.7,
              good: "A wall that keeps the heat until midnight. You stop moving much. You don’t need to anymore.",
              bad: "A young cat already sleeps on that wall. Ten years ago, you would have fought. Now you find another wall.",
              goodFx: { health: 6 },
            },
          ],
        },
        {
          text: "A young cat, all bones and ears, keeps following you. It steals your food. It sleeps a little too close. No manners at all.",
          choices: [
            {
              label: "Chase it away",
              chance: 0.6,
              bonus: { brave: 0.1 },
              good: "It comes back anyway. You let it. You are too tired to keep chasing things.",
              bad: "It leaves, and doesn’t come back. Your spot feels very big after that.",
            },
            {
              label: "Teach it your spots",
              mods: [
                { needs: "kittens", good: "It has your face. Of course it does. You teach it everything: the hanout, the bakery door, the fisherman who keeps heads." },
              ],
              chance: 0.8,
              good: "The hanout with cheese. The bakery’s back door. The fisherman who keeps heads. It will teach someone else one day, and get half of it wrong.",
              bad: "It doesn’t listen. Young cats never listen. You didn’t either.",
              goodFx: { happy: 12 },
            },
          ],
        },
        {
          needs: "girl",
          scene: "walls",
          text: "A young woman stops in the street and looks at you for a long time. “Is it you?” She crouches down, very slowly.",
          choices: [
            {
              label: "Go to her",
              chance: 0.8,
              good: "She cries, and laughs. You purr so loud the street can hear. She pets you against the fur. Of course it’s her.",
              bad: "Your eyes aren’t what they were. You don’t recognise her. She leaves something from her pocket anyway. Like before.",
              goodFx: { happy: 18 },
            },
            {
              label: "Stay where you are",
              chance: 0.5,
              good: "She sits on the step next to you for an hour. Neither of you says anything. You never could.",
              bad: "She waits, then leaves. Maybe she was wrong. Maybe she wasn’t.",
              goodFx: { happy: 12 },
            },
          ],
        },
        {
          needs: "home",
          notIf: "left",
          scene: "home",
          text: "You live on a windowsill in Souissi, in the sun. Every morning, the girl, grown up now, tells you her plans. You don’t care. You listen anyway.",
          choices: [
            {
              label: "Wait for her at the door",
              chance: 0.8,
              good: "Every evening, the key in the lock. Every evening, your tail goes up on its own. You never get used to it.",
              bad: "Some evenings she comes home very late. You wait anyway. You are a professional.",
              goodFx: { happy: 12 },
            },
            {
              label: "Sleep in the sun",
              chance: 0.9,
              good: "The sun moves across the floor. You move with it, one tile at a time. It’s a full-time job.",
              bad: "They built a building across the street. The sun comes later now. You find a new spot, slower.",
              goodFx: { health: 6, happy: 6 },
            },
          ],
        },
        {
          needs: "home",
          notIf: "left",
          scene: "home",
          text: "You have a house and a cushion. You still do your rounds: the wall, the garden, the hanout street. Halfway there, you run into her.",
          choices: [
            {
              label: "Meow once and keep walking",
              chance: 0.8,
              bonus: { clever: 0.1 },
              good: "One meow. “Hello, I’m busy.” She stands in the street laughing alone. You are home first, asleep, as if you never left.",
              bad: "She calls your name loudly, in front of three hanout cats. Your reputation will take weeks to recover.",
            },
            {
              label: "Walk with her to the hanout",
              chance: 0.6,
              bonus: { curious: 0.1, shy: -0.1 },
              good: "Tail up the whole way. The owner gives you a slice of cheese like a regular customer. You are a regular customer.",
              bad: "Halfway there, you remember you had somewhere to be. You leave without explaining. She’s used to it.",
              goodFx: { happy: 10, food: 1 },
            },
          ],
        },
        {
          needs: "left",
          text: "Since the family left for Marseille, you live in the garden of the empty house. New people moved in. They have a dog, and a son who drops the crusts of his sandwich on purpose.",
          choices: [
            {
              label: "Make friends with the son",
              chance: 0.6,
              bonus: { brave: 0.1, clever: 0.2, shy: -0.1 },
              good: "He starts bringing a whole sandwich and eating only half. His mother pretends not to see. The dog pretends not to see you.",
              bad: "The dog sees you first. You spend the afternoon on the wall, very dignified, unable to come down.",
              goodFx: { food: 2, happy: 10 },
              badFx: { happy: -6 },
            },
            {
              label: "Keep your distance",
              chance: 0.75,
              bonus: { shy: 0.2 },
              good: "You sleep under the lemon tree, where you always did. Nobody moves you. Some things stay yours.",
              bad: "They cut the lemon tree down to make a parking space. You sleep under the car instead. It’s not the same.",
              badFx: { happy: -10 },
            },
          ],
        },
        {
          scene: "tram",
          text: "The tram rings its bell, same as always. You are older than the tram now. You remember when this street was just dust and scooters.",
          choices: [
            {
              label: "Sleep on the warm rail",
              chance: 0.4,
              bonus: { clever: -0.1 },
              good: "The driver stops. Rings twice. Waits. You get up slowly, with dignity. Twenty people clap.",
              bad: "You jump too late. Your old legs don’t like it. You lie under a bench for the rest of the day.",
              goodFx: { happy: 12 },
              badFx: { health: -20 },
            },
            {
              label: "Watch it from the bench",
              chance: 0.8,
              good: "The tram goes by. Then another. You count them, then forget the number. It doesn’t matter.",
              bad: "Pigeons take the bench. You let them. You have nothing to prove to pigeons anymore.",
              goodFx: { health: 4, happy: 6 },
            },
          ],
        },
      ],
    },
    endings: [
      {
        when: "early",
        title: "Too small for Rabat",
        text: "You never got very big. You knew one wall, the smell of warm bread, and the sound of the sea at night. Your mother washed your ears every morning. It was a small world. It was yours, and it was warm.",
      },
      {
        when: "cut",
        title: "Asleep in the shade",
        text: "You fall asleep one afternoon in the shade of your wall, and you don’t wake up. Rabat has a hundred other cats. But someone walks past your wall and slows down a little, every day, for a long time.",
      },
      {
        when: "ancient",
        title: "Older than the tram",
        text: "You were there before the tram, before the towers, before half the cats of Rabat’s grandmothers. One morning in the sun, you just stop. The whole street feels it.",
      },
      {
        needs: "home",
        notIf: "left",
        title: "A cat with a home",
        text: "You die in your sleep, on a cushion that smells of her. She buries you under the lemon tree. Every spring, when it flowers, she sits there and tells you her plans.",
      },
      {
        needs: "baker",
        notIf: "flour",
        title: "Khobza",
        text: "One morning, you don’t come to the bakery door. The baker’s son puts bread on the step anyway. He does it for a long time. The other cats eat it. He doesn’t mind.",
      },
      {
        needs: "boss",
        title: "The old king of the market",
        text: "You die in your spot, where the sun hits first. That day, the fishmongers keep a head aside, out of habit. Nobody takes it. Not even the seagulls.",
      },
      {
        needs: "kittens",
        title: "A long line of cats",
        text: "One spring morning, you don’t wake up. On a roof nearby, a tabby with your face is teaching her kittens to wait for the lizard to blink.",
      },
      {
        mood: "sad",
        title: "A cat nobody kept",
        text: "You were tired for a long time. One cold night, you curl up behind the hanout and don’t get up. The owner finds you in the morning. He stands there for a minute, holding the mortadella.",
      },
      {
        title: "A cat of Rabat",
        text: "One spring morning, you don’t wake up. You were curled in the sun, the sea somewhere behind the walls. Nobody wrote your name down. You never had just one anyway.",
      },
    ],
  },

  // ==========================================================
  Tokyo: {
    line: "Neon lights, quiet alleys, and fourteen million people too polite to chase you.",
    origins: {
      street: "A box behind a convenience store, at 2 a.m.",
      shelter: "A rescue group’s spare room. Thirty volunteers, one group chat about you.",
      home: "A closet full of sweaters, in a small apartment. Your bed is already bought. You will never use it.",
    },
    scenes: {
      shelter: "The rescue room",
      flat: "Home",
      konbini: "The konbini",
      park: "The park",
      temple: "The temple",
      station: "The station",
      alley: "The yakitori alley",
      roofs: "The rooftops",
      sakura: "Cherry blossoms",
      street: "The street",
    },
    chapters: {
      // --------------------------------------------------------
      Newborn: [
        {
          origin: "shelter",
          scene: "shelter",
          text: "You are born in the spare room of a cat rescue group in Setagaya. Thirty volunteers have a group chat about you. Your first photo already has 300 likes.",
          choices: [
            {
              label: "Look at the camera",
              chance: 0.6,
              bonus: { curious: 0.2, shy: -0.1 },
              good: "Your second photo gets 2,000. Someone in Osaka makes it her phone background. You are two weeks old and already a brand.",
              bad: "You sneeze exactly when she takes it. The photo goes in the group chat anyway, with the caption “bless you”.",
              goodFx: { happy: 10 },
            },
            {
              label: "Hide in the sock drawer",
              chance: 0.75,
              bonus: { shy: 0.2 },
              good: "The sock drawer is warm and smells of fabric softener. They leave it open for you. It becomes a rule.",
              bad: "The drawer closes. Nobody finds you for an hour. Thirty people in the group chat panic.",
              goodFx: { health: 6 },
              badFx: { happy: -8 },
            },
          ],
        },
        {
          origin: "shelter",
          scene: "shelter",
          text: "Every morning, the volunteer weighs you on a kitchen scale next to the rice cooker. 410 grams. She writes it in a notebook, like the stock market.",
          choices: [
            {
              label: "Eat everything in your bowl",
              chance: 0.65,
              bonus: { brave: 0.1 },
              good: "450 grams. She draws a little star in the notebook. You are now the best investment in Setagaya.",
              bad: "You eat too fast and throw up on the notebook. The numbers are hard to read this week.",
              goodFx: { food: 2, health: 6 },
              badFx: { health: -5 },
            },
            {
              label: "Let your brother eat first",
              chance: 0.5,
              bonus: { shy: 0.1, clever: 0.1 },
              good: "He leaves you the best part, the gravy. The volunteer writes “kind” next to your name. You were just slow.",
              bad: "He eats yours too. 400 grams. The volunteer frowns and gives you extra, with a syringe. It tastes of chicken and betrayal.",
              goodFx: { food: 1, happy: 6 },
              badFx: { food: -1, health: -4 },
            },
          ],
        },
        {
          origin: "home",
          scene: "flat",
          text: "You are born in a closet in a small apartment in Koenji, on a pile of winter sweaters. The woman who lives here works in a bookshop. She has already bought two books about you.",
          choices: [
            {
              label: "Crawl out to meet her",
              chance: 0.6,
              bonus: { curious: 0.2, brave: 0.1 },
              good: "She lies on the floor so you can climb on her face. She doesn’t move for a long time. Chapter one of the book says not to do this.",
              bad: "You crawl into the hallway and get stuck between two shoes. She finds you, says “ah” very softly, and puts you back.",
              goodFx: { happy: 10 },
              badFx: { happy: -4 },
            },
            {
              label: "Stay in the sweaters",
              chance: 0.75,
              bonus: { shy: 0.2 },
              good: "Wool, warm, and the smell of your mother. She lets the sweaters stay in the closet all summer.",
              bad: "In October, she needs her sweater. You are in it.",
              goodFx: { health: 6, happy: 5 },
              badFx: { happy: -5 },
            },
          ],
        },
        {
          origin: "home",
          scene: "flat",
          text: "The apartment is 25 square metres. To you, it’s a continent. The washing machine is a volcano. The door to the balcony is the end of the world.",
          choices: [
            {
              label: "Explore the volcano",
              chance: 0.5,
              bonus: { curious: 0.2, brave: 0.1 },
              stat: "strength",
              good: "You climb on it during the spin cycle. It shakes. You shake. You win. You will sit on it every Sunday from now on.",
              bad: "It starts beeping, very loudly, for no reason. You hide behind the fridge until night.",
              goodFx: { happy: 8, strength: 5 },
              badFx: { happy: -6 },
            },
            {
              label: "Map the continent from the sofa",
              chance: 0.8,
              bonus: { clever: 0.2, shy: 0.1 },
              good: "From the sofa you can see everything: the door, the fridge, her. You decide that’s enough world for now.",
              bad: "You fall off the sofa. It’s a small sofa. It feels like a cliff.",
              goodFx: { health: 4, happy: 4 },
              badFx: { health: -5 },
            },
          ],
        },
        {
          origin: "street",
          scene: "konbini",
          text: "You are born in a box behind a convenience store. It’s 2 a.m. The night worker is on his break, eating a rice ball, looking at nothing.",
          choices: [
            {
              label: "Crawl toward the light",
              chance: 0.6,
              bonus: { curious: 0.2, shy: -0.2 },
              good: "He sees you. He says nothing. He is very tired. The next night, there’s a saucer of water and a folded towel in the box.",
              bad: "A delivery truck backs into the alley, beeping. Your siblings scatter. You never find all of them again.",
              goodFx: { health: 6, food: 1, happy: 8 },
              badFx: { happy: -15, health: -8 },
              goodMark: "konbini",
            },
            {
              label: "Stay hidden with your siblings",
              chance: 0.5,
              good: "Your mother moves you one by one, by the neck, to a garden behind a temple. You complain the whole way.",
              bad: "The box goes out with the morning trash. Your mother saves you. Not everyone.",
              goodFx: { health: 5 },
              badFx: { health: -35, happy: -15 },
            },
          ],
        },
        {
          origin: "street",
          scene: "park",
          text: "Dawn in the park. The crows wake up first. One lands very close, tilts its head, and looks at you like a snack with legs.",
          choices: [
            {
              label: "Hiss as loud as you can",
              gesture: "hold",
              chance: 0.4,
              bonus: { brave: 0.3 },
              stat: "strength",
              good: "The crow hops back. Then a second one comes. Then a third. But they leave. You beat three crows. Nobody will believe you.",
              bad: "A beak, a scream, your mother’s claws. You live. Tokyo crows remember faces. They follow you around now, making comments.",
              goodFx: { happy: 10, strength: 5 },
              badFx: { health: -45, happy: -10 },
            },
            {
              label: "Crawl under the azaleas",
              gesture: "hold",
              chance: 0.7,
              bonus: { shy: 0.2, clever: 0.1 },
              good: "Too many branches for a crow. You watch them leave one by one, grumbling.",
              bad: "You stay under there so long that your mother comes looking, furious and relieved.",
            },
          ],
        },
        {
          origin: "street",
          scene: "street",
          text: "Rainy season. Your box is turning into soup. A vending machine hums nearby, warm and bright, selling hot coffee to nobody.",
          choices: [
            {
              label: "Sleep behind the vending machine",
              chance: 0.7,
              bonus: { clever: 0.1 },
              good: "Warm all night. The light keeps the rats away. You will love vending machines for the rest of your life.",
              bad: "At midnight, a man kicks the machine because it ate his coin. You don’t sleep much after that.",
              goodFx: { health: 8 },
            },
            {
              label: "Follow your mother to the shrine",
              chance: 0.6,
              good: "Under the shrine floor, it’s dry and smells of old wood. Two stone foxes guard the door. Useless, but it’s the thought.",
              bad: "You lose her in the rain, between two umbrellas. You find her at dawn. You’re shaking. So is she.",
              goodFx: { health: 6, happy: 6 },
              badFx: { health: -15, happy: -10 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      Kitten: [
        {
          origin: "shelter",
          scene: "shelter",
          text: "Adoption event, Saturday, in a pet shop car park. You are in a carrier with a card on it. The card says you are “calm”. Nobody asked you.",
          choices: [
            {
              label: "Be calm, like the card says",
              gesture: "hold",
              chance: 0.4,
              bonus: { shy: 0.15, clever: 0.1 },
              good: "A woman in a raincoat reads your card three times. Two weeks of forms later, she takes you home, to a small apartment over the train tracks.",
              bad: "Nobody picks you today. The rescue is full. They clip your ear in the shape of a sakura petal and let you go in a park, with a feeder who comes every evening at 7.",
              goodFx: { happy: 15, health: 6, food: 2 },
              badFx: { happy: -10 },
              goodMark: "home",
              badMark: "eartip",
            },
            {
              label: "Meow at everyone",
              chance: 0.4,
              bonus: { brave: 0.2, curious: 0.1, shy: -0.2 },
              good: "A woman in a raincoat stops. “The card is lying,” she says. She takes you anyway. Your new home is a small apartment over the train tracks.",
              bad: "People smile and walk past. They want “calm”. The rescue clips your ear in the shape of a sakura petal and lets you go in a park, with a feeder who comes every evening at 7.",
              goodFx: { happy: 15, health: 6, food: 2 },
              badFx: { happy: -10 },
              goodMark: "home",
              badMark: "eartip",
            },
          ],
        },
        {
          origin: "home",
          scene: "flat",
          text: "The balcony door is open. Below: a train line, a hundred roofs, and a crow on the railing, looking at you like it has a question.",
          choices: [
            {
              label: "Jump onto the railing",
              gesture: "pounce",
              chance: 0.45,
              bonus: { brave: 0.2, curious: 0.1 },
              stat: "strength",
              good: "You sit up there like a king for one whole minute. The woman screams in a whisper, so the neighbours don’t hear. The next day, she buys a net.",
              bad: "The railing is thinner than it looked. You land on the futon drying on the balcony below. The neighbour brings you back with a bow, and the futon.",
              goodFx: { happy: 10, strength: 6 },
              badFx: { health: -15, happy: -6 },
            },
            {
              label: "Stay inside and watch the trains",
              chance: 0.8,
              bonus: { shy: 0.2, clever: 0.1 },
              good: "A train every three minutes. You count them. You lose count. You start again. It’s the best TV in Tokyo.",
              bad: "The crow comes closer and talks to you for an hour. You understand nothing. You feel insulted anyway.",
              goodFx: { happy: 6 },
              badFx: { happy: -4 },
            },
          ],
        },
        {
          scene: "park",
          text: "An old man on a bench feeds the pigeons every morning at 7. Exactly 7. He has noticed you watching.",
          choices: [
            {
              label: "Walk up to him",
              chance: 0.6,
              bonus: { curious: 0.2, shy: -0.2 },
              good: "He breaks off a piece of rice ball for you, very seriously, like an important business meeting.",
              bad: "The pigeons explode into the air. The old man lets out the longest sigh in Tokyo.",
              goodFx: { food: 2, happy: 8 },
            },
            {
              label: "Catch a pigeon",
              gesture: "pounce",
              chance: 0.2,
              bonus: { brave: 0.1, clever: 0.1 },
              stat: "strength",
              good: "Unbelievable. You did it. The old man laughs so hard he holds on to his hat.",
              bad: "You don’t catch a pigeon. Nobody catches pigeons. You knew that.",
              goodFx: { food: 2, strength: 8, happy: 12 },
              badFx: { food: -1 },
            },
          ],
        },
        {
          fact: "falls",
          scene: "flat",
          text: "Fourth-floor balcony. A moth is dancing just past the railing. You have never wanted anything so much.",
          choices: [
            {
              label: "Jump for it",
              gesture: "pounce",
              chance: 0.35,
              bonus: { brave: 0.1 },
              stat: "strength",
              good: "You catch the moth. Then you remember gravity. You turn in the air, all on your own, and land on your feet in a bush. Moth still in your mouth.",
              bad: "No moth. Four floors. You twist and land on your feet, but the pavement is very hard. A salaryman drops his umbrella.",
              goodFx: { happy: 12, strength: 5 },
              badFx: { health: -40, happy: -8 },
              badMark: "limp",
            },
            {
              label: "Watch it with your jaw clicking",
              chance: 0.8,
              bonus: { clever: 0.1, shy: 0.1 },
              good: "Your jaw makes a little noise on its own. Ek-ek-ek. The moth flies inside. Now it’s yours.",
              bad: "The moth flies away. You click at it for ten more minutes anyway.",
              goodFx: { strength: 4 },
            },
          ],
        },
        {
          fact: "lapping",
          scene: "temple",
          text: "At the temple, people wash their hands at a stone basin with bamboo ladles. The water is cold and perfect.",
          choices: [
            {
              label: "Drink from the basin",
              chance: 0.6,
              bonus: { curious: 0.1 },
              good: "The tip of your tongue, flick, flick, flick. Four times a second. A grandmother bows to you. You don’t bow back.",
              bad: "A priest gently lifts you off the basin. You hear the word “sumimasen” a lot.",
              goodFx: { health: 6 },
            },
            {
              label: "Drink from a ladle someone left",
              chance: 0.5,
              bonus: { clever: 0.2 },
              good: "Perfect height, perfect water. A tourist films it. You are a small part of the internet now.",
              bad: "The ladle tips. Cold water on your head. You leave the temple, offended by Shinto.",
              goodFx: { health: 4, happy: 8 },
              badFx: { happy: -8 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      Young: [
        {
          scene: "park",
          text: "Every evening, a woman with a parasol leaves food in a small park. Lots of cats come. There is a hierarchy. You are at the bottom.",
          choices: [
            {
              label: "Push to the front",
              gesture: "run",
              chance: 0.4,
              bonus: { brave: 0.2, shy: -0.2 },
              stat: "strength",
              good: "You eat first. Nobody saw that coming, including you. You grow big and strong that summer.",
              bad: "An old cat slaps your nose, once, very professionally. You eat last, alone.",
              goodFx: { food: 3, strength: 6 },
              badFx: { health: -8, food: -1 },
            },
            {
              label: "Wait your turn under a bench",
              mods: [
                { needs: "limp", chance: 0.2, why: "Limping", good: "She sees you limp. She puts aside the biggest portion under the bench, just for you. Every evening." },
              ],
              chance: 0.7,
              bonus: { shy: 0.1 },
              good: "She notices. She puts a small portion aside under the bench, just for you. You both pretend.",
              bad: "Nothing left by your turn. Good manners are expensive.",
              goodFx: { food: 2, happy: 8 },
              badFx: { food: -2 },
              goodMark: "parklady",
            },
          ],
        },
        {
          fact: "eartip",
          notIf: "eartip",
          scene: "park",
          text: "A volunteer in gloves crouches near you with a carrier. She speaks very softly. Other cats left with her and came back with a cut ear and a new attitude.",
          choices: [
            {
              label: "Let her take you",
              chance: 0.65,
              good: "A few days later, you’re back in your park with a clipped ear and a full belly. Now everyone knows you belong here.",
              bad: "The vet is so terrifying that you hide in a drain pipe for two weeks.",
              goodFx: { health: 20, food: 1 },
              badFx: { food: -2, happy: -10 },
              goodMark: "eartip",
            },
            {
              label: "Escape over the wall",
              gesture: "run",
              chance: 0.7,
              bonus: { brave: 0.1, clever: 0.1 },
              stat: "strength",
              good: "You stay wild. By the end of summer, you know every roof in the neighbourhood.",
              bad: "You land badly on the other side. You limp for a whole season.",
              goodFx: { strength: 6 },
              badFx: { health: -15 },
              badMark: "limp",
            },
          ],
        },
        {
          scene: "station",
          text: "A station at rush hour. Thousands of shoes, all going somewhere fast. Somewhere inside, a noodle stand drops things.",
          choices: [
            {
              label: "Go in with the crowd",
              gesture: "run",
              chance: 0.4,
              bonus: { brave: 0.1, curious: 0.2, shy: -0.2 },
              good: "Between the legs, under the gates. The cook pretends not to see you. A piece of fish falls. By accident. Twice.",
              bad: "Someone steps on your paw. A station officer chases you out with a broom, apologising the whole time.",
              goodFx: { food: 3, happy: 8 },
              badFx: { health: -15 },
            },
            {
              label: "Wait outside until it’s quiet",
              chance: 0.7,
              bonus: { clever: 0.2 },
              good: "At midnight, the cook takes out the trash. He leaves the lid open. Just enough.",
              bad: "Another cat had the same idea. It is bigger, and it was there first.",
              goodFx: { food: 2 },
              badFx: { food: -1 },
            },
          ],
        },
        {
          needs: "konbini",
          scene: "konbini",
          text: "The night worker calls you “Onigiri” now. The automatic door opens every time you pass. “Irasshaimase!” You think it’s talking to you.",
          choices: [
            {
              label: "Walk inside",
              chance: 0.5,
              bonus: { curious: 0.2, brave: 0.1 },
              good: "Customers take pictures. The worker pretends to be angry. Then he puts you on the counter, next to the warm fried chicken.",
              bad: "The manager is in tonight. The worker carries you out like a sack of rice. “Not tonight, Onigiri. Sorry.”",
              goodFx: { food: 2, happy: 10 },
            },
            {
              label: "Sit outside the door",
              chance: 0.8,
              good: "At 2 a.m., he shares his break with you, like every night. You are basically staff now.",
              bad: "A new worker tonight. He doesn’t know you. The door keeps welcoming you anyway.",
              goodFx: { food: 1, happy: 8 },
            },
          ],
        },
        {
          text: "You fall asleep in a delivery truck full of warm boxes. When the doors open, you are in Saitama. Nothing smells like home.",
          choices: [
            {
              label: "Walk home",
              chance: 0.5,
              bonus: { clever: 0.2, curious: 0.1 },
              stat: "strength",
              good: "Five nights. You follow the train tracks, the river, then the smell of your konbini’s fried chicken. You walk in like you went out for a minute.",
              bad: "You get lost for weeks. When you finally find your park, you are half the cat you were.",
              goodFx: { happy: 10, strength: 6 },
              badFx: { food: -3, health: -15 },
            },
            {
              label: "Get back in the truck",
              chance: 0.5,
              bonus: { clever: 0.1 },
              good: "The driver finds you on his next round, between two boxes. He drives you back. He doesn’t tell his boss.",
              bad: "The truck goes to Chiba next. Then Yokohama. You see a lot of Japan. None of it has your bench.",
              goodFx: { happy: 8 },
              badFx: { happy: -10, food: -2 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      Adult: [
        {
          needs: "parklady",
          fact: "names",
          scene: "park",
          text: "The park woman comes alone one evening, with a carrier. “My apartment is very small,” she says, as if you had asked. “But it’s warm.” She says your name. You turn one ear.",
          choices: [
            {
              label: "Walk into the carrier",
              chance: 0.7,
              bonus: { curious: 0.1, shy: -0.1 },
              good: "Very small, very warm. A window over the train tracks. You watch the trains for hours. She watches you watch them.",
              bad: "Halfway there, you panic and escape. She comes to the park the next evening anyway. Without the carrier.",
              goodFx: { happy: 15, health: 10, food: 2 },
              badFx: { happy: -10 },
              goodMark: "home",
            },
            {
              label: "Stay in the park",
              chance: 0.9,
              good: "She understands. She keeps coming every evening. Your portion stays under the bench.",
              bad: "She doesn’t come for a few days. Then she does, a little thinner. She doesn’t explain.",
            },
          ],
        },
        {
          scene: "roofs",
          text: "On the rooftops, a white cat with one blue eye and one yellow eye has noticed you. She looks at you with both. It’s a lot.",
          choices: [
            {
              label: "Join her on her roof",
              chance: 0.6,
              bonus: { brave: 0.1, shy: -0.1 },
              good: "Two months later, three kittens are born behind a water tank. One has her strange eyes and your terrible manners.",
              bad: "She slaps you off the edge. You land on a balcony full of plants. An old lady screams. You scream back.",
              goodFx: { happy: 15 },
              badFx: { health: -12 },
              goodMark: "kittens",
            },
            {
              label: "Watch her from your own roof",
              chance: 0.7,
              good: "Every evening, the same two roofs, the same distance. It becomes a kind of friendship.",
              bad: "One evening, she doesn’t come. Then never again. You keep looking at that roof.",
            },
          ],
        },
        {
          fact: "gotokuji",
          scene: "street",
          text: "A typhoon is coming. The wind pulls at the shop signs. The whole city closes its shutters very calmly, as if this happens every year. It does.",
          choices: [
            {
              label: "Hide under the train tracks",
              chance: 0.6,
              bonus: { clever: 0.2 },
              good: "Concrete above, concrete around. The storm screams all night. It can’t reach you.",
              bad: "The water rises. You climb a pole and stay there until morning, soaked, personally offended by the sky.",
              goodFx: { health: 4 },
              badFx: { health: -20 },
            },
            {
              label: "Wave a man into the temple",
              mods: [
                { coat: "white", chance: 0.15, why: "White, like a maneki-neko", good: "You sit at the gate, white, one paw raised. You look exactly like the statues. A man walks over. A branch crashes where he stood. He bows to you. Deeply." },
              ],
              chance: 0.5,
              bonus: { curious: 0.2, shy: -0.1 },
              good: "You sit at the temple gate, one paw up, washing your face. A man walks over to look. A second later, a branch crashes where he stood. He bows to you. Deeply.",
              bad: "The man ignores you. The branch misses both of you. You spend the night under the temple floor with eleven wet cats.",
              goodFx: { happy: 12, food: 1 },
              badFx: { health: -8 },
            },
          ],
        },
        {
          scene: "alley",
          text: "Midnight, outside a yakitori bar. A man in a suit sits on the curb, explaining to nobody why his boss is wrong. He holds his skewer like a microphone.",
          choices: [
            {
              label: "Sit next to him",
              mods: [
                { coat: "black", chance: 0.25, why: "Black cat: lucky in Japan", good: "He sees a black cat and gasps. “Fuku-neko!” A lucky cat. He gives you all the chicken, then the stick too, for luck." },
              ],
              chance: 0.6,
              bonus: { curious: 0.1, shy: -0.2 },
              good: "He gives you the chicken and keeps the stick. You hear all about Tanaka-san. Tanaka-san sounds terrible.",
              bad: "He gets up, wobbles, almost sits on you, and apologises to a lamp post.",
              goodFx: { food: 2, happy: 8 },
            },
            {
              label: "Wait for him to drop it",
              gesture: "hold",
              chance: 0.5,
              bonus: { clever: 0.2 },
              good: "He falls asleep against the wall. The skewer tilts. Slowly. It falls. Patience is a hunting skill.",
              bad: "He eats every piece. Then drops the stick, right in front of you. Thanks a lot.",
              goodFx: { food: 2 },
            },
          ],
        },
        {
          scene: "alley",
          text: "A man with a camera is lying on his stomach in your alley. He films cats for television. He says “ii ne, ii ne” very softly.",
          choices: [
            {
              label: "Walk right up to the lens",
              mods: [
                { coat: "calico", chance: 0.15, why: "Calico: Japan’s lucky cat", good: "A calico! The cameraman almost cries. Calicos are the classic lucky cat here. You’re on TV the next Sunday. Half of Japan says “kawaii”." },
              ],
              chance: 0.55,
              bonus: { curious: 0.2, brave: 0.1, shy: -0.2 },
              good: "You sniff the camera. You yawn. It’s on TV the next Sunday. Half of Japan says “kawaii” at the same time.",
              bad: "You headbutt the lens. It falls in a puddle. He keeps saying “ii ne”, but quieter.",
              goodFx: { happy: 12 },
              goodMark: "famous",
            },
            {
              label: "Ignore him completely",
              chance: 0.7,
              bonus: { shy: 0.1, clever: 0.1 },
              good: "You wash your back leg for ten minutes. He films all of it. Somehow, it’s the best part of the show.",
              bad: "He gets bored and films the cat next door. That cat is a fraud.",
            },
          ],
        },
      ],
      // --------------------------------------------------------
      "Hard times": [
        {
          notIf: "home",
          scene: "park",
          text: "New signs in the park: “Please do not feed the cats.” The neighbours complained. The food stops. The signs are very polite about it.",
          choices: [
            {
              label: "Look for a new neighbourhood",
              chance: 0.5,
              bonus: { brave: 0.1, curious: 0.1 },
              good: "Three stations away, you find a fish market and an old lady who does not read signs.",
              bad: "Every neighbourhood already has its cats. You are a stranger everywhere for a while.",
              goodFx: { food: 3 },
              badFx: { food: -2, health: -10 },
            },
            {
              label: "Stay and wait",
              chance: 0.5,
              bonus: { shy: 0.1, clever: 0.1 },
              good: "After two weeks, the food comes back. At night now, in secret. The sign stays up. Everyone pretends.",
              bad: "You lose weight. A lot. Your fur stops shining.",
              goodFx: { food: 2 },
              badFx: { food: -3, health: -15 },
            },
          ],
        },
        {
          text: "Snow on Tokyo, the first in years. The streets go silent. Everything you know is white, cold, and wrong.",
          choices: [
            {
              label: "Find a car that just parked",
              chance: 0.6,
              bonus: { clever: 0.2 },
              good: "A warm engine, every night at 4 a.m. A nurse coming home from her shift. She checks under the car before she starts it. Every time.",
              bad: "Every engine in the street is cold. You walk all night just to stay warm.",
              goodFx: { health: 6 },
              badFx: { health: -20 },
            },
            {
              label: "Curl up in a doorway",
              chance: 0.5,
              good: "In the morning, someone has left a cardboard box and an old scarf. Nobody stays to be thanked.",
              bad: "Someone opens the door and you fall backwards into a dentist’s waiting room. Chaos. One child is very happy.",
              goodFx: { health: 6, happy: 6 },
              badFx: { health: -10 },
            },
          ],
        },
        {
          scene: "konbini",
          text: "The ground shakes. Not a lot. Enough. The shelves of the konbini rattle. Every phone in the street beeps at once.",
          choices: [
            {
              label: "Run under the nearest car",
              gesture: "hold",
              chance: 0.6,
              bonus: { shy: 0.1, clever: 0.1 },
              good: "It stops after twenty seconds. People check their phones and keep walking. You stay under the car until evening, just in case.",
              bad: "The car alarm goes off right above your head. You run three streets without touching the ground.",
              badFx: { happy: -8 },
            },
            {
              label: "Climb onto a wall",
              chance: 0.4,
              bonus: { brave: 0.1 },
              stat: "strength",
              good: "From the wall, you watch the whole street sway, very calm. You look like you organised it.",
              bad: "A flower pot falls from a balcony. It doesn’t miss.",
              goodFx: { happy: 8 },
              badFx: { health: -30 },
            },
          ],
        },
        {
          needs: "home",
          fact: "voices",
          scene: "flat",
          text: "The woman doesn’t come home one evening. Or the next. The neighbour has a key. She stands in the doorway, not sure what to do with a cat.",
          choices: [
            {
              label: "Meow at the neighbour",
              chance: 0.6,
              bonus: { shy: -0.2, brave: 0.1 },
              good: "She feeds you and tells you about her grandchildren. Two weeks later, a voice on the stairs. You know it before the key turns. You sleep on her chest all night.",
              bad: "The neighbour takes you to a shelter “just for a while”. The woman finds you there a month later. You both pretend it was nothing.",
              goodFx: { happy: 12, food: 1 },
              badFx: { happy: -15 },
            },
            {
              label: "Wait by the door",
              chance: 0.5,
              good: "Twelve days. On the thirteenth, her voice in the stairwell. You were already at the door.",
              bad: "She comes back, but weaker. Her son talks about “a place with care”. They don’t take cats there.",
              goodFx: { happy: 12 },
              badFx: { happy: -25 },
              badMark: "left",
            },
          ],
        },
        {
          needs: "kittens",
          scene: "roofs",
          text: "Your kittens are grown. The smallest refuses to leave the water tank. It has decided this is its home forever, preferably on top of you.",
          choices: [
            {
              label: "Push it out into the world",
              chance: 0.6,
              bonus: { brave: 0.1 },
              good: "It complains, hesitates, then runs off across the roofs and doesn’t look back. Good. That’s what you wanted. Mostly.",
              bad: "It leaves, and you never see it again. You check the water tank for weeks.",
              badFx: { happy: -12 },
            },
            {
              label: "Let it stay",
              chance: 0.6,
              good: "It stays. It grows. It still sleeps on you every night, even now that it’s bigger than you.",
              bad: "The bigger cats don’t like you two taking the best tank. There are fights. You don’t win all of them.",
              goodFx: { happy: 12 },
              badFx: { health: -15 },
            },
          ],
        },
      ],
      // --------------------------------------------------------
      "Old age": [
        {
          needs: "konbini",
          scene: "konbini",
          text: "The night worker from that first night is the manager now. His hair is grey. He still takes his break at 2 a.m., with a rice ball.",
          choices: [
            {
              label: "Sit next to him",
              chance: 0.7,
              good: "He doesn’t look surprised. He breaks his onigiri in two. You sit together until his break ends, like old colleagues.",
              bad: "He doesn’t recognise you. Why would he? Every cat looks the same at 2 a.m.",
              goodFx: { happy: 15, food: 1 },
              badMark: "forgotten",
            },
            {
              label: "Watch him through the window",
              chance: 0.6,
              good: "He looks up. He smiles. That night, there is a folded towel by the door. Like the very first one.",
              bad: "He doesn’t look up from the register. They are all busy nights now.",
              goodFx: { happy: 12 },
              badMark: "forgotten",
            },
          ],
        },
        {
          notIf: "home",
          scene: "temple",
          text: "The monk at the temple leaves the side door open on cold nights now. He says it’s for the air. It’s not for the air.",
          choices: [
            {
              label: "Sleep on the warm wooden steps",
              chance: 0.7,
              good: "Nobody chases you anymore. The bell wakes you every morning, gently. You go back to sleep.",
              bad: "The garden is being renovated. Drills everywhere. You look for a new place to sleep, slowly.",
              goodFx: { health: 8, happy: 8 },
            },
            {
              label: "Go back to the park where you grew up",
              chance: 0.5,
              good: "New benches. Same trees. A young cat waits under your old bench. You share it.",
              bad: "The park is a car park now. The vending machine is still there, though.",
              goodFx: { happy: 10 },
            },
          ],
        },
        {
          fact: "blink",
          scene: "street",
          text: "Schoolchildren in yellow hats walk past every morning. One of them always stops to say “ohayō” to you, with a little bow.",
          choices: [
            {
              label: "Answer with a slow blink",
              chance: 0.8,
              good: "He blinks back, very slowly, very seriously. Your secret. Every morning, until he’s too tall for the yellow hat.",
              bad: "The teacher calls him and he runs off. Tomorrow, maybe.",
              goodFx: { happy: 15 },
            },
            {
              label: "Rub against his legs",
              chance: 0.6,
              bonus: { shy: -0.2 },
              good: "He laughs so loud the whole class comes running. You are famous for an entire morning.",
              bad: "He is allergic. He sneezes all the way to school, very happy.",
              goodFx: { happy: 12 },
            },
          ],
        },
        {
          needs: "home",
          notIf: "left",
          scene: "flat",
          text: "You sleep most of the day by the window over the tracks. The woman reads next to you. Neither of you is in a hurry anymore.",
          choices: [
            {
              label: "Watch the trains",
              chance: 0.9,
              good: "The 6:12. The 6:20. The 6:31, which was late once, in 2019. You still think about it.",
              bad: "Your eyes are tired. The trains are just lights now. That’s fine too.",
              goodFx: { happy: 8, health: 4 },
            },
            {
              label: "Sit on her book",
              chance: 0.8,
              good: "She sighs and closes the book. She pets you instead. That was the plan all along.",
              bad: "She keeps reading, with you on the page. You both act like this is normal.",
              goodFx: { happy: 12 },
            },
          ],
        },
        {
          scene: "sakura",
          text: "Cherry blossom season. Under the trees, families sit on blue tarps, eating and singing. Pink petals land on your back.",
          choices: [
            {
              label: "Visit every tarp",
              chance: 0.6,
              bonus: { curious: 0.2, shy: -0.2 },
              good: "Tamagoyaki on one tarp, salmon on the next. A grandfather toasts you with his beer. Best day of the year.",
              bad: "A small dog in a raincoat chases you off the third tarp. You are too old for this.",
              goodFx: { food: 2, happy: 12 },
              badFx: { health: -10 },
            },
            {
              label: "Sleep under the petals",
              chance: 0.8,
              good: "You wake up pink. Someone has taken two hundred photos of you. You don’t mind.",
              bad: "A park guard sweeps the petals. And you, a little.",
              goodFx: { health: 4, happy: 8 },
            },
          ],
        },
        {
          scene: "flat",
          text: "Winter. Through a ground-floor window, you see it: a kotatsu. A low table with a heater under it, and a thick blanket all around. An old lady has her legs under it.",
          choices: [
            {
              label: "Scratch at the window",
              chance: 0.55,
              bonus: { clever: 0.1, shy: -0.2 },
              good: "She opens. She doesn’t say a word. She lifts the blanket. You disappear under it and become round, like cats in the old song.",
              bad: "She waves you away. “No, no, no.” Then she leaves a cushion outside the door. Which is something.",
              goodFx: { health: 10, happy: 12 },
            },
            {
              label: "Sleep on the warm air vent",
              chance: 0.8,
              good: "The vent breathes warm air every ten minutes. Like a slow, metal mother.",
              bad: "The vent stops at midnight. Of course it does.",
              goodFx: { health: 6 },
              badFx: { health: -10 },
            },
          ],
        },
        {
          needs: "famous",
          scene: "street",
          text: "A woman with a phone stops you in the street. “It’s the cat from the TV!” She shows you to her phone. The phone shows you to Osaka.",
          choices: [
            {
              label: "Pose like a professional",
              chance: 0.7,
              good: "Chin up. Slow blink. She cries a little. You get a whole tin of tuna. Fame has its uses.",
              bad: "You sneeze. It goes viral anyway. Fame is strange.",
              goodFx: { food: 2, happy: 10 },
            },
            {
              label: "Walk away, mysterious",
              chance: 0.8,
              good: "She films you leaving. “So cool.” You are, in fact, very cool.",
              bad: "You walk away into a bin. She keeps filming.",
              goodFx: { happy: 8 },
            },
          ],
        },
      ],
    },
    endings: [
      {
        when: "early",
        title: "Like the cherry blossoms",
        text: "You were small, and Tokyo is very big. You knew one box, one warm vending machine, and the sound of the last train. In Japan, people love the cherry blossoms because they don’t last. You were like that.",
      },
      {
        when: "cut",
        title: "A rice ball on the bench",
        text: "You fall asleep under your bench one quiet night, and you don’t wake up. In a city of fourteen million, nobody writes it down. But a child in a yellow hat leaves a rice ball there, the next morning.",
      },
      {
        when: "ancient",
        fact: "nekomata",
        title: "Nekomata",
        text: "The old people of the street say a cat that lives this long grows a second tail and becomes something else. On your last night, you look at the moon with both your tails. Nobody can prove you didn’t.",
      },
      {
        needs: "home",
        notIf: "left",
        title: "A small, warm apartment",
        text: "You close your eyes by the window, between two trains. She keeps your bowl for a long time. Sometimes, without thinking, she still puts a little food in it.",
      },
      {
        needs: "konbini",
        notIf: "forgotten",
        title: "The night shift cat",
        text: "One night, you don’t come at 2 a.m. The manager waits five more minutes. A week later, a drawing of a cat appears on the store door. It says “Onigiri”. It stays for years.",
      },
      {
        needs: "kittens",
        title: "Eyes of two colours",
        text: "On a quiet autumn night, you don’t wake up. On a roof nearby, a young cat with one blue eye and one yellow eye watches the city, exactly the way you used to.",
      },
      {
        needs: "famous",
        title: "Star of the alley",
        text: "When you die, the TV show plays your episode again. Half of Japan says “ah…” at the same time. In your alley, someone leaves a can of tuna and a small paper crane.",
      },
      {
        mood: "sad",
        title: "The empty bench",
        text: "You were tired for a long time. One cold night, under the bench, you close your eyes. In the morning, the old man at 7 feeds the pigeons. He keeps a piece of rice ball aside. Out of habit.",
      },
      {
        title: "A cat of Tokyo",
        text: "On a quiet autumn night, you close your eyes and don’t open them again. Somewhere, a bell rings for the end of a shift. The city keeps going. A few people slow down at the empty spot.",
      },
    ],
  },
};
