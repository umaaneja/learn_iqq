import React from 'react';
import T from '../tokens';
import ActiveJobPanel from '../components/ActiveJobPanel';

export default function JobsPage({ activeJobs }) {
  const jobs = Object.values(activeJobs);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-.02em" }}>Active Jobs</h1>
          <p style={{ fontSize: 13, color: T.textSub, margin: "4px 0 0" }}>
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} currently running
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: "80px 40px", textAlign: "center", boxShadow: T.shadow }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🟢</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>All clear</div>
          <div style={{ fontSize: 13, color: T.textSub }}>No active archival jobs at this time.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {jobs.map((j) => <ActiveJobPanel key={j.id} job={j} />)}
        </div>
      )}
    </div>
  );
}
