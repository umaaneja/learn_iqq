import React from 'react';
import T from '../tokens';
import { Btn, Badge } from '../components/Primitives';
import { Icon } from '../components/Icons';
import ActiveJobPanel from '../components/ActiveJobPanel';
import { fmtDate, fmtDateTime, relTime } from '../utils';

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: "20px 24px", boxShadow: T.shadow }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.textSub, letterSpacing: ".02em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ color: T.textMuted }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || T.text, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.textMuted }}>{sub}</div>
    </div>
  );
}

export default function OverviewPage({ archives, activeJobs, onNewArchive }) {
  const completed  = archives.filter((a) => a.status === "completed").length;
  const failed     = archives.filter((a) => a.status === "failed").length;
  const totalPages = archives.reduce((s, a) => s + a.pages, 0);
  const activeList = Object.values(activeJobs);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-.02em" }}>Overview</h1>
          <p style={{ fontSize: 13, color: T.textSub, margin: "4px 0 0" }}>{fmtDate(new Date().toISOString())} · All times in UTC</p>
        </div>
        <Btn onClick={onNewArchive} variant="primary" icon={<Icon.Plus />} size="md">New Archive</Btn>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Archives" value={archives.length}                   sub="All time"                                           icon={<Icon.Archive />} />
        <StatCard label="Completed"      value={completed}                          sub={`${archives.length ? Math.round((completed / archives.length) * 100) : 0}% success rate`} color={T.green} icon={<Icon.Eye />} />
        <StatCard label="Failed"         value={failed}                             sub="Requires review"  color={failed > 0 ? T.red : T.textMuted}                icon={<Icon.X />} />
        <StatCard label="Pages Archived" value={totalPages.toLocaleString()}       sub="Across all jobs"                                   icon={<Icon.Globe />} />
      </div>

      {/* Active Jobs */}
      {activeList.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: T.text, margin: 0 }}>Active Jobs</h2>
            <span style={{ background: T.accentLight, color: T.accent, fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 99 }}>{activeList.length}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
            {activeList.map((j) => <ActiveJobPanel key={j.id} job={j} />)}
          </div>
        </div>
      )}

      {/* Recent Archives */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: T.text, margin: "0 0 14px" }}>Recent Archives</h2>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, overflow: "hidden", boxShadow: T.shadow }}>
          {archives.slice(0, 5).map((a, i) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.textMuted }}>
                <Icon.Globe />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.url}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{fmtDate(a.created)} · {a.region}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {a.size !== "—" && <span style={{ fontSize: 12, color: T.textSub }}>{a.size}</span>}
                <Badge status={a.status} />
              </div>
            </div>
          ))}
          {archives.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: T.textMuted, fontSize: 13 }}>No archives yet. Start by creating a new archive job.</div>
          )}
        </div>
      </div>
    </div>
  );
}
