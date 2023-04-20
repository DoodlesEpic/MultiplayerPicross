<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let { session, rooms } = data;
	let roomlist: any[] = rooms ?? [];
	let roomlistlength = roomlist?.length ?? 0;

	console.log(roomlist);
	console.log(roomlistlength);
</script>

<div>
	<h1>Rooms</h1>

	{#if roomlistlength > 0}
		<ul>
			{#each roomlist as room}
				<li>
					<div>
						<h2>{room.creator}</h2>
						<p>{room.created_at}</p>
						<p>{room.players?.length ?? 0}</p>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No rooms</p>
	{/if}

	<button disabled>Create room</button>
</div>
