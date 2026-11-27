(function () {
  "use strict";

  const CG = (window.ConstructionGame = window.ConstructionGame || {});

  // MIDI note helper -> frequency in Hz
  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // 64-step (4 bars x 16 steps) upbeat country-rock "Truck Tunes" inspired groove in G Major
  // Chords: Bar 1 = G, Bar 2 = G, Bar 3 = C, Bar 4 = D -> G turnaround
  const BASS_PATTERN = [
    // Bar 1 (G): G2 . D3 . G2 . D3 . G2 . B2 . D3 . E3 .
    43, 0, 0, 0, 50, 0, 0, 0, 43, 0, 47, 0, 50, 0, 52, 0,
    // Bar 2 (G)
    43, 0, 0, 0, 50, 0, 0, 0, 43, 0, 47, 0, 50, 0, 47, 0,
    // Bar 3 (C): C3 . G2 . C3 . G2 . C3 . E3 . G3 . E3 .
    48, 0, 0, 0, 43, 0, 0, 0, 48, 0, 52, 0, 55, 0, 52, 0,
    // Bar 4 (D -> G): D3 . A2 . D3 . C3 . B2 . A2 . G2 . D2 .
    50, 0, 0, 0, 45, 0, 0, 0, 50, 0, 48, 0, 47, 0, 45, 0
  ];

  // Twangy off-beat country-rock guitar stabs (step indices with chord triads)
  const CHORD_G = [55, 59, 62]; // G3 B3 D4
  const CHORD_C = [60, 64, 67]; // C4 E4 G4
  const CHORD_D = [62, 66, 69]; // D4 F#4 A4

  // Catchy bouncy truck-song lead hook (64 steps)
  const MELODY_PATTERN = [
    // Bar 1 (G): "Can you name..." upbeat call
    67, 0, 71, 0, 74, 0, 76, 0, 74, 0, 71, 0, 67, 0, 0, 0,
    // Bar 2 (G): bouncy answer
    71, 0, 74, 0, 76, 0, 79, 0, 76, 0, 74, 0, 71, 0, 0, 0,
    // Bar 3 (C): bright lift
    72, 0, 76, 0, 79, 0, 76, 0, 72, 0, 74, 0, 76, 0, 0, 0,
    // Bar 4 (D): driving turnaround
    74, 0, 76, 0, 74, 0, 71, 0, 69, 0, 67, 0, 71, 0, 74, 0
  ];

  const FOREMAN_NATURAL_PREF = [
    "andrew", "guy", "christopher", "eric", "steffan", "brian", "roger", "davis", "tony", "brandon"
  ];
  const FOREMAN_FALLBACK_PREF = ["mark", "david", "daniel", "alex", "google us english", "male"];
  const ALEX_KID_PREF = ["ana", "maisie"];
  const ALEX_NATURAL_PREF = ["aria", "jenny", "emma", "ava", "sonia", "michelle", "zira"];
  const AMY_NATURAL_PREF = ["aria", "jenny", "emma", "ava", "clara", "sonia", "michelle", "samantha", "zira"];

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.noiseBuffer = null;

      this.soundEnabled = true;
      this.voiceEnabled = true;
      this.musicEnabled = true;
      this.musicVolume = 0.65;
      this.paradeBoost = false;

      this.musicTimer = null;
      this.nextStepTime = 0;
      this.stepIndex = 0;
      this.isDucked = false;
      this.duckTimer = null;

      this.voices = [];
      this.foremanVoiceURI = "";
      this.alexVoiceURI = "";
      this.amyVoiceURI = "";
      this.lastSpoken = "";
      this.lastSpeakTime = 0;

      this.initVoiceDiscovery();
    }

    initVoiceDiscovery() {
      if (!("speechSynthesis" in window)) return;
      const load = () => {
        try {
          const list = window.speechSynthesis.getVoices() || [];
          if (list.length > 0) {
            this.voices = list;
          }
        } catch (_) {}
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }

    getEnglishVoices() {
      if ((!this.voices || this.voices.length === 0) && "speechSynthesis" in window) {
        try {
          this.voices = window.speechSynthesis.getVoices() || [];
        } catch (_) {}
      }
      const en = this.voices.filter((v) => /^en/i.test(v.lang));
      return en.length > 0 ? en : this.voices;
    }

    pickVoice(persona) {
      const pool = this.getEnglishVoices();
      if (!pool || pool.length === 0) return null;

      const overrideURI =
        persona === "alex" ? this.alexVoiceURI : persona === "amy" ? this.amyVoiceURI : this.foremanVoiceURI;
      if (overrideURI) {
        const chosen = pool.find((v) => v.voiceURI === overrideURI);
        if (chosen) return chosen;
      }

      const prefs =
        persona === "alex"
          ? [...ALEX_KID_PREF, ...ALEX_NATURAL_PREF]
          : persona === "amy"
          ? AMY_NATURAL_PREF
          : [...FOREMAN_NATURAL_PREF, ...FOREMAN_FALLBACK_PREF];

      for (const kw of prefs) {
        const match = pool.find((v) => v.name.toLowerCase().includes(kw));
        if (match) return match;
      }
      return pool[0];
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.getTargetMusicGain();
        this.musicGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.soundEnabled ? 0.9 : 0;
        this.sfxGain.connect(this.ctx.destination);

        // Prebuild reusable noise buffer for percussion & dirt effects
        const len = Math.floor(this.ctx.sampleRate * 0.4);
        this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    getTargetMusicGain() {
      if (!this.musicEnabled) return 0;
      const base = 0.28 * this.musicVolume;
      return this.isDucked ? base * 0.28 : base;
    }

    updateMusicGainSmooth() {
      if (!this.ctx || !this.musicGain) return;
      this.musicGain.gain.setTargetAtTime(this.getTargetMusicGain(), this.ctx.currentTime, 0.08);
    }

    duckMusic(duck) {
      this.isDucked = duck;
      this.updateMusicGainSmooth();
    }

    unlockAndStartMusic() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      if (this.musicEnabled && !this.musicTimer) {
        this.startMusic();
      }
    }

    setSoundEnabled(enabled) {
      this.soundEnabled = Boolean(enabled);
      if (this.ctx && this.sfxGain) {
        this.sfxGain.gain.setTargetAtTime(this.soundEnabled ? 0.9 : 0, this.ctx.currentTime, 0.03);
      }
    }

    setVoiceEnabled(enabled) {
      this.voiceEnabled = Boolean(enabled);
      if (!this.voiceEnabled && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
        this.duckMusic(false);
      }
    }

    setMusicEnabled(enabled) {
      this.musicEnabled = Boolean(enabled);
      if (this.musicEnabled) {
        this.ensureContext();
        this.startMusic();
      } else {
        this.stopMusic();
      }
      this.updateMusicGainSmooth();
    }

    setMusicVolume(vol) {
      this.musicVolume = Math.max(0, Math.min(1, Number(vol)));
      this.updateMusicGainSmooth();
    }

    setParadeBoost(boost) {
      this.paradeBoost = Boolean(boost);
    }

    // =======================================================================
    // Truck-Tunes-Inspired Country-Rock Groove Sequencer
    // =======================================================================
    startMusic() {
      const ctx = this.ensureContext();
      if (!ctx || !this.musicEnabled) return;
      if (this.musicTimer) return;

      this.nextStepTime = ctx.currentTime + 0.06;
      this.updateMusicGainSmooth();
      this.musicTimer = setInterval(() => this.scheduleMusicAhead(), 35);
    }

    stopMusic() {
      if (this.musicTimer) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    }

    scheduleMusicAhead() {
      if (!this.ctx || !this.musicEnabled || this.ctx.state !== "running") return;
      const bpm = this.paradeBoost ? 136 : 124;
      const stepDur = 60 / bpm / 4; // 16th note duration

      while (this.nextStepTime < this.ctx.currentTime + 0.16) {
        this.triggerMusicStep(this.stepIndex, this.nextStepTime, stepDur);
        this.nextStepTime += stepDur;
        this.stepIndex = (this.stepIndex + 1) % 64;
      }
    }

    triggerMusicStep(step, time, stepDur) {
      const stepInBar = step % 16;

      // 1. Boom-chick stomp drums
      if (stepInBar === 0 || stepInBar === 8 || stepInBar === 14) {
        this.playMusicKick(time, stepInBar === 14 ? 0.55 : 1);
      }
      if (stepInBar === 4 || stepInBar === 12) {
        this.playMusicSnare(time);
      }
      if (stepInBar % 2 === 1) {
        this.playMusicHat(time, stepInBar % 4 === 2 ? 0.14 : 0.08);
      }

      // 2. Walking Truckin' Bass
      const bassMidi = BASS_PATTERN[step];
      if (bassMidi > 0) {
        this.playMusicBass(midiToFreq(bassMidi), time, stepDur * 1.9);
      }

      // 3. Twangy Honky-Tonk Guitar / Piano offbeat stabs (on "&" of every beat)
      if (stepInBar === 2 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
        let triad = CHORD_G;
        if (step >= 32 && step < 48) triad = CHORD_C;
        else if (step >= 48 && step < 58) triad = CHORD_D;
        this.playMusicChordStab(triad, time, stepDur * 0.9);
      }

      // 4. Bouncy Truck-Song Melody Riff
      const leadMidi = MELODY_PATTERN[step];
      if (leadMidi > 0) {
        this.playMusicLead(midiToFreq(leadMidi), time, stepDur * 1.65);
      }
    }

    playMusicKick(time, mult = 1) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(128, time);
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.11);
      gain.gain.setValueAtTime(0.45 * mult, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.13);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + 0.14);
    }

    playMusicSnare(time) {
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1150;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      src.start(time);
      src.stop(time + 0.1);
    }

    playMusicHat(time, vol = 0.08) {
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 5200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      src.start(time);
      src.stop(time + 0.045);
    }

    playMusicBass(freq, time, dur) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, time);
      filter.type = "lowpass";
      filter.frequency.value = 460;

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.32, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + dur + 0.02);
    }

    playMusicChordStab(triad, time, dur) {
      const ctx = this.ctx;
      triad.forEach((midi) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(midiToFreq(midi), time);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2200, time);
        filter.frequency.exponentialRampToValueAtTime(700, time + dur);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.075, time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + dur + 0.02);
      });
    }

    playMusicLead(freq, time, dur) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq * 0.96, time);
      osc.frequency.exponentialRampToValueAtTime(freq, time + 0.022);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.16, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + dur + 0.02);
    }

    // =======================================================================
    // Tactile Sound Effects (SFX)
    // =======================================================================
    playTone(freq, duration, type = "sine", volume = 0.16, delay = 0, slideTo = null) {
      if (!this.soundEnabled) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      if (slideTo !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(25, slideTo), start + duration);
      }

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    }

    playNoiseBurst(duration = 0.16, filterFreq = 800, volume = 0.14, delay = 0) {
      if (!this.soundEnabled) return;
      const ctx = this.ensureContext();
      if (!ctx || !this.noiseBuffer) return;

      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = filterFreq;
      filter.Q.value = 1.1;

      const gain = ctx.createGain();
      const start = ctx.currentTime + delay;
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      src.start(start);
      src.stop(start + duration + 0.02);
    }

    playDig() {
      this.playTone(130, 0.16, "sawtooth", 0.08, 0, 220);
      this.playNoiseBurst(0.18, 620, 0.18, 0.08);
      this.playNoiseBurst(0.14, 1100, 0.12, 0.16);
      this.playTone(380, 0.11, "triangle", 0.14, 0.24, 640);
    }

    playBlockPick() {
      this.playTone(480, 0.08, "triangle", 0.13, 0, 620);
    }

    playCountNote(stepNum) {
      // Rising G major marimba scale for tap-to-count boxes
      const scale = [392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99, 880.0, 987.77];
      const freq = scale[(Math.max(1, stepNum) - 1) % scale.length];
      this.playTone(freq, 0.18, "sine", 0.2, 0);
      this.playTone(freq * 2, 0.08, "triangle", 0.06, 0);
    }

    playAlexChirp() {
      // Happy kiddie cartoon chirp before Alex talks
      this.playTone(540, 0.08, "triangle", 0.12, 0, 790);
      this.playTone(790, 0.1, "triangle", 0.12, 0.08, 960);
    }

    playRivetSnap() {
      this.playNoiseBurst(0.05, 1900, 0.12, 0);
      this.playNoiseBurst(0.05, 2200, 0.12, 0.07);
      this.playTone(523.25, 0.16, "triangle", 0.16, 0.12);
      this.playTone(659.25, 0.18, "triangle", 0.16, 0.2);
      this.playTone(783.99, 0.24, "triangle", 0.18, 0.28);
      this.playTone(1046.5, 0.34, "sine", 0.16, 0.36);
    }

    playWrongTry() {
      this.playTone(300, 0.16, "sine", 0.15, 0, 190);
      this.playTone(230, 0.18, "triangle", 0.12, 0.12, 165);
    }

    playTreasure() {
      const notes = [587.33, 739.99, 880, 1174.66, 1479.98];
      notes.forEach((n, idx) => {
        this.playTone(n, 0.22, "sine", 0.14, idx * 0.065);
      });
    }

    playPush() {
      this.playTone(95, 0.28, "sawtooth", 0.1, 0, 65);
      this.playNoiseBurst(0.28, 420, 0.16, 0.04);
    }

    playGrade() {
      this.playNoiseBurst(0.32, 950, 0.13, 0);
      this.playTone(330, 0.12, "triangle", 0.11, 0.05, 440);
      this.playTone(440, 0.16, "triangle", 0.11, 0.16, 554);
    }

    playHorn(truck = "alexander") {
      if (truck === "alexander") {
        this.playTone(245, 0.15, "sawtooth", 0.11, 0);
        this.playTone(310, 0.15, "triangle", 0.1, 0);
        this.playTone(245, 0.22, "sawtooth", 0.11, 0.19);
        this.playTone(310, 0.22, "triangle", 0.1, 0.19);
      } else if (truck === "danny") {
        this.playTone(145, 0.28, "sawtooth", 0.13, 0, 138);
        this.playTone(185, 0.28, "sawtooth", 0.09, 0, 178);
      } else if (truck === "scotty") {
        this.playTone(620, 0.09, "square", 0.07, 0, 720);
        this.playTone(760, 0.12, "square", 0.07, 0.12, 880);
      } else if (truck === "greta") {
        this.playTone(440, 0.12, "triangle", 0.13, 0);
        this.playTone(554.37, 0.16, "triangle", 0.13, 0.13);
        this.playTone(659.25, 0.2, "triangle", 0.13, 0.26);
      } else if (truck === "amy") {
        this.playWhistle();
      }
    }

    playWhistle() {
      this.playTone(1046.5, 0.09, "sine", 0.13, 0, 1280);
      this.playTone(1318.5, 0.14, "sine", 0.12, 0.11, 1480);
    }

    playDogBark() {
      this.playTone(460, 0.09, "triangle", 0.17, 0, 690);
      this.playNoiseBurst(0.05, 1300, 0.1, 0.01);
      this.playTone(520, 0.11, "triangle", 0.17, 0.13, 760);
      this.playNoiseBurst(0.05, 1400, 0.1, 0.14);
    }

    playKeyEarned() {
      const notes = [659.25, 783.99, 987.77, 1318.5];
      notes.forEach((f, idx) => this.playTone(f, 0.19, "triangle", 0.16, idx * 0.07));
    }

    playChestLocked() {
      this.playTone(190, 0.1, "square", 0.08, 0, 160);
      this.playTone(165, 0.12, "square", 0.08, 0.11, 140);
    }

    playChestOpen() {
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
      chord.forEach((f, idx) => this.playTone(f, 0.34, "sine", 0.15, idx * 0.07));
    }

    playFanfare() {
      const melody = [
        [523.25, 0.14, 0],
        [659.25, 0.14, 0.13],
        [783.99, 0.14, 0.26],
        [1046.5, 0.28, 0.4],
        [783.99, 0.14, 0.68],
        [1046.5, 0.45, 0.82]
      ];
      melody.forEach(([freq, dur, delay]) => {
        this.playTone(freq, dur, "triangle", 0.17, delay);
        this.playTone(freq * 0.5, dur, "sine", 0.09, delay);
      });
    }

    // =======================================================================
    // Natural Character Speech (Blue-Collar Foreman & Kiddie Alexander)
    // =======================================================================
    speak(text, opts = {}) {
      if (!this.voiceEnabled || !("speechSynthesis" in window)) return;
      const persona = typeof opts === "string" ? "foreman" : opts.persona || "foreman";
      const priority = typeof opts === "boolean" ? opts : Boolean(opts.priority);

      const now = Date.now();
      if (!priority && text === this.lastSpoken && now - this.lastSpeakTime < 1800) {
        return;
      }
      this.lastSpoken = text;
      this.lastSpeakTime = now;

      if (persona === "alex") {
        this.playAlexChirp();
      }

      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const chosen = this.pickVoice(persona);
        const isNatural = chosen && /natural|online|neural/i.test(chosen.name);

        if (chosen) {
          utter.voice = chosen;
        }

        if (persona === "alex") {
          const isChildVoice = chosen && /\b(ana|maisie)\b/i.test(chosen.name);
          utter.rate = 1.07;
          utter.pitch = isChildVoice ? 1.1 : isNatural ? 1.28 : 1.45;
          utter.volume = 0.95;
        } else if (persona === "amy") {
          utter.rate = 1.0;
          utter.pitch = isNatural ? 1.04 : 1.14;
          utter.volume = 0.95;
        } else {
          // Warm blue-collar construction guy cadence
          utter.rate = isNatural ? 0.96 : 0.93;
          utter.pitch = isNatural ? 0.94 : 0.84;
          utter.volume = 0.95;
        }

        this.duckMusic(true);
        clearTimeout(this.duckTimer);
        this.duckTimer = setTimeout(() => this.duckMusic(false), 6000);

        utter.onend = () => {
          clearTimeout(this.duckTimer);
          this.duckMusic(false);
        };
        utter.onerror = () => {
          clearTimeout(this.duckTimer);
          this.duckMusic(false);
        };

        window.speechSynthesis.speak(utter);
      } catch (_) {
        this.duckMusic(false);
      }
    }
  }

  CG.audio = new SoundEngine();
})();
