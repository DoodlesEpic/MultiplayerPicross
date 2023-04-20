<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let { session, profile } = data;

	let profileForm: any;
	let loading = false;
	let fullName: string | null = profile?.full_name;
	let username: string | null = profile?.username;

	function handleSubmit() {
		loading = true;
		return async () => {
			loading = false;
		};
	}
</script>

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

<form method="post" action="?/signout" use:enhance={handleSubmit}>
	<button class="btn btn-danger" disabled={loading}>Sign Out</button>
</form>
