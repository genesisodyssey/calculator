// Simple calculator logic. No eval(): we keep a tiny state machine instead.

const state = {
  current: "0",   // number being typed (string, so "0." works)
  previous: null, // left-hand operand (number)
  op: null,       // "+", "-", "*", "/", "%"
  fresh: false,   // true right after "=" or an operator: next digit starts a new number
};

function compute(a, op, b) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    case "%": return b === 0 ? NaN : a % b;
    default:  return b;
  }
}

function format(n) {
  if (!Number.isFinite(n)) return "Error";
  // Trim floating point noise such as 0.1 + 0.2 = 0.30000000000000004
  return String(parseFloat(n.toPrecision(12)));
}

function inputDigit(d) {
  if (state.current === "Error") state.current = "0";
  if (state.fresh || state.current === "0") {
    state.current = d;
    state.fresh = false;
  } else {
    state.current += d;
  }
}

function inputDot() {
  if (state.current === "Error" || state.fresh) {
    state.current = "0";
    state.fresh = false;
  }
  if (!state.current.includes(".")) state.current += ".";
}

function chooseOp(op) {
  if (state.current === "Error") return;
  // Chain: 2 + 3 + ... evaluates 2 + 3 first
  if (state.op && !state.fresh) equals();
  if (state.current === "Error") return;
  state.previous = parseFloat(state.current);
  state.op = op;
  state.fresh = true;
}

function equals() {
  if (!state.op || state.current === "Error") return;
  const result = compute(state.previous, state.op, parseFloat(state.current));
  state.current = format(result);
  state.previous = null;
  state.op = null;
  state.fresh = true;
}

function clearAll() {
  state.current = "0";
  state.previous = null;
  state.op = null;
  state.fresh = false;
}

function backspace() {
  if (state.fresh || state.current === "Error") return;
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
}

// ---- UI wiring (skipped when running under Node for tests) ----
if (typeof document !== "undefined") {
  const display = document.getElementById("display");
  const render = () => { display.textContent = state.current; };

  document.querySelector(".keys").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.digit) inputDigit(btn.dataset.digit);
    else if (btn.dataset.op) chooseOp(btn.dataset.op);
    else if (btn.dataset.action === "dot") inputDot();
    else if (btn.dataset.action === "equals") equals();
    else if (btn.dataset.action === "clear") clearAll();
    else if (btn.dataset.action === "back") backspace();
    render();
  });

  document.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
    else if ("+-*/%".includes(e.key)) chooseOp(e.key);
    else if (e.key === ".") inputDot();
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
    else if (e.key === "Backspace") backspace();
    else if (e.key === "Escape") clearAll();
    else return;
    render();
  });
}

if (typeof module !== "undefined") {
  module.exports = { state, inputDigit, inputDot, chooseOp, equals, clearAll, backspace };
}
