create type "public"."Account Status" as enum ('Active', 'Inactive', 'Suspended', 'Terminated');

create type "public"."Organisation Role" as enum ('Owner', 'Admin', 'Moderator', 'Developer', 'Guest');

create type "public"."User Role" as enum ('User', 'Administrator', 'Owner');

create table "public"."org_details" (
    "id" uuid not null,
    "name" text not null,
    "slug" text not null,
    "avatar" text,
    "type" text
);


alter table "public"."org_details" enable row level security;

create table "public"."org_members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "org_id" uuid not null,
    "role" "Organisation Role" not null default 'Guest'::"Organisation Role"
);


alter table "public"."org_members" enable row level security;

create table "public"."organisations" (
    "created_at" timestamp with time zone not null default now(),
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."organisations" enable row level security;

create table "public"."user_details" (
    "id" uuid not null,
    "name" text,
    "email" text,
    "avatar" text
);


alter table "public"."user_details" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "joined_at" timestamp with time zone not null default now(),
    "role" "User Role" not null default 'User'::"User Role",
    "status" "Account Status" not null default 'Active'::"Account Status"
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX org_details_pkey ON public.org_details USING btree (id);

CREATE UNIQUE INDEX org_details_slug_key ON public.org_details USING btree (slug);

CREATE UNIQUE INDEX org_members_pkey ON public.org_members USING btree (id);

CREATE UNIQUE INDEX organisations_pkey ON public.organisations USING btree (id);

CREATE UNIQUE INDEX user_details_id_key ON public.user_details USING btree (id);

CREATE UNIQUE INDEX user_details_pkey ON public.user_details USING btree (id);

CREATE UNIQUE INDEX users_id_key ON public.users USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."org_details" add constraint "org_details_pkey" PRIMARY KEY using index "org_details_pkey";

alter table "public"."org_members" add constraint "org_members_pkey" PRIMARY KEY using index "org_members_pkey";

alter table "public"."organisations" add constraint "organisations_pkey" PRIMARY KEY using index "organisations_pkey";

alter table "public"."user_details" add constraint "user_details_pkey" PRIMARY KEY using index "user_details_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."org_details" add constraint "org_details_id_fkey" FOREIGN KEY (id) REFERENCES organisations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."org_details" validate constraint "org_details_id_fkey";

alter table "public"."org_details" add constraint "org_details_slug_key" UNIQUE using index "org_details_slug_key";

alter table "public"."org_members" add constraint "org_members_org_id_fkey" FOREIGN KEY (org_id) REFERENCES organisations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."org_members" validate constraint "org_members_org_id_fkey";

alter table "public"."org_members" add constraint "org_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."org_members" validate constraint "org_members_user_id_fkey";

alter table "public"."user_details" add constraint "public_user_details_id_fkey" FOREIGN KEY (id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_details" validate constraint "public_user_details_id_fkey";

alter table "public"."user_details" add constraint "user_details_id_key" UNIQUE using index "user_details_id_key";

alter table "public"."users" add constraint "public_users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "public_users_id_fkey";

alter table "public"."users" add constraint "users_id_key" UNIQUE using index "users_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_organisation(org_name text, org_slug text, org_avatar text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  org_id UUID;
  user_id UUID;
BEGIN
  -- Get the current user's ID
  SELECT auth.uid() INTO user_id;

  -- Create the organisation and get its ID
  INSERT INTO public.organisations (id)
  VALUES (DEFAULT)
  RETURNING id INTO org_id;

  -- Insert organisation details
  INSERT INTO public.org_details (id, name, slug, avatar)
  VALUES (org_id, org_name, org_slug, org_avatar);

  -- Insert the user as the owner of the organisation
  INSERT INTO public.org_members (user_id, org_id, role)
  VALUES (user_id, org_id, 'Owner'::public."Organisation Role");

  -- Return the newly created organisation ID
  RETURN org_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_organisation(org_name text, org_slug text, org_avatar text DEFAULT NULL::text, org_type text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  org_id UUID;
  user_id UUID;
BEGIN
  -- Get the current user's ID
  SELECT auth.uid() INTO user_id;

  -- Create the organisation and get its ID
  INSERT INTO public.organisations (id)
  VALUES (DEFAULT)
  RETURNING id INTO org_id;

  -- Insert organisation details
  INSERT INTO public.org_details (id, name, slug, avatar, type)
  VALUES (org_id, org_name, org_slug, org_avatar, org_type);

  -- Insert the user as the owner of the organisation
  INSERT INTO public.org_members (user_id, org_id, role)
  VALUES (user_id, org_id, 'Owner'::public."Organisation Role");

  -- Return the newly created organisation ID
  RETURN org_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.users (id)
    VALUES (
      NEW.id
    );

    INSERT INTO public.user_details (id, email, avatar)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data ->> 'avatar_url'
    );

    RETURN NEW;
END;
$function$
;

grant delete on table "public"."org_details" to "anon";

grant insert on table "public"."org_details" to "anon";

grant references on table "public"."org_details" to "anon";

grant select on table "public"."org_details" to "anon";

grant trigger on table "public"."org_details" to "anon";

grant truncate on table "public"."org_details" to "anon";

grant update on table "public"."org_details" to "anon";

grant delete on table "public"."org_details" to "authenticated";

grant insert on table "public"."org_details" to "authenticated";

grant references on table "public"."org_details" to "authenticated";

grant select on table "public"."org_details" to "authenticated";

grant trigger on table "public"."org_details" to "authenticated";

grant truncate on table "public"."org_details" to "authenticated";

grant update on table "public"."org_details" to "authenticated";

grant delete on table "public"."org_details" to "service_role";

grant insert on table "public"."org_details" to "service_role";

grant references on table "public"."org_details" to "service_role";

grant select on table "public"."org_details" to "service_role";

grant trigger on table "public"."org_details" to "service_role";

grant truncate on table "public"."org_details" to "service_role";

grant update on table "public"."org_details" to "service_role";

grant delete on table "public"."org_members" to "anon";

grant insert on table "public"."org_members" to "anon";

grant references on table "public"."org_members" to "anon";

grant select on table "public"."org_members" to "anon";

grant trigger on table "public"."org_members" to "anon";

grant truncate on table "public"."org_members" to "anon";

grant update on table "public"."org_members" to "anon";

grant delete on table "public"."org_members" to "authenticated";

grant insert on table "public"."org_members" to "authenticated";

grant references on table "public"."org_members" to "authenticated";

grant select on table "public"."org_members" to "authenticated";

grant trigger on table "public"."org_members" to "authenticated";

grant truncate on table "public"."org_members" to "authenticated";

grant update on table "public"."org_members" to "authenticated";

grant delete on table "public"."org_members" to "service_role";

grant insert on table "public"."org_members" to "service_role";

grant references on table "public"."org_members" to "service_role";

grant select on table "public"."org_members" to "service_role";

grant trigger on table "public"."org_members" to "service_role";

grant truncate on table "public"."org_members" to "service_role";

grant update on table "public"."org_members" to "service_role";

grant delete on table "public"."organisations" to "anon";

grant insert on table "public"."organisations" to "anon";

grant references on table "public"."organisations" to "anon";

grant select on table "public"."organisations" to "anon";

grant trigger on table "public"."organisations" to "anon";

grant truncate on table "public"."organisations" to "anon";

grant update on table "public"."organisations" to "anon";

grant delete on table "public"."organisations" to "authenticated";

grant insert on table "public"."organisations" to "authenticated";

grant references on table "public"."organisations" to "authenticated";

grant select on table "public"."organisations" to "authenticated";

grant trigger on table "public"."organisations" to "authenticated";

grant truncate on table "public"."organisations" to "authenticated";

grant update on table "public"."organisations" to "authenticated";

grant delete on table "public"."organisations" to "service_role";

grant insert on table "public"."organisations" to "service_role";

grant references on table "public"."organisations" to "service_role";

grant select on table "public"."organisations" to "service_role";

grant trigger on table "public"."organisations" to "service_role";

grant truncate on table "public"."organisations" to "service_role";

grant update on table "public"."organisations" to "service_role";

grant delete on table "public"."user_details" to "anon";

grant insert on table "public"."user_details" to "anon";

grant references on table "public"."user_details" to "anon";

grant select on table "public"."user_details" to "anon";

grant trigger on table "public"."user_details" to "anon";

grant truncate on table "public"."user_details" to "anon";

grant update on table "public"."user_details" to "anon";

grant delete on table "public"."user_details" to "authenticated";

grant insert on table "public"."user_details" to "authenticated";

grant references on table "public"."user_details" to "authenticated";

grant select on table "public"."user_details" to "authenticated";

grant trigger on table "public"."user_details" to "authenticated";

grant truncate on table "public"."user_details" to "authenticated";

grant update on table "public"."user_details" to "authenticated";

grant delete on table "public"."user_details" to "service_role";

grant insert on table "public"."user_details" to "service_role";

grant references on table "public"."user_details" to "service_role";

grant select on table "public"."user_details" to "service_role";

grant trigger on table "public"."user_details" to "service_role";

grant truncate on table "public"."user_details" to "service_role";

grant update on table "public"."user_details" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable read access for org members"
on "public"."org_details"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM org_members
  WHERE ((org_members.org_id = org_details.id) AND (org_members.user_id = auth.uid())))));


create policy "Enable read access for all users"
on "public"."org_members"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for org members"
on "public"."organisations"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM org_members
  WHERE ((org_members.org_id = organisations.id) AND (org_members.user_id = auth.uid())))));


create policy "Enable read access for all users"
on "public"."user_details"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Enable update for users based on email"
on "public"."user_details"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


create policy "Enable update for users based on role"
on "public"."users"
as permissive
for update
to authenticated
using (((role = 'Administrator'::"User Role") OR (role = 'Owner'::"User Role")))
with check (((role = 'Administrator'::"User Role") OR (role = 'Owner'::"User Role")));



