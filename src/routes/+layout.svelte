<script lang="ts">
	import '../app.scss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: ({ supabase, session, url } = data);
	let username = '';

	onMount(async () => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		const res = await supabase.from('profiles').select().eq('id', session?.user.id).single();
		username = res.data?.username ?? session?.user.email?.split('@')[0] ?? 'Profile';

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Multiplayer Picross</title>
</svelte:head>

<nav class="navbar fixed-top shadow-sm bg-white">
	<div class="container-fluid">
		<a class="navbar-brand" href="/rooms">Multiplayer Picross</a>
		{#if session}
			<a class="navbar-brand" href="/account">{username}</a>
		{/if}
	</div>
</nav>

{#key url.pathname}
	<div class="position-absolute w-100 h-100">
		<div class="d-flex flex-column h-100">
			<div
				class="container d-flex flex-column flex-fill my-5 py-5"
				in:fade={{ easing: cubicInOut, duration: 100, delay: 150 }}
				out:fade={{ easing: cubicInOut, duration: 100 }}
			>
				<slot />
			</div>
		</div>
	</div>
{/key}
