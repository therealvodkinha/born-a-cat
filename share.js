// The picture you can share at the end: a tall card (story format,
// 1080 × 1920) with the cat, its name, its ending and a link to the game.
// It is drawn in a <canvas> from what is on screen, so it always has the
// right city colours, coat, and the marks the cat collected.

const GAME_URL = "https://therealvodkinha.github.io/born-a-cat/";
const CARD_W = 1080;
const CARD_H = 1920;

// The SVG drawings are coloured by the CSS. To turn one into a picture, each
// shape gets its final colours written on it, and hidden shapes are removed.
const PAINT = ["fill", "fill-opacity", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-opacity", "opacity"];

function svgPicture(svg, width, height, extra) {
  const copy = svg.cloneNode(true);
  const from = [svg, ...svg.querySelectorAll("*")];
  const to = [copy, ...copy.querySelectorAll("*")];
  from.forEach((el, n) => {
    const style = getComputedStyle(el);
    if (style.display === "none") return to[n].remove();
    for (const p of PAINT) to[n].setAttribute(p, style.getPropertyValue(p));
  });
  if (extra) extra(copy); // classes are kept for this: a picture ignores the page's CSS
  copy.setAttribute("width", width);
  copy.setAttribute("height", height);
  copy.removeAttribute("style");
  const text = new XMLSerializer().serializeToString(copy);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(text);
  });
}

// The poses the CSS gives the cat, which are lost outside the page.
function catPose(copy) {
  const mood = document.body.dataset.mood;
  const fat = parseFloat(getComputedStyle(document.body).getPropertyValue("--fat")) || 1;
  const body = copy.querySelector(":scope > .body");
  if (body) body.setAttribute("transform", `translate(60 108) scale(${fat} 1) translate(-60 -108)`);
  const head = copy.querySelector(".cat-head");
  if (head && mood === "asleep") head.setAttribute("transform", "rotate(4 58 60)");
  const tail = copy.querySelector(".cat-tail");
  if (tail && mood === "sad") tail.setAttribute("transform", "rotate(14 80 104)");
}

// Writes text on several lines so it fits in "width". Returns the y after it.
// With "dry", nothing is written: it only measures.
function wrapText(ctx, text, x, y, width, lineHeight, dry) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > width && line) {
      if (!dry) ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else line = test;
  }
  if (!dry) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
}

