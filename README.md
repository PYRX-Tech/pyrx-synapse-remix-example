# Synapse Remix Example

All 16 SDK endpoints with [@pyrx/synapse](https://www.npmjs.com/package/@pyrx/synapse) + Remix.

## Setup

1. `npm install` → 2. `.env.example` to `.env` → 3. `npm run dev`

## Routes

**Core:** POST /api/track, /api/track/batch, /api/identify, /api/identify/batch, /api/send
**Contacts:** GET /api/contacts, GET/PUT/DELETE /api/contacts/$id
**Templates:** GET/POST /api/templates, GET/PUT/DELETE /api/templates/$slug, POST /api/templates/$slug/preview
Plus form action on homepage.

- [Synapse Docs](https://synapse.pyrx.tech/developers)
