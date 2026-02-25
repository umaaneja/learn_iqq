import React, { useState, useEffect, useRef, useCallback } from 'react';
import T from './tokens';
import mockApi, { _archives, _activeJobs } from './mockApi';
import { rand, simulateJob } from './utils';
import Sidebar from './components/Sidebar';
import NewArchiveModal from './components/NewArchiveModal';
import DetailDrawer from './components/DetailDrawer';
import ToastContainer from './components/Toast';
import { Icon } from './components/Icons';
import OverviewPage from './pages/OverviewPage';
import ArchivesPage from './pages/ArchivesPage';
import JobsPage from './pages/JobsPage';

export default function App() {
  const [view,       setView]       = useState("overview");
  const [archives,   setArchives]   = useState([]);
  const [activeJobs, setActiveJobs] = useState({});
  const [showModal,  setShowModal]  = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [toasts,     setToasts]     = useState([]);
  const toastId = useRef(0);

  // Load initial data
  useEffect(() => {
    mockApi.getList().then(({ data }) => setArchives(data));
  }, []);

  // Toast helper
  const addToast = useCallback((msg, icon = "✓") => {
    const id = toastId.current++;
    setToasts((p) => [...p, { id, msg, icon }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  // Start archival + simulate progression
  const handleSubmit = useCallback(async (url, tags, region) => {
    const { id } = await mockApi.startArchival(url, tags, region);
    const job = { ..._activeJobs[id], progress: 0, step: "Queued", status: "queued" };
    setActiveJobs((prev) => ({ ...prev, [id]: job }));
    addToast(`Archival job started — ${id}`, "⚡");
    setView("jobs");

    simulateJob(
      id,
      _activeJobs,
      (jid, pct, status, step) => {
        _activeJobs[jid] = { ..._activeJobs[jid], progress: pct, status, step };
        setActiveJobs((prev) => ({ ...prev, [jid]: { ...prev[jid], progress: pct, status, step } }));
      },
      (jid) => {
        const j = _activeJobs[jid];
        if (!j) return;
        const completed = {
          ...j,
          status: "completed",
          size: `${rand(60, 500)} MB`,
          duration: `${rand(1, 20)}m ${rand(5, 59)}s`,
          pages: rand(100, 12000),
        };
        _archives.unshift(completed);
        setArchives([..._archives]);
        setActiveJobs((prev) => { const n = { ...prev }; delete n[jid]; return n; });
        addToast(`Archive complete — ${jid}`, "✓");
      }
    );
  }, [addToast]);

  const handleDelete = useCallback(async (id) => {
    await mockApi.deleteArchive(id);
    setArchives([..._archives]);
    setDetailItem(null);
    addToast("Archive deleted", "🗑");
  }, [addToast]);

  const handleDeleteMany = useCallback(async (ids) => {
    await mockApi.deleteMany(ids);
    setArchives([..._archives]);
    addToast(`${ids.length} archives deleted`, "🗑");
  }, [addToast]);

  const handleReArchive = useCallback(() => {
    setDetailItem(null);
    setShowModal(true);
  }, []);

  const activeCount = Object.keys(activeJobs).length;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: T.bg, overflow: "hidden" }}>
      <Sidebar activeView={view} setActiveView={setView} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ height: 56, borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.textMuted }}>
            <span>WebVault</span>
            <Icon.ChevRight />
            <span style={{ color: T.text, fontWeight: 500, textTransform: "capitalize" }}>{view}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {activeCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: T.accentLight, border: `1px solid ${T.blueBorder}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 1.4s ease infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: T.accent }}>{activeCount} running</span>
              </div>
            )}
            <div style={{ width: 1, height: 20, background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 7, cursor: "pointer", color: T.textSub }}>
              <Icon.Bell />
            </div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #1C5BE6, #60A5FA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              A
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {view === "overview" && (
            <OverviewPage archives={archives} activeJobs={activeJobs} onNewArchive={() => setShowModal(true)} />
          )}
          {view === "archives" && (
            <ArchivesPage
              archives={archives}
              activeJobs={activeJobs}
              onDelete={handleDelete}
              onDeleteMany={handleDeleteMany}
              onDetail={setDetailItem}
              onReArchive={handleReArchive}
              onNewArchive={() => setShowModal(true)}
            />
          )}
          {view === "jobs" && <JobsPage activeJobs={activeJobs} />}
        </div>
      </div>

      {showModal   && <NewArchiveModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
      {detailItem  && <DetailDrawer item={detailItem} onClose={() => setDetailItem(null)} onReArchive={handleReArchive} />}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
