import React from 'react';
import T from '../tokens';
import { Badge } from './Primitives';
import { ProgressBar } from './Primitives';
import { relTime } from '../utils';

export default function ActiveJobPanel({ job }) {
  const dotColor =
    job.status === "in_progress" ? "#1C5BE6" :
    job.status === "completed"   ? "#10B981" : "#6B7280";

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: "20px 24px", boxShadow: T.shadow }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: dotColor,
            ...(job.status === "in_progress" ? { animation: "pulse 1.4s ease infinite" } : {}),
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Geist Mono', monospace" }}>{job.id}</span>
          <Badge status={job.status} />
        </div>
        <span style={{ fontSize: 12, color: T.textMuted }}>{relTime(job.created)}</span>
      </div>

      <div style={{ fontSize: 13, color: T.textSub, marginBottom: 4, fontFamily: "'Geist Mono', monospace", wordBreak: "break-all" }}>
        {job.url}
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: T.textMuted }}>{job.region}</span>
        <span style={{ fontSize: 11, color: T.textMuted }}>{job.user}</span>
      </div>

      <div style={{ marginBottom: 8 }}>
        <ProgressBar pct={job.progress} status={job.status} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: T.textSub }}>{job.step}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: job.status === "completed" ? T.green : T.accent }}>
          {job.progress}%
        </span>
      </div>
    </div>
  );
}
