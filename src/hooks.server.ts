import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/database.types';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	return resolve(event);
};
