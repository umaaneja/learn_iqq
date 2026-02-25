import React from 'react';

const s = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" };

export const Icon = {
  Archive:   () => <svg width="16" height="16" viewBox="0 0 24 24" {...s} strokeWidth="1.75"><path d="M21 8v13H3V8M23 3H1v5h22V3zM10 12h4"/></svg>,
  History:   () => <svg width="16" height="16" viewBox="0 0 24 24" {...s} strokeWidth="1.75"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
  Dashboard: () => <svg width="16" height="16" viewBox="0 0 24 24" {...s} strokeWidth="1.75"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Settings:  () => <svg width="16" height="16" viewBox="0 0 24 24" {...s} strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Plus:      () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>,
  Search:    () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Filter:    () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Trash:     () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Download:  () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Eye:       () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Refresh:   () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
  X:         () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Globe:     () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ChevRight: () => <svg width="14" height="14" viewBox="0 0 24 24" {...s} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Bell:      () => <svg width="16" height="16" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Sort:      () => <svg width="12" height="12" viewBox="0 0 24 24" {...s} strokeWidth="2"><path d="M3 6h18M6 12h12M10 18h4"/></svg>,
};
