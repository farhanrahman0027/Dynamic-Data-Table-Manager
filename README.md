# Dynamic Data Table Manager

**Next.js + Redux Toolkit + Material UI (MUI) + TypeScript**

A fully-featured, dynamic data table manager showcasing client-side table operations, dynamic columns, CSV import/export, and state persistence. Designed as a frontend interview task to demonstrate proficiency in building complex UIs, state management with Redux Toolkit, and modern React/Next.js patterns.

---

## Table of Contents
- [Live demo](#live-demo)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [How it works (high level)](#how-it-works-high-level)
  - [Table view](#table-view)
  - [Dynamic columns](#dynamic-columns)
  - [Import & export CSV](#import--export-csv)
  - [State persistence](#state-persistence)
- [Design & UX notes](#design--ux-notes)
- [Testing & Accessibility](#testing--accessibility)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Extending the project / Ideas](#extending-the-project--ideas)
- [Contributing](#contributing)
- [License](#license)
- [Author / Contact](#author--contact)

---

## Live demo
_Place a demo link or Vercel/Netlify link here if available._

---

## Features
**Core:**
- Display tabular data with default columns: `Name`, `Email`, `Age`, `Role`.
- Sorting by clicking column headers (ASC / DESC toggle).
- Global search that queries all visible fields.
- Client-side pagination (10 rows per page by default).

**Dynamic Columns:**
- "Manage Columns" modal to add custom fields (e.g. `Department`, `Location`).
- Toggle column visibility with checkboxes.
- Changes immediately reflected in the table UI.
- Column visibility persisted (via `localStorage` or `redux-persist`).

**Import & Export:**
- Import CSV using PapaParse.
  - Validates headers and row formats.
  - Shows errors for malformed CSV files.
- Export current table view to `.csv` using the `Blob` or `FileSaver.js`.
  - Exports only visible columns and current filters/sort order.

**Bonus (implemented / optional):**
- Inline row editing (double-click to edit, validate fields like Age).
- Row actions: Edit and Delete with confirmation dialogs.
- Light / Dark theme toggle using MUI theming.
- Column reordering with drag-and-drop.
- Responsive design for mobile and tablet.

---

## Tech stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Redux Toolkit (+ optional `redux-persist`)
- Material UI (v5+)
- React Hook Form (forms & validation)
- PapaParse (CSV parsing)
- FileSaver.js / `Blob` for CSV export
- Jest / React Testing Library (recommended for testing)

---

## Getting started

### Prerequisites
- Node.js v18+ (or LTS)
- npm or yarn

### Install
Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd dynamic-data-table-manager
npm install
# or
# yarn

