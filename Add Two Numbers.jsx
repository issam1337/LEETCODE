import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0a0a0f",
  surface: "#13131a",
  surfaceHover: "#1a1a24",
  border: "#23232f",
  borderActive: "#3b3b4f",
  accent: "#4f8ff7",
  accentGlow: "rgba(79, 143, 247, 0.15)",
  sap: "#0070f2",
  sapGlow: "rgba(0, 112, 242, 0.15)",
  gold: "#f5a623",
  goldGlow: "rgba(245, 166, 35, 0.12)",
  green: "#22c55e",
  greenGlow: "rgba(34, 197, 94, 0.12)",
  red: "#ef4444",
  redGlow: "rgba(239, 68, 68, 0.12)",
  text: "#e8e8ef",
  textDim: "#9898a8",
  textMuted: "#5e5e70",
  editorBg: "#0d0d14",
  lineNum: "#3a3a48",
};

// ═══════════════════════════════════════════════
// PROBLEMS DATABASE (ABAP-adapted LeetCode)
// ═══════════════════════════════════════════════
const PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    desc: `Given an internal table of integers IT_NUMS and a target integer IV_TARGET, return the indices of the two numbers that add up to the target.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.`,
    examples: [
      { input: "IT_NUMS = [2, 7, 11, 15], IV_TARGET = 9", output: "EV_IDX1 = 1, EV_IDX2 = 2", explanation: "nums[1] + nums[2] = 2 + 7 = 9" },
      { input: "IT_NUMS = [3, 2, 4], IV_TARGET = 6", output: "EV_IDX1 = 2, EV_IDX2 = 3", explanation: "nums[2] + nums[3] = 2 + 4 = 6" },
    ],
    template: `CLASS zcl_two_sum DEFINITION.
  PUBLIC SECTION.
    TYPES: BEGIN OF ty_result,
             idx1 TYPE i,
             idx2 TYPE i,
           END OF ty_result.

    METHODS solve
      IMPORTING
        it_nums   TYPE STANDARD TABLE OF i
        iv_target TYPE i
      RETURNING
        VALUE(rs_result) TYPE ty_result.
ENDCLASS.

CLASS zcl_two_sum IMPLEMENTATION.
  METHOD solve.
    " ▸ Your solution here
    " Hint: Use a hash table for O(n) lookup
    
    DATA: lt_map TYPE HASHED TABLE OF i
                 WITH UNIQUE KEY table_line.

    " Loop through the table
    " For each number, check if (target - number) exists
    " If yes → return both indices


  ENDMETHOD.
ENDCLASS.`,
    solution: `CLASS zcl_two_sum IMPLEMENTATION.
  METHOD solve.
    TYPES: BEGIN OF ty_map_entry,
             value TYPE i,
             index TYPE i,
           END OF ty_map_entry.

    DATA: lt_map TYPE HASHED TABLE OF ty_map_entry
                 WITH UNIQUE KEY value.
    DATA: ls_entry TYPE ty_map_entry,
          lv_complement TYPE i,
          lv_index TYPE i VALUE 1.

    LOOP AT it_nums INTO DATA(lv_num).
      lv_complement = iv_target - lv_num.

      READ TABLE lt_map WITH KEY value = lv_complement
        INTO DATA(ls_found).
      IF sy-subrc = 0.
        rs_result-idx1 = ls_found-index.
        rs_result-idx2 = lv_index.
        RETURN.
      ENDIF.

      ls_entry-value = lv_num.
      ls_entry-index = lv_index.
      INSERT ls_entry INTO TABLE lt_map.
      lv_index = lv_index + 1.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`,
    testCases: [
      { input: "[2,7,11,15] target=9", expected: "1, 2", desc: "Basic case" },
      { input: "[3,2,4] target=6", expected: "2, 3", desc: "Middle elements" },
      { input: "[3,3] target=6", expected: "1, 2", desc: "Same values" },
    ],
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    desc: `You are given two internal tables representing two non-negative integers. The digits are stored in reverse order. Add the two numbers and return the sum as an internal table.\n\nEach element contains a single digit (0-9).`,
    examples: [
      { input: "IT_L1 = [2,4,3], IT_L2 = [5,6,4]", output: "RT_RESULT = [7,0,8]", explanation: "342 + 465 = 807" },
      { input: "IT_L1 = [9,9,9], IT_L2 = [1]", output: "RT_RESULT = [0,0,0,1]", explanation: "999 + 1 = 1000" },
    ],
    template: `CLASS zcl_add_two_numbers DEFINITION.
  PUBLIC SECTION.
    METHODS solve
      IMPORTING
        it_l1 TYPE STANDARD TABLE OF i
        it_l2 TYPE STANDARD TABLE OF i
      RETURNING
        VALUE(rt_result) TYPE STANDARD TABLE OF i.
ENDCLASS.

CLASS zcl_add_two_numbers IMPLEMENTATION.
  METHOD solve.
    " ▸ Your solution here
    " Process digit by digit with carry
    
    DATA: lv_carry  TYPE i VALUE 0,
          lv_sum    TYPE i,
          lv_digit  TYPE i,
          lv_idx    TYPE i VALUE 1,
          lv_val1   TYPE i,
          lv_val2   TYPE i,
          lv_len1   TYPE i,
          lv_len2   TYPE i.

    lv_len1 = lines( it_l1 ).
    lv_len2 = lines( it_l2 ).

    " While there are digits or carry remains
    " Add corresponding digits + carry
    " Append sum MOD 10 to result
    " Update carry = sum DIV 10


  ENDMETHOD.
ENDCLASS.`,
    solution: `CLASS zcl_add_two_numbers IMPLEMENTATION.
  METHOD solve.
    DATA: lv_carry TYPE i VALUE 0,
          lv_sum   TYPE i,
          lv_idx   TYPE i VALUE 1,
          lv_val1  TYPE i,
          lv_val2  TYPE i,
          lv_len1  TYPE i,
          lv_len2  TYPE i.

    lv_len1 = lines( it_l1 ).
    lv_len2 = lines( it_l2 ).

    WHILE lv_idx <= lv_len1 OR lv_idx <= lv_len2 OR lv_carry > 0.
      lv_val1 = 0.
      lv_val2 = 0.

      IF lv_idx <= lv_len1.
        READ TABLE it_l1 INDEX lv_idx INTO lv_val1.
      ENDIF.
      IF lv_idx <= lv_len2.
        READ TABLE it_l2 INDEX lv_idx INTO lv_val2.
      ENDIF.

      lv_sum = lv_val1 + lv_val2 + lv_carry.
      APPEND ( lv_sum MOD 10 ) TO rt_result.
      lv_carry = lv_sum DIV 10.
      lv_idx = lv_idx + 1.
    ENDWHILE.
  ENDMETHOD.
ENDCLASS.`,
    testCases: [
      { input: "[2,4,3] + [5,6,4]", expected: "[7,0,8]", desc: "342 + 465 = 807" },
      { input: "[9,9,9] + [1]", expected: "[0,0,0,1]", desc: "Carry propagation" },
      { input: "[0] + [0]", expected: "[0]", desc: "Zero + Zero" },
    ],
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    desc: `Given a string IV_INPUT, find the length of the longest substring without duplicate characters.\n\nReturn the length as an integer.`,
    examples: [
      { input: 'IV_INPUT = "abcabcbb"', output: "RV_RESULT = 3", explanation: 'The answer is "abc", length 3' },
      { input: 'IV_INPUT = "bbbbb"', output: "RV_RESULT = 1", explanation: 'The answer is "b", length 1' },
    ],
    template: `CLASS zcl_longest_substring DEFINITION.
  PUBLIC SECTION.
    METHODS solve
      IMPORTING
        iv_input TYPE string
      RETURNING
        VALUE(rv_result) TYPE i.
ENDCLASS.

CLASS zcl_longest_substring IMPLEMENTATION.
  METHOD solve.
    " ▸ Your solution here — Sliding Window
    
    DATA: lv_left    TYPE i VALUE 0,
          lv_right   TYPE i VALUE 0,
          lv_len     TYPE i,
          lv_char    TYPE c LENGTH 1,
          lv_max     TYPE i VALUE 0.

    " Use a hash table to track last seen index
    " Expand right pointer each iteration
    " If duplicate found in window → jump left
    " Track maximum window size

    lv_len = strlen( iv_input ).


  ENDMETHOD.
ENDCLASS.`,
    solution: `CLASS zcl_longest_substring IMPLEMENTATION.
  METHOD solve.
    TYPES: BEGIN OF ty_char_pos,
             char  TYPE c LENGTH 1,
             index TYPE i,
           END OF ty_char_pos.

    DATA: lt_seen  TYPE HASHED TABLE OF ty_char_pos
                   WITH UNIQUE KEY char,
          lv_left  TYPE i VALUE 0,
          lv_len   TYPE i,
          lv_char  TYPE c LENGTH 1.

    lv_len = strlen( iv_input ).

    DO lv_len TIMES.
      DATA(lv_right) = sy-index - 1.
      lv_char = iv_input+lv_right(1).

      READ TABLE lt_seen WITH KEY char = lv_char
        INTO DATA(ls_found).
      IF sy-subrc = 0 AND ls_found-index >= lv_left.
        lv_left = ls_found-index + 1.
      ENDIF.

      DATA(ls_new) = VALUE ty_char_pos(
        char = lv_char index = lv_right ).
      MODIFY TABLE lt_seen FROM ls_new.

      DATA(lv_window) = lv_right - lv_left + 1.
      IF lv_window > rv_result.
        rv_result = lv_window.
      ENDIF.
    ENDDO.
  ENDMETHOD.
ENDCLASS.`,
    testCases: [
      { input: '"abcabcbb"', expected: "3", desc: 'Window "abc"' },
      { input: '"bbbbb"', expected: "1", desc: "All same chars" },
      { input: '"pwwkew"', expected: "3", desc: 'Window "wke"' },
      { input: '""', expected: "0", desc: "Empty string" },
    ],
  },
];

