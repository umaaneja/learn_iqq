import React from 'react';
import T from '../tokens';
import { Icon } from './Icons';

const NAV = [
  { id: "overview", label: "Overview",    icon: <Icon.Dashboard /> },
  { id: "archives", label: "Archives",    icon: <Icon.History />   },
  { id: "jobs",     label: "Active Jobs", icon: <Icon.Archive />   },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <div style={{ width: 224, background: T.sidebar, borderRight: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #1C5BE6, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M21 8v13H3V8M23 3H1v5h22V3zM10 12h4"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8F9FB", letterSpacing: "-.01em" }}>WebVault</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", fontWeight: 400 }}>Enterprise</div>
          </div>
        </div>
      </div>

      {/* Org Selector */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 7, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 500, flex: 1 }}>Acme Corp.</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "4px 10px 8px" }}>
          Workspace
        </div>
        {NAV.map((item) => {
          const active = activeView === item.id;
          return (
            <div key={item.id} onClick={() => setActiveView(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7, cursor: "pointer", marginBottom: 2, background: active ? "rgba(28,91,230,.25)" : "transparent", color: active ? "#93B4F8" : T.sidebarText, transition: "all .15s", fontSize: 13, fontWeight: active ? 500 : 400, border: `1px solid ${active ? "rgba(28,91,230,.35)" : "transparent"}` }}>
              <span style={{ color: active ? "#93B4F8" : "rgba(255,255,255,.35)", display: "flex" }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "14px 14px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #1C5BE6, #60A5FA)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.75)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>alice@corp.com</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)" }}>Admin</div>
          </div>
          <div style={{ color: "rgba(255,255,255,.25)", display: "flex" }}><Icon.Settings /></div>
        </div>
      </div>
    </div>
  );
}
