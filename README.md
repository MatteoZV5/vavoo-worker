# Vavoo Worker - Milano placement test

Repository pronto per Cloudflare Workers.

## File principale
`index.js`

## Placement
`wrangler.jsonc` usa:

`aws:eu-south-1`

## Test
Dopo il deploy:

- `/__test`
- `/__where`

Per controllare il colo:
`https://vavoo-worker.horubatounsus.workers.dev/__where`

Se compare `MXP`, il Worker sta girando sul colo di Milano.
