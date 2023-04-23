<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	$: if (data.session) goto('/rooms');
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="row flex-center flex">
	<div class="col form-widget">
		<Auth
			supabaseClient={data.supabase}
			redirectTo={`${data.url}/logging-in?redirect=/rooms`}
			providers={['github', 'discord']}
			appearance={{ theme: ThemeSupa }}
		/>
	</div>
</div>
