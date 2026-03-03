import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#07090e",
  surface: "#0f1219",
  surface2: "#161b25",
  border: "#1e2533",
  borderActive: "#2d3a52",
  cyan: "#06b6d4",
  cyanGlow: "rgba(6, 182, 212, 0.12)",
  cyanStrong: "rgba(6, 182, 212, 0.25)",
  orange: "#f97316",
  orangeGlow: "rgba(249, 115, 22, 0.12)",
  green: "#22c55e",
  greenGlow: "rgba(34, 197, 94, 0.10)",
  red: "#ef4444",
  redGlow: "rgba(239, 68, 68, 0.10)",
  rose: "#fb7185",
  violet: "#a78bfa",
  violetGlow: "rgba(167, 139, 250, 0.12)",
  amber: "#fbbf24",
  amberGlow: "rgba(251, 191, 36, 0.10)",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  mono: "'JetBrains Mono', monospace",
  display: "'Fira Code', monospace",
};

// ═══════════════════════════════════════
// STEP GENERATOR — Binary Search Sim
// ═══════════════════════════════════════
function generateSteps(nums1Input, nums2Input) {
  let nums1 = [...nums1Input];
  let nums2 = [...nums2Input];
  let swapped = false;

  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
    swapped = true;
  }

  const m = nums1.length, n = nums2.length;
  const half = Math.floor((m + n + 1) / 2);
  const isEven = (m + n) % 2 === 0;
  const steps = [];

  steps.push({
    type: "init",
    title: "🏁 Setup",
    desc: `Ensure nums1 is smaller (${m} ≤ ${n}). We binary search on nums1 only.${swapped ? " (Arrays were swapped)" : ""} Total elements = ${m + n}. We need ${half} elements on the left side.`,
    nums1, nums2, i: -1, j: -1, lo: 0, hi: m, half,
    left1: null, right1: null, left2: null, right2: null,
    check: null, found: false, isEven,
  });

  let lo = 0, hi = m;

  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2);
    const j = half - i;

    const left1 = i > 0 ? nums1[i - 1] : -Infinity;
    const right1 = i < m ? nums1[i] : Infinity;
    const left2 = j > 0 ? nums2[j - 1] : -Infinity;
    const right2 = j < n ? nums2[j] : Infinity;

    if (left1 <= right2 && left2 <= right1) {
      let median;
      if (isEven) {
        median = (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
      } else {
        median = Math.max(left1, left2);
      }

      steps.push({
        type: "found",
        title: "✅ Correct Partition Found!",
        desc: `left1(${left1 === -Infinity ? "-∞" : left1}) ≤ right2(${right2 === Infinity ? "∞" : right2}) ✓ AND left2(${left2 === -Infinity ? "-∞" : left2}) ≤ right1(${right1 === Infinity ? "∞" : right1}) ✓. ${isEven ? `Median = (${Math.max(left1, left2)} + ${Math.min(right1, right2)}) / 2 = ${median}` : `Median = max(${left1 === -Infinity ? "-∞" : left1}, ${left2 === -Infinity ? "-∞" : left2}) = ${median}`}`,
        nums1, nums2, i, j, lo, hi, half,
        left1, right1, left2, right2,
        check: "valid", found: true, median, isEven,
      });
      break;
    } else if (left1 > right2) {
      steps.push({
        type: "step",
        title: `Partition i=${i}, j=${j} — Too Far Right`,
        desc: `left1(${left1}) > right2(${right2}) ✗. nums1's left side has values too large. Move partition LEFT in nums1 (hi = ${i - 1}).`,
        nums1, nums2, i, j, lo, hi, half,
        left1, right1, left2, right2,
        check: "left1_too_big", found: false, isEven,
      });
      hi = i - 1;
    } else {
      steps.push({
        type: "step",
        title: `Partition i=${i}, j=${j} — Too Far Left`,
        desc: `left2(${left2 === -Infinity ? "-∞" : left2}) > right1(${right1 === Infinity ? "∞" : right1}) ✗. nums1's left side is too small. Move partition RIGHT in nums1 (lo = ${i + 1}).`,
        nums1, nums2, i, j, lo, hi, half,
        left1, right1, left2, right2,
        check: "left2_too_big", found: false, isEven,
      });
      lo = i + 1;
    }
  }

  return steps;
}

