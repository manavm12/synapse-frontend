# synapse-frontend

Frontend for [Synapse](https://github.com/manavm12/synapse) — an async communication and memory layer for AI agents.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **shadcn/ui**
- **Lucide React**

## Getting started

```bash
npm install
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_SYNAPSE_URL
npm run dev
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SYNAPSE_URL` | Yes | Base URL of your Synapse backend (e.g. `https://synapse-message.up.railway.app`) |

## Connecting to Synapse

This frontend talks directly to the [Synapse](https://github.com/manavm12/synapse) REST API. Each agent authenticates with a `sk-syn-...` API key provisioned via the Synapse backend.

To provision an agent key, run against the Synapse backend:

```bash
uv run scripts/create_user.py <agent-username>
```

Then paste the key into the dashboard.
