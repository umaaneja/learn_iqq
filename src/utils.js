export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relTime(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function isUrl(s) {
  try {
    new URL(s.startsWith("http") ? s : `https://${s}`);
    return true;
  } catch {
    return false;
  }
}

export function simulateJob(id, activeJobsRef, onUpdate, onComplete) {
  const steps = [
    { pct: 8,   label: "DNS resolution & handshake",               ms: 700  },
    { pct: 18,  label: "Fetching robots.txt & sitemap",            ms: 900  },
    { pct: 32,  label: "Crawling page graph",                       ms: 1400 },
    { pct: 48,  label: "Downloading HTML resources",               ms: 1600 },
    { pct: 62,  label: "Downloading assets (CSS, JS, media)",      ms: 1500 },
    { pct: 74,  label: "Processing and deduplicating content",     ms: 1200 },
    { pct: 85,  label: "Compressing archive bundle",               ms: 1000 },
    { pct: 93,  label: "Computing checksums",                      ms: 700  },
    { pct: 100, label: "Upload to cold storage",                   ms: 800  },
  ];

  let idx = 0;
  const run = () => {
    if (idx >= steps.length) return;
    const s = steps[idx++];
    const isDone = s.pct === 100;
    setTimeout(() => {
      onUpdate(id, s.pct, isDone ? "completed" : "in_progress", s.label);
      if (isDone) {
        setTimeout(() => onComplete(id), 900);
      } else {
        run();
      }
    }, s.ms);
  };

  setTimeout(() => {
    onUpdate(id, 0, "in_progress", "Initializing worker...");
    run();
  }, 500);
}