// ═══════════════════════════════════════
// ARRAY PARTITION VISUAL
// ═══════════════════════════════════════
function ArrayPartition({ label, arr, partIdx, color, leftColor, rightColor, boundaryVals }) {
  const cellW = 52;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: C.mono, fontSize: 11, fontWeight: 700,
        color, letterSpacing: 1.5, marginBottom: 6,
        textTransform: "uppercase",
      }}>{label}</div>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        {/* Left side label */}
        {partIdx > 0 && (
          <div style={{
            position: "absolute", top: -18,
            left: (partIdx * cellW) / 2 - 20,
            fontFamily: C.mono, fontSize: 9, color: leftColor || C.cyan,
            fontWeight: 700, letterSpacing: 1, opacity: 0.7,
          }}>LEFT</div>
        )}
        {/* Right side label */}
        {partIdx < arr.length && (
          <div style={{
            position: "absolute", top: -18,
            left: partIdx * cellW + ((arr.length - partIdx) * cellW) / 2 - 20,
            fontFamily: C.mono, fontSize: 9, color: rightColor || C.orange,
            fontWeight: 700, letterSpacing: 1, opacity: 0.7,
          }}>RIGHT</div>
        )}

        {arr.map((val, idx) => {
          const isLeft = idx < partIdx;
          const isBoundaryLeft = idx === partIdx - 1;
          const isBoundaryRight = idx === partIdx;
          const bgColor = isLeft ? (leftColor || C.cyan) + "15" : (rightColor || C.orange) + "15";
          const borderCol = isBoundaryLeft ? (leftColor || C.cyan) : isBoundaryRight ? (rightColor || C.orange) : C.border;
          const glow = (isBoundaryLeft || isBoundaryRight) ? `0 0 14px ${borderCol}30` : "none";

          return (
            <div key={idx} style={{ display: "flex", alignItems: "center" }}>
              {idx === partIdx && (
                <div style={{
                  width: 3, height: 56, background: C.amber,
                  borderRadius: 2, margin: "0 3px",
                  boxShadow: `0 0 10px ${C.amberGlow}`,
                }} />
              )}
              <div style={{
                width: 46, height: 46, borderRadius: 8,
                background: bgColor,
                border: `2px solid ${borderCol}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: C.mono, fontSize: 18, fontWeight: 700,
                color: C.text, boxShadow: glow,
                margin: "0 2px",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
                {val}
              </div>
            </div>
          );
        })}

        {/* Partition at end */}
        {partIdx === arr.length && (
          <div style={{
            width: 3, height: 56, background: C.amber,
            borderRadius: 2, marginLeft: 3,
            boxShadow: `0 0 10px ${C.amberGlow}`,
          }} />
        )}
      </div>

      {/* Boundary values */}
      {boundaryVals && (
        <div style={{
          display: "flex", gap: 16, marginTop: 6,
          fontFamily: C.mono, fontSize: 11, color: C.textDim,
        }}>
          <span>left: <strong style={{ color: leftColor || C.cyan }}>
            {boundaryVals.left === -Infinity ? "-∞" : boundaryVals.left}
          </strong></span>
          <span>right: <strong style={{ color: rightColor || C.orange }}>
            {boundaryVals.right === Infinity ? "∞" : boundaryVals.right}
          </strong></span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// CROSS-CONDITION CHECK VISUAL
// ═══════════════════════════════════════
function CrossCheck({ left1, right1, left2, right2, checkResult }) {
  const fmt = (v) => v === -Infinity ? "-∞" : v === Infinity ? "∞" : v;
  const cond1 = left1 <= right2;
  const cond2 = left2 <= right1;

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: 16,
    }}>
      <div style={{
        fontFamily: C.mono, fontSize: 10, fontWeight: 700,
        color: C.textMuted, letterSpacing: 1.5, marginBottom: 10,
        textTransform: "uppercase",
      }}>Cross-Condition Check</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Condition 1: left1 <= right2 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: cond1 ? C.greenGlow : C.redGlow,
          border: `1px solid ${cond1 ? C.green + "30" : C.red + "30"}`,
          borderRadius: 8, padding: "8px 12px",
        }}>
          <span style={{
            fontFamily: C.mono, fontSize: 13, color: C.text, flex: 1,
          }}>
            left1(<strong style={{ color: C.cyan }}>{fmt(left1)}</strong>)
            {" ≤ "}
            right2(<strong style={{ color: "#f97316" }}>{fmt(right2)}</strong>)
          </span>
          <span style={{
            fontFamily: C.mono, fontSize: 12, fontWeight: 800,
            color: cond1 ? C.green : C.red,
          }}>{cond1 ? "✓" : "✗"}</span>
        </div>

        {/* Condition 2: left2 <= right1 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: cond2 ? C.greenGlow : C.redGlow,
          border: `1px solid ${cond2 ? C.green + "30" : C.red + "30"}`,
          borderRadius: 8, padding: "8px 12px",
        }}>
          <span style={{
            fontFamily: C.mono, fontSize: 13, color: C.text, flex: 1,
          }}>
            left2(<strong style={{ color: "#06b6d4" }}>{fmt(left2)}</strong>)
            {" ≤ "}
            right1(<strong style={{ color: C.orange }}>{fmt(right1)}</strong>)
          </span>
          <span style={{
            fontFamily: C.mono, fontSize: 12, fontWeight: 800,
            color: cond2 ? C.green : C.red,
          }}>{cond2 ? "✓" : "✗"}</span>
        </div>
      </div>

      {/* Verdict */}
      <div style={{
        marginTop: 10, textAlign: "center",
        fontFamily: C.mono, fontSize: 12, fontWeight: 700,
        color: checkResult === "valid" ? C.green : C.rose,
      }}>
        {checkResult === "valid" && "Both conditions satisfied → Partition is correct!"}
        {checkResult === "left1_too_big" && "left1 > right2 → Move partition LEFT in nums1"}
        {checkResult === "left2_too_big" && "left2 > right1 → Move partition RIGHT in nums1"}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// BINARY SEARCH RANGE BAR
// ═══════════════════════════════════════
function SearchRange({ lo, hi, m, i }) {
  const total = m + 1; // possible positions 0..m

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: 14,
    }}>
      <div style={{
        fontFamily: C.mono, fontSize: 10, fontWeight: 700,
        color: C.textMuted, letterSpacing: 1.5, marginBottom: 10,
        textTransform: "uppercase",
      }}>Binary Search Range on nums1</div>

      <div style={{
        position: "relative", height: 36,
        background: C.surface2, borderRadius: 6,
        overflow: "hidden",
      }}>
        {/* Search range highlight */}
        <div style={{
          position: "absolute",
          left: `${(lo / Math.max(total - 1, 1)) * 100}%`,
          width: `${(Math.max(hi - lo, 0) / Math.max(total - 1, 1)) * 100}%`,
          top: 0, bottom: 0,
          background: C.cyanGlow,
          border: `1px solid ${C.cyan}30`,
          borderRadius: 4,
          transition: "all 0.4s",
        }} />

        {/* Current i marker */}
        {i >= 0 && (
          <div style={{
            position: "absolute",
            left: `calc(${(i / Math.max(total - 1, 1)) * 100}% - 8px)`,
            top: 4, width: 16, height: 28,
            background: C.amber,
            borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: C.mono, fontSize: 11, fontWeight: 800,
            color: C.bg,
            boxShadow: `0 0 12px ${C.amberGlow}`,
            transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>{i}</div>
        )}

        {/* Position markers */}
        {Array.from({ length: total }, (_, idx) => (
          <div key={idx} style={{
            position: "absolute",
            left: `calc(${(idx / Math.max(total - 1, 1)) * 100}% - 1px)`,
            bottom: 2, width: 2, height: 6,
            background: idx >= lo && idx <= hi ? C.cyan + "60" : C.border,
            borderRadius: 1,
          }} />
        ))}
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 6,
        fontFamily: C.mono, fontSize: 11, color: C.textDim,
      }}>
        <span>lo = <strong style={{ color: C.cyan }}>{lo}</strong></span>
        <span>i = <strong style={{ color: C.amber }}>{i >= 0 ? i : "—"}</strong></span>
        <span>hi = <strong style={{ color: C.cyan }}>{hi}</strong></span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// CONCEPTS TAB
// ═══════════════════════════════════════
function ConceptsSection() {
  const cards = [
    {
      icon: "✂️", title: "The Partition Idea", color: C.amber,
      content: (
        <>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
            Instead of merging arrays, we <strong style={{ color: C.text }}>cut both arrays</strong> so that all elements on the left are ≤ all elements on the right. The median sits at this cut boundary.
          </p>
          <div style={{
            background: C.bg, borderRadius: 8, padding: 14,
            fontFamily: C.mono, fontSize: 12, color: C.textDim, lineHeight: 2,
          }}>
            <div>nums1: [<span style={{ color: C.cyan }}>...left1...</span> <span style={{ color: C.amber }}>|</span> <span style={{ color: C.orange }}>...right1...</span>]</div>
            <div>nums2: [<span style={{ color: C.cyan }}>...left2...</span> <span style={{ color: C.amber }}>|</span> <span style={{ color: C.orange }}>...right2...</span>]</div>
            <div style={{ color: C.textMuted, marginTop: 4 }}>Rule: everything on left ≤ everything on right</div>
          </div>
        </>
      ),
    },
    {
      icon: "🔍", title: "Why Binary Search?", color: C.cyan,
      content: (
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          If we pick partition <code style={{ background: C.surface2, padding: "2px 6px", borderRadius: 4, color: C.cyan }}>i</code> in nums1, the partition in nums2 is <strong style={{ color: C.text }}>forced</strong>:
          <code style={{ display: "block", background: C.bg, padding: 10, borderRadius: 8, margin: "10px 0", color: C.amber }}>
            j = (m + n + 1) / 2 - i
          </code>
          So we only need to search <code style={{ background: C.surface2, padding: "2px 6px", borderRadius: 4, color: C.cyan }}>i</code> from 0 to m — that's binary search on the smaller array → <strong style={{ color: C.green }}>O(log(min(m,n)))</strong>.
        </p>
      ),
    },
    {
      icon: "✓✓", title: "The Cross-Conditions", color: C.green,
      content: (
        <>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
            Since each array is already sorted, we only need to check the <strong style={{ color: C.text }}>cross boundaries</strong>:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: C.bg, borderRadius: 8, padding: 10, borderLeft: `3px solid ${C.green}` }}>
              <code style={{ fontFamily: C.mono, fontSize: 13, color: C.green }}>left1 ≤ right2</code>
              <span style={{ color: C.textDim, fontSize: 12, marginLeft: 8 }}>— nums1's left doesn't exceed nums2's right</span>
            </div>
            <div style={{ background: C.bg, borderRadius: 8, padding: 10, borderLeft: `3px solid ${C.green}` }}>
              <code style={{ fontFamily: C.mono, fontSize: 13, color: C.green }}>left2 ≤ right1</code>
              <span style={{ color: C.textDim, fontSize: 12, marginLeft: 8 }}>— nums2's left doesn't exceed nums1's right</span>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: "📊", title: "Computing the Median", color: C.orange,
      content: (
        <>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
            Once the partition is correct, the median depends on odd/even total:
          </p>
          <div style={{
            background: C.bg, borderRadius: 8, padding: 14,
            fontFamily: C.mono, fontSize: 12, color: C.textDim, lineHeight: 2.2,
          }}>
            <div><span style={{ color: C.violet }}>Odd total:</span> median = max(left1, left2)</div>
            <div><span style={{ color: C.orange }}>Even total:</span> median = (max(left1, left2) + min(right1, right2)) / 2</div>
          </div>
        </>
      ),
    },
    {
      icon: "♾️", title: "Edge: -∞ and ∞ Sentinels", color: C.rose,
      content: (
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          When partition is at the edge (i=0 or i=m), one side is empty. We use <strong style={{ color: C.rose }}>-∞</strong> for a missing left value and <strong style={{ color: C.rose }}>∞</strong> for a missing right value. This ensures the cross-conditions still work naturally — an empty side never violates anything.
        </p>
      ),
    },
    {
      icon: "📏", title: "Why Search the Smaller Array?", color: C.violet,
      content: (
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          Binary search on the smaller array (length m) gives O(log m) vs O(log n). Since <strong style={{ color: C.text }}>m ≤ n</strong>, this is optimal. It also guarantees j = half - i never goes negative, avoiding index out-of-bounds issues.
        </p>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {cards.map((c, idx) => (
        <div key={idx} style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: 20, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.color }} />
          <h4 style={{ fontFamily: C.mono, fontSize: 15, color: c.color, margin: "0 0 10px" }}>
            {c.icon} {c.title}
          </h4>
          {c.content}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// EDGE CASES TAB
// ═══════════════════════════════════════
function EdgeCasesSection() {
  const cases = [
    { title: "One Array Empty", input: "nums1 = [], nums2 = [1]", output: "1.0", color: C.cyan,
      desc: "All elements come from nums2. Partition i=0 in nums1, j=1 in nums2. left1 = -∞, left2 = 1. Median = 1." },
    { title: "Single Elements Each", input: "nums1 = [1], nums2 = [2]", output: "1.5", color: C.amber,
      desc: "Even total. After partition: max(left) = 1, min(right) = 2. Median = (1+2)/2 = 1.5." },
    { title: "No Overlap", input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5", color: C.green,
      desc: "Partition cleanly at the boundary. left = [1,2], right = [3,4]. Median = (2+3)/2 = 2.5." },
    { title: "Full Overlap", input: "nums1 = [1,3], nums2 = [2,4]", output: "2.5", color: C.orange,
      desc: "Elements interleave. Binary search finds i=1 in nums1, j=1 in nums2. left1=1, left2=2, right1=3, right2=4." },
    { title: "Very Different Sizes", input: "nums1 = [3], nums2 = [1,2,4,5,6]", output: "3.5", color: C.violet,
      desc: "Binary search only iterates on the small array (1 element). At most 2 iterations regardless of nums2's size." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ fontFamily: C.mono, fontSize: 18, color: C.amber, margin: 0 }}>⚠️ Edge Cases</h3>
      {cases.map((c, i) => (
        <div key={i} style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: 16, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.color }} />
          <div style={{ paddingLeft: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h4 style={{ fontFamily: C.mono, fontSize: 14, color: c.color, margin: 0 }}>{c.title}</h4>
              <span style={{
                fontFamily: C.mono, fontSize: 11, background: C.bg,
                padding: "3px 8px", borderRadius: 5, color: C.textMuted,
              }}>
                Output: <strong style={{ color: C.green }}>{c.output}</strong>
              </span>
            </div>
            <div style={{
              background: C.bg, borderRadius: 6, padding: "8px 12px",
              fontFamily: C.mono, fontSize: 12, color: C.textDim, marginBottom: 8,
            }}>{c.input}</div>
            <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// PRESETS
// ═══════════════════════════════════════
const PRESETS = [
  { label: "[1,3] & [2]", n1: [1, 3], n2: [2] },
  { label: "[1,2] & [3,4]", n1: [1, 2], n2: [3, 4] },
  { label: "[1,3,5] & [2,4,6]", n1: [1, 3, 5], n2: [2, 4, 6] },
  { label: "[1] & [2,3,4,5]", n1: [1], n2: [2, 3, 4, 5] },
];

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
export default function MedianVisualizer() {
  const [tab, setTab] = useState("simulation");
  const [presetIdx, setPresetIdx] = useState(0);
  const [nums1, setNums1] = useState([1, 3]);
  const [nums2, setNums2] = useState([2]);
  const [input1, setInput1] = useState("1,3");
  const [input2, setInput2] = useState("2");
  const [steps, setSteps] = useState(() => generateSteps([1, 3], [2]));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  const cur = steps[step];

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep(prev => {
          if (prev >= steps.length - 1) { setPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, steps.length]);

  const runSim = () => {
    try {
      const n1 = input1.split(",").map(Number).filter(n => !isNaN(n));
      const n2 = input2.split(",").map(Number).filter(n => !isNaN(n));
      if (n1.length + n2.length === 0) return;
      setNums1(n1); setNums2(n2);
      const newSteps = generateSteps(n1, n2);
      setSteps(newSteps); setStep(0); setPlaying(false);
    } catch (e) { /* ignore parse errors */ }
  };

  const selectPreset = (idx) => {
    const p = PRESETS[idx];
    setPresetIdx(idx);
    setInput1(p.n1.join(","));
    setInput2(p.n2.join(","));
    setNums1(p.n1); setNums2(p.n2);
    const newSteps = generateSteps(p.n1, p.n2);
    setSteps(newSteps); setStep(0); setPlaying(false);
  };

  const tabs = [
    { id: "concepts", label: "📖 Concepts" },
    { id: "simulation", label: "▶ Simulate" },
    { id: "edge", label: "⚠ Edge Cases" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "24px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Fira+Code:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 20,
            background: C.redGlow, border: `1px solid ${C.red}30`,
            marginBottom: 10,
          }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: 1.5 }}>
              LEETCODE #4 · HARD
            </span>
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 800, margin: "0 0 4px", fontFamily: C.mono,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.amber})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Median of Two Sorted Arrays
          </h1>
          <p style={{ fontFamily: C.mono, fontSize: 12, color: C.textMuted, margin: 0 }}>
            Binary Search on Partitions — O(log min(m,n))
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 18,
          background: C.surface, borderRadius: 10, padding: 4,
          border: `1px solid ${C.border}`,
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 8, border: "none",
              background: tab === t.id ? C.cyan : "transparent",
              color: tab === t.id ? C.bg : C.textMuted,
              fontWeight: 700, fontSize: 12, cursor: "pointer",
              fontFamily: C.mono, transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "concepts" && <ConceptsSection />}
        {tab === "edge" && <EdgeCasesSection />}

        {tab === "simulation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Input */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: 16,
            }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "end" }}>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <label style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>nums1</label>
                  <input value={input1} onChange={e => setInput1(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && runSim()}
                    style={{
                      width: "100%", padding: "8px 10px", borderRadius: 8,
                      border: `1px solid ${C.border}`, background: C.bg,
                      color: C.text, fontSize: 13, fontFamily: C.mono,
                    }} placeholder="1,3" />
                </div>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <label style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>nums2</label>
                  <input value={input2} onChange={e => setInput2(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && runSim()}
                    style={{
                      width: "100%", padding: "8px 10px", borderRadius: 8,
                      border: `1px solid ${C.border}`, background: C.bg,
                      color: C.text, fontSize: 13, fontFamily: C.mono,
                    }} placeholder="2" />
                </div>
                <button onClick={runSim} style={{
                  padding: "8px 18px", borderRadius: 8, border: "none",
                  background: C.cyan, color: C.bg, fontWeight: 700,
                  fontSize: 13, cursor: "pointer", fontFamily: C.mono,
                }}>Run</button>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.textMuted }}>Presets:</span>
                {PRESETS.map((p, i) => (
                  <button key={i} onClick={() => selectPreset(i)} style={{
                    padding: "4px 10px", borderRadius: 6,
                    border: `1px solid ${presetIdx === i ? C.cyan : C.border}`,
                    background: presetIdx === i ? C.cyanGlow : "transparent",
                    color: presetIdx === i ? C.cyan : C.textDim,
                    fontSize: 11, cursor: "pointer", fontFamily: C.mono,
                  }}>{p.label}</button>
                ))}
              </div>
            </div>

            {/* Step Info */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: 18,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <span style={{
                  fontFamily: C.mono, fontSize: 16, fontWeight: 700,
                  color: cur.found ? C.green : cur.type === "init" ? C.amber : C.rose,
                }}>{cur.title}</span>
                <span style={{
                  fontFamily: C.mono, fontSize: 11, color: C.textMuted,
                  background: C.bg, padding: "4px 10px", borderRadius: 6,
                }}>{step + 1} / {steps.length}</span>
              </div>
              <p style={{ color: C.textDim, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{cur.desc}</p>
            </div>

            {/* Array Partitions */}
            {cur.i >= 0 && (
              <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 18, overflowX: "auto",
              }}>
                <ArrayPartition
                  label="nums1 (smaller)" arr={cur.nums1}
                  partIdx={cur.i} color={C.cyan}
                  leftColor={C.cyan} rightColor={C.orange}
                  boundaryVals={{ left: cur.left1, right: cur.right1 }}
                />
                <ArrayPartition
                  label="nums2" arr={cur.nums2}
                  partIdx={cur.j} color={C.violet}
                  leftColor={C.cyan} rightColor={C.orange}
                  boundaryVals={{ left: cur.left2, right: cur.right2 }}
                />

                {/* Divider line showing all lefts vs rights */}
                <div style={{
                  marginTop: 10, padding: "10px 14px",
                  background: C.bg, borderRadius: 8,
                  fontFamily: C.mono, fontSize: 12, color: C.textDim,
                  display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
                }}>
                  <span>Left side: <strong style={{ color: C.cyan }}>{cur.half}</strong> elements</span>
                  <span>Right side: <strong style={{ color: C.orange }}>{cur.nums1.length + cur.nums2.length - cur.half}</strong> elements</span>
                </div>
              </div>
            )}

            {/* Binary Search Range */}
            {cur.type !== "init" && (
              <SearchRange lo={cur.lo} hi={cur.hi} m={cur.nums1.length} i={cur.i} />
            )}

            {/* Cross-Condition Check */}
            {cur.left1 !== null && (
              <CrossCheck
                left1={cur.left1} right1={cur.right1}
                left2={cur.left2} right2={cur.right2}
                checkResult={cur.check}
              />
            )}

            {/* Median Result */}
            {cur.found && (
              <div style={{
                background: `linear-gradient(135deg, ${C.greenGlow}, ${C.cyanGlow})`,
                border: `1px solid ${C.green}40`,
                borderRadius: 12, padding: 20, textAlign: "center",
              }}>
                <div style={{ fontFamily: C.mono, fontSize: 12, color: C.green, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>
                  MEDIAN FOUND
                </div>
                <div style={{
                  fontFamily: C.display, fontSize: 40, fontWeight: 800,
                  color: C.text,
                }}>
                  {cur.median}
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 12, color: C.textDim, marginTop: 6 }}>
                  {cur.isEven ? "Even total → average of boundary elements" : "Odd total → max of left boundary"}
                </div>
              </div>
            )}

            {/* Controls */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setStep(0); setPlaying(false); }} style={{
                padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`,
                background: C.surface, color: C.textDim, fontWeight: 700,
                fontSize: 16, cursor: "pointer",
              }}>⏮</button>
              <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${C.border}`, background: step === 0 ? C.surface : C.surface2,
                  color: step === 0 ? C.textMuted : C.text, fontWeight: 700, fontSize: 13,
                  cursor: step === 0 ? "default" : "pointer", fontFamily: C.mono,
                  opacity: step === 0 ? 0.5 : 1,
                }}>← Prev</button>
              <button onClick={() => {
                if (playing) { setPlaying(false); }
                else { if (step >= steps.length - 1) setStep(0); setPlaying(true); }
              }} style={{
                padding: "10px 20px", borderRadius: 8, border: "none",
                background: playing ? C.rose : C.cyan, color: C.bg,
                fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: C.mono,
              }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
              <button onClick={() => step < steps.length - 1 && setStep(step + 1)}
                disabled={step >= steps.length - 1} style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8, border: "none",
                  background: step >= steps.length - 1 ? C.surface : `linear-gradient(135deg, ${C.cyan}, ${C.green})`,
                  color: step >= steps.length - 1 ? C.textMuted : C.bg,
                  fontWeight: 700, fontSize: 13, fontFamily: C.mono,
                  cursor: step >= steps.length - 1 ? "default" : "pointer",
                  opacity: step >= steps.length - 1 ? 0.5 : 1,
                }}>Next →</button>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => { setStep(i); setPlaying(false); }} style={{
                  width: i === step ? 22 : 9, height: 9, borderRadius: 5,
                  border: "none", cursor: "pointer", padding: 0,
                  background: i === step ? C.cyan : i < step ? C.green + "60" : C.border,
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Code Section */}
        <div style={{
          marginTop: 24, background: C.surface,
          border: `1px solid ${C.border}`, borderRadius: 12,
          padding: 20, overflow: "auto",
        }}>
          <h3 style={{ fontFamily: C.mono, fontSize: 15, color: C.cyan, margin: "0 0 12px" }}>
            💻 Complete Solution (Python / C++ / JS)
          </h3>
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {["Python", "C++", "JavaScript"].map((lang, i) => (
              <span key={i} style={{
                fontFamily: C.mono, fontSize: 10, padding: "3px 10px",
                borderRadius: 4, background: C.cyanGlow,
                border: `1px solid ${C.cyan}30`, color: C.cyan,
              }}>{lang}</span>
            ))}
          </div>
          <pre style={{
            background: "#06080c", borderRadius: 8, padding: 16,
            fontFamily: C.mono, fontSize: 12.5, color: C.textDim,
            lineHeight: 1.8, margin: 0, overflowX: "auto", whiteSpace: "pre",
          }}>
{`def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):         # ensure nums1 is smaller
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    lo, hi = 0, m

    while lo <= hi:
        i = (lo + hi) // 2              # partition in nums1
        j = (m + n + 1) // 2 - i        # partition in nums2 (forced)

        left1  = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i]   if i < m else float('inf')
        left2  = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j]   if j < n else float('inf')

        if left1 <= right2 and left2 <= right1:      # ✓ valid
            if (m + n) % 2 == 0:
                return (max(left1,left2) + min(right1,right2)) / 2
            else:
                return max(left1, left2)
        elif left1 > right2:
            hi = i - 1                  # move left
        else:
            lo = i + 1                  # move right`}
          </pre>
        </div>
      </div>
    </div>
  );
}
