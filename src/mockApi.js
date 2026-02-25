// ─── Mock Data ────────────────────────────────────────────────────────────────
export let _archives = [
  {
    id: "arc-2847",
    url: "https://docs.stripe.com",
    domain: "docs.stripe.com",
    status: "completed",
    created: "2026-02-25T09:14:00Z",
    size: "342 MB",
    duration: "6m 18s",
    pages: 4821,
    tags: ["docs", "finance"],
    user: "alice@corp.com",
    region: "us-east-1",
  },
  {
    id: "arc-2846",
    url: "https://engineering.atspotify.com",
    domain: "engineering.atspotify.com",
    status: "completed",
    created: "2026-02-24T17:33:00Z",
    size: "89 MB",
    duration: "2m 07s",
    pages: 312,
    tags: ["blog", "tech"],
    user: "bob@corp.com",
    region: "eu-west-1",
  },
  {
    id: "arc-2845",
    url: "https://research.google",
    domain: "research.google",
    status: "failed",
    created: "2026-02-24T12:10:00Z",
    size: "—",
    duration: "—",
    pages: 0,
    tags: ["research"],
    user: "alice@corp.com",
    region: "us-east-1",
    error: "Rate limit exceeded by origin server",
  },
  {
    id: "arc-2844",
    url: "https://vercel.com/blog",
    domain: "vercel.com",
    status: "completed",
    created: "2026-02-23T08:45:00Z",
    size: "56 MB",
    duration: "1m 34s",
    pages: 198,
    tags: ["blog"],
    user: "carol@corp.com",
    region: "ap-southeast-1",
  },
  {
    id: "arc-2843",
    url: "https://handbook.gitlab.com",
    domain: "handbook.gitlab.com",
    status: "completed",
    created: "2026-02-22T14:20:00Z",
    size: "1.2 GB",
    duration: "22m 41s",
    pages: 15420,
    tags: ["docs", "internal"],
    user: "bob@corp.com",
    region: "us-east-1",
  },
  {
    id: "arc-2842",
    url: "https://www.economist.com",
    domain: "economist.com",
    status: "completed",
    created: "2026-02-21T11:05:00Z",
    size: "220 MB",
    duration: "4m 52s",
    pages: 2870,
    tags: ["news"],
    user: "carol@corp.com",
    region: "eu-west-1",
  },
  {
    id: "arc-2841",
    url: "https://aws.amazon.com/documentation",
    domain: "aws.amazon.com",
    status: "failed",
    created: "2026-02-20T16:30:00Z",
    size: "—",
    duration: "—",
    pages: 0,
    tags: ["docs", "cloud"],
    user: "alice@corp.com",
    region: "us-east-1",
    error: "Connection timeout after 30s",
  },
  {
    id: "arc-2840",
    url: "https://developer.mozilla.org",
    domain: "developer.mozilla.org",
    status: "completed",
    created: "2026-02-19T09:00:00Z",
    size: "890 MB",
    duration: "16m 12s",
    pages: 11200,
    tags: ["docs", "web"],
    user: "bob@corp.com",
    region: "us-east-1",
  },
];

export let _activeJobs = {};
let _jobCounter = 2848;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Mock API ─────────────────────────────────────────────────────────────────
const mockApi = {
  getList: async () => {
    await sleep(200);
    return { data: [..._archives], total: _archives.length };
  },

  startArchival: async (url, tags = [], region = "us-east-1") => {
    await sleep(300);
    const id = `arc-${_jobCounter++}`;
    const domain = url.replace(/https?:\/\//, "").split("/")[0];
    const job = {
      id,
      url,
      domain,
      status: "queued",
      created: new Date().toISOString(),
      size: "—",
      duration: "—",
      pages: 0,
      tags,
      user: "alice@corp.com",
      region,
      progress: 0,
      step: "Queued",
      logs: [],
    };
    _activeJobs[id] = job;
    return { id, status: "started" };
  },

  deleteArchive: async (id) => {
    await sleep(200);
    _archives = _archives.filter((a) => a.id !== id);
  },

  deleteMany: async (ids) => {
    await sleep(300);
    _archives = _archives.filter((a) => !ids.includes(a.id));
  },
};

export default mockApi;
