// Drawings for the game: the cat, the coats it can be born with, and the
// city skylines, drawn in SVG. Some coats also have painted pictures of the
// cat (see CAT_PICTURES below), shown instead of the drawing.

// Each coat sets the colours used by the cat drawing below.
const COATS = [
  { id: "ginger", coat: "#e3913f", stripe: "#b5612a", stripes: 1, eye: "#9bc23c", inner: "#f2b8a0", nose: "#e07f7f" },
  { id: "black", coat: "#26211f", eye: "#e6c33a", inner: "#5b4444", nose: "#4a3636" },
  { id: "grey tabby", coat: "#9a948e", stripe: "#5a544f", stripes: 1, eye: "#86b84f", inner: "#e8b4ad", nose: "#d98585" },
  { id: "white", coat: "#f7f2e9", eye: "#6fa8dc", inner: "#f3b6b6", nose: "#ef9a9a" },
  { id: "calico", coat: "#f7f2e9", patch: "#e3913f", patch2: "#2b2522", patches: 1, eye: "#d9a42b", inner: "#f3b6b6", nose: "#ef9a9a" },
  { id: "tuxedo", coat: "#26211f", bib: "#f7f2e9", bibs: 1, eye: "#9bc23c", inner: "#5b4444", nose: "#ef9a9a" },
];

// Turns a coat into CSS variables, read by the cat drawing.
function coatStyle(c) {
  return [
    "--coat:" + c.coat,
    "--stripe:" + (c.stripe || "transparent"),
    "--stripe-o:" + (c.stripes || 0),
    "--patch:" + (c.patch || "transparent"),
    "--patch2:" + (c.patch2 || "transparent"),
    "--patch-o:" + (c.patches || 0),
    "--bib:" + (c.bib || "transparent"),
    "--bib-o:" + (c.bibs || 0),
    "--eye:" + c.eye,
    "--inner:" + c.inner,
    "--nose:" + c.nose,
  ].join(";");
}

