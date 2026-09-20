# Indian Rail Data API

An Express API that exposes Indian Railways train and station data through the `indian-rail-mcp` library.

## Requirements

- Node.js 20 or later
- npm

## Install and run

```bash
npm install
npm run dev
```

The local API listens on `http://localhost:3001`.

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Service health check |
| `GET` | `/train/:trainNumber` | Train details and live status |
| `GET` | `/track/:trainNumber?date=YYYY-MM-DD` | Live running status for a train |
| `GET` | `/trains-between?from=CODE&to=CODE` | Trains between two station codes |
| `GET` | `/station/:stationCode` | Live station board |

### Examples

```bash
curl http://localhost:3001/health
curl http://localhost:3001/train/12951
curl "http://localhost:3001/trains-between?from=NDLS&to=BCT"
curl http://localhost:3001/station/NDLS
```

## Scripts

```bash
npm run dev        # Start the local development server with file watching
npm run start      # Start the local server
npm run typecheck  # Check TypeScript types
```

## Deploy to Vercel

The API is configured for Vercel with a catch-all Node.js function at
`api/[...path].ts`. The `vercel.json` rewrite forwards every public request to
that function while preserving its path, so the routes below work at the root
of your Vercel domain.

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Deploy with the default settings.

After deployment, use the same endpoints from your Vercel URL, for example:

```text
https://your-project.vercel.app/health
```

## Notes

`node_modules` is intentionally excluded from Git. Run `npm install` after cloning the repository.
