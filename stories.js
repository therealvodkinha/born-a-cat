// ============================================================
// STORIES — this is the file to edit to change the game's text.
// ============================================================
//
// Each city has:
//   line    : the sentence shown under the city name at birth
//   events  : the moments of the cat's life, played in order
//   ending  : the last screen
//
// Each event has:
//   text    : what happens
//   choices : the buttons (2 or 3)
//
// Each choice has:
//   label   : the button text
//   chance  : how likely it goes well (0.5 = one time out of two, 1 = always)
//   good    : what happens if it goes well
//   bad     : what happens if it goes badly
//
// The ending has:
//   title   : the big title
//   text    : the ending story
//   lucky   : last line if most choices went well
//   unlucky : last line if most choices went badly
//
// Rules: keep the quotes " " around each text, and the comma at the end of each line.
// To write a quote inside a text, use ’ (curly apostrophe) or \" .

const STORIES = {
  Rabat: {
    line: "Warm stones, the smell of the sea, and a hundred other cats.",
    events: [
      {
        text: "You are three weeks old. Your mother has not come back since the morning. Above you, a man is closing his bakery for the night.",
        choices: [
          {
            label: "Cry until he looks at you",
            chance: 0.6,
            good: "He sighs, breaks a piece of bread, and soaks it in milk for you. You will remember the smell of this shop forever.",
            bad: "He doesn’t hear you over the traffic. You sleep alone, pressed against the warm wall of the oven.",
          },
          {
            label: "Wait in silence for your mother",
            chance: 0.4,
            good: "She comes back at dawn, a fish head in her mouth. She looks tired. She stays a little longer than usual.",
            bad: "She never comes back. You learn, very early, that waiting is not always enough.",
          },
        ],
      },
      {
        text: "Winter. Rain falls on the city for three days. The other cats have taken every dry corner near the market.",
        choices: [
          {
            label: "Fight the big grey tom for his spot",
            chance: 0.3,
            good: "You are small, but you are furious. He leaves. The other cats look at you differently now.",
            bad: "He tears your ear. You keep a little notch in it for the rest of your life.",
          },
          {
            label: "Slip under a parked car",
            chance: 0.7,
            good: "The engine is still warm. You sleep better than you have in weeks.",
            bad: "At dawn, the car starts. You run, soaked and terrified, and don’t stop until the river.",
          },
        ],
      },
      {
        text: "A little girl crouches in front of you near the Kasbah. She holds out her hand. Her mother is calling her name.",
        choices: [
          {
            label: "Let her pet you",
            chance: 0.5,
            good: "She laughs. Every day after school, she comes back with a little something. You start waiting for her at four o’clock.",
            bad: "Her mother pulls her away. “Don’t touch them, they’re dirty.” The girl looks back at you until the corner.",
          },
          {
            label: "Run away",
            chance: 0.8,
            good: "You stay free and wary. Nobody owns you. Nobody will ever disappoint you.",
            bad: "You run straight into a group of boys with a stick. You escape, but you don’t trust hands anymore.",
          },
        ],
      },
      {
        text: "You are old now. Your legs hurt in the morning. The baker’s son has taken over the shop.",
        choices: [
          {
            label: "Go back to the bakery",
            chance: 0.6,
            good: "He recognises you. “You’re my father’s cat.” He puts a cushion by the oven. It becomes yours.",
            bad: "The shop has changed. New owner, new rules. You are chased away with a broom.",
          },
          {
            label: "Stay by the sea",
            chance: 0.6,
            good: "The fishermen share their scraps. You watch the waves for hours. It is enough.",
            bad: "The wind is cold this year. The fishermen don’t come as often.",
          },
        ],
      },
    ],
    ending: {
      title: "A cat of Rabat",
      text: "One morning in spring, you don’t wake up. You were curled in the sun, in the spot you liked best. Nobody wrote your name anywhere. But some people in this city will remember a cat who was there, for a while.",
      lucky: "You were loved more than most. That is a lot, for a street cat.",
      unlucky: "Life wasn’t gentle. You lived it anyway, all the way to the end.",
    },
  },

  Tokyo: {
    line: "Neon lights, quiet alleys, and people who bow to cats.",
    events: [
      {
        text: "You are born in a cardboard box behind a convenience store. It is 2 a.m. The night worker is on his break.",
        choices: [
          {
            label: "Crawl out of the box toward the light",
            chance: 0.6,
            good: "He sees you. He says nothing, but the next night there is a saucer of water and a towel in the box.",
            bad: "A delivery truck backs into the alley. Your siblings scatter. You never find them all again.",
          },
          {
            label: "Stay hidden with your siblings",
            chance: 0.5,
            good: "Your mother moves you, one by one, to a quiet garden behind a temple. It is safer there.",
            bad: "The box is thrown away in the morning. Your mother saves you, but not everyone.",
          },
        ],
      },
      {
        text: "Summer. The heat rises from the asphalt. A woman leaves food every evening in a small park, but many cats come.",
        choices: [
          {
            label: "Push to the front",
            chance: 0.4,
            good: "You eat first. You grow big and strong that summer.",
            bad: "An old cat hisses and swipes at your nose. You eat what’s left, alone, after everyone.",
          },
          {
            label: "Wait your turn under a bench",
            chance: 0.7,
            good: "The woman notices you waiting. She keeps a small portion aside, just for you.",
            bad: "There is nothing left by the time you come. You go to bed hungry.",
          },
        ],
      },
      {
        text: "A volunteer with a carrier and gloves crouches near you. She speaks softly. Other cats have disappeared with her and come back with a small cut in their ear.",
        choices: [
          {
            label: "Let her take you",
            chance: 0.6,
            good: "A few days later, you are back in your park, with a clipped ear and a full belly. Now people know you belong to this street.",
            bad: "The vet visit frightens you so much that you hide for weeks afterward.",
          },
          {
            label: "Escape over the wall",
            chance: 0.7,
            good: "You stay wild, and you know every roof of the neighbourhood.",
            bad: "You land badly. You limp for a whole season.",
          },
        ],
      },
      {
        text: "You are old. The convenience store worker from that first night is now the manager. He still takes his break at 2 a.m.",
        choices: [
          {
            label: "Sit next to him",
            chance: 0.7,
            good: "He doesn’t look surprised. He shares his onigiri with you. You sit together until his break ends.",
            bad: "He doesn’t recognise you. Why would he? It was so many years ago.",
          },
          {
            label: "Go to the temple garden",
            chance: 0.6,
            good: "The monk lets you sleep on the warm wooden steps. Nobody chases you anymore.",
            bad: "The garden is being renovated. You look for a new place to sleep, slowly.",
          },
        ],
      },
    ],
    ending: {
      title: "A cat of Tokyo",
      text: "On a quiet night in autumn, you close your eyes and don’t open them again. Somewhere, a bell rings for the end of a shift. The city keeps going, as it always does. But a few people will notice the empty spot.",
      lucky: "You found your place in a city of fourteen million. That is not nothing.",
      unlucky: "The city was too big, and you were very small. You held on anyway.",
    },
  },
};
