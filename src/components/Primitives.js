import React, { useState } from 'react';
import T from '../tokens';

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    completed:   { label: "Completed",   color: T.green,     bg: T.greenBg,  border: T.greenBorder  },
    in_progress: { label: "In Progress", color: T.yellow,    bg: T.yellowBg, border: T.yellowBorder },
    queued:      { label: "Queued",      color: T.blue,      bg: T.blueBg,   border: T.blueBorder   },
    failed:      { label: "Failed",      color: T.red,       bg: T.redBg,    border: T.redBorder    },
  };
  const c = map[status] || { label: status, color: T.textMuted, bg: T.bg, border: T.border };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, letterSpacing: ".02em", color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {status === "in_progress" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, animation: "pulse 1.4s ease infinite" }} />}
      {status === "completed"   && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={c.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {status === "failed"      && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke={c.color} strokeWidth="1.8" strokeLinecap="round"/></svg>}
      {status === "queued"      && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, opacity: 0.7 }} />}
      {c.label}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "secondary", size = "md", disabled = false, icon }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, borderRadius: T.radius,
    cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
    fontWeight: 500, border: "1px solid transparent", transition: "all .15s", outline: "none",
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { fontSize: 12, padding: "5px 10px" },
    md: { fontSize: 13, padding: "7px 14px" },
    lg: { fontSize: 14, padding: "10px 20px" },
  };
  const variants = {
    primary:   { background: hover ? T.accentHover : T.accent,      color: "#fff",      borderColor: hover ? T.accentHover : T.accent, boxShadow: hover ? "0 1px 6px rgba(28,91,230,.3)" : T.shadow },
    secondary: { background: hover ? T.surfaceHover : T.surface,    color: T.text,      borderColor: hover ? T.borderStrong : T.border, boxShadow: T.shadow },
    ghost:     { background: hover ? T.surfaceHover : "transparent", color: hover ? T.text : T.textSub, borderColor: "transparent" },
    danger:    { background: hover ? "#FEE2E2" : T.redBg,           color: T.red,       borderColor: T.redBorder },
  };
  return (
    <button onClick={!disabled ? onClick : undefined} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, onKeyDown, prefix, style: s }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {prefix && <span style={{ position: "absolute", left: 10, color: T.textMuted, fontSize: 13, pointerEvents: "none" }}>{prefix}</span>}
      <input
        value={value} onChange={onChange} placeholder={placeholder}
        onKeyDown={onKeyDown} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", height: 36, padding: prefix ? "0 12px 0 64px" : "0 12px",
          background: T.surface, border: `1px solid ${focus ? T.accent : T.border}`,
          borderRadius: T.radius, fontSize: 13, color: T.text, fontFamily: "inherit",
          boxShadow: focus ? `0 0 0 3px rgba(28,91,230,.1)` : T.shadow,
          outline: "none", transition: "all .15s", ...s,
        }}
      />
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options, style: s }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ height: 36, padding: "0 10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, fontSize: 13, color: T.text, fontFamily: "inherit", boxShadow: T.shadow, outline: "none", cursor: "pointer", ...s }}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export function Checkbox({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? T.accent : T.border}`, background: checked ? T.accent : T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}>
      {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ pct, status }) {
  const color = status === "completed" ? "#10B981" : status === "failed" ? "#EF4444" : "#1C5BE6";
  return (
    <div style={{ height: 3, borderRadius: 99, background: "#E4E7ED", overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width .4s ease" }} />
    </div>
  );
}

// ─── Tag ─────────────────────────────────────────────────────────────────────
export function Tag({ label }) {
  return (
    <span style={{ display: "inline-block", padding: "1px 7px", borderRadius: 4, fontSize: 11, fontWeight: 500, background: T.bg, border: `1px solid ${T.border}`, color: T.textSub, letterSpacing: ".01em" }}>
      {label}
    </span>
  );
}
