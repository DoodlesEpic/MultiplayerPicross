<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="row flex-center flex">
	<div class="col form-widget">
		<Auth
			supabaseClient={data.supabase}
			redirectTo={`${data.url}/logging-in?redirect=/`}
			providers={['google', 'discord']}
			appearance={{ theme: ThemeSupa }}
		/>
	</div>
</div>
