import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const session = (await supabase.auth.getSession()).data.session;
	if (session) throw redirect(303, '/rooms');

	return { url: url.origin };
};
