import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { session, supabase } = await parent();
	if (!session) redirect(303, '/');

	const { data: rooms, error } = await supabase
		.from('rooms')
		.select(`id, created_at, creator, solved`)
		.order('solved', { ascending: true })
		.order('created_at', { ascending: false });
	if (error) throw error;

	return { rooms };
}) satisfies PageLoad;
