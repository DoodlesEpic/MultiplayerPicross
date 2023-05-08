<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Multiplayer Picross | Create room</title>
</svelte:head>

<div class="col-12 col-sm-10 col-md-8 col-lg-6">
	<div class="text-center mb-5">
		<h1>Create room</h1>
		<p>Choose the nonogram difficulty</p>
	</div>

	<form method="post" action="?/create" use:enhance>
		<label for="nonogram-size" class="form-label">Nonogram size</label>
		<select name="nonogram-size" id="nonogram-size" class="form-select" aria-label="Nonogram size">
			<option value="any" selected>Any</option>
			<option value="5x5">5x5</option>
			<option value="10x10">10x10</option>
		</select>

		<button class="btn btn-primary mt-3">Create room</button>
	</form>
</div>
