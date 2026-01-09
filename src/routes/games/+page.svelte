<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	export let data: PageData;
	let { session, rooms, supabase } = data;
	let players: { [x: string]: { presence_ref: string; room: string | null }[] };

	const playersChannel = supabase
		.channel(`online-users`, {
			config: {
				presence: {
					key: session?.user?.id
				}
			}
		})
		.on('presence', { event: 'sync' }, async () => {
			players = playersChannel.presenceState();
		})
		.subscribe(async (status: string) => {
			if (status === 'SUBSCRIBED') await playersChannel.track({ room: null });
		});
</script>

<svelte:head>
	<title>Multiplayer Picross | Games</title>
</svelte:head>

<div class="col-12">
	<h1 class="text-center mb-5">Games</h1>

	{#if rooms.length > 0}
		<ul class="row p-0">
			{#each rooms as room}
				<a class="btn col-lg-3 col-md-4 col-12" href={resolve(`/games/${room.id}`)}>
					<li class="list-group-item">
						<div class="card shadow-sm">
							<div class="card-body text-start">
								<h2 class="card-title h3">Room {room.id.slice(0, 4)}</h2>
								<p class="card-subtitle {room.solved ? 'text-success' : 'text-danger'}">
									{room.solved ? 'Solved' : 'Unsolved'}
								</p>
								<p class="card-subtitle text-muted">
									Created {dayjs(room.created_at).fromNow()}
								</p>
								{#if players}
									<p class="card-text text-muted">
										{Object.keys(players).reduce((acc, key) => {
											if (players[key].slice(-1)[0].room === room.id) acc++;
											return acc;
										}, 0) || 'No one'} playing
									</p>
								{/if}
							</div>
						</div>
					</li>
				</a>
			{/each}
		</ul>
	{:else}
		<p>No rooms</p>
	{/if}

	<a class="btn btn-primary" href={resolve('/games/create')}>Create room</a>
</div>
