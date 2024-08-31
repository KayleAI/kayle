create extension if not exists "vector" with schema "extensions";

create type "public"."Content Type" as enum ('text', 'audio', 'image', 'video', 'document');

create table "public"."content" (
    "id" uuid not null default gen_random_uuid(),
    "object_id" uuid,
    "encrypted_text" text,
    "type" "Content Type" not null default 'text'::"Content Type"
);


alter table "public"."content" enable row level security;

create table "public"."moderations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "content_id" uuid not null default gen_random_uuid(),
    "hash" text not null,
    "vector" vector(1536),
    "result" jsonb not null default '{}'::jsonb
);


alter table "public"."moderations" enable row level security;

CREATE UNIQUE INDEX content_object_id_key ON public.content USING btree (object_id);

CREATE UNIQUE INDEX content_pkey ON public.content USING btree (id);

CREATE INDEX idx_moderations_vector ON public.moderations USING ivfflat (vector);

CREATE UNIQUE INDEX moderations_content_id_key ON public.moderations USING btree (content_id);

CREATE UNIQUE INDEX moderations_hash_key ON public.moderations USING btree (hash);

CREATE UNIQUE INDEX moderations_pkey ON public.moderations USING btree (id);

alter table "public"."content" add constraint "content_pkey" PRIMARY KEY using index "content_pkey";

alter table "public"."moderations" add constraint "moderations_pkey" PRIMARY KEY using index "moderations_pkey";

alter table "public"."content" add constraint "check_non_text_requires_object_id" CHECK ((((type = 'text'::"Content Type") AND (encrypted_text IS NOT NULL) AND (object_id IS NULL)) OR ((type <> 'text'::"Content Type") AND (object_id IS NOT NULL) AND (encrypted_text IS NULL)))) not valid;

alter table "public"."content" validate constraint "check_non_text_requires_object_id";

alter table "public"."content" add constraint "content_id_fkey" FOREIGN KEY (id) REFERENCES moderations(content_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."content" validate constraint "content_id_fkey";

alter table "public"."content" add constraint "content_object_id_fkey" FOREIGN KEY (object_id) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."content" validate constraint "content_object_id_fkey";

alter table "public"."content" add constraint "content_object_id_key" UNIQUE using index "content_object_id_key";

alter table "public"."moderations" add constraint "moderations_content_id_key" UNIQUE using index "moderations_content_id_key";

alter table "public"."moderations" add constraint "moderations_hash_key" UNIQUE using index "moderations_hash_key";

grant delete on table "public"."content" to "anon";

grant insert on table "public"."content" to "anon";

grant references on table "public"."content" to "anon";

grant select on table "public"."content" to "anon";

grant trigger on table "public"."content" to "anon";

grant truncate on table "public"."content" to "anon";

grant update on table "public"."content" to "anon";

grant delete on table "public"."content" to "authenticated";

grant insert on table "public"."content" to "authenticated";

grant references on table "public"."content" to "authenticated";

grant select on table "public"."content" to "authenticated";

grant trigger on table "public"."content" to "authenticated";

grant truncate on table "public"."content" to "authenticated";

grant update on table "public"."content" to "authenticated";

grant delete on table "public"."content" to "service_role";

grant insert on table "public"."content" to "service_role";

grant references on table "public"."content" to "service_role";

grant select on table "public"."content" to "service_role";

grant trigger on table "public"."content" to "service_role";

grant truncate on table "public"."content" to "service_role";

grant update on table "public"."content" to "service_role";

grant delete on table "public"."moderations" to "anon";

grant insert on table "public"."moderations" to "anon";

grant references on table "public"."moderations" to "anon";

grant select on table "public"."moderations" to "anon";

grant trigger on table "public"."moderations" to "anon";

grant truncate on table "public"."moderations" to "anon";

grant update on table "public"."moderations" to "anon";

grant delete on table "public"."moderations" to "authenticated";

grant insert on table "public"."moderations" to "authenticated";

grant references on table "public"."moderations" to "authenticated";

grant select on table "public"."moderations" to "authenticated";

grant trigger on table "public"."moderations" to "authenticated";

grant truncate on table "public"."moderations" to "authenticated";

grant update on table "public"."moderations" to "authenticated";

grant delete on table "public"."moderations" to "service_role";

grant insert on table "public"."moderations" to "service_role";

grant references on table "public"."moderations" to "service_role";

grant select on table "public"."moderations" to "service_role";

grant trigger on table "public"."moderations" to "service_role";

grant truncate on table "public"."moderations" to "service_role";

grant update on table "public"."moderations" to "service_role";




