import { useState, useEffect, useRef } from "react";

// ─── Dummy API Layer ──────────────────────────────────────────────────────────
const mockDB = {
  jobs: {},
  archives: [
    {
      job_id: "arc-0001",
      url: "https://wikipedia.org",
      siteName: "Wikipedia",
      status: "completed",
      timestamp: "2026-02-20T08:32:00Z",
      size: "142 MB",
      duration: "3 min 12 sec",
      pages: 1240,
    },
    {
      job_id: "arc-0002",
      url: "https://archive.org",
      siteName: "Archive.org",
      status: "completed",
      timestamp: "2026-02-22T14:15:00Z",
      size: "389 MB",
      duration: "8 min 44 sec",
      pages: 3891,
    },
    {
      job_id: "arc-0003",
      url: "https://news.ycombinator.com",
      siteName: "Hacker News",
      status: "failed",
      timestamp: "2026-02-23T19:07:00Z",
      size: "—",
      duration: "—",
      pages: 0,
    },
  ],
};

let jobCounter = 4;

const api = {
  startArchival: (url) =>
    new Promise((res) => {
      setTimeout(() => {
        const job_id = `arc-${String(jobCounter++).padStart(4, "0")}`;
        const siteName = url.replace(/https?:\/\//, "").split("/")[0];
        mockDB.jobs[job_id] = {
          job_id,
          url,
          siteName,
          status: "queued",
          progress: 0,
          timestamp: new Date().toISOString(),
          size: "—",
          duration: "—",
          pages: 0,
        };
        res({ job_id, status: "started" });
      }, 400);
    }),

  getStatus: (job_id) =>
    new Promise((res) => {
      setTimeout(() => {
        const job = mockDB.jobs[job_id];
        res({ job_id, status: job?.status, progress: job?.progress });
      }, 200);
    }),

  getList: () =>
    new Promise((res) => {
      setTimeout(() => res([...mockDB.archives]), 300);
    }),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function elapsed(iso) {
  const sec = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  return `${Math.floor(sec / 3600)}h ago`;
}
function randomBetween(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function isValidUrl(s) {
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

// ─── Status Pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const cfg = {
    completed: { label: "Completed", color: "#00e5a0", bg: "rgba(0,229,160,.12)" },
    in_progress: { label: "In Progress", color: "#f5c542", bg: "rgba(245,197,66,.12)" },
    queued: { label: "Queued", color: "#7eb5ff", bg: "rgba(126,181,255,.12)" },
    failed: { label: "Failed", color: "#ff5c5c", bg: "rgba(255,92,92,.12)" },
  }[status] || { label: status, color: "#aaa", bg: "rgba(170,170,170,.1)" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}33`,
      }}
    >
      {status === "in_progress" && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: cfg.color,
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        />
      )}
      {cfg.label}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color = "#00e5a0" }) {
  return (
    <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,.07)", overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99,
          transition: "width .4s ease",
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}

// ─── Log Terminal ─────────────────────────────────────────────────────────────
function Terminal({ logs }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);
  return (
    <div
      ref={ref}
      style={{
        background: "#0a0a0f",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 8,
        padding: "12px 16px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 11,
        lineHeight: 1.8,
        color: "#7cfc9b",
        maxHeight: 130,
        overflowY: "auto",
        textShadow: "0 0 6px #7cfc9b55",
      }}
    >
      {logs.map((l, i) => (
        <div key={i} style={{ color: l.type === "err" ? "#ff5c5c" : l.type === "sys" ? "#7eb5ff" : "#7cfc9b" }}>
          <span style={{ opacity: 0.4 }}>
            [{new Date(l.ts).toLocaleTimeString()}]
          </span>{" "}
          {l.msg}
        </div>
      ))}
      <span style={{ opacity: 0.6, animation: "blink 1s step-end infinite" }}>█</span>
    </div>
  );
}

// ─── Active Job Card ──────────────────────────────────────────────────────────
function ActiveJobCard({ job }) {
  const pctColor =
    job.status === "failed" ? "#ff5c5c" : job.status === "completed" ? "#00e5a0" : "#f5c542";
  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: `1px solid ${pctColor}33`,
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${pctColor}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#e8e8ff", wordBreak: "break-all" }}>
            {job.url}
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 3, fontFamily: "monospace" }}>
            Job ID: {job.job_id} · Started {elapsed(job.timestamp)}
          </div>
        </div>
        <StatusPill status={job.status} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <ProgressBar pct={job.progress} color={pctColor} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555" }}>
        <span>{job.step || "Initializing..."}</span>
        <span style={{ color: pctColor }}>{job.progress}%</span>
      </div>
      {job.logs && job.logs.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <Terminal logs={job.logs} />
        </div>
      )}
    </div>
  );
}

// ─── Archive Row ──────────────────────────────────────────────────────────────
function ArchiveRow({ item, onReArchive, onDelete, onDetail }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        gap: 16,
        alignItems: "center",
        padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,.05)",
        background: hover ? "rgba(255,255,255,.025)" : "transparent",
        transition: "background .15s",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#d8d8f0" }}>
            {item.url}
          </span>
          <StatusPill status={item.status} />
        </div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 4, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span>🕐 {fmtTime(item.timestamp)}</span>
          {item.size !== "—" && <span>💾 {item.size}</span>}
          {item.pages > 0 && <span>📄 {item.pages.toLocaleString()} pages</span>}
          {item.duration !== "—" && <span>⏱ {item.duration}</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionBtn onClick={() => onDetail(item)} label="Details" color="#7eb5ff" />
        <ActionBtn onClick={() => onReArchive(item.url)} label="Re-archive" color="#f5c542" />
        <ActionBtn onClick={() => onDelete(item.job_id)} label="Delete" color="#ff5c5c" />
      </div>
    </div>
  );
}

function ActionBtn({ onClick, label, color }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? `${color}22` : "transparent",
        border: `1px solid ${color}44`,
        borderRadius: 6,
        color: color,
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        cursor: "pointer",
        transition: "all .15s",
        fontFamily: "'Space Mono', monospace",
        letterSpacing: ".03em",
      }}
    >
      {label}
    </button>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.7)",
        backdropFilter: "blur(6px)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0e0e1a",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,.6)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", marginBottom: 4 }}>ARCHIVE DETAILS</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: "#e8e8ff", wordBreak: "break-all" }}>
              {item.url}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["Job ID", item.job_id],
            ["Status", <StatusPill status={item.status} />],
            ["Archived At", fmtTime(item.timestamp)],
            ["Backup Size", item.size],
            ["Duration", item.duration],
            ["Pages Crawled", item.pages?.toLocaleString() || "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{k}</div>
              <div style={{ fontSize: 13, color: "#d8d8f0", fontFamily: "'Space Mono', monospace" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(0,229,160,.06)", border: "1px solid rgba(0,229,160,.15)", borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: "#00e5a0", fontFamily: "monospace" }}>
            ✓ Archive verified · SHA-256 checksum matches · Stored in 3 redundant locations
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: "#111120",
            border: `1px solid ${t.color || "#00e5a0"}44`,
            borderRadius: 10,
            padding: "10px 16px",
            fontSize: 13,
            color: t.color || "#00e5a0",
            fontFamily: "'Space Mono', monospace",
            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
            animation: "slideIn .25s ease",
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function WebArchiver() {
  const [url, setUrl] = useState("");
  const [activeJobs, setActiveJobs] = useState({});
  const [archives, setArchives] = useState([]);
  const [loadingArchives, setLoadingArchives] = useState(true);
  const [detailItem, setDetailItem] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState("archive"); // "archive" | "history"
  const [submitting, setSubmitting] = useState(false);

  const toast = (msg, color) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, color }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  // Load initial archives
  useEffect(() => {
    api.getList().then((list) => {
      setArchives(list);
      setLoadingArchives(false);
    });
  }, []);

  // Simulate archival progression
  const simulateJob = (job_id) => {
    const steps = [
      { pct: 10, step: "Resolving DNS and establishing connection...", delay: 800 },
      { pct: 22, step: "Fetching robots.txt and sitemap...", delay: 1200 },
      { pct: 38, step: "Crawling pages and discovering links...", delay: 1600 },
      { pct: 55, step: "Downloading assets (images, CSS, JS)...", delay: 1800 },
      { pct: 70, step: "Archival in progress — packaging resources...", delay: 1400 },
      { pct: 84, step: "Compressing archive and computing checksum...", delay: 1200 },
      { pct: 95, step: "Uploading to cold storage...", delay: 1000 },
      { pct: 100, step: "Completed successfully ✓", delay: 600 },
    ];

    const logs = [];
    const pushLog = (msg, type = "ok") => {
      logs.push({ ts: Date.now(), msg, type });
      return [...logs];
    };

    pushLog("[sys] Job queued — worker assigned", "sys");

    const runStep = (idx) => {
      if (idx >= steps.length) return;
      const s = steps[idx];
      const isDone = s.pct === 100;
      const isFailed = false; // could randomize

      setTimeout(() => {
        setActiveJobs((prev) => {
          const job = prev[job_id];
          if (!job) return prev;
          const newLogs = pushLog(s.step, isDone ? "ok" : "ok");
          return {
            ...prev,
            [job_id]: {
              ...job,
              progress: s.pct,
              step: s.step,
              status: isDone ? "completed" : "in_progress",
              logs: newLogs,
            },
          };
        });

        if (isDone) {
          // Move to archive list
          setTimeout(() => {
            setActiveJobs((prev) => {
              const job = prev[job_id];
              if (!job) return prev;
              const completed = {
                ...job,
                status: "completed",
                size: `${randomBetween(80, 450)} MB`,
                duration: `${randomBetween(2, 12)} min ${randomBetween(5, 59)} sec`,
                pages: randomBetween(200, 5000),
              };
              mockDB.archives.unshift(completed);
              setArchives([...mockDB.archives]);
              const next = { ...prev };
              delete next[job_id];
              return next;
            });
            toast("✓ Archival complete!", "#00e5a0");
          }, 1200);
        } else {
          runStep(idx + 1);
        }
      }, s.delay);
    };

    setTimeout(() => {
      setActiveJobs((prev) => ({
        ...prev,
        [job_id]: { ...prev[job_id], status: "in_progress" },
      }));
      pushLog("[sys] Worker started — beginning crawl", "sys");
      runStep(0);
    }, 600);
  };

  const handleSubmit = async () => {
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) normalizedUrl = `https://${normalizedUrl}`;
    if (!isValidUrl(normalizedUrl)) {
      toast("⚠ Please enter a valid URL", "#ff5c5c");
      return;
    }
    setSubmitting(true);
    const { job_id } = await api.startArchival(normalizedUrl);
    const job = mockDB.jobs[job_id];
    setActiveJobs((prev) => ({
      ...prev,
      [job_id]: { ...job, progress: 0, step: "Initializing...", status: "queued", logs: [] },
    }));
    setUrl("");
    setSubmitting(false);
    setActiveTab("archive");
    toast(`⚡ Archival started — Job ${job_id}`, "#7eb5ff");
    simulateJob(job_id);
  };

  const handleDelete = (job_id) => {
    mockDB.archives = mockDB.archives.filter((a) => a.job_id !== job_id);
    setArchives([...mockDB.archives]);
    toast("Deleted from history", "#ff5c5c");
  };

  const activeJobList = Object.values(activeJobs);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070f",
        color: "#e8e8f0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 99px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes scan {
          0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)}
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50,
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,.03) 0px, rgba(0,0,0,.03) 1px, transparent 1px, transparent 2px)" }} />

      {/* Glow blobs */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,160,.04) 0%, transparent 70%)", top: -200, left: -200, pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(126,181,255,.04) 0%, transparent 70%)", bottom: -100, right: -100, pointerEvents: "none" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>
        
        {/* Header */}
        <div style={{ padding: "48px 0 40px", animation: "fadeUp .6s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00e5a0, #00b37d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              🗄
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5a0", letterSpacing: ".12em", textTransform: "uppercase" }}>
              WebVault · Archival System v1.0
            </span>
          </div>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, color: "#f0f0ff", lineHeight: 1.2, marginBottom: 8 }}>
            Preserve the Web,<br />
            <span style={{ color: "#00e5a0" }}>One Site at a Time.</span>
          </h1>
          <p style={{ color: "#555", fontSize: 14, maxWidth: 480 }}>
            Submit any URL to create a permanent archive snapshot. Track progress in real time and browse your archival history.
          </p>
        </div>

        {/* Input Box */}
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.09)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
            animation: "fadeUp .6s .1s ease both",
          }}
        >
          <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".08em" }}>
            ▸ Submit URL for Archival
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#444", fontFamily: "monospace", fontSize: 13 }}>https://</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="example.com"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,.4)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 10,
                  padding: "12px 14px 12px 74px",
                  color: "#e8e8ff",
                  fontSize: 14,
                  fontFamily: "'Space Mono', monospace",
                  outline: "none",
                  transition: "border-color .2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,160,.4)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.1)")}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                background: submitting ? "#1a1a2e" : "linear-gradient(135deg, #00e5a0, #00b37d)",
                border: "none",
                borderRadius: 10,
                padding: "12px 22px",
                color: submitting ? "#555" : "#07070f",
                fontWeight: 700,
                fontSize: 13,
                fontFamily: "'Space Mono', monospace",
                cursor: submitting ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                transition: "all .2s",
                boxShadow: submitting ? "none" : "0 0 20px rgba(0,229,160,.3)",
              }}
            >
              {submitting ? "Starting..." : "Archive Site →"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, animation: "fadeUp .6s .15s ease both" }}>
          {[
            { key: "archive", label: `Active Jobs${activeJobList.length ? ` (${activeJobList.length})` : ""}` },
            { key: "history", label: `History (${archives.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? "rgba(0,229,160,.12)" : "transparent",
                border: `1px solid ${activeTab === tab.key ? "rgba(0,229,160,.35)" : "rgba(255,255,255,.08)"}`,
                borderRadius: 8,
                padding: "8px 18px",
                color: activeTab === tab.key ? "#00e5a0" : "#555",
                fontSize: 12,
                fontFamily: "'Space Mono', monospace",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all .2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Jobs Panel */}
        {activeTab === "archive" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            {activeJobList.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "rgba(255,255,255,.02)",
                border: "1px dashed rgba(255,255,255,.08)",
                borderRadius: 16,
                color: "#3a3a5a",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13 }}>No active jobs</div>
                <div style={{ fontSize: 12, marginTop: 6, color: "#2a2a4a" }}>Submit a URL above to start archiving</div>
              </div>
            ) : (
              activeJobList.map((job) => <ActiveJobCard key={job.job_id} job={job} />)
            )}
          </div>
        )}

        {/* History Panel */}
        {activeTab === "history" && (
          <div
            style={{
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 16,
              overflow: "hidden",
              animation: "fadeUp .3s ease",
            }}
          >
            {/* Table Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 16,
              padding: "12px 20px",
              borderBottom: "1px solid rgba(255,255,255,.07)",
              background: "rgba(255,255,255,.03)",
            }}>
              <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: ".1em", textTransform: "uppercase" }}>URL / Details</span>
              <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: ".1em", textTransform: "uppercase" }}>Actions</span>
            </div>

            {loadingArchives ? (
              <div style={{ padding: 40, textAlign: "center", color: "#333", fontFamily: "monospace" }}>Loading archives...</div>
            ) : archives.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#333", fontFamily: "monospace", fontSize: 13 }}>
                No archives yet. Submit your first URL!
              </div>
            ) : (
              archives.map((item) => (
                <ArchiveRow
                  key={item.job_id}
                  item={item}
                  onReArchive={(url) => { setUrl(url); setActiveTab("archive"); }}
                  onDelete={handleDelete}
                  onDetail={setDetailItem}
                />
              ))
            )}

            {archives.length > 0 && (
              <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,.05)", fontSize: 11, color: "#333", fontFamily: "monospace", display: "flex", justifyContent: "space-between" }}>
                <span>{archives.length} total archives</span>
                <span>
                  {archives.filter((a) => a.status === "completed").length} completed ·{" "}
                  {archives.filter((a) => a.status === "failed").length} failed
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: "center", fontSize: 11, color: "#2a2a3a", fontFamily: "monospace" }}>
          WebVault · Dummy archival demo · All processes are simulated
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}

      {/* Toast Container */}
      <Toast toasts={toasts} />
    </div>
  );
}
