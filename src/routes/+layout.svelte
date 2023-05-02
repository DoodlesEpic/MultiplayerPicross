<script lang="ts">
	import '../app.scss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: ({ supabase, session, url } = data);

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
	<title>Multiplayer Picross</title>
</svelte:head>

<nav class="navbar sticky-top shadow-sm bg-white">
	<div class="container-fluid">
		<a class="navbar-brand" href="/rooms">Multiplayer Picross</a>
		{#if session}
			{#await supabase.from('profiles').select().eq('id', session.user.id).single()}
				<a class="navbar-brand" href="/account">{session?.user?.email?.split('@')[0]}</a>
			{:then result}
				<a class="navbar-brand" href="/account">{result.data?.username}</a>
			{/await}
		{/if}
	</div>
</nav>

{#key url.pathname}
	<div
		class="container mt-5"
		in:fade={{ easing: cubicInOut, duration: 50, delay: 100 }}
		out:fade={{ easing: cubicInOut, duration: 50 }}
	>
		<slot />
	</div>
{/key}
