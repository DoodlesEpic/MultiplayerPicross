<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	$: if (data.session) goto('/rooms');
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="col-12 col-sm-10 col-md-8 col-lg-6">
	<Auth
		supabaseClient={data.supabase}
		redirectTo={`${data.url}/logging-in?redirect=/rooms`}
		providers={['github', 'discord']}
		appearance={{ theme: ThemeSupa }}
	/>
</div>
