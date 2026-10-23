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
//
// THE VOICE
// - The cat has strong opinions, and they are often wrong (cat logic).
// - One precise, real detail beats three pretty words: a brand, a time, a sound.
// - Funny first. The sad part comes in a small detail, never explained.
// - No moral at the end of a sentence. No “you will remember this forever”.

const TRAITS = [
  { id: "brave", line: "You are brave. You once hissed at a bus. The bus didn’t notice. You count it as a win." },
  { id: "shy", line: "You are shy. Your favourite place in the world is under things." },
  { id: "curious", line: "You are curious. Every open door is an invitation. Every closed door is an insult." },
  { id: "clever", line: "You are clever. You know which humans are soft before they know it themselves." },
];

const STORIES = {
  // ==========================================================
  Rabat: {
    line: "Warm stones, the smell of the sea, and a hundred cats who all think they own the place.",
    stages: [
      // --------------------------------------------------------
      {
        name: "Kitten",
        events: [
          {
            text: "You are three weeks old and roughly the size of a msemen. Your mother left this morning “for five minutes”. Above you, the baker pulls down his metal shutter with a noise like the end of the world.",
            choices: [
              {
                label: "Scream until he looks down",
                chance: 0.6,
                bonus: { brave: 0.1, shy: -0.2 },
                good: "He sighs like a man who already feeds four cats he never asked for. Bread soaked in milk, a cardboard box. You decide he belongs to you now.",
                bad: "The scooters are louder than you. He doesn’t hear a thing. You sleep against the wall of the oven, which is still warm, which is something.",
                goodMark: "baker",
              },
              {
                label: "Wait in silence for your mother",
                chance: 0.4,
                good: "She comes back at dawn with a sardine head and the face of someone who had a long day. She stays a little longer than usual. You don’t ask questions.",
                bad: "She doesn’t come back. You wait two days. Then you go looking for food, because waiting turns out not to be a meal.",
              },
            ],
          },
          {
            text: "A seagull lands on the wall above your nest. Rabat’s seagulls are the size of a small dog and have no shame at all. It is counting you and your sisters.",
            choices: [
              {
                label: "Puff up and hiss",
                chance: 0.4,
                bonus: { brave: 0.3, shy: -0.2 },
                good: "You puff up to twice your size, which is still very small. The gull decides you are more trouble than lunch and leaves for the beach. Your sisters sleep on top of you that night.",
                bad: "It doesn’t care how big you look. When it flies off, there are only two of you left in the nest. You stay very close to each other after that.",
              },
              {
                label: "Squeeze into the crack in the wall",
                chance: 0.7,
                bonus: { shy: 0.2 },
                good: "The gull pecks at the stones, screams something rude, and gives up. You stay in the crack until dark, in case it comes back with friends.",
                bad: "You are safe in the crack. One of your sisters was too slow. The nest is bigger now, and colder.",
              },
            ],
          },
          {
            text: "A tourist on the Corniche kneels in front of you with a camera bigger than your whole family. The sun is setting behind her. She is going “psspsspss” with a terrible accent.",
            choices: [
              {
                label: "Sit and pose",
                chance: 0.6,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "Click. She laughs, says something in German, and leaves you half a sandwich. Somewhere in Munich, your face will be on a fridge for ten years.",
                bad: "Click, click, click, click. Forty photos. Zero sandwich. She leaves very happy. You leave very hungry.",
              },
              {
                label: "Run under a bench",
                chance: 0.8,
                good: "She waits, then slides a triangle of La Vache qui rit under the bench and walks away. You eat it. Most of the foil too.",
                bad: "You trip on the curb and land in a puddle. A pigeon saw the whole thing. It looks embarrassed for you.",
              },
            ],
          },
          {
            text: "Your mother is teaching you to hunt in a garden by the old city walls. A lizard is asleep on a hot stone. It looks delicious and a bit stupid.",
            choices: [
              {
                label: "Jump on it",
                chance: 0.5,
                bonus: { brave: 0.2, clever: 0.1 },
                good: "You land on it with all four paws and your whole heart. Your mother looks at you for a long time. You are almost sure it’s pride.",
                bad: "The lizard leaves its tail in your mouth and runs. The tail keeps wiggling. You keep it anyway. It counts.",
              },
              {
                label: "Watch your mother do it",
                chance: 0.7,
                bonus: { clever: 0.2 },
                good: "She waits. She waits more. She moves only when the lizard blinks. From now on, you hunt exactly like her.",
                bad: "She misses too. You both walk home pretending you weren’t hungry anyway.",
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
            text: "Winter. It has rained on Rabat for three days. Every dry corner near the market is taken, and the best one belongs to a big grey tom with half an ear and zero patience.",
            choices: [
              {
                label: "Take his spot",
                chance: 0.3,
                bonus: { brave: 0.2, shy: -0.2 },
                good: "You are small, but you are furious, and furious is a size too. He leaves. The other cats look at you differently now.",
                bad: "He takes a piece of your ear as a souvenir. You keep the notch for the rest of your life. It makes you look experienced.",
                goodMark: "gang",
                badMark: "scar",
              },
              {
                label: "Slip under a parked car",
                chance: 0.7,
                good: "The engine is still warm. Under an old Dacia that smells of oranges and petrol, you sleep better than you have in weeks.",
                bad: "At six in the morning, the car starts. You run, soaked and screaming, and don’t stop until you see the river.",
              },
            ],
          },
          {
            text: "A little girl crouches in front of you near the Oudayas. She holds out her hand very slowly, like it’s a big responsibility. Behind her, her mother is calling her name, louder each time.",
            choices: [
              {
                label: "Let her pet you",
                chance: 0.6,
                bonus: { shy: -0.2, curious: 0.1 },
                good: "She pets you completely wrong, against the fur. You allow it. She comes back every day after school with something in her pocket. You start waiting for her at four o’clock.",
                bad: "Her mother pulls her away. “Don’t touch, they have fleas.” Rude, and also true. The girl looks back at you until the corner.",
                goodMark: "girl",
              },
              {
                label: "Run",
                chance: 0.8,
                good: "You stay free and suspicious. Nobody owns you. Nobody will ever disappoint you. It’s a good system, mostly.",
                bad: "You run straight into three boys with a stick. You get away, but from now on, hands are guilty until proven innocent.",
              },
            ],
          },
          {
            needs: "baker",
            text: "The baker leaves the back door open at night now. Inside, something is moving between the flour bags. Something small. Something with a tail.",
            choices: [
              {
                label: "Hunt the mouse",
                chance: 0.6,
                bonus: { brave: 0.1, clever: 0.1 },
                good: "In the morning, the baker finds the mouse at his feet, presented with care. He laughs and calls you “Khobza”. It means bread. You have a name now. You’ll take it.",
                bad: "You win against the mouse but lose against a bag of flour. The baker opens his shop and finds a completely white cat. He does not laugh.",
                badMark: "flour",
              },
              {
                label: "Sleep by the warm oven",
                chance: 0.8,
                good: "You sleep like a king. In the morning, there is a little bowl of milk next to you, and nobody mentions it.",
                bad: "The baker’s wife finds you asleep on her dough. The broom comes out. The door closes. Some people have no sense of humour.",
                badMark: "flour",
              },
            ],
          },
          {
            text: "The tram rings its bell. On the other side of the tracks, the fish guy is throwing out what he couldn’t sell. Five cats have already seen it.",
            choices: [
              {
                label: "Cross now",
                chance: 0.5,
                bonus: { brave: 0.1, clever: 0.1 },
                good: "Between the wheels, over the rails, and you arrive first. The best sardine is yours. The other cats arrive at a crime scene.",
                bad: "The tram brushes your back leg. You make it, but you limp for weeks, and the sardine went to someone else anyway.",
                badMark: "limp",
              },
              {
                label: "Wait for the tram to pass",
                chance: 0.7,
                bonus: { clever: 0.2 },
                good: "Patience. While the others fight over the first fish, you find the one that fell under the stall. Nobody saw. You tell nobody.",
                bad: "By the time you cross, there is nothing left but the smell, and five cats licking their lips at you.",
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
            text: "Spring. On the rooftops, a tabby with green eyes has been staring at you for three evenings. Either she likes you or she wants your roof. With cats, it’s hard to say.",
            choices: [
              {
                label: "Follow her",
                chance: 0.6,
                bonus: { brave: 0.1, shy: -0.1 },
                good: "Two months later, four kittens are born in a broken washing machine on a roof. One of them has your face, and already your attitude.",
                bad: "She leads you straight to her territory, where her brother is waiting. You come home with a bleeding nose and a lot to think about.",
                goodMark: "kittens",
              },
              {
                label: "Stay on your own roof",
                chance: 0.7,
                good: "You watch her from your roof, with a satellite dish in between. Some loves work better at a safe distance.",
                bad: "Another tom follows her. You hear them all night. You hate the moon, and him, and her a little.",
              },
            ],
          },
          {
            needs: "girl",
            text: "The girl comes back with a shoebox full of holes. “My father finally said yes.” She has been repeating this sentence all the way here. She opens the box.",
            choices: [
              {
                label: "Climb into the box",
                chance: 0.7,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "The box smells like her shoes. You fall asleep before the taxi even moves. You wake up in an apartment in Agdal, with a radiator. A radiator.",
                bad: "In the petit taxi, the panic arrives all at once. You scratch, you jump out at a red light, you run. She shouts your name through the window. You didn’t know you had one.",
                goodMark: "home",
              },
              {
                label: "Look at her, then walk away",
                chance: 0.9,
                good: "You don’t know why. Maybe the street is your home. She still visits, a little less often, always with something in her pocket.",
                bad: "She doesn’t come back after that. You wait at four o’clock for a few more weeks, in case she’s just late.",
              },
            ],
          },
          {
            needs: "gang",
            text: "The old grey tom is getting slow. He sleeps more than he guards. The younger cats are looking at you. The fish market could be yours.",
            choices: [
              {
                label: "Take his place",
                chance: 0.5,
                bonus: { brave: 0.2 },
                good: "One fight. Short, loud, fair. From now on, the fishmongers keep the heads for you, and the young ones eat after you.",
                bad: "He is old, but not that old. You lose, in front of everyone, including a seagull who seems to enjoy it.",
                goodMark: "boss",
              },
              {
                label: "Let him finish his reign",
                chance: 0.8,
                good: "He dies that winter, in his spot, in the sun. The others move aside for you without a word. Nobody takes his exact spot. Not even you.",
                bad: "While you were being respectful, a cat from the other market took over. Nobody asked your opinion.",
              },
            ],
          },
          {
            text: "A van from an animal association parks in your street. A volunteer puts tuna in metal cages with the doors wide open. It smells like a trap. It also smells like tuna.",
            choices: [
              {
                label: "Go in for the tuna",
                chance: 0.6,
                bonus: { curious: 0.1 },
                good: "Three days later, you are back. Vaccinated, a bit lighter in some places, with a small cut in your ear. The volunteer waves every time she passes. You don’t wave back. You are not a dog.",
                bad: "The vet frightens you so much that you stop eating for a week. Even tuna. Even tuna.",
              },
              {
                label: "Watch from the roof",
                chance: 0.7,
                bonus: { clever: 0.2, shy: 0.1 },
                good: "A few days later, the other cats come back healthy, with a little cut in the ear. Next time, maybe. Probably not.",
                bad: "You stay up there being careful for so long that the others eat all the tuna, even the tuna outside the cages.",
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
            text: "August. The heat sits on Rabat like a fat cat on a newspaper. Every bowl of water in the street is dry.",
            choices: [
              {
                label: "Try the café terrace",
                chance: 0.6,
                good: "The waiter sees you staring at his ice bucket. He sighs, fills a little saucer, and puts it in the shade. Every afternoon until September. Same time, same sigh.",
                bad: "The terrace is full and the waiter has a broom. You wait for night under a plastic chair, dizzy.",
              },
              {
                label: "Follow the man washing cars",
                chance: 0.5,
                bonus: { curious: 0.2, clever: 0.1 },
                good: "He sprays you “by accident”. You hate it with your whole body. You also feel alive for the first time in a week.",
                bad: "He chases you away from his customers’ cars. You find a drip under an air conditioner. It tastes like metal.",
              },
            ],
          },
          {
            text: "Night, on the beach. Three stray dogs have smelled you. They spread out slowly, like they practised.",
            choices: [
              {
                label: "Run for the rocks",
                chance: 0.5,
                bonus: { clever: 0.2 },
                good: "You squeeze between two rocks where no dog fits. They bark for an hour, then get bored. Dogs always get bored. You wait for the sun.",
                bad: "You make it, but one of them caught your tail. It never stands quite straight again. You hold it high anyway.",
                badMark: "scar",
              },
              {
                label: "Stand your ground and hiss",
                chance: 0.3,
                bonus: { brave: 0.3 },
                good: "The biggest dog hesitates. Then they all leave, slowly, as if it was their idea.",
                bad: "You fight. You live. That’s all you will ever say about that night.",
                badMark: "scar",
              },
            ],
          },
          {
            needs: "home",
            text: "Boxes everywhere. The family is moving to Marseille. At night you hear them arguing in the kitchen, and your name keeps coming up.",
            choices: [
              {
                label: "Sleep inside a moving box",
                chance: 0.6,
                bonus: { clever: 0.1, curious: 0.1 },
                good: "In the morning, the girl finds you in the box marked “KITCHEN” and laughs through her tears. “Okay. Okay. You’re coming.”",
                bad: "They give you to the neighbour on the third floor. She is kind. She buys the good food. It is not the same.",
                badMark: "left",
              },
              {
                label: "Stay next to the girl all night",
                chance: 0.5,
                good: "Her father watches you two from the doorway for a long time. In the morning, he comes back with a carrier and acts like it was his idea.",
                bad: "On the last day, they open the door of the building and leave you outside with a bag of food. The girl doesn’t look back. She can’t.",
                badMark: "left",
              },
            ],
          },
          {
            needs: "kittens",
            text: "One of your kittens has stopped eating. It sleeps all day and doesn’t play. The other three are hungry, and very loud about it.",
            choices: [
              {
                label: "Curl around the sick one",
                chance: 0.5,
                good: "For two days, you don’t move. On the third, it opens its eyes and bites your ear. It’s going to be fine. It’s going to be annoying.",
                bad: "You keep it warm until the end. The others had to find food alone. They are a little more distant now, and a little more grown up.",
              },
              {
                label: "Go hunt for everyone",
                chance: 0.5,
                bonus: { clever: 0.1, brave: 0.1 },
                good: "You bring back a whole fish, almost as big as you. Even the sick one eats a bit. By the end of the week, it’s stealing from the others.",
                bad: "When you come back, the sick one is gone. The others eat. You eat too. That’s how it works up here.",
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
            text: "You are old now. Your legs complain in the morning. The baker is gone, and his son runs the shop. He has the same sigh.",
            choices: [
              {
                label: "Go back to the bakery",
                chance: 0.6,
                good: "He looks at you for a long second. “You’re my father’s cat.” He puts an old cushion by the oven. It’s been yours ever since.",
                bad: "New sign, new owner, new broom. You get chased out of the place where you got your name.",
                badMark: "flour",
              },
              {
                label: "Watch from across the street",
                chance: 0.8,
                good: "Every morning, the son leaves a piece of bread on the step without looking up. He knows. You know he knows.",
                bad: "Nobody notices you over there. People walk past with their bread. That’s fine too.",
                badMark: "flour",
              },
            ],
          },
          {
            notIf: "home",
            text: "You are old. The wind from the sea is colder this year, or you are. The fishermen at the port know your face now.",
            choices: [
              {
                label: "Stay by the boats",
                chance: 0.6,
                good: "The fishermen share their scraps and their complaints about the price of diesel. You watch the waves for hours. It is enough.",
                bad: "The boats go out less this winter. The fishermen come less. You get thin, slowly, the way old cats do.",
              },
              {
                label: "Find a warm wall in the old city",
                chance: 0.7,
                good: "You find a wall that keeps the heat until midnight. You stop moving much. You don’t need to anymore.",
                bad: "A young cat already sleeps on that wall. You leave without a word. Ten years ago, you would have fought. Now you just find another wall.",
              },
            ],
          },
          {
            text: "A young cat, all bones and ears, keeps following you. It steals from your food. It sleeps a little too close. It has no manners at all.",
            choices: [
              {
                label: "Chase it away",
                chance: 0.6,
                bonus: { brave: 0.1 },
                good: "It comes back anyway. You let it. Honestly, you are too tired to keep chasing things.",
                bad: "It leaves, and doesn’t come back. Your spot feels very big after that.",
              },
              {
                label: "Teach it your spots",
                chance: 0.8,
                good: "The terrace with the water. The bakery’s back door. The fisherman who keeps heads. One day it will teach someone else, and get half of it wrong.",
                bad: "It doesn’t listen. Young cats never listen. You didn’t either.",
              },
            ],
          },
          {
            needs: "girl",
            text: "A young woman stops in the street and looks at you for a long time. “Is it you?” She crouches down, very slowly, like it’s a big responsibility.",
            choices: [
              {
                label: "Go to her",
                chance: 0.8,
                good: "She cries, and laughs, and you purr so loud the whole street can hear. She pets you against the fur. Of course it’s her. She comes every day after that.",
                bad: "You don’t recognise her. Your eyes aren’t what they were. She smiles anyway, and leaves you something from her pocket. Like before.",
              },
              {
                label: "Stay where you are",
                chance: 0.5,
                good: "She sits on the step next to you for an hour. Neither of you says anything. You never could anyway.",
                bad: "She waits, then leaves. Maybe she was wrong. Maybe she wasn’t.",
              },
            ],
          },
          {
            needs: "home",
            notIf: "left",
            text: "You are old. You live on a windowsill in Agdal, in the sun. The girl is grown up. Every morning before work, she tells you her plans for the day. You don’t care. You listen anyway.",
            choices: [
              {
                label: "Wait for her at the door",
                chance: 0.8,
                good: "Every evening, the key in the lock. Every evening, your tail goes up on its own. Fifteen years, and you never get used to it.",
                bad: "Some evenings she comes home very late. You wait anyway. You are a professional.",
              },
              {
                label: "Sleep in the sun",
                chance: 0.9,
                good: "The sun moves across the floor. You move with it, one tile at a time. It’s a full-time job.",
                bad: "They built a building across the street. The sun comes later now. You find a new spot, slower than before.",
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
        text: "You die in your sleep, on a cushion that smells of her. She buries you under the lemon tree in her parents’ garden. Every spring, when it flowers, she sits there for a bit and tells you her plans.",
      },
      {
        needs: "baker",
        notIf: "flour",
        title: "Khobza",
        text: "One morning, you don’t come to the bakery door. The baker’s son puts a piece of bread on the step anyway. He does it every morning for a long time. The other cats eat it. He doesn’t mind.",
      },
      {
        needs: "boss",
        title: "The old king of the market",
        text: "You die in your spot, the good one, where the sun hits first. That day, the fishmongers keep a head aside, out of habit. Nobody takes it. Not even the seagulls.",
      },
      {
        needs: "kittens",
        title: "A long line of cats",
        text: "One spring morning, you don’t wake up. On a roof nearby, a tabby with your face is teaching her kittens to wait for the lizard to blink.",
      },
      {
        luck: "unlucky",
        title: "Gone without a trace",
        text: "One day, you just aren’t there anymore. Nobody knows where you went. Rabat has a hundred other cats. But someone, somewhere, walks past your wall and slows down a little.",
      },
      {
        title: "A cat of Rabat",
        text: "One spring morning, you don’t wake up. You were curled in the sun, in your favourite spot, with the sea somewhere behind the walls. Nobody wrote your name down. You never had just one anyway.",
      },
    ],
  },

  // ==========================================================
  Tokyo: {
    line: "Neon lights, quiet alleys, and fourteen million people too polite to chase you.",
    stages: [
      // --------------------------------------------------------
      {
        name: "Kitten",
        events: [
          {
            text: "You are born in a cardboard box behind a convenience store. It is 2 a.m. The night worker is outside on his break, eating a rice ball and looking at nothing.",
            choices: [
              {
                label: "Crawl toward the light",
                chance: 0.6,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "He sees you. He says nothing, because he is very tired. But the next night, there is a saucer of water and a folded towel in the box.",
                bad: "A delivery truck backs into the alley, beeping. Your siblings scatter. You never find all of them again.",
                goodMark: "konbini",
              },
              {
                label: "Stay hidden with your siblings",
                chance: 0.5,
                good: "Your mother moves you one by one, by the neck, to a quiet garden behind a temple. You complain the whole way. It’s safer there.",
                bad: "The box goes out with the morning trash. Your mother saves you. Not everyone.",
              },
            ],
          },
          {
            text: "Dawn in the park. The crows wake up before everyone. One lands very close, tilts its head, and looks at you like a snack with legs.",
            choices: [
              {
                label: "Hiss as loud as you can",
                chance: 0.4,
                bonus: { brave: 0.3 },
                good: "The crow hops back. Then another one comes. Then a third. But they leave. You beat three crows. Nobody will ever believe you.",
                bad: "Tokyo crows remember faces. From now on, they follow you around, making comments.",
              },
              {
                label: "Crawl under the azaleas",
                chance: 0.7,
                bonus: { shy: 0.2, clever: 0.1 },
                good: "Too many branches for a crow. You watch them leave one by one, grumbling.",
                bad: "You are safe, but you stay under there so long that your mother comes looking for you, furious and relieved.",
              },
            ],
          },
          {
            text: "Rainy season. Your box is turning into soup. A few metres away, a vending machine hums, warm and bright, selling hot coffee to nobody.",
            choices: [
              {
                label: "Sleep behind the vending machine",
                chance: 0.7,
                bonus: { clever: 0.1 },
                good: "Warm all night, and the light keeps the rats away. You will love vending machines for the rest of your life.",
                bad: "At midnight, a man kicks the machine because it ate his coin. You don’t sleep much after that.",
              },
              {
                label: "Follow your mother to the shrine",
                chance: 0.6,
                good: "Under the wooden floor of the shrine, it’s dry and smells of old wood. Two stone foxes guard the entrance. They are useless, but it’s the thought that counts.",
                bad: "You lose her in the rain, between two umbrellas. You find her again at dawn. You are shaking. So is she.",
              },
            ],
          },
          {
            text: "An old man on a bench feeds the pigeons every morning at 7. Exactly 7. He has noticed you watching.",
            choices: [
              {
                label: "Walk up to him",
                chance: 0.6,
                bonus: { curious: 0.2, shy: -0.2 },
                good: "He breaks off a piece of his rice ball for you, very seriously, as if this was an important business meeting.",
                bad: "The pigeons explode into the air. The old man lets out the longest sigh in Tokyo. You ruined his morning.",
              },
              {
                label: "Catch a pigeon",
                chance: 0.2,
                bonus: { brave: 0.1, clever: 0.1 },
                good: "Unbelievable. You did it. The old man laughs so hard he has to hold on to his hat.",
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
            text: "Summer. Heat rises from the asphalt. Every evening, a woman with a parasol leaves food in a small park. Lots of cats come. There is a hierarchy. You are at the bottom of it.",
            choices: [
              {
                label: "Push to the front",
                chance: 0.4,
                bonus: { brave: 0.2, shy: -0.2 },
                good: "You eat first. Nobody saw that coming, including you. You grow big and strong that summer.",
                bad: "An old cat slaps you across the nose, once, very professionally. You eat what’s left, last, alone.",
              },
              {
                label: "Wait your turn under a bench",
                chance: 0.7,
                bonus: { shy: 0.1 },
                good: "The woman notices you waiting. She puts a small portion aside under the bench, just for you. You pretend you didn’t see. She pretends too.",
                bad: "There’s nothing left by the time it’s your turn. Good manners are expensive.",
                goodMark: "parklady",
              },
            ],
          },
          {
            text: "A volunteer in gloves crouches near you with a carrier. She speaks very softly. Other cats have left with her and come back with a little cut in the ear and a new attitude.",
            choices: [
              {
                label: "Let her take you",
                chance: 0.6,
                good: "A few days later, you are back in your park with a clipped ear and a full belly. Now everyone can see you belong to this street.",
                bad: "The vet is so terrifying that you hide in a drain pipe for two weeks.",
              },
              {
                label: "Escape over the wall",
                chance: 0.7,
                bonus: { brave: 0.1, clever: 0.1 },
                good: "You stay wild. By the end of summer, you know every roof in the neighbourhood.",
                bad: "You land badly on the other side. You limp for a whole season.",
              },
            ],
          },
          {
            text: "A train station at rush hour. Thousands of shoes, all going somewhere fast. Somewhere inside, there is a noodle stand that drops things.",
            choices: [
              {
                label: "Go in with the crowd",
                chance: 0.4,
                bonus: { brave: 0.1, curious: 0.2, shy: -0.2 },
                good: "Between the legs, under the gates, to the noodle stand. The cook pretends not to see you. A piece of fish falls. By accident. Twice.",
                bad: "Someone steps on your paw. A station officer chases you out with a broom, apologising the whole time.",
              },
              {
                label: "Wait outside until it’s quiet",
                chance: 0.7,
                bonus: { clever: 0.2 },
                good: "At midnight, the cook takes out the trash. He leaves the lid open. Just a little. Just enough.",
                bad: "Another cat had the same idea. It is bigger than you, and it was there first.",
              },
            ],
          },
          {
            needs: "konbini",
            text: "The night worker at the convenience store calls you “Onigiri” now. The automatic door opens every time you walk past and says “Irasshaimase!” You think it’s talking to you.",
            choices: [
              {
                label: "Walk inside",
                chance: 0.5,
                bonus: { curious: 0.2, brave: 0.1 },
                good: "The customers take pictures. The worker pretends to be angry. Then he puts you on the counter, next to the warm fried chicken.",
                bad: "The manager is in tonight. The worker has to carry you out like a sack of rice. “Not tonight, Onigiri. Sorry.”",
              },
              {
                label: "Sit outside the door",
                chance: 0.8,
                good: "At 2 a.m., he comes out and shares his break with you, like every night. You are basically staff now.",
                bad: "It’s a new worker tonight. He doesn’t know you. You wait outside anyway. The door keeps welcoming you.",
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
            text: "The woman from the park comes alone one evening, with a carrier. “My apartment is very small,” she says, as if you had asked. “But it’s warm.”",
            choices: [
              {
                label: "Walk into the carrier",
                chance: 0.7,
                bonus: { curious: 0.1, shy: -0.1 },
                good: "Her apartment is very small and very warm. There is a window over the train tracks. You watch the trains for hours. She watches you watch them.",
                bad: "Halfway there, you panic, scratch, and escape. She comes to the park the next evening anyway. Without the carrier.",
                goodMark: "home",
              },
              {
                label: "Stay in the park",
                chance: 0.9,
                good: "She understands. She keeps coming every evening, and your portion stays under the bench.",
                bad: "She doesn’t come for a few days. Then she does, a little thinner. She doesn’t explain. You don’t ask.",
              },
            ],
          },
          {
            text: "On the rooftops, a white cat with one blue eye and one yellow eye has noticed you. She looks at you with both. It’s a lot.",
            choices: [
              {
                label: "Join her on her roof",
                chance: 0.6,
                bonus: { brave: 0.1, shy: -0.1 },
                good: "Two months later, three kittens are born behind a water tank. One of them has her strange eyes and your terrible manners.",
                bad: "She hisses and slaps you off the edge. You land on a balcony full of plants. An old lady screams. You scream back.",
                goodMark: "kittens",
              },
              {
                label: "Watch her from your own roof",
                chance: 0.7,
                good: "Every evening, the same two roofs, the same distance. It becomes a kind of friendship.",
                bad: "One evening, she doesn’t come. Then never again. You keep looking at that roof anyway.",
              },
            ],
          },
          {
            text: "A typhoon is coming. The wind is already pulling at the shop signs. The whole city closes its shutters very calmly, as if this happens every year. It does.",
            choices: [
              {
                label: "Hide under the elevated train tracks",
                chance: 0.6,
                bonus: { clever: 0.2 },
                good: "Concrete above, concrete around. The storm screams all night, but it can’t reach you. You even sleep a little.",
                bad: "The water rises in the street. You climb a pole and stay there until morning, soaked, and personally offended by the sky.",
              },
              {
                label: "Go to the shrine",
                chance: 0.6,
                good: "Under the old wooden floor, a dozen cats are waiting out the storm together. Nobody fights tonight. Tomorrow, sure.",
                bad: "A branch crashes onto the shrine roof. You run through the storm to find somewhere else. Everything is wet. Everything.",
              },
            ],
          },
          {
            text: "Midnight, outside a yakitori bar. A man in a suit sits on the curb, explaining to nobody why his boss is wrong. He holds his skewer like a microphone.",
            choices: [
              {
                label: "Sit next to him",
                chance: 0.6,
                bonus: { curious: 0.1, shy: -0.2 },
                good: "He gives you the chicken and keeps the stick. You hear the whole story about Tanaka-san. Tanaka-san sounds terrible. You agree with everything, chewing.",
                bad: "He doesn’t see you. He gets up, wobbles, almost sits on you, and apologises to a lamp post.",
              },
              {
                label: "Wait for him to drop it",
                chance: 0.5,
                bonus: { clever: 0.2 },
                good: "He falls asleep against the wall. The skewer tilts. Slowly. Slowly. It falls. Patience is a hunting skill.",
                bad: "He eats every piece. Then he drops the stick, right in front of you. Thanks a lot.",
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
            text: "New signs in the park: “Please do not feed the cats.” The neighbours complained. The food stops coming. The signs are very polite about it.",
            choices: [
              {
                label: "Look for a new neighbourhood",
                chance: 0.5,
                bonus: { brave: 0.1, curious: 0.1 },
                good: "Three stations away, you find a fish market and an old lady who does not read signs.",
                bad: "Every neighbourhood already has its cats. You are a stranger everywhere for a while.",
              },
              {
                label: "Stay and wait",
                chance: 0.5,
                bonus: { shy: 0.1, clever: 0.1 },
                good: "After two weeks, the food comes back. At night now, in secret. The sign stays up. Everyone pretends to respect it.",
                bad: "You lose weight. A lot. Your fur stops shining.",
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
                good: "A warm engine, every night at 4 a.m. It belongs to a nurse coming home from her shift. She checks under the car before she starts it. Every time.",
                bad: "Every engine in the street is already cold. You walk all night just to stay warm.",
              },
              {
                label: "Curl up in a doorway",
                chance: 0.5,
                good: "In the morning, someone has left a little cardboard box and an old scarf next to you. Nobody stays to be thanked.",
                bad: "Someone opens the door and you fall backwards into a dentist’s waiting room. Chaos. Screaming. One child is very happy.",
              },
            ],
          },
          {
            needs: "home",
            text: "The woman doesn’t come home one evening. Or the next. The neighbour has a key. She stands in the doorway looking at you, not sure what to do with a cat.",
            choices: [
              {
                label: "Meow at the neighbour",
                chance: 0.6,
                bonus: { shy: -0.2, brave: 0.1 },
                good: "She feeds you every day and tells you about her grandchildren. Two weeks later, the woman comes home from the hospital, thinner. You sleep on her chest all night.",
                bad: "The neighbour takes you to a shelter “just for a while”. The woman finds you there a month later. You both pretend it was nothing.",
              },
              {
                label: "Wait by the door",
                chance: 0.5,
                good: "You wait by the door for twelve days. On the thirteenth, the key turns in the lock.",
                bad: "She comes back, but weaker. Her son visits and talks about “a place with care”. They don’t take cats there.",
                badMark: "left",
              },
            ],
          },
          {
            needs: "kittens",
            text: "Your kittens are grown now. The smallest one refuses to leave the water tank. It has decided this is its home forever, with you, preferably on top of you.",
            choices: [
              {
                label: "Push it out into the world",
                chance: 0.6,
                bonus: { brave: 0.1 },
                good: "It complains, it hesitates, then it runs off across the roofs and doesn’t look back. Good. That’s what you wanted. Mostly.",
                bad: "It leaves, and you never see it again. You check the water tank for weeks.",
              },
              {
                label: "Let it stay",
                chance: 0.6,
                good: "It stays. It grows. It still sleeps on you every night, even now that it’s bigger than you.",
                bad: "It stays. The bigger cats don’t like you two taking the best tank. There are fights. You don’t win all of them.",
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
            text: "You are old. The night worker from that first night is the manager now. His hair is grey. He still takes his break at 2 a.m., with a rice ball, looking at nothing.",
            choices: [
              {
                label: "Sit next to him",
                chance: 0.7,
                good: "He doesn’t look surprised. He breaks his onigiri in two. You sit together until his break ends, like old colleagues.",
                bad: "He doesn’t recognise you. Why would he? It was so many years ago, and every cat looks the same at 2 a.m.",
                badMark: "forgotten",
              },
              {
                label: "Watch him through the window",
                chance: 0.6,
                good: "He looks up and sees you. He smiles. That night, there is a folded towel by the door. Like the very first one.",
                bad: "He doesn’t look up from the register. It’s a busy night. They are all busy nights now.",
                badMark: "forgotten",
              },
            ],
          },
          {
            notIf: "home",
            text: "You are old. The monk at the temple has started leaving the side door open on cold nights. He says it’s for the air. It’s not for the air.",
            choices: [
              {
                label: "Sleep on the warm wooden steps",
                chance: 0.7,
                good: "The monk lets you stay. Nobody chases you anymore. The bell wakes you every morning, gently, and you go back to sleep.",
                bad: "The temple garden is being renovated. Men with drills everywhere. You go looking for a new place to sleep, slowly.",
              },
              {
                label: "Go back to the park where you grew up",
                chance: 0.5,
                good: "The benches are new. The trees are the same. A young cat is waiting under your old bench. You share it.",
                bad: "You don’t recognise anything. The park is a car park now. The vending machine is still there, though.",
              },
            ],
          },
          {
            text: "Schoolchildren in yellow hats walk past every morning. One of them always stops to say “ohayō” to you, with a little bow.",
            choices: [
              {
                label: "Answer with a slow blink",
                chance: 0.8,
                good: "He blinks back, very seriously. It becomes your secret. Every morning, until the day he is too tall for the yellow hat.",
                bad: "The teacher calls him and he runs off. Tomorrow, maybe.",
              },
              {
                label: "Rub against his legs",
                chance: 0.6,
                bonus: { shy: -0.2 },
                good: "He laughs so loud that the whole class comes running. You are famous for an entire morning.",
                bad: "He is allergic. He sneezes all the way to school, very happy.",
              },
            ],
          },
          {
            needs: "home",
            notIf: "left",
            text: "You are old. You sleep most of the day by the window over the train tracks. The woman reads next to you. Neither of you is in a hurry anymore.",
            choices: [
              {
                label: "Watch the trains",
                chance: 0.9,
                good: "The 6:12. The 6:20. The 6:31, which was late once, in 2019, and you still think about it. You have never taken a train. You never needed to.",
                bad: "Your eyes are tired. The trains are just lights now. That’s fine too.",
              },
              {
                label: "Sit on her book",
                chance: 0.8,
                good: "She sighs and closes the book. She pets you instead. That was the plan all along.",
                bad: "She keeps reading, with you on the page. You both act like this is normal.",
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
        text: "You close your eyes by the window, between two trains. She keeps your bowl for a long time. Sometimes, without thinking, she still puts a little food in it.",
      },
      {
        needs: "konbini",
        notIf: "forgotten",
        title: "The night shift cat",
        text: "One night, you don’t come at 2 a.m. The manager waits until the end of his break, then five more minutes. A week later, a small drawing of a cat appears on the store door. It says “Onigiri”. It stays there for years.",
      },
      {
        needs: "kittens",
        title: "Eyes of two colours",
        text: "On a quiet autumn night, you don’t wake up. On a roof nearby, a young cat with one blue eye and one yellow eye is watching the city, exactly the way you used to.",
      },
      {
        luck: "unlucky",
        title: "Gone without a trace",
        text: "One day, you are simply not there anymore. In a city of fourteen million, nobody writes it down. But a child in a yellow hat looks for you on the way to school, for a few weeks.",
      },
      {
        title: "A cat of Tokyo",
        text: "On a quiet autumn night, you close your eyes and don’t open them again. Somewhere, a bell rings for the end of a shift. The city keeps going, as it always does. A few people slow down at the empty spot.",
      },
    ],
  },
};
