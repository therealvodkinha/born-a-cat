// Sounds and music.
// Real recordings go in the sounds/ folder and are listed in FILES below.
// A sound with a file uses the file (one of them at random if there are
// several). A sound without a file is made in the browser (Web Audio API),
// except the meow and the music: made-up ones sounded wrong, so without a
// file they stay silent.
//
//   SOUND.play("meow")   plays one sound (see SFX below)
//   SOUND.music("Rabat") starts the background music of a city
//   SOUND.mood("night")  slows the music down ("day" brings it back)
//   SOUND.toggle()       mutes or unmutes; the choice is remembered
//
// Browsers only allow sound after the player taps something, so nothing
// plays before the first tap.

const SOUND = (() => {
  let ctx = null;
  let master, sfxBus;
  let muted = false;
  try {
    muted = localStorage.getItem("born-a-cat:muted") === "1";
  } catch (e) {}

  // Recordings. Paths are relative to index.html. Leave a list empty to
  // use the made-up sound instead.
  const FILES = {
    meow: [],
    purr: [],
    hiss: [],
  };
  const MUSIC = {
    Rabat: "",
    Tokyo: "",
  };

  let size = 1; // how big the cat is (0.5 = newborn, 1 = adult): small cats meow higher

  function init() {
    if (ctx) return ctx.state === "suspended" ? ctx.resume() : null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.7;
    sfxBus.connect(master);
  }

  // white noise, made once
  let noiseBuffer = null;
  function noise() {
    if (!noiseBuffer) {
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuffer.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    return src;
  }

  // a gain that rises, holds, and fades
  function envelope(t, attack, hold, release, peak = 1) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.setValueAtTime(peak, t + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
    return g;
  }

  function tone(freq, t, dur, type = "sine", peak = 0.3, out = sfxBus) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = envelope(t, 0.01, 0, dur, peak);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
  }

  // ------------------------------------------------------------
  // The sounds
  // ------------------------------------------------------------
  const SFX = {
    // a soft tap of paper, for every button
    click(t) {
      const n = noise();
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 2400;
      f.Q.value = 1.5;
      n.connect(f).connect(envelope(t, 0.002, 0, 0.05, 0.35)).connect(sfxBus);
      n.start(t);
      n.stop(t + 0.08);
    },

    // a purr: low rumbling noise, pulsing about 25 times a second
    purr(t) {
      const n = noise();
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 220;
      const pulse = ctx.createGain();
      pulse.gain.value = 0.5;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 25;
      const depth = ctx.createGain();
      depth.gain.value = 0.5;
      lfo.connect(depth).connect(pulse.gain);
      n.connect(f).connect(pulse).connect(envelope(t, 0.3, 0.9, 0.6, 1.6)).connect(sfxBus);
      n.start(t);
      lfo.start(t);
      n.stop(t + 2);
      lfo.stop(t + 2);
    },

    // a hiss: high noise, fast in, slow out
    hiss(t) {
      const n = noise();
      const f = ctx.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 3000;
      n.connect(f).connect(envelope(t, 0.04, 0.35, 0.35, 0.28)).connect(sfxBus);
      n.start(t);
      n.stop(t + 0.9);
    },

    // something went well: two notes going up
    good(t) {
      tone(660, t, 0.25, "triangle", 0.18);
      tone(990, t + 0.09, 0.4, "triangle", 0.16);
    },

    // something went badly: two notes going down
    bad(t) {
      tone(330, t, 0.3, "triangle", 0.16);
      tone(247, t + 0.12, 0.45, "triangle", 0.15);
    },

    // hurt: a dull thud
    hit(t) {
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
      o.connect(envelope(t, 0.005, 0.02, 0.3, 0.7)).connect(sfxBus);
      o.start(t);
      o.stop(t + 0.4);
      const n = noise();
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 700;
      n.connect(f).connect(envelope(t, 0.002, 0, 0.12, 0.4)).connect(sfxBus);
      n.start(t);
      n.stop(t + 0.2);
    },

    // little paw steps while the cat walks across the screen
    steps(t) {
      for (let i = 0; i < 8; i++) {
        const n = noise();
        const f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = 500;
        n.connect(f).connect(envelope(t + i * 0.3, 0.004, 0, 0.06, 0.18)).connect(sfxBus);
        n.start(t + i * 0.3);
        n.stop(t + i * 0.3 + 0.1);
      }
    },

    // a new chapter of life: a small bell
    chapter(t) {
      tone(784, t, 1.2, "sine", 0.15);
      tone(1568, t, 0.8, "sine", 0.05);
    },

    // a gesture done perfectly: a quick sparkle
    perfect(t) {
      [880, 1109, 1319, 1760].forEach((f, i) => tone(f, t + i * 0.06, 0.25, "triangle", 0.1));
    },

    // a heart, a new mark won
    pop(t) {
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(500, t);
      o.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
      o.connect(envelope(t, 0.005, 0, 0.1, 0.2)).connect(sfxBus);
      o.start(t);
      o.stop(t + 0.15);
    },

    // the end of a life: one low, long bell
    farewell(t) {
      tone(262, t, 3.5, "sine", 0.18);
      tone(392, t + 0.02, 3, "sine", 0.08);
      tone(524, t + 0.04, 2.5, "sine", 0.04);
    },

    // a rare ending: a bright run of notes
    rare(t) {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, t + i * 0.08, 0.6, "triangle", 0.09));
    },
  };

  // recordings, loaded once each
  const buffers = {};
  function load(path) {
    if (!buffers[path]) {
      buffers[path] = fetch(path)
        .then((r) => r.arrayBuffer())
        .then((data) => new Promise((ok, fail) => ctx.decodeAudioData(data, ok, fail)))
        .catch(() => null);
    }
    return buffers[path];
  }

  function play(name, delay = 0) {
    if (muted) return;
    init();
    if (!ctx) return;
    const files = FILES[name] || [];
    if (files.length) {
      const path = files[Math.floor(Math.random() * files.length)];
      const at = ctx.currentTime + delay;
      load(path).then((buffer) => {
        if (!buffer) return;
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        // small cats sound a little higher
        if (name === "meow") src.playbackRate.value = 1 + Math.max(0, 1 - size) * 0.5;
        src.connect(sfxBus);
        src.start(Math.max(at, ctx.currentTime));
      });
      return;
    }
    if (SFX[name]) SFX[name](ctx.currentTime + delay);
  }

  // ------------------------------------------------------------
  // Music: one recording per city, looping softly (see MUSIC above).
  // ------------------------------------------------------------
  const track = new Audio();
  track.loop = true;
  let level = 0.35;

  function music(city) {
    const path = MUSIC[city];
    if (!path) {
      track.pause();
      return;
    }
    if (!track.src.endsWith(path)) track.src = path;
    track.volume = muted ? 0 : level;
    track.play().catch(() => {});
  }

  // "night": quieter, for the end of a life
  function mood(name) {
    level = name === "night" ? 0.15 : 0.35;
    if (!muted) track.volume = level;
  }

  function toggle() {
    muted = !muted;
    try {
      localStorage.setItem("born-a-cat:muted", muted ? "1" : "0");
    } catch (e) {}
    init();
    if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
    track.volume = muted ? 0 : level;
    return muted;
  }

  return {
    play,
    music,
    mood,
    toggle,
    unlock: init,
    get muted() {
      return muted;
    },
    set size(v) {
      size = v;
    },
  };
})();
