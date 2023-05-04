import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) throw redirect(303, '/');

	const { data: rooms } = await supabase.from('rooms').select(`id, created_at, creator, solved`);
	return { session, rooms };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session) throw redirect(303, '/');

		// Grab a random row from the random figure table
		const figure = await supabase.from('random_figure').select(`id, figure`).limit(1).single();
		if (figure.error) return fail(500, { error: figure.error });

		const room = await supabase
			.from('rooms')
			.insert({
				creator: session.user.id,
				current: Array(figure.data.figure.length).fill(0),
				figure: figure.data.id
			})
			.select()
			.single();
		if (room.error) return fail(500, { error: room.error });

		throw redirect(303, `/games/${room.data.id}`);
	}
} satisfies Actions;