// A little stamp with a word in it, like the ones in the game.
function stamp(ctx, text, x, y, color, filled) {
  const w = ctx.measureText(text).width + 56;
  roundRect(ctx, x - w / 2, y - 40, w, 64, 10);
  if (filled) {
    ctx.fillStyle = filled;
    ctx.fill();
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(text, x, y + 2);
  return w;
}

// Draws the card and gives it back as a PNG file.
// "card" holds what to write: name, city, title, rarity, odds, lived, marks.
async function drawShareCard(card) {
  const css = getComputedStyle(document.body);
  const color = (name) => css.getPropertyValue(name).trim();
  const ink = color("--ink");
  const muted = color("--muted");
  const accent = color("--accent");
  const gold = "#f0bf3c";
  const special = card.rarity === "rare" || card.rarity === "legendary";

  // the fonts must be loaded before the canvas can use them
  await Promise.all(
    ["700 120px Fraunces", "600 60px Fraunces", "italic 400 40px Literata", "400 40px Literata"].map((f) =>
      document.fonts.load(f).catch(() => {})
    )
  );

  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // background, then the card itself, with its printed shadow
  ctx.fillStyle = color("--bg");
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  const x0 = 70, y0 = 90, w = CARD_W - 140, h = CARD_H - 200;
  roundRect(ctx, x0 + 18, y0 + 18, w, h, 24);
  ctx.fillStyle = ink;
  ctx.fill();
  roundRect(ctx, x0, y0, w, h, 24);
  ctx.fillStyle = color("--card");
  ctx.fill();
  if (special) {
    const glow = ctx.createRadialGradient(540, 620, 40, 540, 620, 620);
    glow.addColorStop(0, "rgba(255, 220, 130, 0.55)");
    glow.addColorStop(1, "rgba(255, 220, 130, 0)");
    ctx.fillStyle = glow;
    ctx.fill();
    ctx.lineWidth = 22;
    ctx.strokeStyle = gold;
    ctx.stroke();
  }
  ctx.lineWidth = 6;
  ctx.strokeStyle = ink;
  ctx.stroke();

  // keep the drawing inside the card
  ctx.save();
  roundRect(ctx, x0, y0, w, h, 24);
  ctx.clip();

  // top: the name of the game, and the rarity
  ctx.font = "600 38px Fraunces";
  ctx.fillStyle = muted;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "10px";
  ctx.fillText("BORN A CAT", 540, y0 + 100);
  ctx.font = "700 34px Fraunces";
  const label = { common: "ENDING", uncommon: "UNCOMMON ENDING", rare: "★ RARE ENDING ★", legendary: "★ LEGENDARY ENDING ★" }[card.rarity];
  if (special) stamp(ctx, label, 540, y0 + 190, "#2a211c", gold);
  else {
    ctx.fillStyle = muted;
    ctx.fillText(label, 540, y0 + 190);
  }
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

  // the scene: the sun or moon, the city, and the cat in front
  const sceneBottom = 930;
  ctx.beginPath();
  ctx.arc(540, 640, 250, 0, Math.PI * 2);
  ctx.fillStyle = color("--disc");
  ctx.fill();
  const skyline = document.querySelector("#horizon svg");
  if (skyline) {
    const img = await svgPicture(skyline, w, w / 4);
    ctx.drawImage(img, x0, sceneBottom - w / 4 + 10);
  }
  const cat = document.querySelector("#end-card .cat");
  if (cat) {
    const size = parseFloat(css.getPropertyValue("--size")) || 1;
    const side = 560 * Math.max(0.55, size);
    const img = await svgPicture(cat, side, side, catPose);
    if (document.body.dataset.cond === "weak") ctx.filter = "saturate(0.35)";
    ctx.drawImage(img, 540 - side / 2, sceneBottom - side * 0.93);
    ctx.filter = "none";
  }

  // the name, the city, the ending, and what the cat collected in its
  // life as stamps. Measured once ("dry"), then written in the middle of
  // the space left between the scene and the bottom line.
  const good = color("--good");
  const marks = card.marks.slice(0, 4).map((m) => ({ text: (m.good ? "+ " : "") + m.label, color: m.good ? good : muted }));
  const words = (y, dry) => {
    y += 96;
    ctx.fillStyle = ink;
    ctx.font = "700 120px Fraunces";
    if (!dry) ctx.fillText(card.name, 540, y);
    y += 66;
    ctx.font = "italic 400 44px Literata";
    ctx.fillStyle = muted;
    if (!dry) ctx.fillText("born in " + card.city, 540, y);

    y += 120;
    ctx.font = "600 66px Fraunces";
    ctx.fillStyle = special ? accent : ink;
    y = wrapText(ctx, "“" + card.title + "”", 540, y, w - 120, 78, dry);

    ctx.font = "400 40px Literata";
    ctx.fillStyle = special ? ink : muted;
    if (card.odds) y = wrapText(ctx, card.odds, 540, y + 10, w - 140, 54, dry);
    ctx.fillStyle = muted;
    y = wrapText(ctx, card.lived, 540, y + 6, w - 140, 54, dry);

    // the stamps, in centred rows
    ctx.font = "700 32px Fraunces";
    const gap = 22;
    const rows = [];
    for (const m of marks) {
      m.w = ctx.measureText(m.text).width + 56;
      const row = rows[rows.length - 1];
      if (row && row.width + gap + m.w <= w - 100) {
        row.items.push(m);
        row.width += gap + m.w;
      } else rows.push({ items: [m], width: m.w });
    }
    for (const row of rows) {
      y += 84;
      let x = 540 - row.width / 2;
      for (const m of row.items) {
        if (!dry) stamp(ctx, m.text, x + m.w / 2, y - 14, m.color);
        x += m.w + gap;
      }
    }
    return y;
  };
  const height = words(0, true);
  words(sceneBottom + Math.max(16, (1620 - sceneBottom - height) / 2), false);

  // bottom: the invitation and the link
  ctx.setLineDash([16, 12]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = muted;
  ctx.beginPath();
  ctx.moveTo(x0 + 70, 1640);
  ctx.lineTo(x0 + w - 70, 1640);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = "600 52px Fraunces";
  ctx.fillStyle = ink;
  ctx.fillText("What cat would you be?", 540, 1725);
  ctx.font = "600 34px Fraunces";
  ctx.fillStyle = accent;
  ctx.fillText(GAME_URL.replace("https://", "").replace(/\/$/, ""), 540, 1785);
  ctx.restore();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return new File([blob], `born-a-cat-${card.name.toLowerCase()}.png`, { type: "image/png" });
}

// Opens the phone's share menu with the picture. Where that isn't possible
// (most computers), the picture is downloaded and the link copied.
// Returns a short line to show under the button.
async function shareCard(card) {
  const file = await drawShareCard(card);
  const text = `I was born a cat in ${card.city}. They called me ${card.name}. My ending: “${card.title}”. What cat would you be? ${GAME_URL}`;
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "";
    } catch (e) {
      if (e.name === "AbortError") return "";
      // some browsers say yes, then fail: fall back to the download
    }
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 10000);
  try {
    await navigator.clipboard.writeText(text);
    return "Picture saved. The link to the game is copied too.";
  } catch (e) {
    return "Picture saved.";
  }
}
