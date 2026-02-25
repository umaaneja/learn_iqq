import React, { useState } from 'react';
import T from '../tokens';
import { Btn, Badge, Checkbox, Tag, ProgressBar, Select } from '../components/Primitives';
import { Icon } from '../components/Icons';
import { fmtDate, relTime } from '../utils';

export default function ArchivesPage({ archives, activeJobs, onDelete, onDeleteMany, onDetail, onReArchive, onNewArchive }) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy,       setSortBy]       = useState("created");
  const [sortDir,      setSortDir]      = useState("desc");
  const [selected,     setSelected]     = useState(new Set());
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 8;

  const activeList = Object.values(activeJobs);
  const allItems   = [...activeList, ...archives];

  const filtered = allItems
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.url.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || (a.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "created") return (new Date(a.created) - new Date(b.created)) * dir;
      if (sortBy === "url")     return a.url.localeCompare(b.url) * dir;
      if (sortBy === "size")    return ((parseFloat(a.size) || 0) - (parseFloat(b.size) || 0)) * dir;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll    = () => { if (selected.size === paged.length) setSelected(new Set()); else setSelected(new Set(paged.map((a) => a.id))); };
  const sortToggle   = (col) => { if (sortBy === col) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortBy(col); setSortDir("desc"); } };

  const thStyle = (col) => ({
    padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600,
    letterSpacing: ".03em", textTransform: "uppercase", cursor: "pointer",
    userSelect: "none", whiteSpace: "nowrap",
    background: sortBy === col ? T.accentLight : "transparent",
    color:      sortBy === col ? T.accent      : T.textSub,
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-.02em" }}>Archives</h1>
          <p style={{ fontSize: 13, color: T.textSub, margin: "4px 0 0" }}>
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} {search || statusFilter !== "all" ? "(filtered)" : "total"}
          </p>
        </div>
        <Btn onClick={onNewArchive} variant="primary" icon={<Icon.Plus />}>New Archive</Btn>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.textMuted, display: "flex" }}><Icon.Search /></span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by URL, ID, or tag…"
            style={{ width: "100%", height: 36, padding: "0 12px 0 34px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, fontSize: 13, color: T.text, fontFamily: "inherit", outline: "none", boxShadow: T.shadow }}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={[
            { value: "all",         label: "All statuses" },
            { value: "completed",   label: "Completed"    },
            { value: "in_progress", label: "In Progress"  },
            { value: "queued",      label: "Queued"       },
            { value: "failed",      label: "Failed"       },
          ]}
        />
        {selected.size > 0 && (
          <Btn onClick={() => { onDeleteMany([...selected]); setSelected(new Set()); }} variant="danger" icon={<Icon.Trash />}>
            Delete ({selected.size})
          </Btn>
        )}
      </div>

      {/* Table */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, overflow: "hidden", boxShadow: T.shadow }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
              <th style={{ width: 40, padding: "10px 16px" }}>
                <Checkbox checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} />
              </th>
              <th style={thStyle("url")} onClick={() => sortToggle("url")}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>URL / Domain <Icon.Sort /></div>
              </th>
              <th style={{ ...thStyle(""), cursor: "default" }}>Status</th>
              <th style={thStyle("created")} onClick={() => sortToggle("created")}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>Created <Icon.Sort /></div>
              </th>
              <th style={thStyle("size")} onClick={() => sortToggle("size")}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>Size <Icon.Sort /></div>
              </th>
              <th style={{ ...thStyle(""), cursor: "default" }}>Region</th>
              <th style={{ ...thStyle(""), cursor: "default" }}>Tags</th>
              <th style={{ ...thStyle(""), cursor: "default", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "60px 20px", color: T.textMuted, fontSize: 14 }}>
                  <div style={{ marginBottom: 8, fontSize: 28 }}>📭</div>
                  No archives match your filters
                </td>
              </tr>
            ) : paged.map((a, i) => {
              const isActive = !!activeJobs[a.id];
              return (
                <tr
                  key={a.id}
                  style={{ borderTop: i > 0 ? `1px solid ${T.border}` : "none", background: selected.has(a.id) ? T.accentLight : "transparent", transition: "background .1s" }}
                  onMouseEnter={(e) => { if (!selected.has(a.id)) e.currentTarget.style.background = T.surfaceHover; }}
                  onMouseLeave={(e) => { if (!selected.has(a.id)) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <Checkbox checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} />
                  </td>
                  <td style={{ padding: "12px 16px", maxWidth: 260 }}>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }}>{a.url}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{a.id} · {a.user}</div>
                    {isActive && <div style={{ marginTop: 6 }}><ProgressBar pct={a.progress || 0} status={a.status} /></div>}
                  </td>
                  <td style={{ padding: "12px 16px" }}><Badge status={a.status} /></td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: T.textSub, whiteSpace: "nowrap" }}>
                    <div>{fmtDate(a.created)}</div>
                    <div style={{ color: T.textMuted }}>{relTime(a.created)}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: T.textSub, fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{a.size}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: T.textSub, whiteSpace: "nowrap" }}>{a.region}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(a.tags || []).map((t) => <Tag key={t} label={t} />)}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <Btn size="sm" variant="ghost" onClick={() => onDetail(a)} icon={<Icon.Eye />}>View</Btn>
                      {!isActive && <Btn size="sm" variant="ghost" onClick={() => onReArchive(a.url)} icon={<Icon.Refresh />} />}
                      {!isActive && <Btn size="sm" variant="ghost" onClick={() => onDelete(a.id)} icon={<Icon.Trash />} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bg }}>
            <span style={{ fontSize: 12, color: T.textSub }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn size="sm" variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Btn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", background: p === page ? T.accent : T.surface, color: p === page ? "#fff" : T.text, border: `1px solid ${p === page ? T.accent : T.border}` }}>
                  {p}
                </button>
              ))}
              <Btn size="sm" variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
