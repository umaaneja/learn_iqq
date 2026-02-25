import React from 'react';
import T from '../tokens';

export default function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 300, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ background: T.sidebar, color: "#fff", borderRadius: T.radiusLg, padding: "12px 18px", fontSize: 13, fontWeight: 500, boxShadow: T.shadowLg, maxWidth: 360, display: "flex", alignItems: "center", gap: 10, animation: "slideInToast .25s ease", border: "1px solid rgba(255,255,255,.08)", pointerEvents: "all" }}>
          <span style={{ fontSize: 16 }}>{t.icon || "✓"}</span>
          <span style={{ color: "rgba(255,255,255,.85)" }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
