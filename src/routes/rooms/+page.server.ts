import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) throw redirect(303, '/');

	const { data: rooms } = await supabase
		.from('rooms')
		.select(`id, created_at, creator, players, solved`);
	return { session, rooms };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session) throw redirect(303, '/');

		const { data, error } = await supabase
			.from('rooms')
			.insert({
				creator: session.user.id,
				current: Array(25).fill(0),
				solution: [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1]
			})
			.select()
			.single();
		if (error) return fail(500, { error });

		throw redirect(303, `/games/${data.id}`);
	}
} satisfies Actions;
