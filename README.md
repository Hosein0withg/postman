# Postman

A lightweight, browser-based API client built with **React** and **TypeScript**. Test HTTP requests, organize them into collections, and view detailed responses — all without leaving your browser.

---

## Features

- **Request Builder** — GET/POST/PUT/PATCH/DELETE, query params, headers, and body editor with live URL preview
- **Response Viewer** — status, timing, size, pretty JSON, headers, and error handling
- **Tabs** — multiple requests with per-tab state and response caching
- **Collections** — create, rename, delete, save, and reload requests
- **History** — auto-tracked and deduplicated, click to restore
- **Import / Export** — JSON collections with validation and smart merge
- **Theming** — dark/light mode, collapsible sidebar, auto-save to `localStorage`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios |
| State | React hooks + Context API |
| Persistence | localStorage |
| Linting | ESLint + typescript-eslint |

---

## How It Works

1. **State lives in `App.tsx`** — `appData` holds collections, history, tabs, and the active tab. It's debounced-saved to `localStorage` via `createAutoSave`.

2. **Each tab owns a request** — the active tab's `request` is passed down to `RequestDiv`, which uses a `useReducer` to keep local editing fast while syncing changes back up.

3. **URL composition** — enabled params are appended to the URL using the `URL` API inside `RequestDiv`, so the URL bar always reflects the final request.

4. **Requests go through `sendApiRequest`** — a thin Axios wrapper that measures duration, computes payload size, and normalizes both successful and error responses into a single `ResponseData` shape.

5. **Responses are per-tab** — `tabResponses` maps `tabId → ResponseData`, so switching tabs restores the previous response instantly.

6. **Persistence** — collections, history, and tabs are all serialized to `localStorage` and rehydrated on load with schema validation.

---

## Getting Started

### Prerequisites
- **Node.js** `^20.19.0 || >=22.12.0`
- **npm** (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hosein0withg/postman.git
cd postman

# Install dependencies
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.



---
