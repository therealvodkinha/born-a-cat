// ============================================================
// STORIES — this is the file to edit to change the game's text.
// ============================================================
//
// HOW A GAME WORKS
// 1. The cat is born in a random city, with a random trait (see TRAITS).
// 2. A life has 5 stages. For each stage, ONE event is drawn at random.
// 3. Each choice can go well or badly (chance + trait bonus).
// 4. Some outcomes leave a "mark" (something the cat remembers).
//    Marks unlock follow-up events later, and special endings.
//
// EVENT
//   text    : what happens
//   needs   : (optional) only possible if the cat has this mark
//   notIf   : (optional) impossible if the cat has this mark
//   choices : the buttons (2 or 3)
//
// CHOICE
//   label    : the button text
//   chance   : how likely it goes well (0.5 = one time out of two)
//   bonus    : (optional) chance added or removed for a trait, e.g. { brave: 0.2, shy: -0.2 }
//   good     : what happens if it goes well
//   bad      : what happens if it goes badly
//   goodMark : (optional) mark left if it goes well
//   badMark  : (optional) mark left if it goes badly
//
// ENDING
//   title, text
//   needs / notIf : (optional) same as events
//   luck          : (optional) "lucky" (most choices went well) or "unlucky"
//   If several special endings are possible, one is drawn at random.
//   Endings with no condition are only used when no special ending fits.
//
// Rules: keep the quotes " " around each text, and the comma at the end of each line.
// Inside a text, use ’ (curly apostrophe) and “ ” (curly quotes).

const TRAITS = [
  { id: "brave", line: "You are brave. You hiss at things ten times your size." },
  { id: "shy", line: "You are shy. You watch the world from under things." },
  { id: "curious", line: "You are curious. Every open door is an invitation." },
  { id: "clever", line: "You are clever. You learn fast who to trust, and when." },
];

