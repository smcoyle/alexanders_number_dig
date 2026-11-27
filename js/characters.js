(function () {
  "use strict";

  const CG = (window.ConstructionGame = window.ConstructionGame || {});

  const PAINTS = [
    { id: "yellow", name: "Classic Yellow", cost: 0, primary: "#ffb703", shade: "#e08e00", accent: "#219ebc" },
    { id: "dino", name: "Dino Green", cost: 4, primary: "#38b000", shade: "#257800", accent: "#ffbe0b" },
    { id: "fire", name: "Fire Rescue Red", cost: 8, primary: "#ef233c", shade: "#b80d22", accent: "#ffd166" },
    { id: "cosmic", name: "Cosmic Blue", cost: 12, primary: "#3a86ff", shade: "#1b59c7", accent: "#ffbe0b" },
    { id: "gold", name: "Golden Champion", cost: 20, primary: "#ffd60a", shade: "#d99b00", accent: "#7209b7" }
  ];

  const HATS = [
    { id: "bluecap", name: "Foreman Cap", emoji: "🧢", cost: 0 },
    { id: "turkey", name: "Turkey Hat", emoji: "🦃", cost: 3 },
    { id: "dino", name: "Dino Spikes", emoji: "🦖", cost: 7 },
    { id: "beacon", name: "Safety Strobe", emoji: "🚨", cost: 11 },
    { id: "crown", name: "Builder Crown", emoji: "👑", cost: 16 }
  ];

  const HEROES = [
    {
      id: "alexander",
      name: "Alexander the Excavator",
      shortName: "Alexander",
      emoji: "🚜",
      helperTitle: "Alexander",
      helperSubtitle: "⛏️ Super Scoop",
      driveName: "Alex"
    },
    {
      id: "danny",
      name: "Danny Dozer",
      shortName: "Danny Dozer",
      emoji: "🚧",
      helperTitle: "Danny Dozer",
      helperSubtitle: "🚜 Push Hint",
      driveName: "Danny"
    },
    {
      id: "scotty",
      name: "Scotty Skidsteer",
      shortName: "Scotty",
      emoji: "⚡",
      helperTitle: "Scotty Skidsteer",
      helperSubtitle: "⚡ Wheelie Boost",
      driveName: "Scotty"
    },
    {
      id: "greta",
      name: "Greta Grader",
      shortName: "Greta Grader",
      emoji: "📐",
      helperTitle: "Greta Grader",
      helperSubtitle: "📏 Count Spaces",
      driveName: "Greta"
    }
  ];

  function getPaint(paintId) {
    return PAINTS.find((p) => p.id === paintId) || PAINTS[0];
  }

  function renderHatSVG(hatId, offsetX = 36, offsetY = 15, scale = 1) {
    let inner = "";
    switch (hatId) {
      case "turkey":
        inner = `
          <g transform="translate(2, -3)">
            <ellipse cx="14" cy="14" rx="14" ry="8" fill="#8d5524" stroke="#4a2508" stroke-width="2"/>
            <path d="M2,11 L-5,3 L5,7 L7,-3 L14,6 L21,-3 L23,7 L33,3 L26,11 Z" fill="#f77f00" stroke="#9e2a2b" stroke-width="1.5"/>
            <circle cx="14" cy="12" r="7" fill="#a4632b"/>
            <circle cx="11" cy="11" r="1.5" fill="#111"/>
            <circle cx="17" cy="11" r="1.5" fill="#111"/>
            <polygon points="14,12 11,16 17,16" fill="#fcbf49"/>
            <path d="M16,15 Q19,18 16,20" stroke="#d62828" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          </g>`;
        break;
      case "dino":
        inner = `
          <g transform="translate(0, -3)">
            <path d="M4,18 L10,4 L18,16 L24,2 L32,16 L38,6 L42,18 Z" fill="#52b788" stroke="#1b4332" stroke-width="2" stroke-linejoin="round"/>
            <rect x="2" y="16" width="42" height="6" rx="3" fill="#2d6a4f"/>
          </g>`;
        break;
      case "beacon":
        inner = `
          <g transform="translate(13, -5)">
            <rect x="2" y="14" width="16" height="6" rx="2" fill="#343a40"/>
            <path d="M4,14 C4,4 16,4 16,14 Z" fill="#ff922b" stroke="#fff" stroke-width="1.5"/>
            <line x1="10" y1="0" x2="10" y2="4" stroke="#ffd43b" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="0" y1="5" x2="4" y2="8" stroke="#ffd43b" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="20" y1="5" x2="16" y2="8" stroke="#ffd43b" stroke-width="2.5" stroke-linecap="round"/>
          </g>`;
        break;
      case "crown":
        inner = `
          <g transform="translate(3, -5)">
            <polygon points="2,20 5,6 15,14 23,3 31,14 41,6 44,20" fill="#ffd43b" stroke="#b87a00" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="23" cy="14" r="3" fill="#e63946"/>
            <circle cx="11" cy="15" r="2.2" fill="#219ebc"/>
            <circle cx="35" cy="15" r="2.2" fill="#219ebc"/>
          </g>`;
        break;
      case "bluecap":
      default:
        inner = `
          <g>
            <path d="M4,16 C4,4 40,4 40,16 Z" fill="#219ebc" stroke="#0b3c5d" stroke-width="2"/>
            <path d="M34,13 L50,15 C52,16 51,18 47,18 L34,17 Z" fill="#126782" stroke="#0b3c5d" stroke-width="1.5"/>
            <circle cx="22" cy="10" r="3.5" fill="#ffe066"/>
          </g>`;
        break;
    }
    return `<g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">${inner}</g>`;
  }

  function renderAlexanderSVG(options = {}) {
    const paint = getPaint(options.paint || "yellow");
    const hatId = options.hat || "bluecap";
    return `
      <svg viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg" aria-label="Alexander the Excavator">
        <g class="truck-idle-bounce">
          <rect x="26" y="42" width="8" height="22" rx="3" fill="#495057" stroke="#212529" stroke-width="2"/>
          <circle cx="28" cy="34" r="5" fill="rgba(255,255,255,0.75)"/>
          <circle cx="22" cy="24" r="4" fill="rgba(255,255,255,0.55)"/>

          <g class="alex-boom-group">
            <path d="M72,82 L106,34 C110,29 118,31 120,38 L88,88 Z" fill="${paint.primary}" stroke="#1d2b3a" stroke-width="3" stroke-linejoin="round"/>
            <line x1="86" y1="68" x2="108" y2="42" stroke="#adb5bd" stroke-width="5" stroke-linecap="round"/>
            <circle cx="78" cy="82" r="5" fill="#343a40"/>

            <g class="alex-dipper-group">
              <circle cx="114" cy="38" r="5.5" fill="#343a40"/>
              <path d="M111,36 L124,36 L142,84 L130,88 Z" fill="${paint.shade}" stroke="#1d2b3a" stroke-width="3" stroke-linejoin="round"/>
              <g transform="translate(128, 78)">
                <path d="M2,6 L28,6 C34,18 28,34 10,34 C0,34 -4,22 2,6 Z" fill="#6c757d" stroke="#1d2b3a" stroke-width="3" stroke-linejoin="round"/>
                <polygon points="27,9 35,12 28,15" fill="#dee2e6" stroke="#1d2b3a" stroke-width="1.5"/>
                <polygon points="28,17 36,20 27,23" fill="#dee2e6" stroke="#1d2b3a" stroke-width="1.5"/>
                <polygon points="24,25 32,29 22,31" fill="#dee2e6" stroke="#1d2b3a" stroke-width="1.5"/>
              </g>
            </g>
          </g>

          <rect x="18" y="60" width="64" height="40" rx="10" fill="${paint.primary}" stroke="#1d2b3a" stroke-width="3"/>
          <rect x="23" y="69" width="20" height="22" rx="4" fill="${paint.shade}"/>
          <line x1="27" y1="74" x2="39" y2="74" stroke="#1d2b3a" stroke-width="2" stroke-linecap="round"/>
          <line x1="27" y1="80" x2="39" y2="80" stroke="#1d2b3a" stroke-width="2" stroke-linecap="round"/>
          <line x1="27" y1="86" x2="39" y2="86" stroke="#1d2b3a" stroke-width="2" stroke-linecap="round"/>

          <path d="M40,28 L74,28 C79,28 84,33 84,40 L84,72 L40,72 Z" fill="${paint.primary}" stroke="#1d2b3a" stroke-width="3" stroke-linejoin="round"/>
          <rect x="47" y="34" width="32" height="28" rx="7" fill="#d8f3ff" stroke="#1d2b3a" stroke-width="2.5"/>

          <g class="eye-blink" style="transform-origin: 63px 47px;">
            <circle cx="56" cy="46" r="5.5" fill="#ffffff"/>
            <circle cx="69" cy="46" r="5.5" fill="#ffffff"/>
            <circle cx="57.5" cy="46" r="3.2" fill="#1d2b3a"/>
            <circle cx="70.5" cy="46" r="3.2" fill="#1d2b3a"/>
            <circle cx="58.5" cy="44.5" r="1.1" fill="#ffffff"/>
            <circle cx="71.5" cy="44.5" r="1.1" fill="#ffffff"/>
          </g>
          <circle cx="50" cy="54" r="3.2" fill="#ff8fa3" opacity="0.75"/>
          <circle cx="75" cy="54" r="3.2" fill="#ff8fa3" opacity="0.75"/>
          <path d="M57,56 Q63,62 69,56" fill="none" stroke="#1d2b3a" stroke-width="2.3" stroke-linecap="round"/>

          <rect x="44" y="75" width="36" height="16" rx="4" fill="${paint.accent}" stroke="#1d2b3a" stroke-width="1.8"/>
          <text x="62" y="86" text-anchor="middle" font-size="8.2" font-weight="900" fill="#ffffff" stroke="#1d2b3a" stroke-width="0.4">ALEX</text>

          ${renderHatSVG(hatId, 36, 15, 1)}

          <rect x="14" y="98" width="78" height="24" rx="12" fill="#343a40" stroke="#1d2b3a" stroke-width="3"/>
          <rect x="20" y="103" width="66" height="14" rx="7" fill="#495057"/>
          <circle cx="27" cy="110" r="6" fill="#adb5bd" stroke="#1d2b3a" stroke-width="2"/>
          <circle cx="45" cy="110" r="4.5" fill="#868e96" stroke="#1d2b3a" stroke-width="1.8"/>
          <circle cx="61" cy="110" r="4.5" fill="#868e96" stroke="#1d2b3a" stroke-width="1.8"/>
          <circle cx="78" cy="110" r="6" fill="#adb5bd" stroke="#1d2b3a" stroke-width="2"/>
        </g>
      </svg>`;
  }

  function renderDannySVG(options = null) {
    const useCustom = Boolean(options && options.paint && options.paint !== "yellow");
    const paint = useCustom ? getPaint(options.paint) : null;
    const bodyColor = paint ? paint.primary : "#fb8500";
    const cabColor = paint ? paint.shade : "#ffb703";
    const hatId = options && options.hat ? options.hat : null;

    return `
      <svg viewBox="0 0 150 98" xmlns="http://www.w3.org/2000/svg" aria-label="Danny Dozer">
        <g class="truck-idle-bounce">
          <rect x="34" y="22" width="7" height="18" rx="3" fill="#495057" stroke="#1d2b3a" stroke-width="2"/>
          <rect x="22" y="36" width="72" height="32" rx="8" fill="${bodyColor}" stroke="#1d2b3a" stroke-width="3"/>
          <path d="M36,18 L72,18 C77,18 80,22 80,28 L80,46 L34,46 L34,28 C34,22 36,18 36,18 Z" fill="${cabColor}" stroke="#1d2b3a" stroke-width="3"/>
          ${
            hatId
              ? renderHatSVG(hatId, 34, 4, 0.9)
              : `<path d="M40,18 C40,8 72,8 72,18 Z" fill="#f77f00" stroke="#1d2b3a" stroke-width="2"/>
                 <rect x="37" y="16" width="39" height="4" rx="2" fill="#e85d04"/>`
          }
          <rect x="42" y="23" width="32" height="20" rx="5" fill="#e7f5ff" stroke="#1d2b3a" stroke-width="2"/>
          <g class="eye-blink" style="transform-origin: 58px 32px;">
            <circle cx="51" cy="31" r="4.5" fill="#fff"/>
            <circle cx="65" cy="31" r="4.5" fill="#fff"/>
            <circle cx="52" cy="31" r="2.7" fill="#1d2b3a"/>
            <circle cx="66" cy="31" r="2.7" fill="#1d2b3a"/>
          </g>
          <path d="M52,38 Q58,43 64,38" fill="none" stroke="#1d2b3a" stroke-width="2" stroke-linecap="round"/>
          <rect x="18" y="66" width="76" height="20" rx="10" fill="#343a40" stroke="#1d2b3a" stroke-width="3"/>
          <circle cx="30" cy="76" r="5.5" fill="#adb5bd" stroke="#1d2b3a" stroke-width="2"/>
          <circle cx="56" cy="76" r="5" fill="#868e96" stroke="#1d2b3a" stroke-width="1.8"/>
          <circle cx="82" cy="76" r="5.5" fill="#adb5bd" stroke="#1d2b3a" stroke-width="2"/>
          <g class="danny-blade-group">
            <rect x="88" y="56" width="22" height="8" rx="3" fill="#495057" stroke="#1d2b3a" stroke-width="2"/>
            <path d="M108,36 C122,40 128,64 122,84 L106,84 C110,68 108,48 104,38 Z" fill="#ced4da" stroke="#1d2b3a" stroke-width="3" stroke-linejoin="round"/>
            <rect x="108" y="44" width="12" height="6" rx="2" fill="#ffd43b"/>
          </g>
        </g>
      </svg>`;
  }

  function renderScottySVG(options = null) {
    const useCustom = Boolean(options && options.paint && options.paint !== "yellow");
    const paint = useCustom ? getPaint(options.paint) : null;
    const cabColor = paint ? paint.primary : "#38b000";
    const armColor = paint ? paint.accent : "#00b4d8";
    const hatId = options && options.hat ? options.hat : null;

    return `
      <svg viewBox="0 0 150 98" xmlns="http://www.w3.org/2000/svg" aria-label="Scotty Skidsteer">
        <g class="truck-idle-bounce">
          <path d="M36,24 L76,24 C82,24 86,30 86,38 L86,64 L30,64 L30,36 C30,29 32,24 36,24 Z" fill="${cabColor}" stroke="#1d2b3a" stroke-width="3"/>
          ${hatId ? renderHatSVG(hatId, 34, 9, 0.92) : ""}
          <rect x="44" y="30" width="35" height="22" rx="6" fill="#d8f3ff" stroke="#1d2b3a" stroke-width="2.2"/>
          <g class="eye-blink" style="transform-origin: 62px 40px;">
            <circle cx="55" cy="40" r="4.8" fill="#fff"/>
            <circle cx="69" cy="40" r="4.8" fill="#fff"/>
            <circle cx="56.5" cy="40" r="2.8" fill="#1d2b3a"/>
            <circle cx="70.5" cy="40" r="2.8" fill="#1d2b3a"/>
          </g>
          <path d="M56,47 Q62,52 68,47" fill="none" stroke="#1d2b3a" stroke-width="2.2" stroke-linecap="round"/>
          <polygon points="34,55 56,55 50,60 70,60 46,63 52,58 34,58" fill="#ffe066"/>
          <g class="scotty-bucket-group">
            <path d="M54,50 L104,56 L104,65 L52,58 Z" fill="${armColor}" stroke="#1d2b3a" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M102,48 L128,56 L120,78 L98,76 Z" fill="#ffd166" stroke="#1d2b3a" stroke-width="2.8" stroke-linejoin="round"/>
          </g>
          <circle cx="42" cy="72" r="14" fill="#212529" stroke="#1d2b3a" stroke-width="3"/>
          <circle cx="42" cy="72" r="6.5" fill="#ffe066" stroke="#1d2b3a" stroke-width="2"/>
          <circle cx="76" cy="72" r="14" fill="#212529" stroke="#1d2b3a" stroke-width="3"/>
          <circle cx="76" cy="72" r="6.5" fill="#ffe066" stroke="#1d2b3a" stroke-width="2"/>
        </g>
      </svg>`;
  }

  function renderGretaSVG(options = null) {
    const useCustom = Boolean(options && options.paint && options.paint !== "yellow");
    const paint = useCustom ? getPaint(options.paint) : null;
    const frameColor = paint ? paint.primary : "#8338ec";
    const cabColor = paint ? paint.shade : "#a76df7";
    const hatId = options && options.hat ? options.hat : null;

    return `
      <svg viewBox="0 0 164 98" xmlns="http://www.w3.org/2000/svg" aria-label="Greta Grader">
        <g class="truck-idle-bounce">
          <path d="M22,44 L134,44 L134,56 L92,56 L82,68 L22,68 Z" fill="${frameColor}" stroke="#1d2b3a" stroke-width="3" stroke-linejoin="round"/>
          <path d="M26,20 L66,20 C72,20 75,25 75,32 L75,48 L26,48 Z" fill="${cabColor}" stroke="#1d2b3a" stroke-width="3"/>
          ${
            hatId
              ? renderHatSVG(hatId, 28, 6, 0.9)
              : `<rect x="28" y="13" width="38" height="8" rx="4" fill="#ffd43b" stroke="#1d2b3a" stroke-width="2"/>
                 <circle cx="42" cy="17" r="4" fill="#74c0fc" stroke="#1d2b3a" stroke-width="1.5"/>
                 <circle cx="54" cy="17" r="4" fill="#74c0fc" stroke="#1d2b3a" stroke-width="1.5"/>`
          }
          <rect x="34" y="25" width="34" height="19" rx="5" fill="#e7f5ff" stroke="#1d2b3a" stroke-width="2"/>
          <g class="eye-blink" style="transform-origin: 51px 34px;">
            <circle cx="44" cy="33" r="4.3" fill="#fff"/>
            <circle cx="58" cy="33" r="4.3" fill="#fff"/>
            <circle cx="45.2" cy="33" r="2.6" fill="#1d2b3a"/>
            <circle cx="59.2" cy="33" r="2.6" fill="#1d2b3a"/>
          </g>
          <path d="M46,40 Q51,44 56,40" fill="none" stroke="#1d2b3a" stroke-width="2" stroke-linecap="round"/>

          <rect x="86" y="47" width="36" height="7" rx="2" fill="#ffe066" stroke="#1d2b3a" stroke-width="1.5"/>

          <g class="greta-blade-group">
            <path d="M74,58 L106,68 L100,84 L68,74 Z" fill="#ffd43b" stroke="#1d2b3a" stroke-width="2.5" stroke-linejoin="round"/>
            <circle cx="88" cy="56" r="5" fill="#adb5bd" stroke="#1d2b3a" stroke-width="2"/>
          </g>

          <circle cx="32" cy="74" r="11.5" fill="#212529" stroke="#1d2b3a" stroke-width="2.5"/>
          <circle cx="32" cy="74" r="5" fill="#ffd43b"/>
          <circle cx="56" cy="74" r="11.5" fill="#212529" stroke="#1d2b3a" stroke-width="2.5"/>
          <circle cx="56" cy="74" r="5" fill="#ffd43b"/>
          <circle cx="126" cy="72" r="12.5" fill="#212529" stroke="#1d2b3a" stroke-width="2.5"/>
          <circle cx="126" cy="72" r="5.5" fill="#ffd43b"/>
        </g>
      </svg>`;
  }

  function renderHeroSVG(heroId, options = {}) {
    switch (heroId) {
      case "danny":
        return renderDannySVG(options);
      case "scotty":
        return renderScottySVG(options);
      case "greta":
        return renderGretaSVG(options);
      case "alexander":
      default:
        return renderAlexanderSVG(options);
    }
  }

  // Fifth character: Amy Foreman (cute with glasses, yellow hard hat, and a crisp white lab coat!)
  function renderAmyForemanSVG() {
    return `
      <svg viewBox="0 0 110 118" xmlns="http://www.w3.org/2000/svg" aria-label="Amy Foreman">
        <g class="truck-idle-bounce">
          <!-- Flowing chestnut hair behind shoulders -->
          <path d="M26,42 C18,55 16,74 22,86 L88,86 C94,74 92,55 84,42 Z" fill="#6f3b26" stroke="#3c1e12" stroke-width="2.5"/>
          <!-- Lab coat body over cute coral top -->
          <path d="M24,116 L28,74 C30,66 38,62 55,62 C72,62 80,66 82,74 L86,116 Z" fill="#ffffff" stroke="#1d2b3a" stroke-width="2.6" stroke-linejoin="round"/>
          <!-- Coral top V-neck -->
          <polygon points="44,64 66,64 55,88" fill="#ff6b6b" stroke="#1d2b3a" stroke-width="1.8"/>
          <!-- Lab coat lapels -->
          <polygon points="42,64 52,88 37,84" fill="#edf2f7" stroke="#1d2b3a" stroke-width="1.8"/>
          <polygon points="68,64 58,88 73,84" fill="#edf2f7" stroke="#1d2b3a" stroke-width="1.8"/>
          <!-- Lab coat pocket with pen & ruler -->
          <rect x="64" y="88" width="14" height="14" rx="3" fill="#f8f9fa" stroke="#adb5bd" stroke-width="1.5"/>
          <rect x="67" y="82" width="3.5" height="9" rx="1" fill="#ffd43b" stroke="#1d2b3a" stroke-width="1"/>
          <rect x="72" y="83" width="3" height="8" rx="1" fill="#219ebc"/>
          <!-- Blueprint clipboard -->
          <g transform="translate(8, 76) rotate(-10)">
            <rect x="0" y="4" width="22" height="28" rx="3" fill="#1971c2" stroke="#1d2b3a" stroke-width="2"/>
            <rect x="3" y="8" width="16" height="20" rx="1" fill="#e7f5ff"/>
            <rect x="7" y="1" width="8" height="5" rx="1.5" fill="#ffd43b" stroke="#1d2b3a" stroke-width="1.3"/>
            <line x1="6" y1="14" x2="16" y2="14" stroke="#1971c2" stroke-width="1.5"/>
            <line x1="6" y1="19" x2="14" y2="19" stroke="#1971c2" stroke-width="1.5"/>
          </g>

          <!-- Neck & Warm Smiling Face -->
          <rect x="49" y="54" width="12" height="11" rx="4" fill="#ffd8be"/>
          <ellipse cx="55" cy="40" rx="22" ry="21" fill="#ffe0c9" stroke="#3c1e12" stroke-width="2.2"/>
          <!-- Hair bangs sweeping past hard hat -->
          <path d="M33,34 C38,22 50,20 58,24 C67,20 75,25 77,35 C71,28 60,28 54,31 C46,27 38,29 33,34 Z" fill="#7f462c" stroke="#3c1e12" stroke-width="1.8"/>

          <!-- Cute expressive eyes + dark-rimmed glasses -->
          <g class="eye-blink" style="transform-origin: 55px 41px;">
            <circle cx="45" cy="41" r="3.5" fill="#1d2b3a"/>
            <circle cx="65" cy="41" r="3.5" fill="#1d2b3a"/>
            <circle cx="46.2" cy="39.8" r="1.2" fill="#ffffff"/>
            <circle cx="66.2" cy="39.8" r="1.2" fill="#ffffff"/>
          </g>
          <!-- Stylish Glasses -->
          <rect x="35" y="34.5" width="18" height="12.5" rx="4.5" fill="rgba(165, 216, 255, 0.25)" stroke="#183153" stroke-width="2.4"/>
          <rect x="57" y="34.5" width="18" height="12.5" rx="4.5" fill="rgba(165, 216, 255, 0.25)" stroke="#183153" stroke-width="2.4"/>
          <line x1="53" y1="40" x2="57" y2="40" stroke="#183153" stroke-width="2.4"/>
          <line x1="38" y1="38" x2="42" y2="37" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round"/>
          <line x1="60" y1="38" x2="64" y2="37" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round"/>

          <!-- Rosy cheeks & warm smile -->
          <circle cx="38" cy="49" r="3.2" fill="#ff8fa3" opacity="0.7"/>
          <circle cx="72" cy="49" r="3.2" fill="#ff8fa3" opacity="0.7"/>
          <path d="M49,51 Q55,56 61,51" fill="none" stroke="#a63c3c" stroke-width="2.2" stroke-linecap="round"/>

          <!-- Yellow Construction Hard Hat -->
          <path d="M29,27 C29,7 81,7 81,27 Z" fill="#ffd43b" stroke="#1d2b3a" stroke-width="2.5"/>
          <rect x="25" y="24" width="60" height="5.5" rx="2.7" fill="#fab005" stroke="#1d2b3a" stroke-width="2"/>
          <rect x="49" y="10" width="12" height="14" rx="3" fill="#ffe89e"/>
        </g>
      </svg>`;
  }

  // Adorable little "Noah!" puppy popping out of a dirt burrow
  function renderNoahDogSVG() {
    return `
      <svg viewBox="0 0 130 96" xmlns="http://www.w3.org/2000/svg" aria-label="Little Puppy saying Noah">
        <!-- Dirt Burrow Rim -->
        <ellipse cx="65" cy="79" rx="52" ry="12" fill="#4f290a" stroke="#2d1504" stroke-width="2.5"/>
        <ellipse cx="65" cy="77" rx="44" ry="8" fill="#2d1504"/>

        <!-- Puppy Body & Head (animates popping up / ducking down) -->
        <g class="noah-puppy-body">
          <!-- Floppy Ears -->
          <ellipse cx="38" cy="42" rx="10" ry="16" transform="rotate(18 38 42)" fill="#7f4f24" stroke="#2d1504" stroke-width="2.3"/>
          <ellipse cx="92" cy="42" rx="10" ry="16" transform="rotate(-18 92 42)" fill="#7f4f24" stroke="#2d1504" stroke-width="2.3"/>
          <!-- Fluffy Puppy Head -->
          <ellipse cx="65" cy="46" rx="24" ry="21" fill="#c68b59" stroke="#2d1504" stroke-width="2.5"/>
          <!-- Cream Muzzle Patch -->
          <ellipse cx="65" cy="52" rx="14" ry="11" fill="#fff1d6"/>
          <!-- Tiny Yellow Safety Hard Hat -->
          <path d="M46,29 C46,16 84,16 84,29 Z" fill="#ffd43b" stroke="#1d2b3a" stroke-width="2"/>
          <rect x="43" y="27" width="44" height="4.5" rx="2.2" fill="#fab005" stroke="#1d2b3a" stroke-width="1.5"/>
          <!-- Sparkling Puppy Eyes -->
          <circle cx="55" cy="41" r="4.2" fill="#1d2b3a"/>
          <circle cx="75" cy="41" r="4.2" fill="#1d2b3a"/>
          <circle cx="56.3" cy="39.5" r="1.4" fill="#ffffff"/>
          <circle cx="76.3" cy="39.5" r="1.4" fill="#ffffff"/>
          <!-- Boopable Nose & Happy Tongue -->
          <ellipse cx="65" cy="48" rx="4.5" ry="3.2" fill="#212529"/>
          <path d="M58,54 Q65,59 72,54" fill="none" stroke="#2d1504" stroke-width="2" stroke-linecap="round"/>
          <path d="M62,56 C62,64 68,64 68,56 Z" fill="#ff758f" stroke="#a4133c" stroke-width="1.3"/>
          <!-- Little Paws on Burrow Rim -->
          <ellipse cx="44" cy="74" rx="9" ry="6" fill="#d49b6a" stroke="#2d1504" stroke-width="2"/>
          <ellipse cx="86" cy="74" rx="9" ry="6" fill="#d49b6a" stroke="#2d1504" stroke-width="2"/>
        </g>
        <!-- Front Dirt Lip masking puppy when ducked -->
        <path d="M13,79 Q65,93 117,79 L122,94 L8,94 Z" fill="#9b5e28"/>
      </svg>`;
  }

  function renderTreasureChestSVG(unlocked = false) {
    return `
      <svg viewBox="0 0 90 74" xmlns="http://www.w3.org/2000/svg" aria-label="Buried Treasure Chest">
        <ellipse cx="45" cy="65" rx="34" ry="6" fill="rgba(0,0,0,0.28)"/>
        <!-- Chest Base -->
        <rect x="14" y="34" width="62" height="30" rx="5" fill="#9c5a25" stroke="#3c1e08" stroke-width="2.5"/>
        <!-- Chest Lid -->
        <path d="M12,34 C12,15 78,15 78,34 Z" fill="#b86b2b" stroke="#3c1e08" stroke-width="2.5"/>
        <!-- Gold Bands -->
        <rect x="23" y="20" width="7" height="44" rx="2" fill="#ffd43b" stroke="#8f5b00" stroke-width="1.5"/>
        <rect x="60" y="20" width="7" height="44" rx="2" fill="#ffd43b" stroke="#8f5b00" stroke-width="1.5"/>
        <rect x="12" y="31" width="66" height="6" rx="2" fill="#fcc419" stroke="#8f5b00" stroke-width="1.5"/>
        <!-- Lock -->
        <rect x="38" y="32" width="14" height="16" rx="3" fill="${unlocked ? "#69db7c" : "#ffe066"}" stroke="#3c1e08" stroke-width="2"/>
        <circle cx="45" cy="39" r="2.6" fill="#3c1e08"/>
        <path d="M43.5,41 L46.5,41 L47,45 L43,45 Z" fill="#3c1e08"/>
      </svg>`;
  }

  function renderDirtMoundSVG(variant = 0) {
    const colors = [
      ["#b06d34", "#7b4316", "#582e0d"],
      ["#a4642d", "#743f14", "#4f290a"],
      ["#bd783d", "#844a1a", "#5f320e"]
    ][variant % 3];

    return `
      <svg class="mound-svg" viewBox="0 0 140 86" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="70" cy="76" rx="62" ry="9" fill="rgba(45, 20, 4, 0.35)"/>
        <path d="M12,74 C22,36 42,16 70,16 C98,16 118,36 128,74 Z" fill="${colors[0]}" stroke="${colors[2]}" stroke-width="3"/>
        <path d="M24,72 C36,44 50,32 70,32 C88,32 104,46 116,72 Z" fill="${colors[1]}" opacity="0.45"/>
        <circle cx="44" cy="54" r="5" fill="#8d99ae" stroke="#495057" stroke-width="1.5"/>
        <circle cx="92" cy="58" r="4" fill="#adb5bd" stroke="#495057" stroke-width="1.5"/>
        <circle cx="72" cy="40" r="3.5" fill="#ffe066" opacity="0.85"/>
        <path d="M58,24 L61,30 L67,33 L61,36 L58,42 L55,36 L49,33 L55,30 Z" fill="#fff3bf" opacity="0.85"/>
      </svg>`;
  }

  CG.characters = {
    PAINTS,
    HATS,
    HEROES,
    getPaint,
    renderAlexanderSVG,
    renderDannySVG,
    renderScottySVG,
    renderGretaSVG,
    renderHeroSVG,
    renderAmyForemanSVG,
    renderNoahDogSVG,
    renderTreasureChestSVG,
    renderDirtMoundSVG
  };
})();
