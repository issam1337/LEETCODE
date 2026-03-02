import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0c0a09",
  surface: "#1c1917",
  surfaceBorder: "#292524",
  windowBg: "rgba(14, 165, 233, 0.08)",
  windowBorder: "#0ea5e9",
  accent: "#0ea5e9",
  accentGlow: "rgba(14, 165, 233, 0.25)",
  warm: "#f97316",
  warmGlow: "rgba(249, 115, 22, 0.2)",
  mint: "#34d399",
  mintGlow: "rgba(52, 211, 153, 0.15)",
  rose: "#f43f5e",
  roseGlow: "rgba(244, 63, 94, 0.2)",
  violet: "#a78bfa",
  text: "#fafaf9",
  textDim: "#a8a29e",
  textMuted: "#78716c",
  charBg: "#292524",
  charBorder: "#44403c",
};

// ═══════════════════════════════════════════════
// GENERATE STEPS for any input string
// ═══════════════════════════════════════════════
function generateSteps(s) {
  const steps = [];
  const lastSeen = {};
  let left = 0;
  let maxLen = 0;
  let bestLeft = 0;
  let bestRight = 0;

  steps.push({
    title: "Initialize",
    desc: "Set two pointers: left = 0, right = 0. The window starts empty. We'll expand right one character at a time.",
    left: 0, right: -1, maxLen: 0,
    bestLeft: 0, bestRight: -1,
    highlight: -1, duplicate: -1,
    lastSeen: {}, action: "ready",
  });

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    let duplicate = -1;
    let moved = false;

    if (lastSeen[ch] !== undefined && lastSeen[ch] >= left) {
      duplicate = lastSeen[ch];
      left = lastSeen[ch] + 1;
      moved = true;
    }

    lastSeen[ch] = right;
    const windowLen = right - left + 1;
    if (windowLen > maxLen) {
      maxLen = windowLen;
      bestLeft = left;
      bestRight = right;
    }

    const window = s.substring(left, right + 1);

    steps.push({
      title: moved
        ? `Step ${right + 1}: Duplicate '${ch}' found!`
        : `Step ${right + 1}: Add '${ch}'`,
      desc: moved
        ? `'${ch}' was already at index ${duplicate} inside the window. Move left pointer past it (left = ${left}). Window is now "${window}" (length ${windowLen}).`
        : `'${ch}' is new. Expand window to "${window}" (length ${windowLen}).${windowLen > maxLen - (windowLen === maxLen ? 0 : 0) ? "" : ""}`,
      left, right, maxLen,
      bestLeft, bestRight,
      highlight: right,
      duplicate: moved ? duplicate : -1,
      lastSeen: { ...lastSeen },
      action: moved ? "shrink" : "expand",
    });
  }

  steps.push({
    title: "✅ Complete!",
    desc: `The longest substring without repeating characters is "${s.substring(bestLeft, bestRight + 1)}" with length ${maxLen}.`,
    left: bestLeft, right: bestRight, maxLen,
    bestLeft, bestRight,
    highlight: -1, duplicate: -1,
    lastSeen: { ...lastSeen }, action: "done",
  });

  return steps;
}

