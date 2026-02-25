# WebVault Enterprise — Web Archival System

A production-grade enterprise web archival dashboard built with React.

## ✨ Features

- **Overview Dashboard** — KPI stats, active job monitor, recent archives
- **Archives Table** — Sortable, filterable, paginated data table with bulk actions
- **Active Jobs Monitor** — Real-time progress bars with step-by-step status
- **Detail Drawer** — Slide-in panel with full metadata, verification, and error info
- **New Archive Modal** — URL input with tag support and region selection
- **Toast Notifications** — Non-blocking feedback for all user actions
- **Dummy API Layer** — Fully simulated backend with realistic archival flow

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── index.js              # React entry point
├── index.css             # Global styles & keyframe animations
├── App.js                # Root component, state & routing
├── tokens.js             # Design tokens (colors, shadows, radii)
├── utils.js              # Helpers: date formatting, URL validation, job simulator
├── mockApi.js            # Dummy API layer with seed data
├── components/
│   ├── Icons.js          # SVG icon set
│   ├── Primitives.js     # Badge, Btn, Input, Select, Checkbox, ProgressBar, Tag
│   ├── Sidebar.js        # Left nav with org switcher & user profile
│   ├── ActiveJobPanel.js # Real-time progress card for running jobs
│   ├── NewArchiveModal.js # Modal form to submit new URL
│   ├── DetailDrawer.js   # Slide-in metadata drawer
│   └── Toast.js          # Toast notification container
└── pages/
    ├── OverviewPage.js   # Dashboard with stats & recent archives
    ├── ArchivesPage.js   # Full archives data table
    └── JobsPage.js       # Active jobs monitor
```

## 🎨 Design System

- **Font**: Plus Jakarta Sans (UI) + Geist Mono (code/URLs)
- **Accent**: #1C5BE6 (enterprise blue)
- **Theme**: Clean light background (#F8F9FB) with white surfaces
- **Tokens**: All values centralized in `src/tokens.js`

## 🔌 Replacing the Dummy API

All API calls are in `src/mockApi.js`. Replace `mockApi` methods with real `fetch()` or `axios` calls to connect to your backend:

```js
// Example: replace mockApi.getList
getList: async () => {
  const res  = await fetch('/api/archive/list', { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  return { data, total: data.length };
},
```

## 📡 Expected API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/archive/list` | Fetch all archives |
| `POST` | `/api/archive/start` | Start new archival job |
| `GET`  | `/api/archive/status/:id` | Poll job status |
| `DELETE` | `/api/archive/:id` | Delete an archive |

## 📄 License

MIT — free to use and modify.
