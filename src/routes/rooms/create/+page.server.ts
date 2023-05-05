import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session) throw redirect(303, '/');

		const data = await request.formData();
		const size = data.get('nonogram-size') as '5x5' | '10x10' | 'any';
		const width = size === '5x5' ? 5 : 10;

		// Grab a random row from the random figure table
		const figure =
			size === 'any'
				? await supabase.from('random_figure').select(`id, figure`).limit(1).single()
				: await supabase
						.from('random_figure')
						.select(`id, figure`)
						.eq('width', width)
						.limit(1)
						.single();
		if (figure.error) return fail(500, { error: figure.error });

		// Create a new room with the figure and redirect to game page
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
