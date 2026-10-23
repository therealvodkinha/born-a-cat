// Cities a kitten can be born in. New York comes in a later update.
const CITIES = [
  { name: "Rabat", line: "Warm stones, the smell of the sea, and a hundred other cats." },
  { name: "Tokyo", line: "Neon lights, quiet alleys, and people who bow to cats." },
];

const home = document.getElementById("home");
const birth = document.getElementById("birth");
const cityName = document.getElementById("city-name");
const cityLine = document.getElementById("city-line");

function beBorn() {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  cityName.textContent = city.name;
  cityLine.textContent = city.line;
  home.classList.add("hidden");
  birth.classList.remove("hidden");
}

document.getElementById("born-btn").addEventListener("click", beBorn);
document.getElementById("again-btn").addEventListener("click", beBorn);
