import React from 'react';
import T from '../tokens';
import { Btn, Badge, Tag } from './Primitives';
import { Icon } from './Icons';
import { fmtDateTime } from '../utils';

export default function DetailDrawer({ item, onClose, onReArchive }) {
  if (!item) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(15,21,32,0.3)", backdropFilter: "blur(2px)" }} />
      <div style={{ width: 420, background: T.surface, borderLeft: `1px solid ${T.border}`, height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0,0,0,0.1)", animation: "slideInRight .25s ease" }}>
        
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: T.surface, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 3 }}>{item.id}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>Archive Details</h3>
          </div>
          <button onClick={onClose} style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.textSub, cursor: "pointer", padding: 6, borderRadius: 6, display: "flex" }}>
            <Icon.X />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <Badge status={item.status} />
            {(item.tags || []).map((t) => <Tag key={t} label={t} />)}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6 }}>URL</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: T.text, wordBreak: "break-all", background: T.bg, padding: "10px 12px", borderRadius: T.radius, border: `1px solid ${T.border}` }}>
              {item.url}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              ["Created",        fmtDateTime(item.created)],
              ["Region",         item.region],
              ["Backup Size",    item.size],
              ["Duration",       item.duration],
              ["Pages Crawled",  item.pages > 0 ? item.pages.toLocaleString() : "—"],
              ["Archived By",    item.user],
            ].map(([k, v]) => (
              <div key={k} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 500 }}>{k}</div>
                <div style={{ fontSize: 13, color: T.text, fontWeight: 500, wordBreak: "break-word" }}>{v}</div>
              </div>
            ))}
          </div>

          {item.status === "failed" && item.error && (
            <div style={{ background: T.redBg, border: `1px solid ${T.redBorder}`, borderRadius: T.radius, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.red, marginBottom: 4 }}>Error Details</div>
              <div style={{ fontSize: 13, color: T.red, fontFamily: "'Geist Mono', monospace" }}>{item.error}</div>
            </div>
          )}

          {item.status === "completed" && (
            <div style={{ background: T.greenBg, border: `1px solid ${T.greenBorder}`, borderRadius: T.radius, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.green, marginBottom: 4 }}>Verification</div>
              <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.7 }}>
                ✓ SHA-256 checksum verified<br />
                ✓ Stored in 3 redundant locations<br />
                ✓ Encrypted at rest (AES-256)
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <Btn onClick={() => onReArchive(item.url)} variant="secondary" icon={<Icon.Refresh />}>Re-archive</Btn>
          {item.status === "completed" && <Btn variant="secondary" icon={<Icon.Download />}>Export</Btn>}
        </div>
      </div>
    </div>
  );
}