// A sitting cat. Its mood (awake, happy, sad, asleep) is set with
// data-mood on the element around it, and changes the eyes.
// What happened in its life shows too: data-marks on <body> lists the
// marks (see MARKS in stories.js) and switches on the "acc" drawings,
// data-cond (strong, ok, weak) changes how healthy it looks,
// data-age (kitten, adult, old) changes its shape: a big head when young,
// a grey muzzle when old.
const CAT_SVG = `
<svg class="cat" viewBox="0 0 120 120" aria-hidden="true">
  <ellipse class="cat-shadow" cx="60" cy="109" rx="34" ry="4"/>
  <g class="acc acc-sparkles">
    <path d="M20 38 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 Z"/>
    <path d="M100 56 l1.5 -4.5 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5 -4.5 l-4.5 -1.5 Z"/>
    <path d="M26 72 l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 Z"/>
  </g>
  <g class="acc acc-kitten">
    <ellipse class="body" cx="22" cy="102" rx="10" ry="6.5"/>
    <path class="ear" d="M7 90 L8 81 L13 86 Z M15 86 L20 81 L20 90 Z"/>
    <circle class="head" cx="14" cy="92" r="6.5"/>
    <path class="line thin" d="M11 92 q1 1.2 2 0 M15 92 q1 1.2 2 0"/>
  </g>
  <g class="cat-tail">
    <path class="ol" d="M80 104 C102 106 112 86 102 72 C98 66 93 67 95 72"/>
    <path class="fill-stroke" d="M80 104 C102 106 112 86 102 72 C98 66 93 67 95 72"/>
  </g>
  <path class="body" d="M35 108 C29 84 37 61 58 59 C80 57 91 84 85 108 Z"/>
  <path class="patch" d="M67 63 C81 64 88 84 85 101 C76 92 70 80 67 63 Z"/>
  <path class="bib" d="M48 64 C52 84 64 84 68 64 C62 69 54 69 48 64 Z"/>
  <path class="stripes" d="M37 82 C42 81 45 83 47 86 M36 93 C41 92 44 94 46 97 M84 82 C79 81 76 83 74 86 M85 93 C80 92 77 94 75 97"/>
  <path class="line" d="M50 84 C49 95 49 102 50 107 M66 84 C67 95 67 102 66 107"/>
  <g class="acc acc-bandage">
    <rect x="41" y="95" width="13" height="7" rx="2"/>
    <path d="M45 95 V102 M49 95 V102"/>
  </g>
  <g class="cat-head">
    <path class="ear" d="M38 40 L40 13 L57 29 Z"/>
    <path class="ear" d="M61 28 L77 12 L79 40 Z"/>
    <path class="ear-in" d="M42 34 L43 20 L52 29 Z"/>
    <path class="ear-in" d="M66 28 L75 19 L76 34 Z"/>
    <ellipse class="head" cx="58" cy="44" rx="23" ry="19"/>
    <path class="patch2" d="M61 26 C73 27 81 36 80 45 C72 42 65 36 61 26 Z"/>
    <path class="stripes" d="M58 26.5 V33 M51 28 L52.5 33 M65 28 L63.5 33"/>
    <g class="eyes eyes-open">
      <ellipse class="eye" cx="49" cy="44" rx="3.4" ry="4.4"/>
      <ellipse class="pupil" cx="49" cy="44" rx="1.3" ry="3.3"/>
      <ellipse class="eye" cx="67" cy="44" rx="3.4" ry="4.4"/>
      <ellipse class="pupil" cx="67" cy="44" rx="1.3" ry="3.3"/>
    </g>
    <path class="eyes eyes-happy line" d="M45 46 Q49 40 53 46 M63 46 Q67 40 71 46"/>
    <path class="eyes eyes-closed line" d="M45 44 Q49 48.5 53 44 M63 44 Q67 48.5 71 44"/>
    <g class="acc acc-old">
      <ellipse cx="58" cy="55" rx="9" ry="5"/>
      <path d="M44 37 q5 -3 9 0 M63 37 q5 -3 9 0"/>
    </g>
    <path class="eyes eyes-sad line" d="M45 45 L53 46 M63 46 L71 45"/>
    <path class="nose" d="M56 51 L60 51 L58 53.6 Z"/>
    <path class="line thin" d="M58 53.6 Q56 56.6 53.8 55.4 M58 53.6 Q60 56.6 62.2 55.4"/>
    <path class="whiskers" d="M44 52 L30 49.5 M44 55 L30 57.5 M72 52 L86 49.5 M72 55 L86 57.5"/>
    <path class="acc acc-scar" d="M70 33 L75 47 M69.4 37.6 l4 -1.4 M70.8 41.6 l4 -1.4"/>
    <g class="acc acc-flour">
      <ellipse cx="44" cy="34" rx="5" ry="3"/>
      <ellipse cx="66" cy="57" rx="4" ry="2.4"/>
      <ellipse cx="74" cy="22" rx="2.6" ry="2"/>
    </g>
    <path class="acc acc-crown" d="M47 29 L48.5 17 L53.5 23 L58 13 L62.5 23 L67.5 17 L69 29 Q58 26 47 29 Z"/>
  </g>
  <g class="acc acc-collar">
    <path class="band" d="M42 61 Q58 71 74 61"/>
    <circle class="bell" cx="58" cy="69.5" r="3.2"/>
  </g>
  <path class="acc acc-heart" d="M94 34 C90 28 82 31 86 37 L94 44 L102 37 C106 31 98 28 94 34 Z"/>
</svg>`;

