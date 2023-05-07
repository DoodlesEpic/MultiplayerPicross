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

	onMount(async () => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) invalidate('supabase:auth');
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Multiplayer Picross</title>
</svelte:head>

<nav class="navbar fixed-bottom fixed-md-top shadow bg-white">
	<div class="container-fluid justify-content-around">
		<a class="d-none d-md-block navbar-brand me-auto" href="/rooms">Multiplayer Picross</a>
		{#if session}
			<a class="btn navbar-brand m-0 px-4 p-1" href="/rooms"><i class="bi bi-joystick" /></a>
			<a class="btn navbar-brand m-0 px-4 p-1" href="/rooms/create"
				><i class="bi bi-plus-circle" /></a
			>
			<a class="btn navbar-brand m-0 px-4 p-1" href="/account"><i class="bi bi-person-circle" /></a>
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
