import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	const { data: room } = await supabase
		.from('rooms')
		.select(`id, solution, current, players, creator, created_at`)
		.eq('id', params.room)
		.single();

	return { session, room };
}) satisfies PageServerLoad;
