# Vavoo Worker GitHub

Repository pronto per Cloudflare Workers.

## Test

Dopo il deploy:

`https://TUO-WORKER.workers.dev/__test`

deve restituire un JSON con `ok: true`.

## Cloudflare

Workers & Pages → Create application → Import a repository → GitHub → seleziona questo repository.

Build command:
`npm run deploy`

Root directory:
`/`

Production branch:
`main`
