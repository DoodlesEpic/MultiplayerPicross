<script lang="ts">
	import '../app.scss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<nav class="navbar sticky-top shadow-sm">
	<div class="container-fluid">
		<a class="navbar-brand" href="/rooms">Multiplayer Picross</a>
		{#if session}
			<a class="navbar-brand" href="/account">{session?.user?.email}</a>
		{/if}
	</div>
</nav>
<div class="container mt-5">
	<slot />
</div>
