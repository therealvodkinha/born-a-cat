// Sounds and music. Everything is made in the browser with the Web Audio API:
// no sound files to download, and no licences to worry about.
// These are placeholders until real recordings arrive: to use a recording,
// load it in play() instead of building the sound.
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
  let master, sfxBus, musicBus, echo;
  let muted = false;
  try {
    muted = localStorage.getItem("born-a-cat:muted") === "1";
  } catch (e) {}

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
    musicBus = ctx.createGain();
    musicBus.gain.value = 0.22;
    musicBus.connect(master);
    // a soft echo for the music, so plucked notes ring in a room
    echo = ctx.createDelay(1);
    echo.delayTime.value = 0.32;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 1800;
    echo.connect(tone).connect(feedback).connect(echo);
    tone.connect(musicBus);
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

    // a meow: a buzzing voice whose pitch rises then falls, shaped by two
    // filters that move like a mouth going "mi-a-ow"
    meow(t) {
      const base = 520 / Math.max(0.55, size);
      const dur = 0.6;
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(base * 0.85, t);
      o.frequency.linearRampToValueAtTime(base * 1.2, t + 0.16);
      o.frequency.exponentialRampToValueAtTime(base * 0.72, t + dur);
      const out = envelope(t, 0.05, 0.3, 0.25, 0.5);
      for (const [a, b, c, q] of [
        [600, 1100, 500, 7],
        [2300, 1700, 950, 9],
      ]) {
        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.Q.value = q;
        f.frequency.setValueAtTime(a, t);
        f.frequency.linearRampToValueAtTime(b, t + 0.2);
        f.frequency.linearRampToValueAtTime(c, t + dur);
        o.connect(f).connect(out);
      }
      out.connect(sfxBus);
      o.start(t);
      o.stop(t + dur + 0.1);
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

  function play(name, delay = 0) {
    if (muted) return;
    init();
    if (!ctx || !SFX[name]) return;
    SFX[name](ctx.currentTime + delay);
  }

  // ------------------------------------------------------------
  // Music: plucked notes drawn at random from the scale of the city,
  // over a quiet low note. Never the same twice, never really loud.
  // ------------------------------------------------------------
  const SONGS = {
    // a maqam Hijaz on D, plucked like an oud
    Rabat: { drone: 73.4, notes: [293.7, 311.1, 370, 392, 440, 466.2, 523.3, 587.3], wave: "sawtooth", cutoff: 1400, gap: [0.35, 0.9] },
    // the in scale, plucked like a koto
    Tokyo: { drone: 82.4, notes: [329.6, 349.2, 440, 493.9, 523.3, 659.3, 698.5], wave: "triangle", cutoff: 3000, gap: [0.6, 1.6] },
  };
  let song = null;
  let timer = null;
  let droneOsc = null;
  let slow = 1;

  function pluck(freq, t) {
    const o = ctx.createOscillator();
    o.type = song.wave;
    o.frequency.value = freq;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(song.cutoff, t);
    f.frequency.exponentialRampToValueAtTime(300, t + 0.8);
    const g = envelope(t, 0.005, 0, 1.1, 0.25);
    o.connect(f).connect(g);
    g.connect(musicBus);
    g.connect(echo);
    o.start(t);
    o.stop(t + 1.3);
  }

  function nextNote() {
    if (!song || !ctx) return;
    // mostly small steps up or down the scale, sometimes a jump
    const i = nextNote.i ?? 0;
    const step = Math.random() < 0.8 ? (Math.random() < 0.5 ? -1 : 1) : Math.floor(Math.random() * 5) - 2;
    nextNote.i = Math.max(0, Math.min(song.notes.length - 1, i + step));
    pluck(song.notes[nextNote.i], ctx.currentTime + 0.02);
    const [a, b] = song.gap;
    timer = setTimeout(nextNote, (a + Math.random() * (b - a)) * 1000 * slow);
  }

  function music(city) {
    init();
    if (!ctx) return;
    stopMusic();
    song = SONGS[city];
    if (!song) return;
    droneOsc = ctx.createOscillator();
    droneOsc.frequency.value = song.drone;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
    droneOsc.connect(g).connect(musicBus);
    droneOsc.start();
    nextNote();
  }

  function stopMusic() {
    clearTimeout(timer);
    if (droneOsc) droneOsc.stop();
    droneOsc = null;
    song = null;
  }

  // "night": slower and quieter, for the end of a life
  function mood(name) {
    slow = name === "night" ? 2.6 : 1;
    if (musicBus) musicBus.gain.setTargetAtTime(name === "night" ? 0.12 : 0.22, ctx.currentTime, 1);
  }

  function toggle() {
    muted = !muted;
    try {
      localStorage.setItem("born-a-cat:muted", muted ? "1" : "0");
    } catch (e) {}
    init();
    if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
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
