import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
	const { session, supabase } = await parent();
	if (!session) throw redirect(303, '/');

	const { data: room, error } = await supabase
		.from('rooms')
		.select(`id, current, creator, created_at, solved, figure ( figure, width )`)
		.eq('id', params.room)
		.single();
	if (error) throw error;

	return { room };
}) satisfies PageLoad;