const STORIES = {
  // ==========================================================
  Rabat: {
    line: "Warm stones, the smell of the sea, and a hundred other cats.",
    stages: [
      // --------------------------------------------------------
      {
        name: "Kitten",
        events: [
          {
            text: "You are three weeks old. Your mother has not come back since the morning. Above you, a man is closing his bakery for the night.",
            choices: [
              {
                label: "Cry until he looks at you",
                chance: 0.6,
                bonus: { brave: 0.1, shy: -0.2 },
                good: "He sighs, breaks a piece of bread, and soaks it in milk for you. You will remember the smell of this shop forever.",
                bad: "He doesn’t hear you over the traffic. You sleep alone, pressed against the warm wall of the oven.",
                goodMark: "baker",
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
            text: "A seagull lands on the wall above your nest. It looks at you and your two sisters the way you look at fish.",
            choices: [
              {
                label: "Puff up and hiss",
                chance: 0.4,
                bonus: { brave: 0.3, shy: -0.2 },
                good: "The gull hesitates, then flies off toward the sea. Your sisters sleep pressed against you that night.",
                bad: "It doesn’t care how big you look. When it leaves, you are only two.",
              },
              {
                label: "Hide deep in the crack of the wall",
                chance: 0.7,
                bonus: { shy: 0.2 },
                good: "The gull pecks at the stones, gives up, and leaves. You stay hidden until dark, just in case.",
                bad: "You are safe. One of your sisters was too slow.",
              },
            ],
          },
          {
            text: "A tourist on the Corniche kneels in front of you with a big camera. The sun is setting behind her.",
            choices: [
              {
                label: "Sit and look at the camera",
                chance: 0.6,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "Click. She laughs and leaves you half a sandwich. Somewhere far away, your face will hang on a wall.",
                bad: "Click, click, click. Then she leaves. Pictures don’t fill a stomach.",
              },
              {
                label: "Run under a bench",
                chance: 0.8,
                good: "She waits a moment, then puts a piece of cheese near the bench before leaving.",
                bad: "You trip over the curb and land in a puddle. Even the pigeons look embarrassed for you.",
              },
            ],
          },
          {
            text: "Your mother is teaching you to hunt in a garden near the old city walls. A lizard is sleeping on a hot stone.",
            choices: [
              {
                label: "Jump on it",
                chance: 0.5,
                bonus: { brave: 0.2, clever: 0.1 },
                good: "You catch it. Your mother looks at you for a long time. You think she is proud.",
                bad: "The lizard leaves its tail in your mouth and runs. You keep the tail. It feels like a victory anyway.",
              },
              {
                label: "Watch your mother do it",
                chance: 0.7,
                bonus: { clever: 0.2 },
                good: "You watch how she waits, how she moves only when the lizard blinks. You will never forget it.",
                bad: "She misses too. You both go home hungry, and a little ashamed.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Young",
        events: [
          {
            text: "Winter. Rain falls on the city for three days. The other cats have taken every dry corner near the market.",
            choices: [
              {
                label: "Fight the big grey tom for his spot",
                chance: 0.3,
                bonus: { brave: 0.2, shy: -0.2 },
                good: "You are small, but you are furious. He leaves. The other cats look at you differently now.",
                bad: "He tears your ear. You keep a little notch in it for the rest of your life.",
                goodMark: "gang",
                badMark: "scar",
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
                chance: 0.6,
                bonus: { shy: -0.2, curious: 0.1 },
                good: "She laughs. Every day after school, she comes back with a little something. You start waiting for her at four o’clock.",
                bad: "Her mother pulls her away. “Don’t touch them, they’re dirty.” The girl looks back at you until the corner.",
                goodMark: "girl",
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
            needs: "baker",
            text: "The baker leaves the back door open at night now. Inside, something is moving in the flour bags.",
            choices: [
              {
                label: "Hunt the mouse",
                chance: 0.6,
                bonus: { brave: 0.1, clever: 0.1 },
                good: "In the morning, the baker finds the mouse at his feet. He laughs and calls you “Khobza”. You have a name now.",
                bad: "You knock over a whole bag of flour. The baker finds you white from head to tail. He doesn’t laugh.",
                badMark: "flour",
              },
              {
                label: "Sleep by the warm oven",
                chance: 0.8,
                good: "You sleep like a king. In the morning, there is a little bowl of milk next to you.",
                bad: "The baker’s wife finds you. She chases you out with a broom and closes the door.",
                badMark: "flour",
              },
            ],
          },
          {
            text: "The tram rings its bell. On the other side of the tracks, a man is throwing away fish from his stall.",
            choices: [
              {
                label: "Cross now",
                chance: 0.5,
                bonus: { brave: 0.1, clever: 0.1 },
                good: "You run between the wheels and the rails, and you arrive first. The best fish is yours.",
                bad: "The tram brushes your back leg. You make it, but you limp for weeks.",
                badMark: "limp",
              },
              {
                label: "Wait for the tram to pass",
                chance: 0.7,
                bonus: { clever: 0.2 },
                good: "Patience. The other cats fought for the first fish. Nobody noticed the one under the stall.",
                bad: "By the time you cross, there is nothing left but the smell.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Adult",
        events: [
          {
            text: "Spring. On the rooftops, a tabby with green eyes has been watching you for three evenings.",
            choices: [
              {
                label: "Follow her",
                chance: 0.6,
                bonus: { brave: 0.1, shy: -0.1 },
                good: "Two months later, four kittens are born in a broken washing machine on a roof. One of them has your face.",
                bad: "She leads you to her territory. Her brother is waiting there. You come back with a bleeding nose.",
                goodMark: "kittens",
              },
              {
                label: "Stay on your own roof",
                chance: 0.7,
                good: "You watch her from afar. Some loves are better that way.",
                bad: "Another cat follows her. You hear them all night, and you hate the moon.",
              },
            ],
          },
          {
            needs: "girl",
            text: "The girl comes back with a cardboard box with holes in it. “My father finally said yes.” She opens the box.",
            choices: [
              {
                label: "Climb into the box",
                chance: 0.7,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "The box smells like her. You fall asleep before you even arrive. When you wake up, you live in an apartment in Agdal.",
                bad: "In the taxi, panic takes you. You scratch, you jump out at a red light, and you run. She cries your name through the window.",
                goodMark: "home",
              },
              {
                label: "Look at her, and walk away",
                chance: 0.9,
                good: "You don’t know why. Maybe the street is your home. She still comes to see you, a little less often.",
                bad: "She doesn’t come back after that. You wait at four o’clock for a few more weeks.",
              },
            ],
          },
          {
            needs: "gang",
            text: "The old grey tom you fought is getting slow. The younger cats look at you. The market could be yours.",
            choices: [
              {
                label: "Take his place",
                chance: 0.5,
                bonus: { brave: 0.2 },
                good: "One fight, short and fair. From now on, the fishmongers keep the heads for you.",
                bad: "He is old, but not that old. You lose, in front of everyone.",
                goodMark: "boss",
              },
              {
                label: "Let him finish his reign",
                chance: 0.8,
                good: "He dies that winter, in his spot. The others make room for you without a fight.",
                bad: "A cat from another market takes the place. Nobody asked your opinion.",
              },
            ],
          },
          {
            text: "A van from an animal association parks in the street. A volunteer puts food in metal cages with open doors.",
            choices: [
              {
                label: "Go in for the food",
                chance: 0.6,
                bonus: { curious: 0.1 },
                good: "Three days later, you are back, vaccinated, with a small cut in your ear. The volunteer waves at you each time she passes.",
                bad: "The vet frightens you so much that you stop eating for a week.",
              },
              {
                label: "Watch from the roof",
                chance: 0.7,
                bonus: { clever: 0.2, shy: 0.1 },
                good: "You see the cats come back a few days later, healthy. Next time, maybe.",
                bad: "You stay up there so long that the other cats eat everything.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Hard times",
        events: [
          {
            text: "August. The heat is crushing the city. Every bowl of water in the street is dry.",
            choices: [
              {
                label: "Go to the mosque courtyard fountain",
                chance: 0.6,
                good: "An old man sees you drinking. He fills a small bowl and leaves it in the shade. He does it every day until September.",
                bad: "The fountain is surrounded by children. You wait until night, dizzy.",
              },
              {
                label: "Follow the gardener with the hose",
                chance: 0.5,
                bonus: { curious: 0.2, clever: 0.1 },
                good: "He sprays you “by accident”. You hate it. You also feel alive again.",
                bad: "He chases you away from his flowers. You find a puddle under an air conditioner. It tastes like metal.",
              },
            ],
          },
          {
            text: "Night, on the beach. Three stray dogs have smelled you. They spread out slowly.",
            choices: [
              {
                label: "Run for the rocks",
                chance: 0.5,
                bonus: { clever: 0.2 },
                good: "You squeeze between two rocks where no dog can follow. You wait until the sun comes up.",
                bad: "You make it, but one of them caught your tail. It never stands straight again.",
                badMark: "scar",
              },
              {
                label: "Stand your ground and hiss",
                chance: 0.3,
                bonus: { brave: 0.3 },
                good: "The biggest dog hesitates. Then they all leave, as if it was their idea.",
                bad: "You fight. You live. That’s all you can say about that night.",
                badMark: "scar",
              },
            ],
          },
          {
            needs: "home",
            text: "Boxes everywhere in the apartment. The family is moving to Marseille. At night, you hear them argue in the kitchen about you.",
            choices: [
              {
                label: "Sleep in a moving box",
                chance: 0.6,
                bonus: { clever: 0.1, curious: 0.1 },
                good: "The girl finds you there in the morning and laughs through her tears. “Okay. You come with us.”",
                bad: "They give you to a neighbour. She is kind. But it’s not the same.",
                badMark: "left",
              },
              {
                label: "Stay by the girl all night",
                chance: 0.5,
                good: "Her father watches you two for a long time. In the morning, he buys a carrier.",
                bad: "On the last day, they open the door of the building and leave you in the street, with a bag of food. The girl doesn’t look back. She can’t.",
                badMark: "left",
              },
            ],
          },
          {
            needs: "kittens",
            text: "One of your kittens has stopped eating. It sleeps all the time. The others are hungry.",
            choices: [
              {
                label: "Stay curled around the sick one",
                chance: 0.5,
                good: "For two days you don’t move. On the third, it opens its eyes and asks for milk.",
                bad: "You keep it warm until the end. The others had to find food alone. They are a little more distant now.",
              },
              {
                label: "Go hunt for all of them",
                chance: 0.5,
                bonus: { clever: 0.1, brave: 0.1 },
                good: "You bring back a whole fish. Even the sick one eats a little. It gets better.",
                bad: "When you come back, the sick one is gone. The others eat. Life is like that, here.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Old age",
        events: [
          {
            needs: "baker",
            notIf: "home",
            text: "You are old now. Your legs hurt in the morning. The baker’s son has taken over the shop.",
            choices: [
              {
                label: "Go back to the bakery",
                chance: 0.6,
                good: "He recognises you. “You’re my father’s cat.” He puts a cushion by the oven. It becomes yours.",
                bad: "The shop has changed. New owner, new rules. You are chased away with a broom.",
                badMark: "flour",
              },
              {
                label: "Watch the shop from across the street",
                chance: 0.8,
                good: "Every morning, the son leaves a piece of bread on the step, without looking. He knows.",
                bad: "Nobody notices you. That’s fine too.",
                badMark: "flour",
              },
            ],
          },
          {
            notIf: "home",
            text: "You are old. The sea wind is colder this year. The fishermen have started to know your face.",
            choices: [
              {
                label: "Stay by the boats",
                chance: 0.6,
                good: "The fishermen share their scraps. You watch the waves for hours. It is enough.",
                bad: "The wind is cold this year. The fishermen don’t come as often.",
              },
              {
                label: "Find a sunny wall in the old city",
                chance: 0.7,
                good: "A wall that keeps the heat until midnight. You stop moving much. You don’t need to.",
                bad: "A young cat already sleeps there. You leave without a word. You are too old for this.",
              },
            ],
          },
          {
            text: "A young cat, all bones and big ears, keeps following you. It steals from your food. It sleeps close to you.",
            choices: [
              {
                label: "Chase it away",
                chance: 0.6,
                bonus: { brave: 0.1 },
                good: "It comes back anyway. You let it. You are tired of fighting.",
                bad: "It leaves for good. Your spot feels very big after that.",
              },
              {
                label: "Teach it your spots",
                chance: 0.8,
                good: "The fountain, the bakery door, the fisherman who gives heads. One day, it will teach someone else.",
                bad: "It doesn’t listen. Young cats never do. You did the same.",
              },
            ],
          },
          {
            needs: "girl",
            text: "A young woman stops on the street and looks at you for a long time. “Is it you?” She kneels, the way a little girl did, years ago.",
            choices: [
              {
                label: "Go to her",
                chance: 0.8,
                good: "She cries, and laughs, and you purr loud enough for the whole street. She comes every day after that.",
                bad: "You don’t recognise her. She smiles anyway, and leaves you a little something. Like before.",
              },
              {
                label: "Stay where you are",
                chance: 0.5,
                good: "She sits on the step next to you for an hour. Neither of you needs to move.",
                bad: "She waits, then leaves. Maybe she was wrong. Maybe not.",
              },
            ],
          },
          {
            needs: "home",
            notIf: "left",
            text: "You are old. You live on a windowsill now, in the sun. The girl is grown. She speaks to you in the morning before work.",
            choices: [
              {
                label: "Wait for her at the door",
                chance: 0.8,
                good: "Every evening, the key in the lock. Every evening, your tail up. You never get tired of it.",
                bad: "Some evenings she comes home late. You wait anyway.",
              },
              {
                label: "Sleep in the sun",
                chance: 0.9,
                good: "The sun moves across the floor. You move with it. It’s a full-time job.",
                bad: "The neighbours’ building blocks the sun now. You find a new spot, slower than before.",
              },
            ],
          },
        ],
      },
    ],
    endings: [
      {
        needs: "home",
        notIf: "left",
        title: "A cat with a home",
        text: "You die in your sleep, on a cushion that smells of her. She buries you under a lemon tree. Every spring, she sits there for a while.",
      },
      {
        needs: "baker",
        notIf: "flour",
        title: "Khobza",
        text: "One morning, you don’t come to the bakery door. The baker’s son puts a small piece of bread on the step anyway, every morning, for a long time.",
      },
      {
        needs: "boss",
        title: "The old king of the market",
        text: "You die in your spot, the best one, where the sun hits first. The fishmongers keep a head aside that day, out of habit. Nobody takes it.",
      },
      {
        needs: "kittens",
        title: "A long line of cats",
        text: "You don’t wake up one spring morning. On the rooftops, a tabby with your face is teaching her own kittens how to wait for lizards.",
      },
      {
        luck: "unlucky",
        title: "Gone without a trace",
        text: "One day, you are just not there anymore. Nobody knows where you went. Rabat has a hundred other cats. But someone, somewhere, noticed the empty wall.",
      },
      {
        title: "A cat of Rabat",
        text: "One morning in spring, you don’t wake up. You were curled in the sun, in the spot you liked best. Nobody wrote your name anywhere. But some people in this city will remember a cat who was there, for a while.",
      },
    ],
  },

  // ==========================================================
  Tokyo: {
    line: "Neon lights, quiet alleys, and people who bow to cats.",
    stages: [
      // --------------------------------------------------------
      {
        name: "Kitten",
        events: [
          {
            text: "You are born in a cardboard box behind a convenience store. It is 2 a.m. The night worker is on his break.",
            choices: [
              {
                label: "Crawl out of the box toward the light",
                chance: 0.6,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "He sees you. He says nothing, but the next night there is a saucer of water and a towel in the box.",
                bad: "A delivery truck backs into the alley. Your siblings scatter. You never find them all again.",
                goodMark: "konbini",
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
            text: "Dawn in the park. The crows are awake before everyone. One of them lands very close and tilts its head.",
            choices: [
              {
                label: "Hiss as loud as you can",
                chance: 0.4,
                bonus: { brave: 0.3 },
                good: "The crow jumps back. Then another one comes. And another. But they leave. You won.",
                bad: "Crows remember faces. From now on, they follow you, laughing.",
              },
              {
                label: "Crawl under the azalea bushes",
                chance: 0.7,
                bonus: { shy: 0.2, clever: 0.1 },
                good: "Too many branches for a crow. You watch them leave, one by one.",
                bad: "You are safe, but you stay there so long that your mother comes looking for you, worried.",
              },
            ],
          },
          {
            text: "Rainy season. Your box is melting. A few metres away, a vending machine hums, warm and bright.",
            choices: [
              {
                label: "Sleep behind the vending machine",
                chance: 0.7,
                bonus: { clever: 0.1 },
                good: "Warm all night, and the light keeps the rats away. You will love vending machines all your life.",
                bad: "A man kicks the machine because it ate his coin. You don’t sleep much after that.",
              },
              {
                label: "Follow your mother to the shrine",
                chance: 0.6,
                good: "Under the wooden floor of the shrine, it is dry and smells of incense. The fox statues watch over you.",
                bad: "You get lost on the way, in the rain. You find her again at dawn, shaking.",
              },
            ],
          },
          {
            text: "An old man on a bench feeds the pigeons every morning. He has noticed you watching.",
            choices: [
              {
                label: "Walk up to him",
                chance: 0.6,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "He breaks a piece of his rice ball for you, very seriously, as if it was an important meeting.",
                bad: "The pigeons explode into the air. The old man sighs. You ruined his morning.",
              },
              {
                label: "Catch a pigeon",
                chance: 0.2,
                bonus: { brave: 0.1, clever: 0.1 },
                good: "Unbelievable. You did it. The old man laughs so hard he has to sit down.",
                bad: "You don’t catch a pigeon. Nobody catches pigeons. You knew that.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Young",
        events: [
          {
            text: "Summer. The heat rises from the asphalt. A woman leaves food every evening in a small park, but many cats come.",
            choices: [
              {
                label: "Push to the front",
                chance: 0.4,
                bonus: { brave: 0.2, shy: -0.2 },
                good: "You eat first. You grow big and strong that summer.",
                bad: "An old cat hisses and swipes at your nose. You eat what’s left, alone, after everyone.",
              },
              {
                label: "Wait your turn under a bench",
                chance: 0.7,
                bonus: { shy: 0.1 },
                good: "The woman notices you waiting. She keeps a small portion aside, just for you.",
                bad: "There is nothing left by the time you come. You go to bed hungry.",
                goodMark: "parklady",
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
                bonus: { brave: 0.1, clever: 0.1 },
                good: "You stay wild, and you know every roof of the neighbourhood.",
                bad: "You land badly. You limp for a whole season.",
              },
            ],
          },
          {
            text: "A train station at rush hour. Thousands of feet. Somewhere inside, there is a noodle stand that drops things.",
            choices: [
              {
                label: "Go in with the crowd",
                chance: 0.4,
                bonus: { brave: 0.1, curious: 0.2, shy: -0.2 },
                good: "Between the legs, through the gates, to the noodle stand. The cook pretends not to see you. A piece of fish falls. By accident.",
                bad: "Someone steps on your paw. A station officer chases you out with a broom and a very polite voice.",
              },
              {
                label: "Wait outside until it’s quiet",
                chance: 0.7,
                bonus: { clever: 0.2 },
                good: "At midnight, the cook takes out the trash. He leaves the lid open, just a little.",
                bad: "Another cat had the same idea. It is bigger than you.",
              },
            ],
          },
          {
            needs: "konbini",
            text: "The night worker from the convenience store has a name for you now: “Onigiri”. The automatic door opens every time you pass.",
            choices: [
              {
                label: "Walk inside",
                chance: 0.5,
                bonus: { curious: 0.2, brave: 0.1 },
                good: "The customers take pictures. The worker pretends to be angry. Then he puts you on the warm counter.",
                bad: "The manager is there tonight. The worker has to carry you out, sadly. “Not tonight, Onigiri.”",
              },
              {
                label: "Sit outside the door",
                chance: 0.8,
                good: "He comes out at 2 a.m. and shares his break with you, like every night. You are part of the shift now.",
                bad: "It’s a new worker tonight. He doesn’t know you. You wait anyway.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Adult",
        events: [
          {
            needs: "parklady",
            text: "The woman from the park comes alone one evening, with a carrier. “My apartment is small,” she says. “But it’s warm.”",
            choices: [
              {
                label: "Walk into the carrier",
                chance: 0.7,
                bonus: { curious: 0.1, shy: -0.1 },
                good: "Her apartment is very small, and very warm. There is a window over the train tracks. You watch the trains for hours.",
                bad: "Halfway there, you panic, scratch, and escape. She comes to the park the next day anyway. She doesn’t bring the carrier.",
                goodMark: "home",
              },
              {
                label: "Stay in the park",
                chance: 0.9,
                good: "She understands. She keeps coming every evening, and she keeps your portion aside.",
                bad: "She doesn’t come for a few days. Then she does. You don’t know where she went.",
              },
            ],
          },
          {
            text: "On the rooftops of the neighbourhood, a white cat with one blue eye and one yellow eye has noticed you.",
            choices: [
              {
                label: "Join her on her roof",
                chance: 0.6,
                bonus: { brave: 0.1, shy: -0.1 },
                good: "Two months later, three kittens are born behind a water tank. One of them has her strange eyes.",
                bad: "She hisses and slaps you off the edge. You land on a balcony full of plants. An old lady screams.",
                goodMark: "kittens",
              },
              {
                label: "Watch her from your own roof",
                chance: 0.7,
                good: "Every evening, the same distance. It becomes a kind of friendship.",
                bad: "One evening she doesn’t come. Then never again.",
              },
            ],
          },
          {
            text: "A typhoon is coming. The wind is already pulling at the signs. Everyone in the city is closing their shutters.",
            choices: [
              {
                label: "Shelter under the elevated train tracks",
                chance: 0.6,
                bonus: { clever: 0.2 },
                good: "Concrete above, concrete around. The storm screams all night, but it can’t reach you.",
                bad: "The water rises in the street. You climb a pole and stay there until morning, soaked to the bone.",
              },
              {
                label: "Go to the shrine",
                chance: 0.6,
                good: "Under the old wooden floor, a dozen cats are waiting out the storm. Nobody fights tonight.",
                bad: "A branch falls on the roof of the shrine. You run through the storm to find another place.",
              },
            ],
          },
          {
            text: "Midnight. A man in a suit sits on the curb outside a yakitori bar, alone. He is talking to himself. He has a skewer in his hand.",
            choices: [
              {
                label: "Sit next to him",
                chance: 0.6,
                bonus: { curious: 0.1, shy: -0.2 },
                good: "He gives you the chicken and keeps the stick. He tells you about his boss for an hour. You listen. He seems better after.",
                bad: "He doesn’t see you. He gets up, wobbles, and almost sits on you.",
              },
              {
                label: "Wait for him to drop it",
                chance: 0.5,
                bonus: { clever: 0.2 },
                good: "He falls asleep. The skewer falls. Patience pays.",
                bad: "He eats it all. He drops the stick. Thanks a lot.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Hard times",
        events: [
          {
            notIf: "home",
            text: "New signs in the park: “Do not feed the cats.” Neighbours complained. The food stops coming.",
            choices: [
              {
                label: "Look for a new neighbourhood",
                chance: 0.5,
                bonus: { brave: 0.1, curious: 0.1 },
                good: "Three stations away, you find a fish market and an old lady who doesn’t read signs.",
                bad: "Every neighbourhood already has its cats. You are a stranger everywhere for a while.",
              },
              {
                label: "Stay and wait",
                chance: 0.5,
                bonus: { shy: 0.1, clever: 0.1 },
                good: "After two weeks, the food comes back. At night now, and in secret. The sign stays up.",
                bad: "You lose weight. A lot. Your fur stops shining.",
              },
            ],
          },
          {
            text: "Snow on Tokyo, the first in years. The streets are silent. Everything you know is white and cold.",
            choices: [
              {
                label: "Find a car that just parked",
                chance: 0.6,
                bonus: { clever: 0.2 },
                good: "A warm engine, every night, at the same time. A nurse coming back from the night shift.",
                bad: "Every engine is already cold. You walk all night to stay warm.",
              },
              {
                label: "Curl up in a doorway",
                chance: 0.5,
                good: "In the morning, someone puts a small cardboard box and an old scarf next to you.",
                bad: "Someone opens the door and you fall inside a dentist’s waiting room. Chaos.",
              },
            ],
          },
          {
            needs: "home",
            text: "The woman doesn’t come home one evening. Then not the next one. A neighbour has a key. She looks at you, unsure what to do.",
            choices: [
              {
                label: "Meow at the neighbour",
                chance: 0.6,
                bonus: { shy: -0.2, brave: 0.1 },
                good: "She feeds you every day. Two weeks later, the woman comes home from the hospital, thinner. You sleep on her chest all night.",
                bad: "The neighbour takes you to a shelter “just for a while”. The woman finds you there a month later. You both pretend it was nothing.",
              },
              {
                label: "Wait by the door",
                chance: 0.5,
                good: "You wait twelve days. On the thirteenth, the key turns in the lock.",
                bad: "She comes back, but she is weaker. Her son talks about “a place with care”. They don’t take cats there.",
                badMark: "left",
              },
            ],
          },
          {
            needs: "kittens",
            text: "Your kittens are old enough now. The smallest one doesn’t want to leave the water tank.",
            choices: [
              {
                label: "Push it out into the world",
                chance: 0.6,
                bonus: { brave: 0.1 },
                good: "It complains, it hesitates, then it runs off across the roofs. It doesn’t look back. That’s good.",
                bad: "It leaves, and you never see it again. You check the water tank for weeks.",
              },
              {
                label: "Let it stay with you",
                chance: 0.6,
                good: "It stays. It grows. It sleeps against you every night, as big as you now.",
                bad: "It stays. The bigger cats don’t like that you two take the best tank. There are fights.",
              },
            ],
          },
        ],
      },
      // --------------------------------------------------------
      {
        name: "Old age",
        events: [
          {
            needs: "konbini",
            text: "You are old. The night worker from that first night is now the manager. He still takes his break at 2 a.m.",
            choices: [
              {
                label: "Sit next to him",
                chance: 0.7,
                good: "He doesn’t look surprised. He shares his onigiri with you. You sit together until his break ends.",
                bad: "He doesn’t recognise you. Why would he? It was so many years ago.",
                badMark: "forgotten",
              },
              {
                label: "Watch him through the window",
                chance: 0.6,
                good: "He sees you, and smiles. He puts a towel by the door. Like the very first night.",
                bad: "He doesn’t look up from the register. It’s a busy night.",
                badMark: "forgotten",
              },
            ],
          },
          {
            notIf: "home",
            text: "You are old. The monk at the temple has started leaving the side door open on cold nights.",
            choices: [
              {
                label: "Sleep on the warm wooden steps",
                chance: 0.7,
                good: "The monk lets you stay. Nobody chases you anymore. The bell wakes you up, gently, every morning.",
                bad: "The garden is being renovated. You look for a new place to sleep, slowly.",
              },
              {
                label: "Go back to the park where you grew up",
                chance: 0.5,
                good: "The benches are new, the trees are the same. A young cat waits under your old bench. You share it.",
                bad: "You don’t recognise anything. The park is a parking lot now.",
              },
            ],
          },
          {
            text: "Schoolchildren in yellow hats pass every morning. One of them always stops to say “ohayō” to you.",
            choices: [
              {
                label: "Answer with a slow blink",
                chance: 0.8,
                good: "He blinks back, very seriously. It becomes your secret. Every morning, until he is too tall for the yellow hat.",
                bad: "The teacher calls him and he runs. Tomorrow, maybe.",
              },
              {
                label: "Go rub against his legs",
                chance: 0.6,
                bonus: { shy: -0.2 },
                good: "He laughs so loud that all the children come. You are famous for a whole morning.",
                bad: "He is allergic. He sneezes all the way to school, happy anyway.",
              },
            ],
          },
          {
            needs: "home",
            notIf: "left",
            text: "You are old. You sleep most of the day by the window over the train tracks. The woman reads next to you.",
            choices: [
              {
                label: "Watch the trains",
                chance: 0.9,
                good: "The 6:12, the 6:20, the 6:31. You know them all. You have never taken one. You don’t need to.",
                bad: "Your eyes are tired. The trains are just lights now. That’s fine too.",
              },
              {
                label: "Climb on her book",
                chance: 0.8,
                good: "She sighs and closes the book. She pets you instead. That was the plan.",
                bad: "She keeps reading, with you on the page. You both pretend that’s normal.",
              },
            ],
          },
        ],
      },
    ],
    endings: [
      {
        needs: "home",
        notIf: "left",
        title: "A small, warm apartment",
        text: "You close your eyes by the window, between two trains. She keeps your bowl for a long time. Sometimes she still puts a little food in it, without thinking.",
      },
      {
        needs: "konbini",
        notIf: "forgotten",
        title: "The night shift cat",
        text: "One night, you don’t come at 2 a.m. The manager waits until the end of his break, then a little more. On the door of the store, a small drawing of a cat appears. It stays there for years.",
      },
      {
        needs: "kittens",
        title: "Eyes of two colours",
        text: "On a quiet night in autumn, you don’t wake up. On a roof nearby, a young cat with one blue eye and one yellow eye is watching the city, the way you used to.",
      },
      {
        luck: "unlucky",
        title: "Gone without a trace",
        text: "One day, you are simply not there anymore. In a city of fourteen million, nobody writes it down. But a child in a yellow hat looks for you on the way to school, for a few weeks.",
      },
      {
        title: "A cat of Tokyo",
        text: "On a quiet night in autumn, you close your eyes and don’t open them again. Somewhere, a bell rings for the end of a shift. The city keeps going, as it always does. But a few people will notice the empty spot.",
      },
    ],
  },
};