// ═══════════════════════════════════════════════
// CHARACTER CELL
// ═══════════════════════════════════════════════
function CharCell({ char, index, inWindow, isHighlight, isDuplicate, isBest, step }) {
  let borderColor = C.charBorder;
  let bg = C.charBg;
  let glow = "none";
  let scale = 1;
  let indexColor = C.textMuted;

  if (isDuplicate) {
    borderColor = C.rose;
    bg = C.roseGlow;
    glow = `0 0 16px ${C.roseGlow}`;
    scale = 1.05;
  } else if (isHighlight) {
    borderColor = C.warm;
    bg = C.warmGlow;
    glow = `0 0 16px ${C.warmGlow}`;
    scale = 1.08;
  } else if (inWindow) {
    borderColor = C.accent;
    bg = C.windowBg;
    glow = `0 0 12px ${C.accentGlow}`;
  }

  if (isBest && step?.action === "done") {
    borderColor = C.mint;
    bg = C.mintGlow;
    glow = `0 0 16px ${C.mintGlow}`;
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: `scale(${scale})`,
    }}>
      <div style={{
        width: 44, height: 48, borderRadius: 10,
        background: bg, border: `2px solid ${borderColor}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20, fontWeight: 700, color: C.text,
        boxShadow: glow,
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {char}
      </div>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: indexColor,
        transition: "color 0.3s",
      }}>{index}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// POINTER LABEL
// ═══════════════════════════════════════════════
function PointerIndicator({ label, color, index, totalChars }) {
  if (index < 0 || index >= totalChars) return null;
  const offset = index * 52 + 22;

  return (
    <div style={{
      position: "absolute", left: offset, bottom: -28,
      display: "flex", flexDirection: "column", alignItems: "center",
      transform: "translateX(-50%)",
      transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <div style={{
        width: 0, height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderBottom: `6px solid ${color}`,
      }} />
      <span style={{
        fontSize: 10, fontWeight: 800, color: C.bg,
        background: color, padding: "2px 6px", borderRadius: 4,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
      }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// WINDOW BRACKET
// ═══════════════════════════════════════════════
function WindowBracket({ left, right, totalChars, color }) {
  if (right < 0 || left > right) return null;
  const startX = left * 52;
  const width = (right - left + 1) * 52;

  return (
    <div style={{
      position: "absolute", left: startX - 4, top: -6,
      width: width + 8, height: "calc(100% + 12)",
      border: `2px solid ${color || C.accent}`,
      borderRadius: 14,
      background: `${color || C.accent}08`,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      pointerEvents: "none",
    }} />
  );
}

// ═══════════════════════════════════════════════
// HASH MAP VISUAL
// ═══════════════════════════════════════════════
function HashMapVisual({ lastSeen, currentChar }) {
  const entries = Object.entries(lastSeen).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) {
    return (
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
        color: C.textMuted, fontStyle: "italic",
      }}>
        { "{ empty }" }
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {entries.map(([ch, idx]) => (
        <div key={ch} style={{
          display: "flex", alignItems: "center", gap: 0, borderRadius: 6,
          overflow: "hidden", border: `1px solid ${ch === currentChar ? C.warm : C.surfaceBorder}`,
          background: ch === currentChar ? C.warmGlow : C.bg,
          transition: "all 0.3s",
        }}>
          <span style={{
            padding: "4px 7px", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12, fontWeight: 700, color: C.text,
            background: ch === currentChar ? `${C.warm}30` : `${C.charBg}`,
          }}>'{ch}'</span>
          <span style={{
            padding: "4px 7px", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12, color: C.textDim,
          }}>{idx}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// CONCEPT SECTION
// ═══════════════════════════════════════════════
function ConceptsTab() {
  const concepts = [
    {
      icon: "🪟",
      title: "The Sliding Window Pattern",
      color: C.accent,
      content: (
        <>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
            Imagine a <strong style={{ color: C.text }}>magnifying glass</strong> sliding over text. The glass can grow wider or shrink.
            Two pointers — <strong style={{ color: C.accent }}>left</strong> and <strong style={{ color: C.warm }}>right</strong> — define the edges of the glass.
          </p>
          <div style={{
            background: C.bg, borderRadius: 8, padding: 16, textAlign: "center",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, lineHeight: 2,
          }}>
            <div style={{ color: C.textMuted }}>string: a b c d e f g</div>
            <div>
              <span style={{ color: C.textMuted }}>{"       "}</span>
              <span style={{ color: C.accent }}>L</span>
              <span style={{ color: C.textMuted }}>{"───────"}</span>
              <span style={{ color: C.warm }}>R</span>
            </div>
            <div>
              <span style={{ color: C.textMuted }}>{"       "}</span>
              <span style={{ color: C.accent, background: C.accentGlow, padding: "2px 4px", borderRadius: 4 }}>[ window ]</span>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: "🗺️",
      title: "Hash Map as Memory",
      color: C.warm,
      content: (
        <>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
            We use a hash map to remember the <strong style={{ color: C.text }}>last index</strong> where each character appeared. This gives us <strong style={{ color: C.text }}>O(1) lookups</strong> — instant detection of duplicates.
          </p>
          <div style={{
            background: C.bg, borderRadius: 8, padding: 14,
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, lineHeight: 2, color: C.textDim,
          }}>
            <div>lastSeen = {"{"}</div>
            <div>{"  "}'a' → <span style={{ color: C.accent }}>0</span>,  'b' → <span style={{ color: C.accent }}>1</span>,  'c' → <span style={{ color: C.accent }}>2</span></div>
            <div>{"}"}</div>
            <div style={{ color: C.textMuted, marginTop: 4, fontSize: 11 }}>
              → "Is 'b' in my window?" Check map instantly!
            </div>
          </div>
        </>
      ),
    },
    {
      icon: "🔄",
      title: "Expand vs. Shrink",
      color: C.mint,
      content: (
        <>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
            Each step has only two possible outcomes:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              background: C.bg, borderRadius: 8, padding: 12,
              borderLeft: `3px solid ${C.mint}`,
            }}>
              <strong style={{ color: C.mint, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace" }}>EXPAND →</strong>
              <span style={{ color: C.textDim, fontSize: 13, marginLeft: 8 }}>
                New character? Move right pointer forward. Window grows.
              </span>
            </div>
            <div style={{
              background: C.bg, borderRadius: 8, padding: 12,
              borderLeft: `3px solid ${C.rose}`,
            }}>
              <strong style={{ color: C.rose, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace" }}>← SHRINK</strong>
              <span style={{ color: C.textDim, fontSize: 13, marginLeft: 8 }}>
                Duplicate? Jump left pointer past the old occurrence.
              </span>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: "⚡",
      title: "Why O(n) and Not O(n²)?",
      color: C.violet,
      content: (
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          A brute-force approach checks every possible substring — that's O(n²). With sliding window, each character is visited <strong style={{ color: C.text }}>at most twice</strong> (once by right, once by left). The left pointer only moves forward, never backward. Combined with O(1) hash map lookups, the total work is <strong style={{ color: C.violet }}>O(n)</strong>.
        </p>
      ),
    },
    {
      icon: "🎯",
      title: "The Key Insight",
      color: C.warm,
      content: (
        <div style={{
          background: C.bg, borderRadius: 8, padding: 16,
          borderLeft: `3px solid ${C.warm}`,
        }}>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
            When we find a duplicate at index <code style={{ background: C.surface, padding: "2px 6px", borderRadius: 4, color: C.warm }}>d</code>, we don't scan from left to d — we <strong>jump</strong> left directly to <code style={{ background: C.surface, padding: "2px 6px", borderRadius: 4, color: C.warm }}>d + 1</code> because every position before that would still contain the duplicate character.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {concepts.map((c, i) => (
        <div key={i} style={{
          background: C.surface, border: `1px solid ${C.surfaceBorder}`,
          borderRadius: 12, padding: 20, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: c.color,
          }} />
          <h4 style={{
            color: c.color, margin: "0 0 12px", fontSize: 15,
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            {c.icon} {c.title}
          </h4>
          {c.content}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PATTERNS & EDGE CASES TAB
// ═══════════════════════════════════════════════
function PatternsTab() {
  const patterns = [
    {
      title: "All Unique Characters",
      input: '"abcdef"', output: "6", color: C.mint,
      desc: "Window expands across the entire string — left never moves. The whole string is the answer.",
    },
    {
      title: "All Same Characters",
      input: '"bbbbb"', output: "1", color: C.rose,
      desc: "Every step triggers a shrink. Left always chases right. Maximum window is always 1.",
    },
    {
      title: "Duplicate Far Apart",
      input: '"abcdeafg"', output: "7",  color: C.accent,
      desc: "The second 'a' appears at index 5. Left jumps from 0 to 1, then window keeps growing to \"bcdeafg\" (7).",
    },
    {
      title: "Empty String",
      input: '""', output: "0", color: C.textMuted,
      desc: "The loop never executes. Return 0.",
    },
    {
      title: "Single Character",
      input: '"a"', output: "1", color: C.violet,
      desc: "One iteration, window is \"a\", length 1.",
    },
    {
      title: "Repeat at End",
      input: '"abcda"', output: "4", color: C.warm,
      desc: "The duplicate 'a' at the very end causes a shrink, but the best window \"abcd\" (4) was already recorded.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ color: C.warm, fontSize: 18, margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
        ⚠️ Edge Cases & Patterns
      </h3>
      {patterns.map((p, i) => (
        <div key={i} style={{
          background: C.surface, border: `1px solid ${C.surfaceBorder}`,
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h4 style={{ color: p.color, margin: 0, fontSize: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
              {p.title}
            </h4>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              background: C.bg, padding: "3px 8px", borderRadius: 5, color: C.textMuted,
            }}>
              Output: <span style={{ color: C.mint, fontWeight: 700 }}>{p.output}</span>
            </span>
          </div>
          <div style={{
            background: C.bg, borderRadius: 6, padding: "8px 12px",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
            color: C.textDim, marginBottom: 8,
          }}>
            s = {p.input}
          </div>
          <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// REAL WORLD TAB
// ═══════════════════════════════════════════════
function RealWorldTab() {
  const scenarios = [
    {
      icon: "🔒", title: "Password Validation", color: C.accent,
      desc: "Checking if a password has enough unique consecutive characters — \"no repeated chars in any 8-char window\" is essentially this algorithm.",
    },
    {
      icon: "🧬", title: "DNA Sequence Analysis", color: C.mint,
      desc: "Finding the longest unique nucleotide subsequence (A, T, G, C) in genomic data. Bioinformatics tools use sliding windows extensively.",
    },
    {
      icon: "📡", title: "Network Packet Deduplication", color: C.warm,
      desc: "Detecting unique packet streams in a data flow. When a duplicate packet arrives, the window resets — identical to this problem's shrink logic.",
    },
    {
      icon: "📊", title: "SAP / ABAP Data Processing", color: C.violet,
      desc: "When processing sequential records (like bank statement lines), sliding window helps find the longest run of unique transaction IDs or detect duplicate entries efficiently.",
    },
    {
      icon: "🔎", title: "Text Editors & Autocomplete", color: C.rose,
      desc: "Finding unique character spans for syntax highlighting, autocomplete suggestion windows, or detecting repeated typing patterns.",
    },
    {
      icon: "📈", title: "Stock Trading — Unique Days", color: C.mint,
      desc: "Finding the longest streak of trading days with unique price movements — useful for volatility analysis.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ color: C.accent, fontSize: 18, margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
        🌍 Where Is This Used?
      </h3>
      {scenarios.map((s, i) => (
        <div key={i} style={{
          background: C.surface, border: `1px solid ${C.surfaceBorder}`,
          borderRadius: 12, padding: 16, display: "flex", gap: 14,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
            background: s.color,
          }} />
          <span style={{ fontSize: 26, paddingLeft: 8 }}>{s.icon}</span>
          <div>
            <h4 style={{ color: s.color, margin: "0 0 4px", fontSize: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
              {s.title}
            </h4>
            <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function SlidingWindowExplainer() {
  const [inputStr, setInputStr] = useState("abcabcbb");
  const [activeStr, setActiveStr] = useState("abcabcbb");
  const [steps, setSteps] = useState(() => generateSteps("abcabcbb"));
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("simulation");
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const current = steps[step];
  const chars = activeStr.split("");

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps.length]);

  const handleRun = () => {
    if (inputStr.trim().length === 0) return;
    const s = inputStr.trim();
    setActiveStr(s);
    const newSteps = generateSteps(s);
    setSteps(newSteps);
    setStep(0);
    setIsPlaying(false);
  };

  const presets = [
    { label: "abcabcbb", val: "abcabcbb" },
    { label: "bbbbb", val: "bbbbb" },
    { label: "pwwkew", val: "pwwkew" },
    { label: "dvdf", val: "dvdf" },
  ];

  const tabs = [
    { id: "concepts", label: "📖 Concepts" },
    { id: "simulation", label: "▶ Simulate" },
    { id: "patterns", label: "⚠ Patterns" },
    { id: "realworld", label: "🌍 Real World" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "24px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 20,
            background: C.accentGlow, border: `1px solid ${C.accent}40`,
            marginBottom: 10,
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              fontWeight: 700, color: C.accent, letterSpacing: 1.5,
            }}>LEETCODE #3</span>
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 700, margin: "0 0 4px",
            fontFamily: "'IBM Plex Mono', monospace",
            color: C.text,
          }}>
            Longest Substring Without
            <br />
            <span style={{ color: C.accent }}>Repeating Characters</span>
          </h1>
          <p style={{
            color: C.textMuted, fontSize: 13, margin: 0,
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            Sliding Window + Hash Map — O(n)
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 18,
          background: C.surface, borderRadius: 10, padding: 4,
          border: `1px solid ${C.surfaceBorder}`,
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "10px 6px", borderRadius: 8, border: "none",
                background: tab === t.id ? C.accent : "transparent",
                color: tab === t.id ? C.bg : C.textMuted,
                fontWeight: 700, fontSize: 12, cursor: "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Concepts Tab */}
        {tab === "concepts" && <ConceptsTab />}

        {/* Patterns Tab */}
        {tab === "patterns" && <PatternsTab />}

        {/* Real World Tab */}
        {tab === "realworld" && <RealWorldTab />}

        {/* Simulation Tab */}
        {tab === "simulation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Input */}
            <div style={{
              background: C.surface, border: `1px solid ${C.surfaceBorder}`,
              borderRadius: 12, padding: 16,
            }}>
              <div style={{
                display: "flex", gap: 8, marginBottom: 10, alignItems: "center",
                flexWrap: "wrap",
              }}>
                <input
                  value={inputStr}
                  onChange={e => setInputStr(e.target.value.slice(0, 20))}
                  onKeyDown={e => e.key === "Enter" && handleRun()}
                  placeholder="Type a string..."
                  style={{
                    flex: 1, minWidth: 120, padding: "8px 12px", borderRadius: 8,
                    border: `1px solid ${C.surfaceBorder}`, background: C.bg,
                    color: C.text, fontSize: 14,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                />
                <button
                  onClick={handleRun}
                  style={{
                    padding: "8px 18px", borderRadius: 8, border: "none",
                    background: C.accent, color: C.bg,
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  Run
                </button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: C.textMuted, lineHeight: "28px" }}>Presets:</span>
                {presets.map(p => (
                  <button
                    key={p.val}
                    onClick={() => { setInputStr(p.val); }}
                    style={{
                      padding: "4px 10px", borderRadius: 6,
                      border: `1px solid ${inputStr === p.val ? C.accent : C.surfaceBorder}`,
                      background: inputStr === p.val ? C.accentGlow : "transparent",
                      color: inputStr === p.val ? C.accent : C.textDim,
                      fontSize: 12, cursor: "pointer",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    "{p.label}"
                  </button>
                ))}
              </div>
            </div>

            {/* Step Header */}
            <div style={{
              background: C.surface, border: `1px solid ${C.surfaceBorder}`,
              borderRadius: 12, padding: 18,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{
                  margin: 0, fontSize: 16,
                  color: current.action === "shrink" ? C.rose : current.action === "done" ? C.mint : C.accent,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  {current.title}
                </h3>
                <span style={{
                  fontSize: 11, color: C.textMuted,
                  fontFamily: "'IBM Plex Mono', monospace",
                  background: C.bg, padding: "4px 10px", borderRadius: 6,
                }}>
                  {step + 1} / {steps.length}
                </span>
              </div>
              <p style={{ color: C.textDim, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                {current.desc}
              </p>
            </div>

            {/* Visual: Character Cells with Window */}
            <div style={{
              background: C.surface, border: `1px solid ${C.surfaceBorder}`,
              borderRadius: 12, padding: "28px 20px 48px",
              overflowX: "auto",
            }}>
              <div style={{ position: "relative", display: "inline-flex", gap: 8 }}>
                {current.action !== "ready" && (
                  <WindowBracket
                    left={current.left}
                    right={current.right}
                    totalChars={chars.length}
                    color={current.action === "done" ? C.mint : C.accent}
                  />
                )}
                {chars.map((ch, i) => {
                  const inWindow = i >= current.left && i <= current.right;
                  const isHighlight = i === current.highlight;
                  const isDuplicate = i === current.duplicate;
                  const isBest = current.action === "done" && i >= current.bestLeft && i <= current.bestRight;
                  return (
                    <CharCell
                      key={i} char={ch} index={i}
                      inWindow={inWindow} isHighlight={isHighlight}
                      isDuplicate={isDuplicate} isBest={isBest} step={current}
                    />
                  );
                })}
                {current.action !== "ready" && (
                  <>
                    <PointerIndicator label="L" color={C.accent} index={current.left} totalChars={chars.length} />
                    <PointerIndicator label="R" color={C.warm} index={current.right} totalChars={chars.length} />
                  </>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Window", value: current.right >= 0 ? `"${activeStr.substring(current.left, current.right + 1)}"` : '""', color: C.accent },
                { label: "Length", value: current.right >= 0 ? current.right - current.left + 1 : 0, color: C.warm },
                { label: "Max", value: current.maxLen, color: C.mint },
                {
                  label: "Action",
                  value: current.action === "expand" ? "✓ Expand" : current.action === "shrink" ? "✗ Shrink" : current.action === "done" ? "Done!" : "—",
                  color: current.action === "shrink" ? C.rose : current.action === "done" ? C.mint : C.accent,
                },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, minWidth: 80, background: C.surface,
                  border: `1px solid ${C.surfaceBorder}`, borderRadius: 10,
                  padding: "10px 12px", textAlign: "center",
                }}>
                  <div style={{
                    fontSize: 10, color: C.textMuted, fontWeight: 700,
                    fontFamily: "'IBM Plex Mono', monospace",
                    letterSpacing: 1, marginBottom: 4, textTransform: "uppercase",
                  }}>{s.label}</div>
                  <div style={{
                    fontSize: 15, fontWeight: 700, color: s.color,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Hash Map */}
            <div style={{
              background: C.surface, border: `1px solid ${C.surfaceBorder}`,
              borderRadius: 12, padding: 14,
            }}>
              <div style={{
                fontSize: 11, color: C.textMuted, fontWeight: 700,
                fontFamily: "'IBM Plex Mono', monospace",
                marginBottom: 8, letterSpacing: 1, textTransform: "uppercase",
              }}>
                Hash Map — lastSeen
              </div>
              <HashMapVisual
                lastSeen={current.lastSeen}
                currentChar={current.highlight >= 0 ? activeStr[current.highlight] : null}
              />
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setStep(0); setIsPlaying(false); }}
                style={{
                  padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${C.surfaceBorder}`, background: C.surface,
                  color: C.textDim, fontWeight: 700, fontSize: 16, cursor: "pointer",
                }}
              >⏮</button>
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${C.surfaceBorder}`,
                  background: step === 0 ? C.surface : C.charBg,
                  color: step === 0 ? C.textMuted : C.text,
                  fontWeight: 700, fontSize: 13, cursor: step === 0 ? "default" : "pointer",
                  fontFamily: "'IBM Plex Mono', monospace",
                  opacity: step === 0 ? 0.5 : 1,
                }}
              >← Prev</button>
              <button
                onClick={() => {
                  if (isPlaying) { setIsPlaying(false); }
                  else { if (step >= steps.length - 1) setStep(0); setIsPlaying(true); }
                }}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: isPlaying ? C.rose : C.accent,
                  color: C.bg, fontWeight: 700, fontSize: 13, cursor: "pointer",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                disabled={step === steps.length - 1}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8, border: "none",
                  background: step === steps.length - 1 ? C.surface : `linear-gradient(135deg, ${C.accent}, ${C.mint})`,
                  color: step === steps.length - 1 ? C.textMuted : C.bg,
                  fontWeight: 700, fontSize: 13,
                  cursor: step === steps.length - 1 ? "default" : "pointer",
                  fontFamily: "'IBM Plex Mono', monospace",
                  opacity: step === steps.length - 1 ? 0.5 : 1,
                }}
              >Next →</button>
            </div>

            {/* Step dots */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 5, flexWrap: "wrap",
            }}>
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setStep(i); setIsPlaying(false); }}
                  style={{
                    width: i === step ? 20 : 8, height: 8, borderRadius: 4,
                    border: "none", cursor: "pointer", padding: 0,
                    background: i === step ? C.accent
                      : i < step ? C.mint + "60" : C.surfaceBorder,
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Full Solution */}
        <div style={{
          marginTop: 24, background: C.surface,
          border: `1px solid ${C.surfaceBorder}`,
          borderRadius: 12, padding: 18, overflow: "auto",
        }}>
          <h3 style={{
            color: C.accent, margin: "0 0 12px", fontSize: 15,
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            💻 C++ Solution
          </h3>
          <pre style={{
            background: "#0d0d0d", borderRadius: 8, padding: 16,
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5,
            color: C.textDim, lineHeight: 1.8, margin: 0,
            overflowX: "auto", whiteSpace: "pre",
          }}>
{`class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int maxLen = 0, left = 0;

        for (int right = 0; right < s.size(); right++) {
            // If duplicate found inside window → shrink
            if (lastSeen.count(s[right]) && lastSeen[s[right]] >= left)
                left = lastSeen[s[right]] + 1;

            lastSeen[s[right]] = right;           // update position
            maxLen = max(maxLen, right - left + 1); // track best
        }
        return maxLen;
    }
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
