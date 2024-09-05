alter table "public"."content" drop constraint "content_pkey";

drop index if exists "public"."content_pkey";

alter table "public"."content" alter column "id" drop default;

alter table "public"."content" alter column "id" drop not null;

CREATE UNIQUE INDEX content_id_key ON public.content USING btree (id);

alter table "public"."content" add constraint "content_id_key" UNIQUE using index "content_id_key";