// The cat seen from the side, walking to the right. Used between two steps
// of its life, to show time passing. The legs move with CSS (see .walker).
const WALK_SVG = `
<svg class="cat walk-cat" viewBox="0 0 150 100" aria-hidden="true">
  <ellipse class="cat-shadow" cx="72" cy="92" rx="46" ry="3.5"/>
  <g class="walk-tail">
    <path class="ol" d="M34 50 C18 46 12 30 18 18"/>
    <path class="fill-stroke" d="M34 50 C18 46 12 30 18 18"/>
  </g>
  <g class="leg leg-a"><path class="ol" d="M44 58 V88"/><path class="fill-stroke" d="M44 58 V88"/></g>
  <g class="leg leg-b"><path class="ol" d="M90 58 V88"/><path class="fill-stroke" d="M90 58 V88"/></g>
  <path class="body" d="M30 52 C30 38 46 34 66 36 C86 38 100 38 104 48 C108 60 96 66 70 66 C44 66 30 64 30 52 Z"/>
  <path class="stripes" d="M50 38 C52 44 52 48 50 52 M62 37 C64 43 64 48 62 52 M74 38 C76 44 76 48 74 52"/>
  <path class="patch" d="M60 37 C74 36 84 40 86 50 C78 54 66 50 60 37 Z"/>
  <g class="leg leg-b"><path class="ol" d="M52 60 V88"/><path class="fill-stroke" d="M52 60 V88"/></g>
  <g class="leg leg-a"><path class="ol" d="M98 58 V88"/><path class="fill-stroke" d="M98 58 V88"/></g>
  <g class="walk-head">
    <path class="ear" d="M100 24 L104 6 L114 20 Z"/>
    <path class="ear" d="M114 20 L124 8 L126 26 Z"/>
    <ellipse class="head" cx="114" cy="34" rx="17" ry="15"/>
    <path class="bib" d="M100 42 C104 52 116 52 122 46 C114 48 106 46 100 42 Z"/>
    <ellipse class="eye" cx="120" cy="31" rx="2.6" ry="3.4"/>
    <ellipse class="pupil" cx="121" cy="31" rx="1" ry="2.6"/>
    <path class="nose" d="M129 36 L131.5 36 L130.5 38.5 Z"/>
    <path class="whiskers" d="M124 40 L140 38 M124 42 L140 44"/>
    <ellipse class="acc acc-old" cx="126" cy="41" rx="6" ry="4"/>
  </g>
</svg>`;

// Painted pictures of the cat, in img/cats/. A coat (or a breed, for a cat
// with a breed) that has them shows them instead of the drawings above. The
// others keep the drawings until their pictures are made.
//   adult, kitten, old : sitting, at each age (a 640 square, paws at 90 %)
//   sleep              : asleep, curled up
//   walk               : walking to the right; two pictures are shown in turn
const CAT_PICTURES = {
  ginger: {
    adult: "img/cats/ginger-adult.webp",
    kitten: "img/cats/ginger-kitten.webp",
    old: "img/cats/ginger-old.webp",
    sleep: "img/cats/ginger-sleep.webp",
    walk: ["img/cats/ginger-walk.webp"],
  },
  black: {
    adult: "img/cats/black-adult.webp",
    kitten: "img/cats/black-kitten.webp",
    old: "img/cats/black-old.webp",
    sleep: "img/cats/black-sleep.webp",
    walk: ["img/cats/black-walk.webp"],
  },
};

// Where the painted picture goes, next to the drawing (see showPicture in game.js).
const CAT_PICTURE = `<img class="cat cat-picture" alt="">`;

// Small paw print, used to show how far along the life is.
const PAW_SVG = `
<svg viewBox="0 0 24 24" aria-hidden="true"><g>
  <ellipse cx="12" cy="16" rx="5.2" ry="4.4"/>
  <ellipse cx="5.2" cy="10.4" rx="2.2" ry="2.8"/>
  <ellipse cx="9.4" cy="6.4" rx="2.2" ry="2.9"/>
  <ellipse cx="14.6" cy="6.4" rx="2.2" ry="2.9"/>
  <ellipse cx="18.8" cy="10.4" rx="2.2" ry="2.8"/>
</g></svg>`;

