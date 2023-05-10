import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const session = (await supabase.auth.getSession()).data.session;
		if (!session) throw redirect(303, '/');

		const formData = await request.formData();
		const figure = formData.get('figure') as string;
		const drawing = JSON.parse(figure) as boolean[];

		if (drawing.length !== 25) return fail(400, { message: 'Invalid drawing' });

		const { error } = await supabase.from('figures').insert({
			creator: session.user.id,
			figure: drawing,
			width: 5
		});
		if (error) throw error;
	}
} satisfies Actions;
