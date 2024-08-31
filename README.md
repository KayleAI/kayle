# Kayle

Open-source content moderation at scale.

## Development

[Biome](https://biomejs.dev/) is recommended for linting.

We use [Deepsource](https://deepsource.io/) for static analysis. Our link is [here](https://app.deepsource.com/gh/KayleAI/kayle).

### Database

To produce migrations for Supabase, run the following command:

```bash
supabase db diff --schema auth,public,extensions -f <name_of_migration>
```

To produce schema for Drizzle, run the following command:

```bash
bunx drizzle-kit introspect
```