// Rabat: the blue houses of the medina, the Hassan Tower, a palm tree,
// and the ochre wall of the kasbah in front.
function rabatSkyline() {
  let wall = "M0 90 V66";
  for (let x = 0; x < 360; x += 12) wall += ` H${x + 6} V61 H${x + 12} V66`;
  wall += " V90 Z";
  // the gate of the kasbah, a horseshoe arch cut out of the wall
  const gate = "M118 90 V76 C118 66 136 66 136 76 V90 Z";
  const houses =
    "M0 90 V52 H22 V58 H40 V46 H58 V54 H76 V44 H96 V56 H112 V48 H134 V58 H150 V50 H170 V60 H186 V90 Z" +
    " M280 90 V54 H298 V48 H318 V56 H336 V50 H360 V90 Z";
  const tower = "M232 90 V14 H262 V90 Z";
  const towerArches =
    "M239 40 V30 C239 25 245 25 245 30 V40 Z M249 40 V30 C249 25 255 25 255 30 V40 Z M243 62 V52 C243 46 251 46 251 52 V62 Z";
  const palm =
    "M205 90 C206 74 204 60 201 48" +
    " M201 48 C192 42 184 44 178 50 M201 48 C196 38 188 36 182 37 M201 48 C204 38 212 35 220 37 M201 48 C210 44 218 47 222 54 M201 48 C202 42 200 37 197 33";
  return `
<svg class="skyline" viewBox="0 0 360 90" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <path class="sky-far" d="${houses}"/>
  <path class="sky-far" d="${tower}"/>
  <path class="sky-bg" d="${towerArches}"/>
  <path class="sky-line" d="${palm}"/>
  <path class="sky-near" fill-rule="evenodd" d="${wall} ${gate}"/>
</svg>`;
}

// Tokyo: blocks of flats with lit windows, low houses, and the electric
// wires that cross every street.
function tokyoSkyline() {
  const blocks = [
    [0, 30, 34], [34, 14, 22], [58, 40, 30], [92, 22, 26], [122, 6, 34],
    [160, 34, 24], [188, 18, 30], [222, 28, 22], [248, 10, 38], [290, 36, 26], [320, 20, 40],
  ];
  let far = "";
  let windows = "";
  blocks.forEach(([x, y, w], i) => {
    far += `M${x} 90 V${y} H${x + w} V90 Z `;
    for (let wy = y + 6; wy < 62; wy += 8) {
      for (let wx = x + 4; wx < x + w - 4; wx += 7) {
        // a fixed pattern, so the same windows are always lit
        if ((wx * 7 + wy * 3 + i) % 5 === 0) windows += `M${wx} ${wy} h3 v4 h-3 Z `;
      }
    }
  });
  const houses =
    "M0 90 V72 L14 64 L28 72 V90 Z M40 90 V74 L56 66 L72 74 V90 Z M140 90 V70 L158 62 L176 70 V90 Z" +
    " M214 90 V73 L230 65 L246 73 V90 Z M300 90 V71 L318 63 L336 71 V90 Z M336 90 V76 H360 V90 Z";
  const poles = "M96 90 V34 M88 40 H104 M90 46 H102 M268 90 V30 M260 36 H276 M262 42 H274";
  const wires =
    "M0 44 Q48 58 88 40 M0 50 Q50 64 90 46 M104 40 Q182 62 260 36 M102 46 Q182 66 262 42 M276 36 Q320 50 360 40 M274 42 Q320 56 360 48";
  const vending = "M186 90 V72 H196 V90 Z";
  return `
<svg class="skyline" viewBox="0 0 360 90" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <path class="sky-far" d="${far}"/>
  <path class="sky-window" d="${windows}"/>
  <path class="sky-near" d="${houses}"/>
  <path class="sky-window glow" d="${vending}"/>
  <path class="sky-line thin" d="${wires}"/>
  <path class="sky-line" d="${poles}"/>
</svg>`;
}

const SKYLINES = { Rabat: rabatSkyline(), Tokyo: tokyoSkyline() };
