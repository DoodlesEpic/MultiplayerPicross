import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	update: async ({ request, locals: { supabase } }) => {
		const session = (await supabase.auth.getSession()).data.session;
		if (!session) redirect(303, '/');

		const formData = await request.formData();
		const fullName = formData.get('fullName') as string;
		const username = formData.get('username') as string;
		const avatarUrl = formData.get('avatarUrl') as string;

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			full_name: fullName,
			username,
			avatar_url: avatarUrl,
			updated_at: new Date()
		});

		if (error) {
			return fail(500, {
				fullName,
				username,
				avatarUrl
			});
		}

		return {
			fullName,
			username,
			avatarUrl
		};
	},
	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, '/');
	}
} satisfies Actions;