// ═══════════════════════════════════════════════
// ABAP SYNTAX HIGHLIGHTER (simple)
// ═══════════════════════════════════════════════
function highlightABAP(code) {
  const keywords = /\b(CLASS|DEFINITION|IMPLEMENTATION|PUBLIC|PRIVATE|PROTECTED|SECTION|METHODS|METHOD|ENDMETHOD|ENDCLASS|IMPORTING|EXPORTING|RETURNING|CHANGING|VALUE|TYPE|DATA|TYPES|BEGIN OF|END OF|STANDARD TABLE|HASHED TABLE|SORTED TABLE|WITH UNIQUE KEY|WITH NON-UNIQUE KEY|READ TABLE|LOOP AT|ENDLOOP|INTO|APPEND|INSERT|MODIFY|DELETE|IF|ELSE|ELSEIF|ENDIF|DO|ENDDO|WHILE|ENDWHILE|RETURN|AND|OR|NOT|TABLE_LINE|INDEX|LINES|STRLEN|SY-SUBRC|SY-INDEX|MOD|DIV)\b/gi;
  const strings = /('[^']*'|"[^"]*")/g;
  const comments = /(\"[^\n]*$|^\s*\*[^\n]*$)/gm;
  const numbers = /\b(\d+)\b/g;

  let result = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  result = result.replace(comments, `<span style="color:${C.textMuted};font-style:italic">$1</span>`);
  result = result.replace(strings, `<span style="color:${C.gold}">$1</span>`);
  result = result.replace(keywords, `<span style="color:${C.accent};font-weight:600">$&</span>`);
  result = result.replace(numbers, `<span style="color:${C.green}">$1</span>`);

  return result;
}

// ═══════════════════════════════════════════════
// CODE EDITOR COMPONENT
// ═══════════════════════════════════════════════
function ABAPEditor({ code, onChange, readOnly }) {
  const textareaRef = useRef(null);
  const lines = code.split("\n");

  return (
    <div style={{
      background: C.editorBg, borderRadius: 10, overflow: "hidden",
      border: `1px solid ${C.border}`, position: "relative",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px", borderBottom: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          color: C.textMuted, letterSpacing: 0.5,
        }}>
          {readOnly ? "SOLUTION.abap" : "EDITOR.abap"}
        </span>
        <div style={{
          padding: "2px 8px", borderRadius: 4,
          background: C.sapGlow, border: `1px solid ${C.sap}40`,
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: C.sap, fontWeight: 700,
          }}>ABAP</span>
        </div>
      </div>

      {/* Editor body */}
      <div style={{ display: "flex", position: "relative", maxHeight: 420, overflow: "auto" }}>
        {/* Line numbers */}
        <div style={{
          padding: "12px 0", minWidth: 44, textAlign: "right",
          borderRight: `1px solid ${C.border}`,
          userSelect: "none", flexShrink: 0,
          background: C.editorBg,
        }}>
          {lines.map((_, i) => (
            <div key={i} style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, lineHeight: "20px", color: C.lineNum,
              paddingRight: 10,
            }}>{i + 1}</div>
          ))}
        </div>

        {/* Code area */}
        {readOnly ? (
          <pre style={{
            margin: 0, padding: 12, flex: 1, overflow: "auto",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5,
            lineHeight: "20px", color: C.textDim, whiteSpace: "pre",
          }}
            dangerouslySetInnerHTML={{ __html: highlightABAP(code) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => onChange(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1, margin: 0, padding: 12, border: "none",
              background: "transparent", color: C.text, resize: "none",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5,
              lineHeight: "20px", outline: "none", minHeight: 300,
              whiteSpace: "pre", overflowWrap: "normal",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TEST RESULTS PANEL
// ═══════════════════════════════════════════════
function TestResults({ testCases, results }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {testCases.map((tc, i) => {
        const result = results?.[i];
        const passed = result?.passed;
        const ran = result !== undefined;

        return (
          <div key={i} style={{
            background: C.surface, border: `1px solid ${ran ? (passed ? C.green + "40" : C.red + "40") : C.border}`,
            borderRadius: 8, padding: 12,
            transition: "all 0.3s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                color: C.text, fontWeight: 600,
              }}>
                Test {i + 1}: {tc.desc}
              </span>
              {ran && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                  fontFamily: "'IBM Plex Mono', monospace",
                  background: passed ? C.greenGlow : C.redGlow,
                  color: passed ? C.green : C.red,
                }}>
                  {passed ? "✓ PASS" : "✗ FAIL"}
                </span>
              )}
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              color: C.textDim, lineHeight: 1.8,
            }}>
              <div>Input: {tc.input}</div>
              <div>Expected: <span style={{ color: C.green }}>{tc.expected}</span></div>
              {ran && !passed && (
                <div>Got: <span style={{ color: C.red }}>{result?.got || "error"}</span></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ARCHITECTURE OPTIONS TAB
// ═══════════════════════════════════════════════
function ArchitectureTab() {
  const [expanded, setExpanded] = useState(0);

  const options = [
    {
      id: 0,
      title: "Option 1: SAP BTP + Laravel API",
      badge: "RECOMMENDED",
      badgeColor: C.green,
      difficulty: "Medium",
      diagram: `┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  PanLab.GG  │────▶│  Laravel API │────▶│  SAP BTP ABAP   │
│  Frontend   │◀────│  Backend     │◀────│  Environment    │
│  (React)    │     │  /api/run    │     │  (Cloud ABAP)   │
└─────────────┘     └──────────────┘     └─────────────────┘`,
      steps: [
        "User writes ABAP in the browser editor",
        "Frontend POSTs code to Laravel /api/abap/run",
        "Laravel calls SAP BTP ABAP Environment via REST API",
        "SAP compiles + runs the code in a sandbox class",
        "Results returned → Laravel → Frontend → Show test results",
      ],
      pros: ["Real ABAP execution — 100% authentic", "SAP BTP has free tier", "Full ABAP syntax support", "Can test with real SAP data types"],
      cons: ["Requires SAP BTP account", "Some latency for cold starts", "Need to handle security carefully"],
      code: `// Laravel Controller — routes/api.php
Route::post('/abap/run', [AbapController::class, 'run']);

// app/Http/Controllers/AbapController.php
class AbapController extends Controller
{
    public function run(Request $request)
    {
        $code = $request->input('code');
        $testCases = $request->input('test_cases');

        // Call SAP BTP ABAP Environment
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->getSAPToken(),
            'Content-Type'  => 'application/json',
        ])->post(config('sap.btp_url') . '/sap/bc/adt/programs/run', [
            'source_code' => $code,
            'test_inputs' => $testCases,
        ]);

        return response()->json([
            'results' => $response->json('test_results'),
            'compile_errors' => $response->json('errors'),
            'runtime_ms' => $response->json('runtime'),
        ]);
    }

    private function getSAPToken()
    {
        // OAuth2 client credentials flow to SAP BTP
        return Cache::remember('sap_token', 3500, function () {
            $resp = Http::asForm()->post(config('sap.token_url'), [
                'grant_type'    => 'client_credentials',
                'client_id'     => config('sap.client_id'),
                'client_secret' => config('sap.client_secret'),
            ]);
            return $resp->json('access_token');
        });
    }
}`,
    },
    {
      id: 1,
      title: "Option 2: On-Prem SAP via RFC",
      badge: "IF YOU HAVE ACCESS",
      badgeColor: C.gold,
      difficulty: "Medium-Hard",
      diagram: `┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  PanLab.GG  │────▶│  Laravel API │────▶│  SAP On-Premise  │
│  Frontend   │◀────│  + sapnwrfc  │◀────│  via RFC / BAPI  │
│  (React)    │     │  PHP ext     │     │  (Your system)   │
└─────────────┘     └──────────────┘     └─────────────────┘`,
      steps: [
        "Install SAP NW RFC SDK + PHP extension on your server",
        "Create a Z_RUN_ABAP function module on your SAP system",
        "Laravel calls the FM via RFC with the user's code",
        "FM compiles dynamically (GENERATE SUBROUTINE POOL)",
        "Results returned via RFC → Laravel → Frontend",
      ],
      pros: ["Uses your existing SAP system", "No extra cloud costs", "Full ABAP + SAP dictionary access"],
      cons: ["Requires SAP system access", "PHP RFC extension setup", "Security: dynamic code execution risks", "Network/VPN requirements"],
      code: `// SAP Function Module: Z_ABAP_CODE_RUNNER
// (Create via SE37)

FUNCTION Z_ABAP_CODE_RUNNER.
*"------------------------------------------------------
*" IMPORTING
*"   IV_SOURCE_CODE TYPE STRING
*"   IV_TEST_INPUT  TYPE STRING
*" EXPORTING
*"   EV_OUTPUT      TYPE STRING
*"   EV_ERROR       TYPE STRING
*"   EV_RUNTIME_MS  TYPE I
*"------------------------------------------------------

  DATA: lt_source  TYPE TABLE OF string,
        lv_prog    TYPE string,
        lv_msg     TYPE string.

  " Split source into lines
  SPLIT iv_source_code AT cl_abap_char_utilities=>newline
    INTO TABLE lt_source.

  " Generate subroutine pool (sandboxed)
  GENERATE SUBROUTINE POOL lt_source
    NAME lv_prog MESSAGE lv_msg.

  IF sy-subrc <> 0.
    ev_error = lv_msg.
    RETURN.
  ENDIF.

  " Execute and capture output
  DATA(lv_start) = cl_abap_runtime=>create_hr_timer( ).
  
  TRY.
      PERFORM run_tests IN PROGRAM (lv_prog)
        USING iv_test_input
        CHANGING ev_output.
    CATCH cx_root INTO DATA(lx_err).
      ev_error = lx_err->get_text( ).
  ENDTRY.

  ev_runtime_ms = cl_abap_runtime=>create_hr_timer( )
                - lv_start.

ENDFUNCTION.`,
    },
    {
      id: 2,
      title: "Option 3: open-abap Transpiler (Browser)",
      badge: "EASIEST START",
      badgeColor: C.accent,
      difficulty: "Easy",
      diagram: `┌─────────────────────────────────────────────┐
│              Browser (Client-Side)           │
│                                              │
│  ┌──────────┐    ┌────────────────────────┐  │
│  │  Editor   │───▶│  open-abap transpiler  │  │
│  │  (React)  │◀───│  ABAP → JavaScript     │  │
│  └──────────┘    └────────────────────────┘  │
│                                              │
│  No server needed! Runs entirely in browser  │
└─────────────────────────────────────────────┘`,
      steps: [
        "Install open-abap: npm install @niclas/open-abap",
        "User writes ABAP in the browser",
        "Transpiler converts ABAP → JavaScript in real-time",
        "Execute the JS and compare against test cases",
        "Everything runs client-side — zero server cost!",
      ],
      pros: ["No SAP system needed", "Zero infrastructure cost", "Instant execution", "Works offline", "Perfect for learning/practice"],
      cons: ["Limited ABAP syntax support", "No SAP dictionary types", "No database operations", "Subset of ABAP only"],
      code: `// Install: npm install @niclas/open-abap
// In your React component:

import {ABAP} from "@niclas/open-abap";

async function runABAPCode(sourceCode, testInput) {
  try {
    // Transpile ABAP to JavaScript
    const abap = new ABAP();
    await abap.initializeStatic();
    
    // Add the source code as a class
    await abap.addSource("zcl_solution", sourceCode);
    
    // Run transpilation
    await abap.parse();
    
    // Execute and get results
    const result = await abap.run("zcl_solution", "solve", {
      input: testInput,
    });
    
    return {
      success: true,
      output: result,
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      errors: error.message,
    };
  }
}

// In your Laravel Blade / React page:
// <ABAPEditor onSubmit={runABAPCode} />`,
    },
    {
      id: 3,
      title: "Option 4: Docker ABAP Sandbox",
      badge: "SELF-HOSTED",
      badgeColor: C.red,
      difficulty: "Hard",
      diagram: `┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  PanLab.GG  │────▶│  Laravel API │────▶│  Docker Container│
│  Frontend   │◀────│  Queue +     │◀────│  open-abap CLI   │
│  (React)    │     │  Workers     │     │  (Sandboxed)     │
└─────────────┘     └──────────────┘     └─────────────────┘`,
      steps: [
        "Set up Docker container with open-abap CLI",
        "Laravel queues code execution jobs",
        "Worker spins up isolated container per submission",
        "Container runs ABAP → JS transpilation + execution",
        "Results returned via queue → WebSocket → Frontend",
      ],
      pros: ["Fully isolated execution", "Scalable with queues", "No SAP license needed", "Security via containerization"],
      cons: ["Complex infrastructure", "Docker management", "Limited ABAP syntax", "Queue latency"],
      code: `# Dockerfile for ABAP sandbox
FROM node:20-alpine

RUN npm install -g @niclas/open-abap
WORKDIR /sandbox

COPY runner.js .

# Security: non-root user, resource limits
USER node
CMD ["node", "runner.js"]

# docker-compose.yml
services:
  abap-runner:
    build: ./abap-sandbox
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.5'
    read_only: true
    tmpfs:
      - /tmp:size=10M

# Laravel Job: app/Jobs/RunAbapCode.php
class RunAbapCode implements ShouldQueue
{
    public function handle(): void
    {
        $result = Process::timeout(10)->run(
            "docker run --rm -m 128m " .
            "-e CODE='{$this->code}' " .
            "-e TESTS='{$this->tests}' " .
            "abap-runner"
        );

        broadcast(new AbapResult(
            $this->userId,
            json_decode($result->output())
        ));
    }
}`,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ color: C.accent, fontSize: 18, margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
        🏗️ How to Run ABAP on Your Website
      </h3>
      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
        Four architecture options for executing ABAP code from PanLab.GG, ordered by recommendation:
      </p>

      {options.map((opt) => (
        <div key={opt.id} style={{
          background: C.surface, border: `1px solid ${expanded === opt.id ? opt.badgeColor + "40" : C.border}`,
          borderRadius: 12, overflow: "hidden",
          transition: "border-color 0.3s",
        }}>
          {/* Header */}
          <button
            onClick={() => setExpanded(expanded === opt.id ? -1 : opt.id)}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "14px 18px", border: "none",
              background: "transparent", cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 14,
                fontWeight: 700, color: C.text,
              }}>{opt.title}</span>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 4,
                background: opt.badgeColor + "20", color: opt.badgeColor,
                fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 0.8,
              }}>{opt.badge}</span>
            </div>
            <span style={{
              color: C.textMuted, fontSize: 18,
              transform: expanded === opt.id ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}>▾</span>
          </button>

          {/* Expanded Content */}
          {expanded === opt.id && (
            <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Diagram */}
              <pre style={{
                background: C.editorBg, borderRadius: 8, padding: 14,
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                color: C.accent, lineHeight: 1.6, margin: 0,
                overflowX: "auto", whiteSpace: "pre",
              }}>
                {opt.diagram}
              </pre>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {opt.steps.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 10, alignItems: "flex-start",
                    fontSize: 13, color: C.textDim, lineHeight: 1.5,
                  }}>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                      color: C.accent, fontWeight: 700, flexShrink: 0,
                      background: C.accentGlow, padding: "2px 6px", borderRadius: 4,
                    }}>{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>

              {/* Pros/Cons */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>✓ PROS</div>
                  {opt.pros.map((p, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.textDim, lineHeight: 1.8, paddingLeft: 8 }}>• {p}</div>
                  ))}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>✗ CONS</div>
                  {opt.cons.map((c, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.textDim, lineHeight: 1.8, paddingLeft: 8 }}>• {c}</div>
                  ))}
                </div>
              </div>

              {/* Implementation Code */}
              <div>
                <div style={{
                  fontSize: 11, color: C.gold, fontWeight: 700, marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>📄 IMPLEMENTATION</div>
                <pre style={{
                  background: C.editorBg, borderRadius: 8, padding: 14,
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5,
                  color: C.textDim, lineHeight: 1.7, margin: 0,
                  overflowX: "auto", whiteSpace: "pre",
                  maxHeight: 350, overflow: "auto",
                  border: `1px solid ${C.border}`,
                }}>
                  {opt.code}
                </pre>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Quick comparison */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 12, padding: 18, overflowX: "auto",
      }}>
        <h4 style={{ color: C.gold, margin: "0 0 12px", fontSize: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
          ⚡ Quick Comparison
        </h4>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["", "SAP BTP", "On-Prem RFC", "Browser", "Docker"].map(h => (
                <th key={h} style={{ padding: "8px 6px", color: C.textMuted, fontWeight: 700, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Real ABAP", "✅", "✅", "⚠️ Partial", "⚠️ Partial"],
              ["Setup", "Medium", "Hard", "Easy", "Hard"],
              ["Cost", "Free tier", "$0*", "$0", "Server"],
              ["Latency", "~2s", "~1s", "Instant", "~3s"],
              ["SAP Types", "✅", "✅", "❌", "❌"],
              ["Security", "High", "Medium", "High", "High"],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: "8px 6px",
                    color: j === 0 ? C.textDim : C.text,
                    fontWeight: j === 0 ? 600 : 400,
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function ABAPLeetCode() {
  const [tab, setTab] = useState("solve");
  const [problemIdx, setProblemIdx] = useState(2);
  const [code, setCode] = useState(PROBLEMS[2].template);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const problem = PROBLEMS[problemIdx];

  const handleProblemChange = (idx) => {
    setProblemIdx(idx);
    setCode(PROBLEMS[idx].template);
    setShowSolution(false);
    setTestResults(null);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTestResults(null);

    // Simulate test execution (in real implementation, this calls your backend)
    setTimeout(() => {
      const hasCode = code.length > problem.template.length + 20;
      const results = problem.testCases.map((tc, i) => ({
        passed: hasCode ? Math.random() > 0.3 : false,
        got: hasCode ? tc.expected : "not implemented",
      }));
      setTestResults(results);
      setSubmitting(false);
    }, 1500);
  };

  const tabs = [
    { id: "solve", label: "⌨️ Solve" },
    { id: "arch", label: "🏗️ Architecture" },
  ];

  const diffColors = { Easy: C.green, Medium: C.gold, Hard: C.red };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "20px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 16px", borderRadius: 20,
            background: C.sapGlow, border: `1px solid ${C.sap}40`,
            marginBottom: 10,
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              fontWeight: 700, color: C.sap, letterSpacing: 1.5,
            }}>SAP ABAP</span>
            <span style={{ color: C.textMuted }}>×</span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              fontWeight: 700, color: C.gold, letterSpacing: 1.5,
            }}>LEETCODE</span>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, margin: "0 0 4px",
            fontFamily: "'IBM Plex Mono', monospace", color: C.text,
          }}>
            ABAP Coding Challenges
          </h1>
          <p style={{
            color: C.textMuted, fontSize: 12, margin: 0,
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            Practice algorithms in ABAP — submit & test on your website
          </p>
        </div>

        {/* Main Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 16,
          background: C.surface, borderRadius: 10, padding: 4,
          border: `1px solid ${C.border}`,
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 8, border: "none",
                background: tab === t.id ? C.accent : "transparent",
                color: tab === t.id ? C.bg : C.textMuted,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Architecture Tab */}
        {tab === "arch" && <ArchitectureTab />}

        {/* Solve Tab */}
        {tab === "solve" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Problem Selector */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PROBLEMS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => handleProblemChange(i)}
                  style={{
                    flex: 1, minWidth: 140, padding: "10px 12px", borderRadius: 8,
                    border: `1px solid ${problemIdx === i ? C.accent : C.border}`,
                    background: problemIdx === i ? C.accentGlow : C.surface,
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                    fontWeight: 700, color: problemIdx === i ? C.accent : C.textDim,
                  }}>
                    #{p.id}. {p.title}
                  </div>
                  <span style={{
                    fontSize: 10, color: diffColors[p.difficulty],
                    fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
                  }}>{p.difficulty}</span>
                </button>
              ))}
            </div>

            {/* Problem Description */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: 18,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{
                  margin: 0, fontSize: 17, color: C.text,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  #{problem.id}. {problem.title}
                </h3>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 5,
                  background: diffColors[problem.difficulty] + "20",
                  color: diffColors[problem.difficulty],
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>{problem.difficulty}</span>
              </div>
              <p style={{
                color: C.textDim, fontSize: 13.5, lineHeight: 1.7, margin: "0 0 14px",
                whiteSpace: "pre-line",
              }}>{problem.desc}</p>

              {/* Examples */}
              {problem.examples.map((ex, i) => (
                <div key={i} style={{
                  background: C.editorBg, borderRadius: 8, padding: 12, marginBottom: 8,
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                  color: C.textDim, lineHeight: 1.8,
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{ fontWeight: 700, color: C.textMuted, fontSize: 11, marginBottom: 4 }}>
                    Example {i + 1}:
                  </div>
                  <div>Input: <span style={{ color: C.gold }}>{ex.input}</span></div>
                  <div>Output: <span style={{ color: C.green }}>{ex.output}</span></div>
                  <div style={{ color: C.textMuted, fontSize: 11 }}>// {ex.explanation}</div>
                </div>
              ))}
            </div>

            {/* Code Editor */}
            <ABAPEditor
              code={code}
              onChange={setCode}
              readOnly={false}
            />

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  flex: 2, padding: "12px 20px", borderRadius: 10, border: "none",
                  background: submitting
                    ? C.border
                    : `linear-gradient(135deg, ${C.green}, ${C.accent})`,
                  color: C.bg, fontWeight: 700, fontSize: 14, cursor: submitting ? "default" : "pointer",
                  fontFamily: "'IBM Plex Mono', monospace",
                  transition: "all 0.2s",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "⏳ Running Tests..." : "▶ Submit & Test"}
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 10,
                  border: `1px solid ${C.gold}40`,
                  background: showSolution ? C.goldGlow : "transparent",
                  color: C.gold, fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {showSolution ? "Hide Solution" : "💡 Solution"}
              </button>
              <button
                onClick={() => { setCode(problem.template); setTestResults(null); }}
                style={{
                  padding: "12px 16px", borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textMuted, fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                ↺ Reset
              </button>
            </div>

            {/* Test Results */}
            {testResults && (
              <div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 10,
                }}>
                  <h4 style={{
                    margin: 0, fontSize: 14, color: C.text,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>Test Results</h4>
                  {(() => {
                    const passed = testResults.filter(r => r.passed).length;
                    const total = testResults.length;
                    const allPassed = passed === total;
                    return (
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5,
                        background: allPassed ? C.greenGlow : C.redGlow,
                        color: allPassed ? C.green : C.red,
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}>
                        {passed}/{total} Passed
                      </span>
                    );
                  })()}
                </div>
                <TestResults testCases={problem.testCases} results={testResults} />
              </div>
            )}

            {/* Solution */}
            {showSolution && (
              <div>
                <h4 style={{
                  margin: "0 0 8px", fontSize: 14, color: C.gold,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>💡 ABAP Solution</h4>
                <ABAPEditor code={problem.solution} readOnly />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
