import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { session } = await parent();
	if (!session) redirect(303, '/');
}) satisfies PageLoad;
