# Kayle

Open-source content moderation at scale.





### Database

To produce migrations for Supabase, run the following command:

```bash
supabase db diff --schema auth,public,extensions --f <name_of_migration>
```

To produce schema for Drizzle, run the following command:

```bash
bunx drizzle-kit introspect
```
