(function () {
  "use strict";

  const CG = (window.ConstructionGame = window.ConstructionGame || {});

  const TREASURES = [
    { id: "trex", emoji: "🦖", name: "T-Rex Tooth", story: "Found deep under the canyon bedrock!" },
    { id: "wrench", emoji: "🔧", name: "Golden Wrench", story: "Tightens giant bridge bolts!" },
    { id: "pie", emoji: "🥧", name: "Thanksgiving Pie", story: "Warm pumpkin pie for the truck crew!" },
    { id: "turkey", emoji: "🦃", name: "Turkey Feather", story: "A lucky autumn badge for Alexander!" },
    { id: "gem", emoji: "💎", name: "Canyon Diamond", story: "Sparkles harder than headlights!" },
    { id: "cone", emoji: "🚧", name: "Shiny Safety Cone", story: "Keeps every dig site super safe!" },
    { id: "fossil", emoji: "🐚", name: "Spiral Ammonite", story: "An ancient ocean shell fossil!" },
    { id: "helmet", emoji: "⛑️", name: "Chief Engineer Hat", story: "Worn by master bridge builders!" },
    { id: "bolt", emoji: "🔩", name: "Titanium Rivet", story: "Holds skyscrapers steady in the wind!" },
    { id: "corn", emoji: "🌽", name: "Harvest Golden Corn", story: "A sweet Thanksgiving snack!" },
    { id: "compass", emoji: "🧭", name: "Surveyor Compass", story: "Points builders straight and true!" },
    { id: "gear", emoji: "⚙️", name: "Platinum Gear", story: "Powers Scotty's fastest wheelies!" },
    { id: "acorn", emoji: "🌰", name: "Lucky Acorn", story: "Found near Beaver Creek Dam!" },
    { id: "train", emoji: "🚂", name: "Miniature Steam Engine", story: "A tiny toy train from the tunnel!" },
    { id: "trophy", emoji: "🏆", name: "Golden Beam Cup", story: "Awarded for awesome math skills!" },
    { id: "star", emoji: "🌟", name: "Superstar Sticker", story: "You and Alexander are unstoppable!" },
    { id: "minigame", emoji: "💻", name: "Mini ThinkPad Copy", story: "Found inside the Magic Treasure Chest — a playable copy of this very game!" }
  ];

  const PROJECTS = [
    {
      id: "bridge",
      title: "Golden Canyon Suspension Bridge",
      tag: "STRUCTURAL",
      icon: "🌉",
      unit: "Meters (m)",
      description: "Span a deep river canyon with towers, cables, and steel decks!",
      facts: [
        "Stage 1: Concrete piers anchor deep into canyon rock so the bridge never slips!",
        "Stage 2: Tall steel towers carry the bridge weight down into the ground!",
        "Stage 3: Strong truss deck beams must add up to the exact canyon span!",
        "Stage 4: Suspension cables hang in curves called parabolas to hold the road!",
        "Stage 5: Guardrails and lane lines complete the bridge — trucks can cross!"
      ],
      renderSVG(stage) {
        return `
          <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg">
            <!-- Canyon Sky & Hills -->
            <rect width="420" height="180" fill="#a5e3ff"/>
            <circle cx="368" cy="34" r="20" fill="#ffe066"/>
            <path d="M0,120 Q85,78 175,118 T360,104 L420,118 L420,180 L0,180 Z" fill="#95d5b2"/>
            <!-- Canyon Cliffs & River -->
            <path d="M0,115 L88,115 L112,180 L0,180 Z" fill="#b07d4f" stroke="#7f5539" stroke-width="2"/>
            <path d="M332,115 L420,115 L420,180 L308,180 Z" fill="#b07d4f" stroke="#7f5539" stroke-width="2"/>
            <rect x="102" y="152" width="216" height="28" fill="#219ebc"/>
            <path d="M125,163 Q160,157 195,163 T265,163 T305,163" stroke="#90e0ef" stroke-width="3" fill="none" stroke-linecap="round"/>

            <!-- Blueprint Ghost Guide -->
            <g opacity="${stage < 5 ? 0.35 : 0}" stroke="#1971c2" stroke-width="2" stroke-dasharray="5 4" fill="none">
              <rect x="118" y="60" width="16" height="96"/>
              <rect x="286" y="60" width="16" height="96"/>
              <line x1="20" y1="115" x2="400" y2="115"/>
              <path d="M60,115 Q126,38 210,104 Q294,38 360,115"/>
            </g>

            <!-- Stage 1: Concrete Foundation Piers -->
            <g opacity="${stage >= 1 ? 1 : 0}">
              <rect x="112" y="128" width="28" height="46" rx="3" fill="#adb5bd" stroke="#495057" stroke-width="2"/>
              <rect x="280" y="128" width="28" height="46" rx="3" fill="#adb5bd" stroke="#495057" stroke-width="2"/>
            </g>

            <!-- Stage 2: Twin Suspension Towers -->
            <g opacity="${stage >= 2 ? 1 : 0}">
              <rect x="118" y="42" width="16" height="88" rx="3" fill="#e63946" stroke="#780000" stroke-width="2"/>
              <rect x="286" y="42" width="16" height="88" rx="3" fill="#e63946" stroke="#780000" stroke-width="2"/>
              <rect x="114" y="64" width="24" height="7" rx="2" fill="#ff758f"/>
              <rect x="282" y="64" width="24" height="7" rx="2" fill="#ff758f"/>
            </g>

            <!-- Stage 3: Steel Truss Roadway Deck -->
            <g opacity="${stage >= 3 ? 1 : 0}">
              <rect x="18" y="109" width="384" height="12" rx="3" fill="#495057" stroke="#212529" stroke-width="2"/>
              <path d="M24,121 L44,132 L64,121 L84,132 L104,121 M144,121 L164,132 L184,121 L204,132 L224,121 L244,132 L264,121 M316,121 L336,132 L356,121 L376,132 L396,121" stroke="#6c757d" stroke-width="3" fill="none"/>
            </g>

            <!-- Stage 4: Suspension Cables & Hangars -->
            <g opacity="${stage >= 4 ? 1 : 0}" stroke="#d62828" fill="none">
              <path d="M35,109 Q90,94 126,44 Q210,118 294,44 Q330,94 385,109" stroke-width="4" stroke-linecap="round"/>
              <line x1="154" y1="74" x2="154" y2="109" stroke="#e9ecef" stroke-width="2"/>
              <line x1="180" y1="88" x2="180" y2="109" stroke="#e9ecef" stroke-width="2"/>
              <line x1="210" y1="94" x2="210" y2="109" stroke="#e9ecef" stroke-width="2"/>
              <line x1="240" y1="88" x2="240" y2="109" stroke="#e9ecef" stroke-width="2"/>
              <line x1="266" y1="74" x2="266" y2="109" stroke="#e9ecef" stroke-width="2"/>
            </g>

            <!-- Stage 5: Road Stripes, Lights & Happy Crossing Vehicle -->
            <g opacity="${stage >= 5 ? 1 : 0}">
              <line x1="24" y1="115" x2="396" y2="115" stroke="#ffe066" stroke-width="2.5" stroke-dasharray="12 8"/>
              <circle cx="126" cy="36" r="4" fill="#ffd43b"/>
              <circle cx="294" cy="36" r="4" fill="#ffd43b"/>
              <!-- Little celebratory dump truck crossing -->
              <g transform="translate(186, 89)">
                <rect x="0" y="6" width="28" height="12" rx="3" fill="#ffb703" stroke="#1d2b3a" stroke-width="1.8"/>
                <rect x="26" y="8" width="12" height="10" rx="2" fill="#fb8500" stroke="#1d2b3a" stroke-width="1.8"/>
                <circle cx="8" cy="19" r="3.5" fill="#212529"/>
                <circle cx="31" cy="19" r="3.5" fill="#212529"/>
              </g>
            </g>
          </svg>`;
      }
    },
    {
      id: "skyscraper",
      title: "Sunshine Skyscraper Tower",
      tag: "STRUCTURAL LOAD",
      icon: "🏙️",
      unit: "Stories",
      description: "Stack steel girders and sunlit floors high into the clouds!",
      facts: [
        "Stage 1: Deep steel piles anchor the skyscraper into solid bedrock!",
        "Stage 2: Ground atrium columns hold the combined weight of every floor above!",
        "Stage 3: Horizontal steel I-beams tie the columns together into rigid rectangles!",
        "Stage 4: Sunlit glass curtain walls let daylight shine into every room!",
        "Stage 5: The spire and rooftop crane crown the tallest tower in town!"
      ],
      renderSVG(stage) {
        return `
          <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg">
            <rect width="420" height="180" fill="#b8ebff"/>
            <circle cx="64" cy="36" r="22" fill="#ffe066"/>
            <rect x="0" y="154" width="420" height="26" fill="#74c69d"/>
            <rect x="130" y="150" width="160" height="14" fill="#8d99ae"/>

            <!-- Blueprint Ghost -->
            <rect x="155" y="34" width="110" height="120" fill="none" stroke="#1971c2" stroke-width="2" stroke-dasharray="5 4" opacity="${stage < 5 ? 0.35 : 0}"/>

            <!-- Stage 1: Foundation Pad & Piles -->
            <g opacity="${stage >= 1 ? 1 : 0}">
              <rect x="142" y="146" width="136" height="14" rx="3" fill="#6c757d" stroke="#343a40" stroke-width="2"/>
              <rect x="160" y="160" width="14" height="16" fill="#495057"/>
              <rect x="203" y="160" width="14" height="16" fill="#495057"/>
              <rect x="246" y="160" width="14" height="16" fill="#495057"/>
            </g>

            <!-- Stage 2: Lower Atrium Steel Frame -->
            <g opacity="${stage >= 2 ? 1 : 0}">
              <rect x="155" y="110" width="110" height="36" fill="#4dabf7" stroke="#1864ab" stroke-width="2.5"/>
              <rect x="196" y="122" width="28" height="24" rx="2" fill="#ffe066" stroke="#1864ab" stroke-width="2"/>
            </g>

            <!-- Stage 3: Mid-Rise Steel Stories -->
            <g opacity="${stage >= 3 ? 1 : 0}">
              <rect x="155" y="72" width="110" height="38" fill="#339af0" stroke="#1864ab" stroke-width="2.5"/>
              <line x1="155" y1="91" x2="265" y2="91" stroke="#ffd43b" stroke-width="3"/>
            </g>

            <!-- Stage 4: Upper Glass Curtain Stories -->
            <g opacity="${stage >= 4 ? 1 : 0}">
              <rect x="162" y="36" width="96" height="36" fill="#74c0fc" stroke="#1864ab" stroke-width="2.5"/>
              <g fill="#e7f5ff">
                <rect x="172" y="44" width="16" height="18" rx="2"/>
                <rect x="202" y="44" width="16" height="18" rx="2"/>
                <rect x="232" y="44" width="16" height="18" rx="2"/>
                <rect x="168" y="77" width="16" height="10" rx="2"/>
                <rect x="202" y="77" width="16" height="10" rx="2"/>
                <rect x="236" y="77" width="16" height="10" rx="2"/>
                <rect x="168" y="96" width="16" height="10" rx="2"/>
                <rect x="202" y="96" width="16" height="10" rx="2"/>
                <rect x="236" y="96" width="16" height="10" rx="2"/>
              </g>
            </g>

            <!-- Stage 5: Spire, Flag & Tower Crane -->
            <g opacity="${stage >= 5 ? 1 : 0}">
              <rect x="182" y="24" width="56" height="12" rx="3" fill="#ffd43b" stroke="#e67700" stroke-width="2"/>
              <line x1="210" y1="24" x2="210" y2="6" stroke="#e63946" stroke-width="4" stroke-linecap="round"/>
              <circle cx="210" cy="6" r="4" fill="#ffe066"/>
              <polygon points="212,8 232,13 212,18" fill="#51cf66"/>
            </g>
          </svg>`;
      }
    },
    {
      id: "dam",
      title: "Beaver Creek Hydro Dam",
      tag: "HYDRAULIC ENG",
      icon: "💧",
      unit: "Flow Units",
      description: "Channel mighty river water through spillways and clean turbines!",
      facts: [
        "Stage 1: A wide concrete dam base resists huge water pressure at the bottom!",
        "Stage 2: Thick sloping concrete walls hold back the deep mountain lake!",
        "Stage 3: Clean hydro turbines spin from rushing water to make electricity!",
        "Stage 4: Elevated aqueduct pipes deliver fresh water to farms and towns!",
        "Stage 5: Open spillways release sparkling waterfalls safely downstream!"
      ],
      renderSVG(stage) {
        return `
          <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg">
            <rect width="420" height="180" fill="#bdf0ff"/>
            <path d="M0,108 L108,74 L182,115 L312,68 L420,104 L420,180 L0,180 Z" fill="#52b788"/>
            <!-- Upstream Lake -->
            <rect x="0" y="92" width="175" height="88" fill="#0096c7"/>
            <rect x="0" y="156" width="420" height="24" fill="#00b4d8"/>

            <polygon points="158,64 248,64 276,162 152,162" fill="none" stroke="#1971c2" stroke-width="2" stroke-dasharray="5 4" opacity="${stage < 5 ? 0.4 : 0}"/>

            <!-- Stage 1: Foundation & Spillway Apron -->
            <g opacity="${stage >= 1 ? 1 : 0}">
              <rect x="148" y="142" width="134" height="24" rx="4" fill="#adb5bd" stroke="#495057" stroke-width="2"/>
            </g>

            <!-- Stage 2: Main Concrete Dam Wall -->
            <g opacity="${stage >= 2 ? 1 : 0}">
              <polygon points="160,66 242,66 270,144 156,144" fill="#ced4da" stroke="#495057" stroke-width="2.5"/>
              <rect x="155" y="60" width="92" height="10" rx="3" fill="#dee2e6" stroke="#495057" stroke-width="2"/>
            </g>

            <!-- Stage 3: Hydro Powerhouse & Turbines -->
            <g opacity="${stage >= 3 ? 1 : 0}">
              <rect x="262" y="114" width="62" height="36" rx="4" fill="#ffd166" stroke="#e67700" stroke-width="2.2"/>
              <circle cx="282" cy="132" r="9" fill="#4dabf7" stroke="#1864ab" stroke-width="2"/>
              <circle cx="306" cy="132" r="9" fill="#4dabf7" stroke="#1864ab" stroke-width="2"/>
            </g>

            <!-- Stage 4: Aqueduct Pipe Span -->
            <g opacity="${stage >= 4 ? 1 : 0}">
              <rect x="242" y="88" width="166" height="16" rx="6" fill="#48cae4" stroke="#023e8a" stroke-width="2.5"/>
              <rect x="336" y="104" width="12" height="52" fill="#8d99ae" stroke="#495057" stroke-width="2"/>
              <rect x="384" y="104" width="12" height="52" fill="#8d99ae" stroke="#495057" stroke-width="2"/>
            </g>

            <!-- Stage 5: Sparkling Spillway Waterfall -->
            <g opacity="${stage >= 5 ? 1 : 0}">
              <path d="M182,70 L214,70 L236,158 L194,158 Z" fill="#90e0ef" opacity="0.9"/>
              <circle cx="204" cy="156" r="7" fill="#ffffff"/>
              <circle cx="222" cy="154" r="9" fill="#ffffff"/>
              <circle cx="240" cy="157" r="6" fill="#ffffff"/>
            </g>
          </svg>`;
      }
    },
    {
      id: "railway",
      title: "Mountain Express Railway",
      tag: "TRANSPORTATION",
      icon: "🚂",
      unit: "Track Meters",
      description: "Bore through a mountain and bridge the valley for the express train!",
      facts: [
        "Stage 1: Stone viaduct pillars support heavy trains high above the valley!",
        "Stage 2: Arched bridges spread heavy locomotive weight safely outward!",
        "Stage 3: A reinforced stone tunnel lets trains glide right under the mountain!",
        "Stage 4: Parallel steel rails spaced at exact width keep train wheels locked on!",
        "Stage 5: All aboard! The Mountain Express zooms across your completed line!"
      ],
      renderSVG(stage) {
        return `
          <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg">
            <rect width="420" height="180" fill="#c3ebff"/>
            <polygon points="0,160 72,42 152,160" fill="#7f9183"/>
            <polygon points="48,84 72,42 96,84" fill="#ffffff"/>
            <rect x="0" y="148" width="420" height="32" fill="#52b788"/>

            <line x1="16" y1="106" x2="404" y2="106" stroke="#1971c2" stroke-width="2" stroke-dasharray="5 4" opacity="${stage < 5 ? 0.4 : 0}"/>

            <!-- Stage 1: Viaduct Pillars -->
            <g opacity="${stage >= 1 ? 1 : 0}">
              <rect x="176" y="106" width="18" height="48" fill="#adb5bd" stroke="#495057" stroke-width="2"/>
              <rect x="256" y="106" width="18" height="48" fill="#adb5bd" stroke="#495057" stroke-width="2"/>
              <rect x="336" y="106" width="18" height="48" fill="#adb5bd" stroke="#495057" stroke-width="2"/>
            </g>

            <!-- Stage 2: Arched Viaduct Bridge -->
            <g opacity="${stage >= 2 ? 1 : 0}">
              <path d="M168,104 L388,104 L388,126 Q370,108 354,126 L336,126 Q304,106 274,126 L256,126 Q224,106 194,126 L168,126 Z" fill="#ced4da" stroke="#495057" stroke-width="2"/>
            </g>

            <!-- Stage 3: Mountain Tunnel Arch -->
            <g opacity="${stage >= 3 ? 1 : 0}">
              <path d="M98,148 L98,92 C98,74 146,74 146,92 L146,148 Z" fill="#495057" stroke="#212529" stroke-width="3"/>
              <path d="M108,148 L108,98 C108,84 136,84 136,98 L136,148 Z" fill="#1d2b3a"/>
            </g>

            <!-- Stage 4: Railway Deck & Steel Rails -->
            <g opacity="${stage >= 4 ? 1 : 0}">
              <rect x="16" y="98" width="390" height="8" rx="2" fill="#8d5524" stroke="#4a2508" stroke-width="1.8"/>
              <line x1="16" y1="97" x2="406" y2="97" stroke="#dee2e6" stroke-width="3"/>
            </g>

            <!-- Stage 5: Mountain Express Train -->
            <g opacity="${stage >= 5 ? 1 : 0}" transform="translate(205, 66)">
              <rect x="0" y="8" width="46" height="20" rx="4" fill="#e63946" stroke="#1d2b3a" stroke-width="2"/>
              <rect x="30" y="0" width="16" height="16" rx="3" fill="#ffb703" stroke="#1d2b3a" stroke-width="2"/>
              <rect x="8" y="0" width="8" height="10" fill="#343a40"/>
              <circle cx="12" cy="30" r="4.5" fill="#212529"/>
              <circle cx="26" cy="30" r="4.5" fill="#212529"/>
              <circle cx="40" cy="30" r="4.5" fill="#212529"/>
              <rect x="52" y="10" width="38" height="18" rx="3" fill="#219ebc" stroke="#1d2b3a" stroke-width="2"/>
              <circle cx="62" cy="30" r="4" fill="#212529"/>
              <circle cx="80" cy="30" r="4" fill="#212529"/>
            </g>
          </svg>`;
      }
    },
    {
      id: "plaza",
      title: "Thanksgiving Parade Plaza & Wheel",
      tag: "CIVIC FESTIVE",
      icon: "🎡",
      unit: "Meters (m)",
      description: "Build a sunny Thanksgiving festival plaza with a spinning Ferris Wheel!",
      facts: [
        "Stage 1: Level plaza stonework keeps crowds and parade trucks rolling smoothly!",
        "Stage 2: Autumn welcome arches use strong triangles to stand tall!",
        "Stage 3: A balanced A-frame holds the Ferris Wheel hub centered!",
        "Stage 4: Evenly spaced wheel spokes balance all the gondolas in a circle!",
        "Stage 5: Festive flags & the Happy Thanksgiving banner open the celebration!"
      ],
      renderSVG(stage) {
        return `
          <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg">
            <rect width="420" height="180" fill="#ffd8a8"/>
            <rect x="0" y="96" width="420" height="84" fill="#ffc078" opacity="0.45"/>
            <rect x="0" y="144" width="420" height="36" fill="#d9480f"/>

            <circle cx="230" cy="82" r="50" fill="none" stroke="#1971c2" stroke-width="2" stroke-dasharray="5 4" opacity="${stage < 5 ? 0.35 : 0}"/>

            <!-- Stage 1: Parade Plaza Deck -->
            <g opacity="${stage >= 1 ? 1 : 0}">
              <rect x="26" y="138" width="368" height="16" rx="4" fill="#ffe8cc" stroke="#a64b00" stroke-width="2"/>
            </g>

            <!-- Stage 2: Thanksgiving Welcome Arch -->
            <g opacity="${stage >= 2 ? 1 : 0}">
              <rect x="44" y="76" width="14" height="64" fill="#e8590c" stroke="#5c2400" stroke-width="2"/>
              <rect x="118" y="76" width="14" height="64" fill="#e8590c" stroke="#5c2400" stroke-width="2"/>
              <path d="M36,78 Q88,48 140,78" fill="none" stroke="#fab005" stroke-width="10" stroke-linecap="round"/>
            </g>

            <!-- Stage 3: Ferris Wheel A-Frame -->
            <g opacity="${stage >= 3 ? 1 : 0}">
              <line x1="230" y1="82" x2="188" y2="140" stroke="#495057" stroke-width="7" stroke-linecap="round"/>
              <line x1="230" y1="82" x2="272" y2="140" stroke="#495057" stroke-width="7" stroke-linecap="round"/>
              <circle cx="230" cy="82" r="9" fill="#ffd43b" stroke="#1d2b3a" stroke-width="2"/>
            </g>

            <!-- Stage 4: Ferris Wheel Rim & Gondolas -->
            <g opacity="${stage >= 4 ? 1 : 0}">
              <circle cx="230" cy="82" r="48" fill="none" stroke="#e63946" stroke-width="5"/>
              <line x1="230" y1="34" x2="230" y2="130" stroke="#adb5bd" stroke-width="2"/>
              <line x1="182" y1="82" x2="278" y2="82" stroke="#adb5bd" stroke-width="2"/>
              <line x1="196" y1="48" x2="264" y2="116" stroke="#adb5bd" stroke-width="2"/>
              <line x1="264" y1="48" x2="196" y2="116" stroke="#adb5bd" stroke-width="2"/>
              <rect x="223" y="26" width="14" height="12" rx="3" fill="#4cc9f0" stroke="#1d2b3a" stroke-width="1.5"/>
              <rect x="271" y="76" width="14" height="12" rx="3" fill="#ffd43b" stroke="#1d2b3a" stroke-width="1.5"/>
              <rect x="175" y="76" width="14" height="12" rx="3" fill="#51cf66" stroke="#1d2b3a" stroke-width="1.5"/>
              <rect x="223" y="124" width="14" height="12" rx="3" fill="#ff922b" stroke="#1d2b3a" stroke-width="1.5"/>
            </g>

            <!-- Stage 5: Festive Banner & Autumn Pumpkins -->
            <g opacity="${stage >= 5 ? 1 : 0}">
              <rect x="304" y="96" width="84" height="24" rx="8" fill="#8338ec" stroke="#fff" stroke-width="2"/>
              <text x="346" y="112" text-anchor="middle" font-size="9.5" font-weight="900" fill="#ffe066">HAPPY HARVEST!</text>
              <circle cx="332" cy="133" r="8" fill="#f76707" stroke="#5c2400" stroke-width="1.5"/>
              <circle cx="358" cy="133" r="9" fill="#ff922b" stroke="#5c2400" stroke-width="1.5"/>
            </g>
          </svg>`;
      }
    }
  ];

  CG.projects = {
    TREASURES,
    PROJECTS,
    getProject(id) {
      return PROJECTS.find((p) => p.id === id) || PROJECTS[0];
    }
  };
})();
