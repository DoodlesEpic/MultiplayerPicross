<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	export let data: PageData;

	let { session, rooms, supabase } = data;
	let roomlist: any[] = rooms ?? [];
	let roomlistlength = roomlist?.length ?? 0;

	let players: any = {};
	const playersChannel = supabase.channel(`online-users}`, {
		config: {
			presence: {
				key: session?.user?.id
			}
		}
	});
	playersChannel
		.on('presence', { event: 'sync' }, async () => {
			players = playersChannel.presenceState();
		})
		.subscribe(async (status: string) => {
			if (status === 'SUBSCRIBED') {
				await playersChannel.track({ room: null });
			}
		});
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
							<p class="card-subtitle {room.solved ? 'text-success' : 'text-danger'}">
								{room.solved ? 'Solved' : 'Unsolved'}
							</p>
							<p class="card-subtitle text-muted mb-3">
								Created {dayjs(room.created_at).fromNow()}
							</p>

							<ul class="card-text text-muted">
								{#each Object.keys(players) as player}
									{#if players[player].slice(-1)[0].room === room.id}
										{#await supabase.from('profiles').select().eq('id', player).single()}
											<li class="list-group-item">Loading username...</li>
										{:then result}
											<li class="list-group-item">{result.data?.username}</li>
										{/await}
									{/if}
								{/each}
							</ul>
						</div>
					</div>
				</li>
			</a>
		{/each}
	</ul>
{:else}
	<p>No rooms</p>
{/if}

<form method="post" action="?/create" use:enhance>
	<button class="btn btn-primary">Create room</button>
</form>
