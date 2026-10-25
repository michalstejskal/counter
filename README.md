# Counter

Minimal React counters. Tap a number to increment it. Use the reset or remove icon,
or the single **+** button to add a counter. Data saves automatically in local storage.
No accounts, notifications, or backend.

## Run

Requires Node.js 22.12+ (22.x), Node.js 24.x, or Node.js 26+.

```sh
npm ci
npm start
```

Open http://localhost:5173.

## Checks

```sh
npm run build
npm run lint
npm test
npm run e2e
```

Browser tests use an installed Google Chrome and cover desktop and mobile.
`npm run build` outputs `dist/`; `npm run preview` serves the production build.

## Storage

Counters use the `counter.workspace.v1` local-storage key. Existing React data and
legacy Angular `items` data remain readable. Changes sync between tabs, not devices.
Invalid data is reported without being overwritten. Clearing browser storage removes
saved counters.
