import React, { useState } from 'react';
import T from '../tokens';
import { Btn, Input, Select } from './Primitives';
import { Icon } from './Icons';
import { isUrl } from '../utils';

const REGIONS = [
  { value: "us-east-1",      label: "US East (N. Virginia)"     },
  { value: "eu-west-1",      label: "EU West (Ireland)"          },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)"   },
  { value: "us-west-2",      label: "US West (Oregon)"           },
];

export default function NewArchiveModal({ onClose, onSubmit }) {
  const [url,        setUrl]        = useState("");
  const [tags,       setTags]       = useState("");
  const [region,     setRegion]     = useState("us-east-1");
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = async () => {
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    if (!isUrl(normalized)) { setError("Please enter a valid URL"); return; }
    setError("");
    setSubmitting(true);
    await onSubmit(normalized, tags.split(",").map((t) => t.trim()).filter(Boolean), region);
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,21,32,0.5)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 28, width: "100%", maxWidth: 500, boxShadow: T.shadowLg, animation: "fadeUp .2s ease" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>New Archival Job</h2>
            <p style={{ fontSize: 13, color: T.textSub, margin: "4px 0 0" }}>Submit a website URL to begin archival</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }}>
            <Icon.X />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>
              Website URL *
            </label>
            <Input
              value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === "Enter" && handle()}
              prefix={<span style={{ fontSize: 12, fontFamily: "monospace", color: T.textMuted }}>URL</span>}
              style={{ fontFamily: "'Geist Mono', monospace" }}
            />
            {error && <div style={{ fontSize: 12, color: T.red, marginTop: 5 }}>{error}</div>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>
              Tags <span style={{ color: T.textMuted }}>(comma-separated)</span>
            </label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="docs, internal, finance" />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>
              Storage Region
            </label>
            <Select value={region} onChange={setRegion} options={REGIONS} style={{ width: "100%" }} />
          </div>

          <div style={{ padding: "12px 14px", background: T.accentLight, borderRadius: T.radius, border: `1px solid ${T.blueBorder}` }}>
            <div style={{ fontSize: 12, color: T.blue, fontWeight: 500 }}>📋 Archival Information</div>
            <div style={{ fontSize: 12, color: T.textSub, marginTop: 4, lineHeight: 1.6 }}>
              Archival jobs typically complete within 2–30 minutes depending on site size. You'll be notified upon completion.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <Btn onClick={onClose} variant="secondary">Cancel</Btn>
          <Btn onClick={handle} variant="primary" disabled={submitting} icon={<Icon.Plus />}>
            {submitting ? "Starting..." : "Start Archival"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
