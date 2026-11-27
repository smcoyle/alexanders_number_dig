(function () {
  "use strict";

  const CG = (window.ConstructionGame = window.ConstructionGame || {});

  const STORAGE_KEY = "alexanders_math_dig_save_v2";
  const KEY_STREAK_TARGET = 3;

  const ALEX_DIG_LINES = [
    "Whoa! Look!",
    "Gee! Cooool!",
    "Wow! Diggy dig!",
    "Super awesome!",
    "Ooh! What's this?"
  ];

  const ALEX_TAP_LINES = [
    "Gee! Cooool! Tap a dirt pile!",
    "Whoa! I'm ready to dig!",
    "Hehe! Let's find numbers!",
    "Wow! Look at us go!"
  ];

  const COUNT_WORDS = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
  ];

  const state = {
    mode: "age5", // age5 | foreman | master | sandbox
    opMode: "mix", // mix | add | sub
    activeHero: "alexander", // alexander | danny | scotty | greta
    projectId: "bridge",
    stage: 0,
    gears: 0,
    streak: 0,
    keyStreak: 0,
    hasMagicKey: false,
    chestFound: false,
    paint: "yellow",
    hat: "bluecap",
    unlockedPaints: ["yellow"],
    unlockedHats: ["bluecap"],
    unlockedTreasures: [],
    completedProjects: [],
    problemIndex: 0,
    problem: null,
    countedMax: 0,
    sandbox: { left: null, right: null },
    mounds: [],
    scottyBonusUsed: false,
    busy: false,
    drag: null,
    miniGame: { depth: 1, solved: 0, phase: "dig", answer: 1, mounds: [1, 2] }
  };

  const els = {};

  function cacheDOM() {
    const ids = [
      "brand-hero-emoji", "brand-hero-title",
      "stat-gears", "stat-stars", "key-chip", "stat-key", "stat-streak", "streak-chip", "treasure-badge",
      "btn-title-honk", "btn-music", "btn-projects", "btn-garage", "btn-treasures", "btn-settings",
      "project-badge", "project-title", "stage-dots", "project-svg-host", "crane-delivery-overlay",
      "engineering-fact-text", "amy-foreman-btn", "amy-svg-slot", "blueprint-subtitle",
      "btn-read-problem", "equation-row", "comparator-hint-label", "comparator-unit-badge",
      "beam-track-area", "blueprint-feedback", "crew-lanes",
      "dig-ground", "mounds-grid", "alexander-actor", "alexander-bubble", "alexander-svg-host",
      "alexander-held-block", "chest-pedestal-btn", "chest-pedestal-svg", "chest-pedestal-label",
      "roaming-fx-layer", "particle-layer", "sandbox-controls", "btn-sandbox-grade", "btn-sandbox-clear",
      "drag-ghost", "chest-modal", "chest-modal-sub", "inception-depth", "mini-stage-text",
      "mini-eq-text", "mini-feedback", "mini-yard",
      "settings-modal", "btn-setting-music", "btn-setting-sound", "btn-setting-voice",
      "music-volume-slider", "music-volume-val", "select-amy-voice", "select-foreman-voice", "select-alex-voice",
      "btn-test-amy", "btn-test-foreman", "btn-test-alex",
      "celebration-modal", "celeb-title", "celeb-subtitle", "celeb-scene", "celeb-parade-trucks",
      "btn-next-project", "btn-replay-project",
      "projects-modal", "projects-list", "garage-modal", "garage-driver-bar", "garage-preview-svg",
      "garage-gears-count", "garage-paints", "garage-hats", "treasures-modal", "treasures-grid",
      "treasure-toast", "treasure-toast-emoji", "treasure-toast-title", "treasure-toast-desc"
    ];
    ids.forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.gears === "number") state.gears = saved.gears;
      if (typeof saved.keyStreak === "number") state.keyStreak = saved.keyStreak;
      if (typeof saved.hasMagicKey === "boolean") state.hasMagicKey = saved.hasMagicKey;
      if (Array.isArray(saved.unlockedPaints)) state.unlockedPaints = saved.unlockedPaints;
      if (Array.isArray(saved.unlockedHats)) state.unlockedHats = saved.unlockedHats;
      if (Array.isArray(saved.unlockedTreasures)) state.unlockedTreasures = saved.unlockedTreasures;
      if (Array.isArray(saved.completedProjects)) state.completedProjects = saved.completedProjects;
      if (saved.paint) state.paint = saved.paint;
      if (saved.hat) state.hat = saved.hat;
      if (saved.projectId) state.projectId = saved.projectId;
      if (saved.activeHero && ["alexander", "danny", "scotty", "greta"].includes(saved.activeHero)) {
        state.activeHero = saved.activeHero;
      }
      if (saved.opMode && ["mix", "add", "sub"].includes(saved.opMode)) {
        state.opMode = saved.opMode;
      }
      if (saved.mode && ["age5", "foreman", "master", "sandbox"].includes(saved.mode)) {
        state.mode = saved.mode;
      }
      if (typeof saved.musicEnabled === "boolean") CG.audio.setMusicEnabled(saved.musicEnabled);
      if (typeof saved.soundEnabled === "boolean") CG.audio.setSoundEnabled(saved.soundEnabled);
      if (typeof saved.voiceEnabled === "boolean") CG.audio.setVoiceEnabled(saved.voiceEnabled);
      if (typeof saved.musicVolume === "number") CG.audio.setMusicVolume(saved.musicVolume);
      if (typeof saved.foremanVoiceURI === "string") CG.audio.foremanVoiceURI = saved.foremanVoiceURI;
      if (typeof saved.alexVoiceURI === "string") CG.audio.alexVoiceURI = saved.alexVoiceURI;
      if (typeof saved.amyVoiceURI === "string") CG.audio.amyVoiceURI = saved.amyVoiceURI;
    } catch (_) {}
  }

  function writeSave() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          gears: state.gears,
          keyStreak: state.keyStreak,
          hasMagicKey: state.hasMagicKey,
          unlockedPaints: state.unlockedPaints,
          unlockedHats: state.unlockedHats,
          unlockedTreasures: state.unlockedTreasures,
          completedProjects: state.completedProjects,
          paint: state.paint,
          hat: state.hat,
          projectId: state.projectId,
          activeHero: state.activeHero,
          opMode: state.opMode,
          mode: state.mode,
          musicEnabled: CG.audio.musicEnabled,
          soundEnabled: CG.audio.soundEnabled,
          voiceEnabled: CG.audio.voiceEnabled,
          musicVolume: CG.audio.musicVolume,
          foremanVoiceURI: CG.audio.foremanVoiceURI,
          alexVoiceURI: CG.audio.alexVoiceURI,
          amyVoiceURI: CG.audio.amyVoiceURI
        })
      );
    } catch (_) {}
  }

  function getTotalStages() {
    return state.mode === "age5" ? 3 : 5;
  }

  function getActiveHeroMeta() {
    return CG.characters.HEROES.find((h) => h.id === state.activeHero) || CG.characters.HEROES[0];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // =========================================================================
  // Math Problem (Addition + Subtraction) & Dig Mound Generation
  // =========================================================================
  function generateProblem() {
    state.scottyBonusUsed = false;
    state.countedMax = 0;

    if (state.mode === "sandbox") {
      state.problem = { template: "sandbox", op: "+", a: null, b: null, c: null, answer: null, solved: false, tryValue: null };
      state.sandbox = { left: null, right: null };
      const pool = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      buildMoundsFromNumbers(pool.slice(0, 6));
      renderChestPedestal();
      return;
    }

    let a, b, c, template, op;
    const chooseSub =
      state.opMode === "sub"
        ? true
        : state.opMode === "add"
        ? false
        : state.problemIndex % 2 === 1;

    if (state.mode === "age5") {
      if (state.problemIndex === 0 && state.opMode !== "sub") {
        a = 1; b = 4; c = 5; template = "a+?=c"; op = "+";
      } else if ((state.problemIndex === 1 && state.opMode === "mix") || (state.problemIndex === 0 && state.opMode === "sub")) {
        // Subtraction starter: 5 - ? = 3 -> answer 2
        a = 5; b = 2; c = 3; template = "a-?=c"; op = "-";
      } else if (state.problemIndex === 2 && state.opMode !== "sub") {
        a = 1; b = 8; c = 9; template = "a+?=c"; op = "+";
      } else if (chooseSub) {
        op = "-";
        a = randInt(3, 9);
        c = randInt(1, a - 1);
        b = a - c;
        template = Math.random() < 0.62 ? "a-?=c" : "a-b=?";
      } else {
        op = "+";
        c = randInt(3, 9);
        a = randInt(1, c - 1);
        b = c - a;
        template = Math.random() < 0.72 ? "a+?=c" : "a+b=?";
      }
    } else if (state.problemIndex === 0 && state.mode === "foreman" && state.opMode !== "sub") {
      a = 1; b = 8; c = 9; template = "a+?=c"; op = "+";
    } else if (chooseSub) {
      op = "-";
      const maxMinuend = state.mode === "master" ? 20 : 10;
      const minMinuend = state.mode === "master" ? 8 : 4;
      a = randInt(minMinuend, maxMinuend);
      c = randInt(1, a - 1);
      b = a - c;
      template = Math.random() < 0.6 ? "a-?=c" : "a-b=?";
    } else {
      op = "+";
      const maxSum = state.mode === "master" ? 20 : 10;
      const minSum = state.mode === "master" ? 8 : 4;
      c = randInt(minSum, maxSum);
      a = randInt(1, c - 1);
      b = c - a;

      const roll = Math.random();
      if (roll < 0.52) template = "a+?=c";
      else if (roll < 0.78) template = "?+b=c";
      else template = "a+b=?";
    }

    let answer;
    if (template === "a+?=c") answer = b;
    else if (template === "?+b=c") answer = a;
    else if (template === "a+b=?") answer = c;
    else if (template === "a-?=c") answer = b;
    else answer = c; // a-b=?

    state.problem = { template, op, a, b, c, answer, solved: false, tryValue: null };

    const targetCount = state.mode === "age5" ? 4 : 6;
    const maxVal = state.mode === "age5" ? 9 : state.mode === "master" ? 20 : 10;
    const numbers = new Set([answer]);

    if (op === "+" && template !== "a+b=?" && c !== answer && c <= maxVal) {
      numbers.add(c);
    }
    if (op === "-" && a !== answer && a <= maxVal) {
      numbers.add(a);
    }
    if (answer + 1 <= maxVal) numbers.add(answer + 1);
    if (answer - 1 >= 1) numbers.add(answer - 1);

    let guard = 0;
    while (numbers.size < targetCount && guard < 60) {
      guard++;
      numbers.add(randInt(1, maxVal));
    }

    buildMoundsFromNumbers(shuffle(Array.from(numbers)).slice(0, targetCount));
    renderChestPedestal();
  }

  function buildMoundsFromNumbers(values) {
    const answer = state.problem ? state.problem.answer : null;
    const decoyIndices = [];
    values.forEach((v, idx) => {
      if (v !== answer) decoyIndices.push(idx);
    });

    // Place the "Noah!" puppy burrow in a decoy mound (guaranteed on round 0, ~65% thereafter)
    let noahIdx = -1;
    if (state.mode !== "sandbox" && decoyIndices.length > 0) {
      if (state.problemIndex === 0 || Math.random() < 0.65) {
        noahIdx = decoyIndices[Math.floor(Math.random() * decoyIndices.length)];
      }
    }

    // Place a buried treasure chest in a non-Noah mound (if not already waiting on pedestal)
    let chestIdx = -1;
    const nonNoahIndices = values.map((_, i) => i).filter((i) => i !== noahIdx);
    if (!state.chestFound && state.mode !== "sandbox" && nonNoahIndices.length > 0) {
      if (state.hasMagicKey || state.problemIndex === 0 || Math.random() < 0.6) {
        chestIdx = nonNoahIndices[Math.floor(Math.random() * nonNoahIndices.length)];
      }
    }

    const treasurePool = nonNoahIndices.filter((i) => i !== chestIdx);
    const treasureSlot =
      treasurePool.length > 0
        ? treasurePool[Math.floor(Math.random() * treasurePool.length)]
        : nonNoahIndices[0];

    state.mounds = values.map((val, idx) => ({
      id: idx,
      value: val,
      dug: false,
      pushed: false,
      used: false,
      isNoahDog: idx === noahIdx,
      dogState: "hidden", // hidden | up | ducked
      hasChest: idx === chestIdx,
      hasTreasure: idx === treasureSlot && idx !== noahIdx && Math.random() < 0.72
    }));
  }

  // =========================================================================
  // Rendering Crew, Amy Foreman, HUD, Project, Blueprint, Mounds & Chest
  // =========================================================================
  function renderCrew() {
    const heroMeta = getActiveHeroMeta();
    els["brand-hero-emoji"].textContent = heroMeta.emoji;
    els["brand-hero-title"].textContent = `${heroMeta.shortName}'s Dig!`;

    const actor = els["alexander-actor"];
    actor.className = `alexander-actor hero-${state.activeHero}`;
    els["alexander-svg-host"].innerHTML = CG.characters.renderHeroSVG(state.activeHero, {
      paint: state.paint,
      hat: state.hat
    });

    els["amy-svg-slot"].innerHTML = CG.characters.renderAmyForemanSVG();

    // Dynamic Standby Crew Bar (the other 3 trucks + Drive! swap button + DIG NEXT!)
    const standby = CG.characters.HEROES.filter((h) => h.id !== state.activeHero);
    const cardsHTML = standby
      .map((h) => {
        const svg = CG.characters.renderHeroSVG(h.id, { paint: "yellow", hat: h.id === "alexander" ? "bluecap" : null });
        return `
          <div class="crew-card" id="crew-card-${h.id}">
            <button class="crew-main-tap" data-helper-hero="${h.id}" type="button" title="${h.helperTitle}: ${h.helperSubtitle}">
              <div class="crew-svg-slot">${svg}</div>
              <div class="crew-card-label">
                <strong>${h.helperTitle}</strong>
                <small>${h.helperSubtitle}</small>
              </div>
            </button>
            <button class="drive-hero-btn tactile-btn" data-drive-hero="${h.id}" type="button" title="Drive as ${h.shortName}!">
              Drive!
            </button>
          </div>`;
      })
      .join("");

    els["crew-lanes"].innerHTML = `
      ${cardsHTML}
      <button id="btn-mega-dig" class="mega-dig-btn tactile-btn" type="button" title="Dig the next dirt mound!">
        <span class="mega-dig-icon">⛏️</span>
        <span class="mega-dig-copy">
          <strong>DIG NEXT!</strong>
          <small>or tap any pile</small>
        </span>
      </button>`;

    els["btn-mega-dig"] = document.getElementById("btn-mega-dig");
    els["btn-mega-dig"].addEventListener("click", digNextUndugMound);
  }

  function renderHUD() {
    const totalStages = getTotalStages();
    document.body.classList.toggle("age5-mode", state.mode === "age5");

    els["stat-gears"].textContent = String(state.gears);
    els["stat-stars"].textContent = `${state.stage} / ${totalStages}`;
    els["stat-streak"].textContent = String(state.streak);
    els["treasure-badge"].textContent = `${state.unlockedTreasures.length}/${CG.projects.TREASURES.length}`;

    // Magic Key Chip
    if (state.hasMagicKey) {
      els["key-chip"].classList.add("key-ready");
      els["stat-key"].textContent = "KEY!";
    } else {
      els["key-chip"].classList.remove("key-ready");
      els["stat-key"].textContent = `${state.keyStreak} / ${KEY_STREAK_TARGET}`;
    }

    els["btn-music"].classList.toggle("active", CG.audio.musicEnabled);
    els["btn-music"].innerHTML = CG.audio.musicEnabled
      ? `<span>🎵</span> <span class="btn-label">Music</span>`
      : `<span>🔇</span> <span class="btn-label">Muted</span>`;

    document.querySelectorAll(".op-pill, .op-card-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.op === state.opMode);
    });

    els["sandbox-controls"].classList.toggle("hidden", state.mode !== "sandbox");
    syncSettingsControls();
  }

  function syncSettingsControls() {
    document.querySelectorAll(".mode-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.mode === state.mode);
    });

    if (els["btn-setting-music"]) {
      els["btn-setting-music"].classList.toggle("active", CG.audio.musicEnabled);
      els["btn-setting-music"].textContent = CG.audio.musicEnabled ? "🎵 Truck Music: ON" : "🎵 Truck Music: OFF";
    }
    if (els["btn-setting-sound"]) {
      els["btn-setting-sound"].classList.toggle("active", CG.audio.soundEnabled);
      els["btn-setting-sound"].textContent = CG.audio.soundEnabled ? "🔊 Sound FX: ON" : "🔇 Sound FX: OFF";
    }
    if (els["btn-setting-voice"]) {
      els["btn-setting-voice"].classList.toggle("active", CG.audio.voiceEnabled);
      els["btn-setting-voice"].textContent = CG.audio.voiceEnabled ? "🗣️ Voices: ON" : "🤫 Voices: OFF";
    }
    if (els["music-volume-slider"]) {
      const pct = Math.round(CG.audio.musicVolume * 100);
      els["music-volume-slider"].value = String(pct);
      els["music-volume-val"].textContent = `${pct}%`;
    }
  }

  function populateVoiceDropdowns() {
    if (!els["select-foreman-voice"] || !els["select-alex-voice"] || !els["select-amy-voice"]) return;
    const voices = CG.audio.getEnglishVoices();
    const autoAmy = CG.audio.pickVoice("amy");
    const autoForeman = CG.audio.pickVoice("foreman");
    const autoAlex = CG.audio.pickVoice("alex");

    const buildOptions = (autoVoice, selectedURI) => {
      const opts = [
        `<option value="">Auto (${autoVoice ? autoVoice.name.replace(/Microsoft |Google /, "") : "Default"})</option>`
      ];
      voices.forEach((v) => {
        const sel = v.voiceURI === selectedURI ? "selected" : "";
        opts.push(`<option value="${v.voiceURI}" ${sel}>${v.name}</option>`);
      });
      return opts.join("");
    };

    els["select-amy-voice"].innerHTML = buildOptions(autoAmy, CG.audio.amyVoiceURI);
    els["select-foreman-voice"].innerHTML = buildOptions(autoForeman, CG.audio.foremanVoiceURI);
    els["select-alex-voice"].innerHTML = buildOptions(autoAlex, CG.audio.alexVoiceURI);
  }

  function renderProject() {
    const project = CG.projects.getProject(state.projectId);
    const totalStages = getTotalStages();
    const visualStage =
      state.mode === "age5" ? [0, 2, 4, 5][Math.min(state.stage, 3)] : state.stage;

    els["project-badge"].textContent = project.tag;
    els["project-title"].textContent = `${project.icon} ${project.title}`;
    els["comparator-unit-badge"].textContent = project.unit;
    els["project-svg-host"].innerHTML = project.renderSVG(visualStage);

    const dotsHTML = [];
    for (let i = 1; i <= totalStages; i++) {
      let cls = "stage-dot";
      if (i <= state.stage) cls += " done";
      else if (i === state.stage + 1) cls += " current";
      dotsHTML.push(`<span class="${cls}">${i <= state.stage ? "✓" : i}</span>`);
    }
    els["stage-dots"].innerHTML = dotsHTML.join("");

    const factIdx = Math.min(visualStage, project.facts.length - 1);
    els["engineering-fact-text"].textContent = project.facts[factIdx];
  }

  function renderBlueprint() {
    const p = state.problem;
    if (!p) return;

    if (p.template === "sandbox") {
      const leftVal = state.sandbox.left;
      const rightVal = state.sandbox.right;
      const total = (leftVal || 0) + (rightVal || 0);
      els["blueprint-subtitle"].textContent = "SANDBOX BALANCE";
      els["equation-row"].innerHTML = `
        <div id="sandbox-slot-left" class="eq-drop-slot ${leftVal !== null ? "filled-correct" : ""}" data-slot="left">${leftVal !== null ? leftVal : "?"}</div>
        <div class="eq-card eq-operator">+</div>
        <div id="sandbox-slot-right" class="eq-drop-slot ${rightVal !== null ? "filled-correct" : ""}" data-slot="right">${rightVal !== null ? rightVal : "?"}</div>
        <div class="eq-card eq-operator">=</div>
        <div class="eq-card eq-known-b">${total > 0 ? total : "?"}</div>
      `;
      renderSandboxBeamComparator(leftVal, rightVal);
      return;
    }

    els["blueprint-subtitle"].textContent = p.op === "-" ? "SUBTRACTION CUT" : "SPAN BLUEPRINT";

    const slotText = p.solved ? p.answer : p.tryValue !== null ? p.tryValue : "?";
    const slotCls = p.solved
      ? "eq-drop-slot filled-correct"
      : p.tryValue !== null
      ? "eq-drop-slot filled-wrong"
      : "eq-drop-slot";

    if (p.template === "a+?=c") {
      els["equation-row"].innerHTML = `
        <div class="eq-card eq-known-a">${p.a}</div>
        <div class="eq-card eq-operator">+</div>
        <div id="eq-drop-slot" class="${slotCls}">${slotText}</div>
        <div class="eq-card eq-operator">=</div>
        <div class="eq-card eq-known-b">${p.c}</div>
      `;
    } else if (p.template === "?+b=c") {
      els["equation-row"].innerHTML = `
        <div id="eq-drop-slot" class="${slotCls}">${slotText}</div>
        <div class="eq-card eq-operator">+</div>
        <div class="eq-card eq-known-a">${p.b}</div>
        <div class="eq-card eq-operator">=</div>
        <div class="eq-card eq-known-b">${p.c}</div>
      `;
    } else if (p.template === "a+b=?") {
      els["equation-row"].innerHTML = `
        <div class="eq-card eq-known-a">${p.a}</div>
        <div class="eq-card eq-operator">+</div>
        <div class="eq-card eq-known-a">${p.b}</div>
        <div class="eq-card eq-operator">=</div>
        <div id="eq-drop-slot" class="${slotCls}">${slotText}</div>
      `;
    } else if (p.template === "a-?=c") {
      els["equation-row"].innerHTML = `
        <div class="eq-card eq-known-a">${p.a}</div>
        <div class="eq-card eq-operator">−</div>
        <div id="eq-drop-slot" class="${slotCls}">${slotText}</div>
        <div class="eq-card eq-operator">=</div>
        <div class="eq-card eq-known-b">${p.c}</div>
      `;
    } else {
      // a - b = ?
      els["equation-row"].innerHTML = `
        <div class="eq-card eq-known-a">${p.a}</div>
        <div class="eq-card eq-operator">−</div>
        <div class="eq-card eq-known-a">${p.b}</div>
        <div class="eq-card eq-operator">=</div>
        <div id="eq-drop-slot" class="${slotCls}">${slotText}</div>
      `;
    }

    renderBeamComparator(p);
  }

  function renderBeamComparator(p, pulseMissing = false) {
    const cells = [];
    const ticks = [];

    if (p.op === "-") {
      // Subtraction beam: total starting length is p.a
      const totalStart = p.a;
      const keepLen = p.c;
      const trimLen = p.b;

      if (p.template === "a-?=c") {
        // Blocks 1..keepLen stay blue; blocks (keepLen+1)..totalStart are tappable trim boxes!
        for (let i = 1; i <= totalStart; i++) {
          let cls = "beam-cell ";
          let label = "";
          let dataAttr = "";
          if (i <= keepLen) {
            cls += p.solved ? "steel-solved" : "steel-a";
            label = i;
          } else if (p.solved) {
            cls += "steel-removed";
            label = `−${i - keepLen}`;
          } else if (p.tryValue !== null) {
            const tryKeep = Math.max(0, totalStart - p.tryValue);
            if (i <= tryKeep) {
              cls += "steel-a";
              label = i;
            } else {
              cls += p.tryValue > trimLen ? "steel-overflow" : "steel-try";
              label = "✕";
            }
          } else {
            const stepNum = i - keepLen;
            const isCounted = stepNum <= state.countedMax;
            cls += `steel-trim${isCounted ? " counted" : ""}`;
            if (pulseMissing) cls += " hint-pulse";
            dataAttr = `data-count-step="${stepNum}"`;
            label = isCounted ? stepNum : `−`;
          }
          cells.push(`<div class="${cls}" ${dataAttr}>${label}</div>`);
          ticks.push(`<div class="ruler-tick">${i}</div>`);
        }
        els["comparator-hint-label"].textContent = p.solved
          ? `Clean cut! ${p.a} − ${p.b} = ${p.c}!`
          : `Tap the red boxes to count how many to take away from ${p.a} to leave ${p.c}!`;
      } else {
        // a - b = ?: blocks 1..keepLen are tappable answer boxes; (keepLen+1)..a are crossed-out removed blocks!
        for (let i = 1; i <= totalStart; i++) {
          let cls = "beam-cell ";
          let label = "";
          let dataAttr = "";
          if (i > keepLen) {
            cls += "steel-removed";
            label = "✕";
          } else if (p.solved) {
            cls += "steel-solved";
            label = i;
          } else if (p.tryValue !== null) {
            cls += i <= p.tryValue ? (p.tryValue > keepLen ? "steel-overflow" : "steel-try") : "steel-missing";
            label = i;
          } else {
            const isCounted = i <= state.countedMax;
            cls += `steel-missing${isCounted ? " counted" : ""}`;
            if (pulseMissing) cls += " hint-pulse";
            dataAttr = `data-count-step="${i}"`;
            label = isCounted ? i : "?";
          }
          cells.push(`<div class="${cls}" ${dataAttr}>${label}</div>`);
          ticks.push(`<div class="ruler-tick">${i}</div>`);
        }
        els["comparator-hint-label"].textContent = p.solved
          ? `Clean cut! ${p.a} − ${p.b} = ${p.c}!`
          : `We cut off ${p.b}. Tap the remaining boxes to count what's left!`;
      }

      els["beam-track-area"].innerHTML = `
        <div class="beam-cells-row">${cells.join("")}</div>
        <div class="beam-ruler-row">${ticks.join("")}</div>
      `;
      return;
    }

    // Addition Beam Comparator
    const knownPart = p.template === "a+?=c" ? p.a : p.template === "?+b=c" ? p.b : p.a;
    const secondPart = p.template === "a+b=?" ? p.b : p.answer;
    const totalTarget = p.c;
    const tryVal = p.tryValue;

    let displayTotal = totalTarget;
    if (tryVal !== null && !p.solved) {
      const attemptSum = p.template === "a+b=?" ? tryVal : knownPart + tryVal;
      displayTotal = Math.max(totalTarget, attemptSum);
    }

    if (p.template === "a+b=?") {
      for (let i = 1; i <= displayTotal; i++) {
        let cls = "beam-cell ";
        let label = "";
        let dataAttr = "";
        if (p.solved) {
          cls += "steel-solved";
          label = i;
        } else if (tryVal !== null) {
          cls += i <= tryVal ? (i <= totalTarget ? "steel-try" : "steel-overflow") : "steel-missing";
          label = i <= tryVal ? i : "?";
        } else {
          const stepNum = i - p.a;
          const isCounted = stepNum > 0 && stepNum <= state.countedMax;
          cls += i <= p.a ? "steel-a" : `steel-missing${isCounted ? " counted" : ""}`;
          if (i > p.a && pulseMissing) cls += " hint-pulse";
          if (i > p.a) dataAttr = `data-count-step="${stepNum}"`;
          label = i <= p.a ? i : isCounted ? stepNum : `+${stepNum}`;
        }
        cells.push(`<div class="${cls}" ${dataAttr}>${label}</div>`);
        ticks.push(`<div class="ruler-tick ${i > totalTarget ? "overflow-tick" : ""}">${i}</div>`);
      }
      els["comparator-hint-label"].textContent = `Tap the boxes after ${p.a} to count up to the total!`;
    } else {
      const attemptSum = tryVal !== null ? knownPart + tryVal : knownPart;
      for (let i = 1; i <= displayTotal; i++) {
        let cls = "beam-cell ";
        let label = "";
        let dataAttr = "";
        if (i <= knownPart) {
          cls += "steel-a";
          label = i;
        } else if (p.solved) {
          cls += "steel-solved";
          label = i;
        } else if (tryVal !== null && i <= attemptSum) {
          cls += i > totalTarget ? "steel-overflow" : "steel-try";
          label = i;
        } else {
          const stepNum = i - knownPart;
          const isCounted = stepNum <= state.countedMax;
          cls += `steel-missing${isCounted ? " counted" : ""}`;
          if (pulseMissing) cls += " hint-pulse";
          dataAttr = `data-count-step="${stepNum}"`;
          label = isCounted ? stepNum : "?";
        }
        cells.push(`<div class="${cls}" ${dataAttr}>${label}</div>`);
        ticks.push(`<div class="ruler-tick ${i > totalTarget ? "overflow-tick" : ""}">${i}</div>`);
      }
      els["comparator-hint-label"].textContent = p.solved
        ? `Solid! ${knownPart} + ${secondPart} = ${totalTarget}!`
        : `Tap the empty boxes to count how many we need!`;
    }

    els["beam-track-area"].innerHTML = `
      <div class="beam-cells-row">${cells.join("")}</div>
      <div class="beam-ruler-row">${ticks.join("")}</div>
    `;
  }

  function renderSandboxBeamComparator(leftVal, rightVal) {
    const l = leftVal || 0;
    const r = rightVal || 0;
    const total = l + r;
    const count = Math.max(10, total);
    const cells = [];
    const ticks = [];
    for (let i = 1; i <= count; i++) {
      let cls = "beam-cell ";
      let label = "";
      if (i <= l) {
        cls += "steel-a";
        label = i;
      } else if (i <= total) {
        cls += "steel-solved";
        label = i;
      } else {
        cls += "steel-missing";
      }
      cells.push(`<div class="${cls}">${label}</div>`);
      ticks.push(`<div class="ruler-tick">${i}</div>`);
    }
    els["comparator-hint-label"].textContent =
      total > 0 ? `Greta's Scale: ${l} + ${r} = ${total} total!` : "Dig numbers and drop them in both slots!";
    els["beam-track-area"].innerHTML = `
      <div class="beam-cells-row">${cells.join("")}</div>
      <div class="beam-ruler-row">${ticks.join("")}</div>
    `;
  }

  function renderMounds() {
    els["mounds-grid"].classList.toggle("grid-4", state.mode === "age5");
    els["mounds-grid"].innerHTML = state.mounds
      .map((m) => {
        if (!m.dug) {
          const pushedCls = m.pushed ? "pushed-away" : "";
          return `
            <div class="mound-slot" data-mound-slot="${m.id}">
              <button class="dirt-mound-btn ${pushedCls}" data-mound-id="${m.id}" type="button" aria-label="Dirt Pile ${m.id + 1} - Tap to dig">
                <span class="mound-tap-tag">TAP TO DIG!</span>
                ${CG.characters.renderDirtMoundSVG(m.id)}
              </button>
            </div>`;
        }

        if (m.isNoahDog) {
          const dogCls = m.dogState === "up" ? "popped-up" : "ducked";
          const bubbleHtml = m.dogState === "up" ? `<span class="noah-bubble">Noah!</span>` : "";
          return `
            <div class="mound-slot" data-mound-slot="${m.id}">
              <button class="noah-dog-hole ${dogCls}" data-noah-id="${m.id}" type="button" aria-label="Noah Puppy Burrow - Tap to peek!">
                ${bubbleHtml}
                ${CG.characters.renderNoahDogSVG()}
              </button>
            </div>`;
        }

        const pips = Array.from({ length: Math.min(m.value, 10) })
          .map(() => `<span class="unit-pip"></span>`)
          .join("");
        const usedCls = m.used ? "used-correct" : "";
        const decoyCls = m.pushed ? "dimmed-decoy" : "";

        return `
          <div class="mound-slot" data-mound-slot="${m.id}">
            <div class="revealed-block ${usedCls} ${decoyCls}" data-block-id="${m.id}" data-value="${m.value}" role="button" tabindex="0" aria-label="Number beam ${m.value} — tap or drag into blueprint">
              <span class="block-number">${m.value}</span>
              <div class="block-unit-pips">${pips}</div>
              <span class="block-action-hint">TAP OR DRAG</span>
            </div>
          </div>`;
      })
      .join("");
  }

  function renderChestPedestal() {
    const btn = els["chest-pedestal-btn"];
    if (!state.chestFound || state.mode === "sandbox") {
      btn.classList.add("hidden");
      return;
    }
    btn.classList.remove("hidden");
    btn.classList.toggle("chest-ready-glow", state.hasMagicKey);
    els["chest-pedestal-svg"].innerHTML = CG.characters.renderTreasureChestSVG(state.hasMagicKey);
    els["chest-pedestal-label"].textContent = state.hasMagicKey ? "🗝️ OPEN CHEST!" : "🔒 3-Streak Key!";
  }

  function setFeedback(text, tone = "neutral") {
    const fb = els["blueprint-feedback"];
    fb.textContent = text;
    fb.className = "blueprint-feedback";
    if (tone === "good") fb.classList.add("good");
    else if (tone === "oops") fb.classList.add("oops");
  }

  function showAlexBubble(text, speakToo = true) {
    const bubble = els["alexander-bubble"];
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.remove("hidden");
    clearTimeout(showAlexBubble._timer);
    showAlexBubble._timer = setTimeout(() => {
      bubble.classList.add("hidden");
    }, 2400);

    if (speakToo) {
      CG.audio.speak(text, { persona: "alex", priority: true });
    }
  }

  // =========================================================================
  // Particle Effects & Truck Animations
  // =========================================================================
  function spawnParticles(anchorEl, kind = "dirt", count = 8) {
    if (!anchorEl) return;
    const groundRect = els["dig-ground"].getBoundingClientRect();
    const targetRect = anchorEl.getBoundingClientRect();
    const cx = targetRect.left - groundRect.left + targetRect.width / 2;
    const cy = targetRect.top - groundRect.top + targetRect.height / 2;

    const emojis = kind === "stars" ? ["⭐", "⚙️", "✨", "🎉"] : ["✨", "🪨"];

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = kind === "dirt" ? "particle particle-dirt" : "particle";
      if (kind !== "dirt") {
        p.textContent = emojis[i % emojis.length];
        p.style.fontSize = `${16 + Math.random() * 10}px`;
      }
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * 140}px`);
      p.style.setProperty("--dy", `${-35 - Math.random() * 75}px`);
      p.style.setProperty("--rot", `${(Math.random() - 0.5) * 320}deg`);
      els["particle-layer"].appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  }

  function moveAlexanderToward(targetEl) {
    const alex = els["alexander-actor"];
    if (!alex || !targetEl) return;
    const groundRect = els["dig-ground"].getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const desiredX = Math.max(0, Math.min(groundRect.width - 175, targetRect.left - groundRect.left - 125));
    const desiredY = Math.max(-24, Math.min(24, (targetRect.top - groundRect.top) * 0.25 - 12));
    alex.style.transform = `translate(${desiredX}px, ${desiredY}px)`;
  }

  function resetAlexanderHome() {
    els["alexander-actor"].style.transform = "translate(0px, 0px)";
  }

  function launchRoamingTruck(type, animClass = "drive-across") {
    const truck = document.createElement("div");
    truck.className = `roaming-truck ${animClass}`;
    truck.innerHTML = CG.characters.renderHeroSVG(type, { paint: "yellow", hat: type === "alexander" ? "bluecap" : null });
    els["roaming-fx-layer"].appendChild(truck);
    setTimeout(() => truck.remove(), 1450);
  }

  function showDeliveredBeamToast(text) {
    const badge = document.createElement("div");
    badge.className = "delivered-beam-badge";
    badge.textContent = text;
    els["crane-delivery-overlay"].appendChild(badge);
    setTimeout(() => badge.remove(), 1000);
  }

  // =========================================================================
  // Core Actions: Digging, Noah Dog, Chest, Tap-Counting, Solving
  // =========================================================================
  function triggerNoahDogPop(moundId) {
    const mound = state.mounds.find((m) => m.id === moundId);
    if (!mound || !mound.isNoahDog) return;
    mound.dogState = "up";
    renderMounds();
    CG.audio.playDogBark();
    CG.audio.speak("Noah!", { persona: "alex", priority: true });
    setFeedback("🐶 A little dog popped out and said \"Noah!\"", "neutral");

    clearTimeout(mound._duckTimer);
    mound._duckTimer = setTimeout(() => {
      if (state.mounds.includes(mound) && mound.isNoahDog) {
        mound.dogState = "ducked";
        renderMounds();
      }
    }, 1850);
  }

  function digMound(moundId) {
    if (state.busy) return;
    const mound = state.mounds.find((m) => m.id === moundId);
    if (!mound || mound.dug || mound.pushed) return;

    const slotEl = document.querySelector(`[data-mound-slot="${moundId}"]`);
    moveAlexanderToward(slotEl);

    els["alexander-actor"].classList.remove("digging");
    void els["alexander-actor"].offsetWidth;
    els["alexander-actor"].classList.add("digging");

    CG.audio.playDig();
    spawnParticles(slotEl, "dirt", 10);

    if (!mound.isNoahDog) {
      const dugCount = state.mounds.filter((m) => m.dug).length;
      const line = ALEX_DIG_LINES[Math.floor(Math.random() * ALEX_DIG_LINES.length)];
      showAlexBubble(line, dugCount === 0 || Math.random() < 0.5);
    }

    setTimeout(() => {
      mound.dug = true;
      els["alexander-actor"].classList.remove("digging");

      if (mound.isNoahDog) {
        triggerNoahDogPop(mound.id);
        return;
      }

      renderMounds();
      if (mound.hasChest) {
        state.chestFound = true;
        renderChestPedestal();
        CG.audio.playTreasure();
        spawnParticles(slotEl, "stars", 10);
        if (state.hasMagicKey) {
          setFeedback("🗝️ You dug up a Treasure Chest! Tap the chest to unlock it!", "good");
          CG.audio.speak("Ooh! A buried Treasure Chest and you have the Magic Key! Tap it to open!", { persona: "amy", priority: true });
        } else {
          setFeedback("🧰 Buried Treasure Chest! Get 3 right in a row for the Magic Key!", "neutral");
        }
      } else if (mound.hasTreasure) {
        awardRandomTreasure(slotEl);
      }
    }, 260);
  }

  function digNextUndugMound() {
    const next = state.mounds.find((m) => !m.dug && !m.pushed);
    if (next) {
      digMound(next.id);
    } else {
      CG.audio.playHorn(state.activeHero);
      showAlexBubble("All dug up! Tap a number!", true);
      setFeedback("All piles are dug! Tap or drag a number into the blueprint!", "neutral");
    }
  }

  function handleCountBoxTap(stepNum) {
    const p = state.problem;
    if (!p || p.solved || p.template === "sandbox") return;

    state.countedMax = stepNum === state.countedMax ? Math.max(0, stepNum - 1) : stepNum;
    const current = state.countedMax;
    renderBeamComparator(p);

    if (current > 0) {
      CG.audio.playCountNote(current);
      const word = COUNT_WORDS[current] || String(current);
      if ((p.template === "a+?=c" || p.template === "?+b=c" || p.template === "a-?=c" || p.template === "a-b=?") && current === p.answer) {
        setFeedback(`${current} spaces! Find the number ${p.answer} in the dirt!`, "good");
        CG.audio.speak(`${word}! That's ${p.answer}! Now find the ${p.answer}!`, { persona: "amy", priority: true });
      } else {
        setFeedback(`Counting spaces: ${current}...`, "neutral");
        CG.audio.speak(`${word}!`, { persona: "amy", priority: true });
      }
    }
  }

  function awardRandomTreasure(anchorEl) {
    const remaining = CG.projects.TREASURES.filter((t) => !state.unlockedTreasures.includes(t.id) && t.id !== "minigame");
    let treasure;
    if (remaining.length > 0) {
      treasure = remaining[Math.floor(Math.random() * remaining.length)];
      state.unlockedTreasures.push(treasure.id);
    } else {
      treasure = CG.projects.TREASURES[Math.floor(Math.random() * (CG.projects.TREASURES.length - 1))];
    }

    state.gears += 2;
    writeSave();
    renderHUD();
    CG.audio.playTreasure();
    spawnParticles(anchorEl, "stars", 8);
    showAlexBubble(`Woooow! ${treasure.name}!`, true);

    els["treasure-toast-emoji"].textContent = treasure.emoji;
    els["treasure-toast-title"].textContent = `${treasure.name} (+2 ⚙️)`;
    els["treasure-toast-desc"].textContent = treasure.story;
    els["treasure-toast"].classList.remove("hidden");
    clearTimeout(awardRandomTreasure._timer);
    awardRandomTreasure._timer = setTimeout(() => {
      els["treasure-toast"].classList.add("hidden");
    }, 3200);
  }

  function tryPlaceValue(value, blockId, targetSlot = null) {
    if (state.busy) return;
    const p = state.problem;
    if (!p || p.solved) return;

    if (state.mode === "sandbox") {
      if (targetSlot === "right" || (targetSlot === null && state.sandbox.left !== null && state.sandbox.right === null)) {
        state.sandbox.right = value;
      } else {
        state.sandbox.left = value;
      }
      CG.audio.playBlockPick();
      renderBlueprint();
      if (state.sandbox.left !== null && state.sandbox.right !== null) {
        const sum = state.sandbox.left + state.sandbox.right;
        CG.audio.playRivetSnap();
        setFeedback(`Awesome! ${state.sandbox.left} + ${state.sandbox.right} = ${sum}!`, "good");
        CG.audio.speak(`Look at that! ${state.sandbox.left} plus ${state.sandbox.right} makes ${sum}!`, { persona: "amy", priority: true });
        showAlexBubble("Gee! Cooool!", false);
        showDeliveredBeamToast(`🔩 ${sum}-Unit Beam Welded!`);
        launchRoamingTruck("scotty", "scotty-spin");
      }
      return;
    }

    if (value === p.answer) {
      handleCorrectAnswer(blockId);
    } else {
      handleWrongAttempt(value);
    }
  }

  function handleWrongAttempt(value) {
    const p = state.problem;
    p.tryValue = value;
    state.streak = 0;
    state.keyStreak = 0;
    CG.audio.playWrongTry();
    renderHUD();
    renderBlueprint();

    let msg;
    if (p.template === "a-?=c") {
      const leftOver = p.a - value;
      if (leftOver < p.c) {
        msg = `Whoa! ${p.a} minus ${value} leaves ${leftOver} — too small for ${p.c}! Try ${p.answer}!`;
      } else {
        msg = `Almost! ${p.a} minus ${value} leaves ${leftOver}. We need to take away more to get ${p.c}!`;
      }
    } else if (p.template === "a-b=?") {
      msg = `Not quite! Start with ${p.a}, take away ${p.b}, and count what's left!`;
    } else if (p.template === "a+b=?") {
      msg = value < p.answer
        ? `Whoa partner, ${value} is too short! Count ${p.a} plus ${p.b} together!`
        : `Hold up buddy, ${value} is too long! Count ${p.a} plus ${p.b}!`;
    } else {
      const known = p.template === "a+?=c" ? p.a : p.b;
      const attemptTotal = known + value;
      if (attemptTotal > p.c) {
        const diff = attemptTotal - p.c;
        msg = `Whoa! ${known} + ${value} = ${attemptTotal} — ${diff} too long for ${p.c}! Try ${p.answer}!`;
      } else {
        const need = p.c - attemptTotal;
        msg = `Close! ${known} + ${value} = ${attemptTotal}. Need ${need} more to hit ${p.c}!`;
      }
    }

    setFeedback(msg, "oops");
    CG.audio.speak(msg, { persona: "amy", priority: true });

    setTimeout(() => {
      if (state.problem === p && !p.solved) {
        p.tryValue = null;
        renderBlueprint();
      }
    }, 1700);
  }

  function handleCorrectAnswer(blockId) {
    const p = state.problem;
    p.solved = true;
    p.tryValue = null;
    state.busy = true;

    const block = state.mounds.find((m) => m.id === blockId);
    if (block) block.used = true;

    state.streak += 1;
    let earnedKeyNow = false;
    if (!state.hasMagicKey) {
      state.keyStreak = Math.min(KEY_STREAK_TARGET, state.keyStreak + 1);
      if (state.keyStreak >= KEY_STREAK_TARGET) {
        state.hasMagicKey = true;
        earnedKeyNow = true;
      }
    }

    const gearEarned = 3 + Math.min(3, Math.floor(state.streak / 2));
    state.gears += gearEarned;
    state.stage += 1;
    state.problemIndex += 1;

    CG.audio.playRivetSnap();
    if (earnedKeyNow) {
      setTimeout(() => CG.audio.playKeyEarned(), 360);
    }

    els["alexander-actor"].classList.add("celebrate");
    els["streak-chip"].classList.add("pop");
    setTimeout(() => {
      els["alexander-actor"].classList.remove("celebrate");
      els["streak-chip"].classList.remove("pop");
    }, 700);

    const totalStages = getTotalStages();
    const project = CG.projects.getProject(state.projectId);
    const equationStr = p.op === "-" ? `${p.a} − ${p.b} = ${p.c}` : `${p.a} + ${p.b} = ${p.c}`;
    const spokenEq = p.op === "-" ? `${p.a} minus ${p.b} equals ${p.c}` : `${p.a} plus ${p.b} is ${p.c}`;

    renderHUD();
    renderBlueprint();
    renderMounds();
    renderProject();
    renderChestPedestal();
    showDeliveredBeamToast(`🔩 ${equationStr} Installed!`);
    spawnParticles(els["alexander-actor"], "stars", 12);
    showAlexBubble("WOOOW! COOOOL!", false);

    let praise;
    if (earnedKeyNow) {
      praise = `🗝️ 3-IN-A-ROW! You won the Magic Key! Dig up a chest to open it!`;
      CG.audio.speak(`Way to go! You got three in a row and earned the Magic Key!`, { persona: "amy", priority: true });
    } else {
      const praiseList = [
        `Attaboy! ${spokenEq} — solid as concrete!`,
        `Hot dog! ${spokenEq}! Bolt 'er down, crew!`,
        `Right on the money, buddy! Look at that ${project.title} comin' together!`
      ];
      praise = praiseList[state.problemIndex % praiseList.length];
      CG.audio.speak(praise, { persona: "foreman", priority: true });
    }
    setFeedback(`${praise} (+${gearEarned} ⚙️)`, "good");

    const standby = CG.characters.HEROES.filter((h) => h.id !== state.activeHero);
    launchRoamingTruck(standby[0].id, "drive-across");
    setTimeout(() => launchRoamingTruck(standby[1].id, "scotty-spin"), 280);

    writeSave();

    setTimeout(() => {
      resetAlexanderHome();
      if (state.stage >= totalStages) {
        state.busy = false;
        openProjectCelebration();
      } else {
        launchRoamingTruck(standby[2].id, "drive-across");
        CG.audio.playGrade();
        setTimeout(() => {
          generateProblem();
          renderBlueprint();
          renderMounds();
          setFeedback("Fresh dirt piles ready! Tap a pile to dig!", "neutral");
          state.busy = false;
          speakCurrentPuzzle();
        }, 550);
      }
    }, 1550);
  }

  function speakCurrentPuzzle() {
    const p = state.problem;
    if (!p || p.template === "sandbox") return;
    if (p.template === "a+?=c") {
      CG.audio.speak(`Hi builder! We have ${p.a} and we need ${p.c}. What's missing?`, { persona: "amy", priority: true });
    } else if (p.template === "?+b=c") {
      CG.audio.speak(`What plus ${p.b} equals ${p.c}? Let's dig it up!`, { persona: "amy", priority: true });
    } else if (p.template === "a+b=?") {
      CG.audio.speak(`What is ${p.a} plus ${p.b}? Dig up the answer!`, { persona: "amy", priority: true });
    } else if (p.template === "a-?=c") {
      CG.audio.speak(`Subtraction time! Start with ${p.a} and take away what to leave ${p.c}?`, { persona: "amy", priority: true });
    } else {
      CG.audio.speak(`Start with ${p.a}, take away ${p.b}, how many are left?`, { persona: "amy", priority: true });
    }
  }

  // =========================================================================
  // Magic Treasure Chest & Playable Mini ThinkPad Video Game Inside!
  // =========================================================================
  function handleChestPedestalClick() {
    if (!state.chestFound) return;
    if (!state.hasMagicKey) {
      CG.audio.playChestLocked();
      els["chest-pedestal-btn"].classList.remove("shake");
      void els["chest-pedestal-btn"].offsetWidth;
      els["chest-pedestal-btn"].classList.add("shake");
      setFeedback("🔒 Chest is locked! Solve 3 in a row to earn the Magic Key!", "oops");
      CG.audio.speak("Ooh, that Treasure Chest is locked! Solve three in a row to win the Magic Key!", { persona: "amy", priority: true });
      return;
    }

    // Unlock the chest!
    state.hasMagicKey = false;
    state.keyStreak = 0;
    state.chestFound = false;
    state.gears += 15;
    if (!state.unlockedTreasures.includes("minigame")) {
      state.unlockedTreasures.push("minigame");
    }
    writeSave();
    renderHUD();
    renderChestPedestal();

    CG.audio.playChestOpen();
    CG.audio.speak("Whoa! Inside the Magic Chest is a miniature ThinkPad with a copy of THIS VERY VIDEO GAME!", { persona: "amy", priority: true });
    openMiniGameChest(1);
  }

  function openMiniGameChest(depth = 1) {
    state.miniGame = {
      depth,
      solved: depth - 1,
      phase: "dig",
      answer: 1,
      mounds: shuffle([1, 2])
    };
    renderMiniGame();
    els["chest-modal"].classList.remove("hidden");
  }

  function renderMiniGame() {
    const mg = state.miniGame;
    els["inception-depth"].textContent = String(mg.depth);
    els["mini-stage-text"].textContent = `Depth: ${mg.depth}`;
    els["mini-eq-text"].textContent = mg.phase === "chest" ? "1 + 1 = 2!" : "1 + ? = 2";

    if (mg.phase === "dig") {
      els["mini-feedback"].textContent = "Tap a tiny dirt pile!";
      els["mini-yard"].innerHTML = mg.mounds
        .map((val, idx) => `<button class="mini-mound tactile-btn" data-mini-mound="${idx}" type="button">🟤 Dig!</button>`)
        .join("");
    } else if (mg.phase === "pick") {
      els["mini-feedback"].textContent = "Tap the 1 to fill 1 + ? = 2!";
      els["mini-yard"].innerHTML = mg.mounds
        .map((val) => `<button class="mini-block tactile-btn" data-mini-val="${val}" type="button">${val}</button>`)
        .join("");
    } else {
      els["mini-feedback"].textContent = "Tiny Magic Chest dug up!!";
      els["mini-yard"].innerHTML = `<button class="mini-chest-btn tactile-btn" data-mini-open-chest="1" type="button">🎁 Open Tiny Chest Inside!</button>`;
    }
  }

  // =========================================================================
  // Crew Helper & Driver Switching Interactions
  // =========================================================================
  function switchDriver(heroId) {
    if (!CG.characters.HEROES.some((h) => h.id === heroId)) return;
    state.activeHero = heroId;
    writeSave();
    renderCrew();
    CG.audio.playHorn(heroId);
    const meta = getActiveHeroMeta();
    showAlexBubble(`I'm ${meta.shortName}! Let's dig!`, true);
    setFeedback(`Now driving ${meta.name}! Tap any dirt pile!`, "neutral");
  }

  function triggerHelperAction(heroId) {
    if (state.busy) return;
    const card = document.getElementById(`crew-card-${heroId}`);
    if (card) {
      card.classList.add("working");
      setTimeout(() => card.classList.remove("working"), 800);
    }

    if (heroId === "alexander") {
      // Alexander helper: Super Scoop digs up the answer mound!
      CG.audio.playHorn("alexander");
      launchRoamingTruck("alexander", "drive-across");
      const p = state.problem;
      const targetMound = p && state.mode !== "sandbox"
        ? state.mounds.find((m) => m.value === p.answer && !m.dug && !m.isNoahDog)
        : null;
      const anyUndug = targetMound || state.mounds.find((m) => !m.dug && !m.pushed);
      if (anyUndug) {
        setFeedback("Alexander zoomed in for a Super Scoop!", "good");
        CG.audio.speak("Alexander comin' in hot with a Super Scoop!", { persona: "foreman", priority: true });
        digMound(anyUndug.id);
      } else {
        setFeedback(`Alexander says: Look for ${p ? p.answer : "a beam"}!`, "neutral");
      }
      return;
    }

    if (heroId === "danny") {
      const p = state.problem;
      CG.audio.playPush();
      CG.audio.playHorn("danny");
      launchRoamingTruck("danny", "drive-across");
      if (!p || state.mode === "sandbox") return;
      const decoy = state.mounds.find((m) => m.value !== p.answer && !m.pushed && !m.used && !m.isNoahDog);
      if (decoy) {
        decoy.pushed = true;
        renderMounds();
        setFeedback(`Danny Dozer pushed away a decoy pile (${decoy.value})!`, "neutral");
        CG.audio.speak("Danny Dozer comin' through! Pushed that decoy right outta the way!", { persona: "foreman", priority: true });
      } else {
        setFeedback(`Danny says: Right on target! Look for ${p.answer}!`, "neutral");
      }
      return;
    }

    if (heroId === "greta") {
      const p = state.problem;
      CG.audio.playHorn("greta");
      if (!p || state.mode === "sandbox") {
        setFeedback("Greta says: Drop any two beams in the slots to measure 'em!", "neutral");
        return;
      }
      renderBeamComparator(p, true);
      const hintText =
        p.op === "-"
          ? `Greta's ruler is lit! Tap the ${p.answer} pulsing boxes to count!`
          : `Tap the ${p.answer} pulsing empty boxes to reach ${p.c}!`;
      setFeedback(hintText, "neutral");
      CG.audio.speak(hintText, { persona: "amy", priority: true });
      return;
    }

    if (heroId === "scotty") {
      CG.audio.playHorn("scotty");
      launchRoamingTruck("scotty", "scotty-spin");
      if (!state.scottyBonusUsed) {
        state.scottyBonusUsed = true;
        state.gears += 1;
        writeSave();
        renderHUD();
        setFeedback("Scotty popped a 360 wheelie! +1 Golden Gear! ⚡", "good");
        showAlexBubble("Woooow! Look at Scotty!", true);
      } else {
        setFeedback("Scotty says: Vroom vroom! Keep diggin', buddy!", "neutral");
      }
    }
  }

  // =========================================================================
  // Modals: Celebration, Projects, Garage, Treasures, Settings
  // =========================================================================
  function openProjectCelebration() {
    const project = CG.projects.getProject(state.projectId);
    if (!state.completedProjects.includes(project.id)) {
      state.completedProjects.push(project.id);
    }
    state.gears += 10;
    writeSave();
    renderHUD();

    CG.audio.setParadeBoost(true);
    CG.audio.playFanfare();
    CG.audio.speak(
      `Way to go, builder! You and the whole crew finished the ${project.title}! Tap anyone to cheer!`,
      { persona: "amy", priority: true }
    );

    els["celeb-title"].textContent = `${project.icon} ${project.title} Built!`;
    els["celeb-scene"].innerHTML = project.renderSVG(5);

    const paradeChars = [
      { id: "alexander", name: "Alexander", svg: CG.characters.renderAlexanderSVG({ paint: state.paint, hat: state.hat }) },
      { id: "danny", name: "Danny Dozer", svg: CG.characters.renderDannySVG({ paint: state.paint, hat: state.hat }) },
      { id: "scotty", name: "Scotty", svg: CG.characters.renderScottySVG({ paint: state.paint, hat: state.hat }) },
      { id: "greta", name: "Greta Grader", svg: CG.characters.renderGretaSVG({ paint: state.paint, hat: state.hat }) },
      { id: "amy", name: "Amy Foreman", svg: CG.characters.renderAmyForemanSVG() }
    ];

    els["celeb-parade-trucks"].innerHTML = paradeChars
      .map(
        (t) => `
        <button class="parade-truck-btn tactile-btn" data-parade-truck="${t.id}" type="button">
          ${t.svg}
          <span>🔊 ${t.name}</span>
        </button>`
      )
      .join("");

    els["celebration-modal"].classList.remove("hidden");
  }

  function advanceToNextProject() {
    CG.audio.setParadeBoost(false);
    els["celebration-modal"].classList.add("hidden");
    const list = CG.projects.PROJECTS;
    const idx = list.findIndex((p) => p.id === state.projectId);
    const next = list[(idx + 1) % list.length];
    selectProject(next.id);
  }

  function selectProject(projectId) {
    state.projectId = projectId;
    state.stage = 0;
    writeSave();
    generateProblem();
    renderHUD();
    renderProject();
    renderBlueprint();
    renderMounds();
    setFeedback(`New build started! Tap a dirt pile to build your ${CG.projects.getProject(projectId).title}!`, "neutral");
    speakCurrentPuzzle();
  }

  function openSettingsModal() {
    populateVoiceDropdowns();
    syncSettingsControls();
    els["settings-modal"].classList.remove("hidden");
  }

  function openProjectsModal() {
    els["projects-list"].innerHTML = CG.projects.PROJECTS.map((p) => {
      const doneCount = state.completedProjects.includes(p.id) ? "🏆 Completed!" : "🚧 Ready to Build";
      const activeCls = p.id === state.projectId ? "active" : "";
      return `
        <button class="project-choice-card ${activeCls}" data-pick-project="${p.id}" type="button">
          <div class="project-choice-head">
            <span>${p.icon}</span>
            <small class="project-tag">${p.tag}</small>
          </div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <small><strong>${doneCount}</strong></small>
        </button>`;
    }).join("");
    els["projects-modal"].classList.remove("hidden");
  }

  function openGarageModal() {
    renderGarageContents();
    els["garage-modal"].classList.remove("hidden");
  }

  function renderGarageContents() {
    els["garage-driver-bar"].innerHTML = CG.characters.HEROES.map((h) => {
      const activeCls = h.id === state.activeHero ? "active" : "";
      return `<button class="garage-driver-btn tactile-btn ${activeCls}" data-garage-driver="${h.id}" type="button">${h.emoji} Drive ${h.shortName}</button>`;
    }).join("");

    els["garage-preview-svg"].innerHTML = CG.characters.renderHeroSVG(state.activeHero, {
      paint: state.paint,
      hat: state.hat
    });
    els["garage-gears-count"].textContent = String(state.gears);

    els["garage-paints"].innerHTML = CG.characters.PAINTS.map((p) => {
      const unlocked = state.unlockedPaints.includes(p.id);
      const equipped = state.paint === p.id;
      const cls = equipped ? "equipped" : unlocked ? "" : "locked";
      const label = equipped ? "✓ Equipped" : unlocked ? "Select" : `Unlock ${p.cost} ⚙️`;
      return `
        <button class="garage-item-btn tactile-btn ${cls}" data-paint-id="${p.id}" type="button">
          <span class="color-swatch" style="background:${p.primary}"></span>
          <strong>${p.name}</strong>
          <small>${label}</small>
        </button>`;
    }).join("");

    els["garage-hats"].innerHTML = CG.characters.HATS.map((h) => {
      const unlocked = state.unlockedHats.includes(h.id);
      const equipped = state.hat === h.id;
      const cls = equipped ? "equipped" : unlocked ? "" : "locked";
      const label = equipped ? "✓ Equipped" : unlocked ? "Wear" : `Unlock ${h.cost} ⚙️`;
      return `
        <button class="garage-item-btn tactile-btn ${cls}" data-hat-id="${h.id}" type="button">
          <span style="font-size:1.5rem">${h.emoji}</span>
          <strong>${h.name}</strong>
          <small>${label}</small>
        </button>`;
    }).join("");
  }

  function openTreasuresModal() {
    els["treasures-grid"].innerHTML = CG.projects.TREASURES.map((t) => {
      const unlocked = state.unlockedTreasures.includes(t.id);
      return `
        <button class="treasure-sticker-card ${unlocked ? "unlocked" : "locked"}" data-treasure-id="${t.id}" type="button">
          <span class="treasure-sticker-emoji">${unlocked ? t.emoji : "❓"}</span>
          <strong>${unlocked ? t.name : "Hidden Treasure"}</strong>
          <small>${unlocked ? t.story : "Dig dirt piles to find!"}</small>
        </button>`;
    }).join("");
    els["treasures-modal"].classList.remove("hidden");
  }

  // =========================================================================
  // Unified Touch + Mouse Pointer Drag / Tap Handling
  // =========================================================================
  function setupPointerDragging() {
    const ground = els["mounds-grid"];
    const ghost = els["drag-ghost"];

    ground.addEventListener("pointerdown", (e) => {
      const moundBtn = e.target.closest(".dirt-mound-btn");
      if (moundBtn) {
        digMound(Number(moundBtn.dataset.moundId));
        return;
      }

      const noahBtn = e.target.closest(".noah-dog-hole");
      if (noahBtn) {
        triggerNoahDogPop(Number(noahBtn.dataset.noahId));
        return;
      }

      const blockEl = e.target.closest(".revealed-block");
      if (!blockEl || state.busy) return;
      const blockId = Number(blockEl.dataset.blockId);
      const value = Number(blockEl.dataset.value);

      e.preventDefault();
      state.drag = {
        blockId,
        value,
        startX: e.clientX,
        startY: e.clientY,
        moved: false
      };
    });

    window.addEventListener("pointermove", (e) => {
      if (!state.drag) return;
      const dx = e.clientX - state.drag.startX;
      const dy = e.clientY - state.drag.startY;
      if (!state.drag.moved && Math.hypot(dx, dy) > 10) {
        state.drag.moved = true;
        ghost.textContent = String(state.drag.value);
        ghost.classList.remove("hidden");
        CG.audio.playBlockPick();
      }
      if (state.drag.moved) {
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
        highlightDropTargets(e.clientX, e.clientY);
      }
    });

    window.addEventListener("pointerup", (e) => {
      if (!state.drag) return;
      const drag = state.drag;
      state.drag = null;
      ghost.classList.add("hidden");
      clearDropHighlights();

      if (!drag.moved) {
        tryPlaceValue(drag.value, drag.blockId, null);
        return;
      }

      const dropTarget = findDropTargetAt(e.clientX, e.clientY);
      if (dropTarget) {
        tryPlaceValue(drag.value, drag.blockId, dropTarget.dataset.slot || null);
      }
    });

    window.addEventListener("pointercancel", () => {
      state.drag = null;
      ghost.classList.add("hidden");
      clearDropHighlights();
    });
  }

  function getDropSlots() {
    return Array.from(document.querySelectorAll(".eq-drop-slot"));
  }

  function findDropTargetAt(x, y) {
    const slots = getDropSlots();
    for (const slot of slots) {
      const rect = slot.getBoundingClientRect();
      if (x >= rect.left - 24 && x <= rect.right + 24 && y >= rect.top - 24 && y <= rect.bottom + 24) {
        return slot;
      }
    }
    return null;
  }

  function highlightDropTargets(x, y) {
    const hit = findDropTargetAt(x, y);
    getDropSlots().forEach((s) => s.classList.toggle("hover-target", s === hit));
  }

  function clearDropHighlights() {
    getDropSlots().forEach((s) => s.classList.remove("hover-target"));
  }

  function switchMode(newMode) {
    state.mode = newMode;
    state.problemIndex = 0;
    state.stage = Math.min(state.stage, getTotalStages() - 1);
    writeSave();
    generateProblem();
    renderHUD();
    renderProject();
    renderBlueprint();
    renderMounds();
    CG.audio.playBlockPick();

    if (state.mode === "sandbox") {
      setFeedback("Sandbox Mode! Dig up any numbers and weigh 'em on Greta's Scale!", "neutral");
      CG.audio.speak("Sandbox mode, buddy! Dig numbers and test out any sums!", { persona: "foreman", priority: true });
    } else if (state.mode === "age5") {
      setFeedback("Tap a dirt pile below, or tap the boxes to count!", "neutral");
      speakCurrentPuzzle();
    } else {
      setFeedback("New shift started! Tap a dirt pile to dig!", "neutral");
      speakCurrentPuzzle();
    }
  }

  function switchOpMode(newOp) {
    state.opMode = newOp;
    state.problemIndex = 0;
    writeSave();
    generateProblem();
    renderHUD();
    renderBlueprint();
    renderMounds();
    CG.audio.playBlockPick();
    speakCurrentPuzzle();
  }

  // =========================================================================
  // Event Wiring
  // =========================================================================
  function bindUIEvents() {
    const firstUnlock = () => {
      CG.audio.unlockAndStartMusic();
      window.removeEventListener("pointerdown", firstUnlock);
      window.removeEventListener("keydown", firstUnlock);
    };
    window.addEventListener("pointerdown", firstUnlock, { passive: true });
    window.addEventListener("keydown", firstUnlock, { passive: true });

    setupPointerDragging();

    // Tap-to-count blueprint cells (works for both addition & subtraction!)
    els["beam-track-area"].addEventListener("click", (e) => {
      const cell = e.target.closest(".beam-cell[data-count-step]");
      if (!cell) return;
      handleCountBoxTap(Number(cell.dataset.countStep));
    });

    // Dynamic Crew Bar delegation (Helper abilities & Drive! truck swap)
    els["crew-lanes"].addEventListener("click", (e) => {
      const driveBtn = e.target.closest("[data-drive-hero]");
      if (driveBtn) {
        switchDriver(driveBtn.dataset.driveHero);
        return;
      }
      const helperBtn = e.target.closest("[data-helper-hero]");
      if (helperBtn) {
        triggerHelperAction(helperBtn.dataset.helperHero);
      }
    });

    // Amy Foreman widget tap
    els["amy-foreman-btn"].addEventListener("click", () => {
      CG.audio.playWhistle();
      speakCurrentPuzzle();
      setFeedback("👩‍🔧 Amy Foreman: You've got this, builder! Tap the boxes or dig a pile!", "neutral");
    });

    // Operation pills (➕ / ➖ / ➕➖)
    document.querySelectorAll(".op-pill, .op-card-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchOpMode(btn.dataset.op);
      });
    });

    // Treasure Chest Pedestal
    els["chest-pedestal-btn"].addEventListener("click", handleChestPedestalClick);

    // Mini ThinkPad Game Inside Treasure Chest
    els["mini-yard"].addEventListener("click", (e) => {
      const moundBtn = e.target.closest("[data-mini-mound]");
      if (moundBtn) {
        CG.audio.playDig();
        state.miniGame.phase = "pick";
        renderMiniGame();
        return;
      }
      const valBtn = e.target.closest("[data-mini-val]");
      if (valBtn) {
        const val = Number(valBtn.dataset.miniVal);
        if (val === state.miniGame.answer) {
          CG.audio.playRivetSnap();
          state.miniGame.phase = "chest";
          renderMiniGame();
          showAlexBubble("WOOOW! TINY CHEST!", true);
        } else {
          CG.audio.playWrongTry();
          els["mini-feedback"].textContent = "Almost! 1 + 1 = 2 — tap the 1!";
        }
        return;
      }
      const openBtn = e.target.closest("[data-mini-open-chest]");
      if (openBtn) {
        CG.audio.playChestOpen();
        state.gears += 5;
        writeSave();
        renderHUD();
        openMiniGameChest(state.miniGame.depth + 1);
        CG.audio.speak("Haha! Another copy of THIS VERY GAME inside the tiny chest!", { persona: "alex", priority: true });
      }
    });

    // Top HUD Music & Settings
    els["btn-music"].addEventListener("click", () => {
      CG.audio.setMusicEnabled(!CG.audio.musicEnabled);
      writeSave();
      renderHUD();
    });

    els["btn-settings"].addEventListener("click", openSettingsModal);

    document.querySelectorAll(".mode-card").forEach((card) => {
      card.addEventListener("click", () => {
        switchMode(card.dataset.mode);
      });
    });

    els["btn-setting-music"].addEventListener("click", () => {
      CG.audio.setMusicEnabled(!CG.audio.musicEnabled);
      writeSave();
      renderHUD();
    });

    els["btn-setting-sound"].addEventListener("click", () => {
      CG.audio.setSoundEnabled(!CG.audio.soundEnabled);
      writeSave();
      renderHUD();
      if (CG.audio.soundEnabled) CG.audio.playBlockPick();
    });

    els["btn-setting-voice"].addEventListener("click", () => {
      CG.audio.setVoiceEnabled(!CG.audio.voiceEnabled);
      writeSave();
      renderHUD();
    });

    els["music-volume-slider"].addEventListener("input", (e) => {
      CG.audio.setMusicVolume(Number(e.target.value) / 100);
      writeSave();
      syncSettingsControls();
    });

    els["select-amy-voice"].addEventListener("change", (e) => {
      CG.audio.amyVoiceURI = e.target.value;
      writeSave();
    });

    els["select-foreman-voice"].addEventListener("change", (e) => {
      CG.audio.foremanVoiceURI = e.target.value;
      writeSave();
    });

    els["select-alex-voice"].addEventListener("change", (e) => {
      CG.audio.alexVoiceURI = e.target.value;
      writeSave();
    });

    els["btn-test-amy"].addEventListener("click", () => {
      CG.audio.playWhistle();
      CG.audio.speak("Hi! I'm Amy Foreman! Let's check the blueprint together!", { persona: "amy", priority: true });
    });

    els["btn-test-foreman"].addEventListener("click", () => {
      CG.audio.speak("Hey buddy! Grab your hard hat, we're buildin' a bridge today!", { persona: "foreman", priority: true });
    });

    els["btn-test-alex"].addEventListener("click", () => {
      showAlexBubble("Woooow! Gee! Cooool!", true);
    });

    // Title & Active Truck Honks
    els["btn-title-honk"].addEventListener("click", () => {
      CG.audio.playHorn(state.activeHero);
      els["alexander-actor"].classList.add("celebrate");
      setTimeout(() => els["alexander-actor"].classList.remove("celebrate"), 650);
      showAlexBubble("Beep beep! Let's dig!", true);
    });

    els["alexander-actor"].addEventListener("click", () => {
      CG.audio.playHorn(state.activeHero);
      els["alexander-actor"].classList.add("celebrate");
      setTimeout(() => els["alexander-actor"].classList.remove("celebrate"), 650);
      const line = ALEX_TAP_LINES[Math.floor(Math.random() * ALEX_TAP_LINES.length)];
      showAlexBubble(line, true);
    });

    els["btn-read-problem"].addEventListener("click", () => {
      CG.audio.playBlockPick();
      speakCurrentPuzzle();
    });

    // Sandbox Buttons
    els["btn-sandbox-grade"].addEventListener("click", () => {
      CG.audio.playGrade();
      launchRoamingTruck("greta", "drive-across");
      generateProblem();
      renderBlueprint();
      renderMounds();
    });

    els["btn-sandbox-clear"].addEventListener("click", () => {
      state.sandbox = { left: null, right: null };
      CG.audio.playBlockPick();
      renderBlueprint();
    });

    // Modals
    els["btn-projects"].addEventListener("click", openProjectsModal);
    els["btn-garage"].addEventListener("click", openGarageModal);
    els["btn-treasures"].addEventListener("click", openTreasuresModal);

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modal = document.getElementById(btn.dataset.closeModal);
        modal.classList.add("hidden");
        if (modal.id === "celebration-modal") CG.audio.setParadeBoost(false);
      });
    });

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.add("hidden");
          if (backdrop.id === "celebration-modal") CG.audio.setParadeBoost(false);
        }
      });
    });

    els["projects-list"].addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pick-project]");
      if (!btn) return;
      CG.audio.playHorn("greta");
      els["projects-modal"].classList.add("hidden");
      selectProject(btn.dataset.pickProject);
    });

    els["garage-driver-bar"].addEventListener("click", (e) => {
      const btn = e.target.closest("[data-garage-driver]");
      if (!btn) return;
      switchDriver(btn.dataset.garageDriver);
      renderGarageContents();
    });

    els["garage-paints"].addEventListener("click", (e) => {
      const btn = e.target.closest("[data-paint-id]");
      if (!btn) return;
      const paint = CG.characters.PAINTS.find((p) => p.id === btn.dataset.paintId);
      if (!paint) return;
      if (state.unlockedPaints.includes(paint.id)) {
        state.paint = paint.id;
        CG.audio.playBlockPick();
        showAlexBubble("Ooh! Cool paint!", true);
      } else if (state.gears >= paint.cost) {
        state.gears -= paint.cost;
        state.unlockedPaints.push(paint.id);
        state.paint = paint.id;
        CG.audio.playTreasure();
        showAlexBubble(`Woooow! ${paint.name}!`, true);
      } else {
        CG.audio.playWrongTry();
        CG.audio.speak(`Need ${paint.cost} golden gears for ${paint.name}, buddy!`, { persona: "amy", priority: true });
      }
      writeSave();
      renderHUD();
      renderCrew();
      renderGarageContents();
    });

    els["garage-hats"].addEventListener("click", (e) => {
      const btn = e.target.closest("[data-hat-id]");
      if (!btn) return;
      const hat = CG.characters.HATS.find((h) => h.id === btn.dataset.hatId);
      if (!hat) return;
      if (state.unlockedHats.includes(hat.id)) {
        state.hat = hat.id;
        CG.audio.playBlockPick();
        showAlexBubble("Gee! Neat hat!", true);
      } else if (state.gears >= hat.cost) {
        state.gears -= hat.cost;
        state.unlockedHats.push(hat.id);
        state.hat = hat.id;
        CG.audio.playTreasure();
        showAlexBubble(`Cooool! ${hat.name}!`, true);
      } else {
        CG.audio.playWrongTry();
        CG.audio.speak(`Need ${hat.cost} golden gears for that ${hat.name}!`, { persona: "amy", priority: true });
      }
      writeSave();
      renderHUD();
      renderCrew();
      renderGarageContents();
    });

    els["treasures-grid"].addEventListener("click", (e) => {
      const card = e.target.closest("[data-treasure-id]");
      if (!card) return;
      const t = CG.projects.TREASURES.find((item) => item.id === card.dataset.treasureId);
      if (!t) return;
      if (state.unlockedTreasures.includes(t.id)) {
        CG.audio.playTreasure();
        CG.audio.speak(`${t.name}! ${t.story}`, { persona: "amy", priority: true });
      } else {
        CG.audio.playWrongTry();
      }
    });

    els["celeb-parade-trucks"].addEventListener("click", (e) => {
      const btn = e.target.closest("[data-parade-truck]");
      if (!btn) return;
      CG.audio.playHorn(btn.dataset.paradeTruck);
    });

    els["btn-next-project"].addEventListener("click", advanceToNextProject);
    els["btn-replay-project"].addEventListener("click", () => {
      CG.audio.setParadeBoost(false);
      els["celebration-modal"].classList.add("hidden");
      selectProject(state.projectId);
    });
  }

  // =========================================================================
  // Boot
  // =========================================================================
  function init() {
    cacheDOM();
    loadSave();
    generateProblem();
    renderCrew();
    renderHUD();
    renderProject();
    renderBlueprint();
    renderMounds();
    bindUIEvents();
    setFeedback("Tap a dirt pile below, or tap the boxes to count!", "neutral");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
