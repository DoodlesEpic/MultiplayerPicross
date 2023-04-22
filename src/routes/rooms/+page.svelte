<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	let { session, rooms } = data;
	let roomlist: any[] = rooms ?? [];
	let roomlistlength = roomlist?.length ?? 0;
</script>

<h1 class="text-center mb-3">Rooms</h1>

{#if roomlistlength > 0}
	<ul class="row p-0">
		{#each roomlist as room}
			<a class="btn col-lg-3 col-md-4 col-12" href="/games/{room.id}">
				<li class="list-group-item">
					<div class="card shadow-sm">
						<div class="card-body text-start">
							<h2 class="card-title h3">Room {room.id.slice(0, 4)}</h2>
							<p class="card-subtitle text-muted mb-3">
								{new Date(room.created_at).toLocaleString()}
							</p>
							<p class="card-text text-muted">{room.players?.length ?? 'No '} players</p>
						</div>
					</div>
				</li>
			</a>
		{/each}
	</ul>
{:else}
	<p>No rooms</p>
{/if}

<form method="post" action="?/create">
	<button class="btn btn-primary">Create room</button>
</form>
