"use client";

import { createClient } from "@repo/db/client";
import { toast } from "sonner";

export async function signout() {
	const supabase = createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		toast.error(`An error occurred while signing out: ${error.message}`);
	}

	toast.success("You’ve been signed out; redirecting you to the login page.");
}
