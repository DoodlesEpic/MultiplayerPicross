import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

const get_figure = (supabase: SupabaseClient, size: string, collection: string, width: number) => {
	const query = supabase.from('random_figure').select(`id, creator, figure`);

	if (size !== 'any') {
		switch (collection) {
			case 'official':
				return query.is('creator', null).eq('width', width);
			case 'community':
				return query.not('creator', 'is', null).eq('width', width);
			default:
				return query.eq('width', width);
		}
	}

	switch (collection) {
		case 'official':
			return query.is('creator', null);
		case 'community':
			return query.not('creator', 'is', null);
		default:
			return query;
	}
};

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const session = (await supabase.auth.getSession()).data.session;
		if (!session) redirect(303, '/');

		const data = await request.formData();
		const size = data.get('nonogram-size') as '5x5' | '10x10' | 'any';
		const collection = data.get('nonogram-collection') as 'any' | 'official' | 'community';
		const width = size === '5x5' ? 5 : 10;

		// Grab a random row from the random figure table
		const figure = await get_figure(supabase, size, collection, width).limit(1).single();
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

		redirect(303, `/games/${room.data.id}`);
	}
} satisfies Actions;
