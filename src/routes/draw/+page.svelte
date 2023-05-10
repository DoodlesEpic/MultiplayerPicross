<script lang="ts">
	import { enhance } from '$app/forms';

	let figure: boolean[] = Array(25).fill(false);

	// Convert 2D array row and column to 1D array index
	$: index = (row: number, column: number, width: number) => row * width + column;
	$: tile = (row: number, column: number, width: number): boolean =>
		figure[index(row, column, width)];

	const handleClick = async (tile: boolean, position: number) => {
		figure[position] = !tile;
	};
</script>

<svelte:head>
	<title>Multiplayer Picross | Draw</title>
</svelte:head>

<form
	class="d-flex flex-column align-items-center m-auto"
	method="post"
	action="?/create"
	use:enhance
>
	<h1>Draw a new nonogram</h1>
	<p>Create your own nonogram to play with</p>

	<table class="my-5">
		<tbody>
			{#each Array(5) as _, row}
				<tr>
					{#each Array(5) as _, column}
						<td>
							<button
								on:click={() => handleClick(tile(row, column, 5), index(row, column, 5))}
								type="button"
								class={`btn p-3 p-md-4 p-xl-5 ${
									tile(row, column, 5) ? 'btn-primary' : 'btn-danger'
								}`}
							/>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<input
		class="d-none"
		aria-hidden="true"
		type="text"
		name="figure"
		id="figure"
		value={JSON.stringify(figure)}
	/>

	<button class="btn btn-primary" type="submit">Save</button>
</form>
