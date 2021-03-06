## Environment Variables <!-- {docsify-ignore-all} -->

The environment variables will define on `process.env`.

For example, having an environment variable named `NODE_ENV` will be exposed in the JS as `process.env.NODE_ENV`.

### Define Variables

```env
# valid variable
DEV_SERVER_OPEN = false

# variable start with "#" will not defiend
# DEV_SERVER_PORT = 3000

# you could expand the variable by "${}"
HOST = localhost:${DEV_SERVER_PORT}
```

<br />

To define variables that depend on `NODE_ENV`. Create `.env.*` file, for examples

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except `test.**`.
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Rules:

- Files end with `.local` will not be committed
- The priority order will be follow `.env.${NODE_ENV}.local` > `.env.${NODE_ENV}` > `.env.local` > `.env`

### Usage

```ts
if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'debug'
) {
  window.game = game;
}
```
