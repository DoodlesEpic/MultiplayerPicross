<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	let { session, room } = data;

	const handleClick = (tile: boolean, position: number) => {
		room.current[position] = !tile;
	};
</script>

<h1>Game</h1>
<!-- <p>{JSON.stringify(room, null, 2)}</p> -->

<div>
	{#each room.current as tile, position}
		<button
			on:click={() => handleClick(tile, position)}
			class={`btn p-5 mb-1 ${tile ? 'btn-primary' : 'btn-danger'}`}
		/>

		{#if (position + 1) % 5 === 0}
			<br />
		{/if}
	{/each}
</div>
