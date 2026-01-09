import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const session = (await supabase.auth.getSession()).data.session;
		if (!session) redirect(303, '/');

		const formData = await request.formData();
		const figure = formData.get('figure') as string;
		const drawing = JSON.parse(figure) as boolean[];

		if (drawing.length !== 25) return fail(400, { message: 'Invalid drawing' });

		// Save the figure on the database
		const { data, error } = await supabase
			.from('figures')
			.insert({
				creator: session.user.id,
				figure: drawing,
				width: 5
			})
			.select()
			.single();
		if (error) throw error;

		// Create a new room with the figure and redirect to game page
		const room = await supabase
			.from('rooms')
			.insert({
				creator: session.user.id,
				current: Array(data.figure.length).fill(0),
				figure: data.id
			})
			.select()
			.single();
		if (room.error) return fail(500, { error: room.error });

		redirect(303, `/games/${room.data.id}`);
	}
} satisfies Actions;
