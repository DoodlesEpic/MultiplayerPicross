<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Multiplayer Picross | Create room</title>
</svelte:head>

<div class="col-12 col-sm-10 col-md-8 col-lg-6">
	<div class="text-center">
		<h1>Create room</h1>
		<p>Choose the nonogram difficulty</p>
	</div>

	<form method="post" action="?/create" use:enhance>
		<div class="my-4">
			<label for="nonogram-size" class="form-label m-0">Nonogram size</label>
			<div class="form-text mt-0 mb-2">
				Choose the nonogram figure size. Larger figures are generally harder
			</div>
			<select
				name="nonogram-size"
				id="nonogram-size"
				class="form-select"
				aria-label="Nonogram size"
			>
				<option value="any" selected>Any</option>
				<option value="5x5">5x5</option>
				<option value="10x10">10x10</option>
			</select>
		</div>

		<div>
			<label for="nonogram-collection" class="form-label m-0">Collection</label>
			<div class="form-text mt-0 mb-2">Choose whether to play official or community nonograms.</div>
			<select
				name="nonogram-collection"
				id="nonogram-collection"
				class="form-select"
				aria-label="Nonogram collection"
			>
				<option value="any" selected>Official and community</option>
				<option value="official">Official only</option>
				<option value="community">Community only</option>
			</select>
		</div>

		<button class="btn btn-primary mt-4">Start game</button>
	</form>
</div>
