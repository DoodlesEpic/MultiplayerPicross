<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let { session, profile } = data;

	let profileForm: any;
	let loading = false;
	let fullName: string | null = profile?.full_name;
	let username: string | null = profile?.username;

	const handleSubmit = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleLogout = () => {
		loading = true;
		return async () => {
			await data.supabase.auth.signOut();
			loading = false;
			goto('/');
		};
	};
</script>

<div class="m-auto col">
	<form
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
		class="mb-3"
	>
		<div class="mb-3">
			<label for="email" class="form-label">Email</label>
			<input id="email" type="text" value={session.user.email} class="form-control" disabled />
		</div>

		<div class="mb-3">
			<label for="fullName" class="form-label">Full Name</label>
			<input
				id="fullName"
				name="fullName"
				type="text"
				value={form?.fullName ?? fullName}
				class="form-control"
			/>
		</div>

		<div class="mb-3">
			<label for="username" class="form-label">Username</label>
			<input
				id="username"
				name="username"
				type="text"
				value={form?.username ?? username}
				class="form-control"
			/>
		</div>

		<div>
			<input
				type="submit"
				class="btn btn-primary"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>

	<form method="post" action="?/signout" use:enhance={handleLogout}>
		<button class="btn btn-danger" disabled={loading}>Sign Out</button>
	</form>
</div>
