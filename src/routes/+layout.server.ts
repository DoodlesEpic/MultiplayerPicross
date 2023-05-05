import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	return {
		session: (await event.locals.supabase.auth.getSession()).data.session
	};
};
