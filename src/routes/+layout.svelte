<script lang="ts">
	import '../app.scss';
	import 'bootstrap-icons/font/bootstrap-icons.scss';
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

<nav class="d-none d-md-block navbar fixed-top shadow-sm bg-white">
	<div class="container-fluid">
		<a class="navbar-brand" href="/rooms">Multiplayer Picross</a>
		{#if session}
			<div>
				<a class="navbar-brand" href="/rooms/create"><i class="bi bi-plus-circle px-2 py-3" /></a>
				<a class="navbar-brand" href="/account"><i class="bi bi-person-circle px-2 py-3" /></a>
			</div>
		{/if}
	</div>
</nav>

{#key url.pathname}
	<div class="position-absolute w-100 h-100">
		<div class="d-flex flex-column h-100">
			<div
				class="container d-flex align-items-center justify-content-center flex-fill mt-md-5 py-5"
				in:fade={{ easing: cubicInOut, duration: 100, delay: 150 }}
				out:fade={{ easing: cubicInOut, duration: 100 }}
			>
				<div
					class="row d-flex flex-column align-items-center justify-content-center flex-fill mb-5"
				>
					<slot />
				</div>
			</div>
		</div>
	</div>
{/key}

{#if session}
	<nav class="d-block d-md-none navbar fixed-bottom shadow bg-white">
		<div class="container-fluid justify-content-around">
			<a class="navbar-brand" href="/rooms"><i class="bi bi-joystick p-5" /></a>
			<a class="navbar-brand" href="/rooms/create"><i class="bi bi-plus-circle p-5" /></a>
			<a class="navbar-brand" href="/account"><i class="bi bi-person-circle p-5" /></a>
		</div>
	</nav>
{/if}
