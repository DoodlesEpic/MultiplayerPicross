<script lang="ts">
	// Convert 2D array row and column to 1D array index
	$: index = (row: number, column: number, width: number) => row * width + column;

	const handleClick = async (tile: boolean, position: number) => {
		console.log(position);
	};
</script>

<svelte:head>
	<title>Multiplayer Picross | Draw</title>
</svelte:head>

<div class="d-flex flex-column align-items-center m-auto">
	<h1>Draw a new nonogram</h1>
	<p>Create your own nonogram to play with</p>

	<table class="my-5">
		<tbody>
			{#each Array(5) as _, row}
				<tr>
					{#each Array(5) as _, column}
						<td>
							<button
								on:click={() => handleClick(true, index(row, column, 5))}
								class={`btn p-3 p-md-4 p-xl-5 btn-primary`}
							/>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<button class="btn btn-primary" type="submit">Save</button>
</div>
