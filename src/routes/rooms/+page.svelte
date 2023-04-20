<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let { session, rooms } = data;
	let roomlist: any[] = rooms ?? [];
	let roomlistlength = roomlist?.length ?? 0;

	console.log(roomlist);
	console.log(roomlistlength);
</script>

<h1 class="text-center mb-3">Rooms</h1>

{#if roomlistlength > 0}
	<ul>
		{#each roomlist as room}
			<li class="row mb-3">
				<div class="card">
					<div class="card-body">
						<h2 class="card-title">Room {room.creator.slice(0, 4)}</h2>
						<p class="card-subtitle text-body-secondary mb-3">
							Created {new Date(room.created_at).toLocaleString()}
						</p>
						<p>{room.players?.length ?? 'No '} players</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<p>No rooms</p>
{/if}

<button class="btn btn-primary mt-2" disabled>Create room</button>
