// The name the cat gets at birth: a name people would really give a cat in
// its city, with what it means. Some names only go with one coat (a black
// cat called "Kuro", a calico called "Mike"), the others fit any cat.
// To add a city: add a block with "any" and, if you want, one list per coat
// (the coat ids are in COATS, art.js).

const NAMES = {
  Rabat: {
    any: [
      ["Mishmish", "It means “apricot” in Darija."],
      ["Sukkar", "It means “sugar”."],
      ["Zitouna", "It means “little olive”."],
      ["Louza", "It means “almond”."],
      ["Mchicha", "It means “kitty” in Darija. Not very original. Very loved."],
      ["Ziri", "An Amazigh name. It means “moonlight”."],
      ["Itri", "An Amazigh name. It means “star”."],
      ["Ghzala", "It means “gazelle”. In Darija, also “a real beauty”."],
      ["Simo", "Like half the boys in your street."],
    ],
    ginger: [["Zaafrane", "It means “saffron”, for your colour."]],
    black: [["Kahla", "It means “the black one”. Simple."]],
    white: [
      ["Talj", "It means “snow”."],
      ["Lben", "It means “buttermilk”, for your colour."],
    ],
    "grey tabby": [
      ["Nmer", "It means “tiger”. You are a little smaller."],
      ["Rmad", "It means “ash”, for your colour."],
    ],
    calico: [["Zerbiya", "It means “carpet”. Your coat has as many colours."]],
  },
  Tokyo: {
    any: [
      ["Tama", "The classic Japanese cat name. One famous Tama was a train station master."],
      ["Mochi", "Like the soft rice cake."],
      ["Momo", "It means “peach”."],
      ["Sora", "It means “sky”."],
      ["Kinako", "Like the sweet roasted soy powder."],
      ["Daifuku", "Like the round, stuffed rice cake. It also means “great luck”."],
      ["Azuki", "Like the sweet red beans."],
      ["Maru", "It means “round”. Like the famous cat who loved boxes."],
      ["Chibi", "It means “tiny”. You won’t stay tiny."],
    ],
    ginger: [
      ["Chatora", "It means “tea tiger”: the Japanese word for a ginger tabby."],
      ["Mikan", "It means “mandarin orange”, for your colour."],
    ],
    black: [
      ["Kuro", "It means “black”. Simple."],
      ["Sumi", "It means “ink”, for your colour."],
    ],
    white: [
      ["Shiro", "It means “white”. Simple."],
      ["Yuki", "It means “snow”."],
    ],
    "grey tabby": [
      ["Saba", "It means “mackerel”. In Japan, grey tabbies are “mackerel tigers”."],
      ["Tora", "It means “tiger”. You are a little smaller."],
    ],
    calico: [["Mike", "Say “mee-keh”. It is the Japanese word for a calico cat."]],
    tuxedo: [["Hachi", "From “hachiware”, the Japanese word for black-and-white cats."]],
  },
};

// A name for a cat of this city and coat: [name, meaning].
// One time in two, a name made for its coat, if there is one.
function nameFor(city, coat, rng = Math.random) {
  const names = NAMES[city] || { any: [["Kitty", "Nobody thought very hard about it."]] };
  const forCoat = names[coat] || [];
  if (forCoat.length && rng() < 0.5) return pick(forCoat, rng);
  return pick(names.any, rng);
}
