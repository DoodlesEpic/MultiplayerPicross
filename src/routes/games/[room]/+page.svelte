<script lang="ts">
	import type { string } from '$env/static/private';
	import type { PageData } from './$types';
	export let data: PageData;
	let { session, room, supabase } = data;
	let figure = room.figure as { figure: boolean[]; width: number };

	supabase
		.channel('db-messages')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'rooms',
				filter: `id=eq.${room.id}`
			},
			(payload) => {
				// Don't update everything in our local object
				// Since the JOIN on the figure/creator won't be performed in this listener
				if (room) {
					room.current = payload.new.current;
					room.solved = payload.new.solved;
				}
			}
		)
		.subscribe();

	let players: { [key: string]: { id: string; room: string }[] } = {};
	const playersChannel = supabase
		.channel(`online-users`, {
			config: {
				presence: {
					key: session?.user.id
				}
			}
		})
		.on('presence', { event: 'sync' }, async () => {
			players = playersChannel.presenceState();
		})
		.subscribe(async (status: string) => {
			if (status === 'SUBSCRIBED') {
				await playersChannel.track({ room: room.id });
			}
		});

	const handleClick = async (tile: boolean, position: number) => {
		// Optimistically update the room state
		if (!room) throw new Error('Room not found');
		room.current[position] = !tile;
		room.solved = room.current.every((val: boolean, index: number) => val === figure.figure[index]);

		// Syncronize the game state with the database
		const { error } = await supabase
			.from('rooms')
			.update({ current: room.current, solved: room.solved })
			.eq('id', room.id);

		// Rollback the change on error (i.e. network issue)
		if (error) {
			room.current[position] = tile;
			room.solved = room.current.every((val, index) => val === room.current[index]);
		}
	};

	// Convert 2D array row and column to 1D array index
	$: index = (row: number, column: number, width: number) => row * width + column;
	$: tile = (row: number, column: number, width: number): boolean =>
		room.current[index(row, column, width)];

	$: contiguousTiles = (position: number, type: 'column' | 'row') => {
		let result: number[] = [0];

		let current_index = 0;
		for (let i = 0; i < figure.width; i++) {
			const isRow = type === 'row';
			const isChecked =
				figure.figure[isRow ? index(position, i, figure.width) : index(i, position, figure.width)];

			if (isChecked) result[current_index] = (result[current_index] || 0) + 1;
			else if (result[current_index] > 0) current_index++;
		}

		return result;
	};
</script>

<div class="d-flex flex-column align-items-center m-auto">
	<h1>Game {room.id.slice(0, 4)}</h1>
	<p>{room.solved ? 'Solved' : 'Not Solved'}</p>

	<h2 class="h4 mt-2">Players</h2>
	<ul class="p-0">
		{#await supabase.from('profiles').select().in('id', Object.keys(players))}
			<li class="list-group-item">Loading players...</li>
		{:then result}
			{#if result.data}
				{#each result.data as player}
					{#if players[player.id].slice(-1)[0].room === room.id}
						<li class="list-group-item">
							{player.username}
						</li>
					{/if}
				{/each}
			{:else}
				<li class="list-group-item">No players found</li>
			{/if}
		{/await}
	</ul>

	<h2 class="h4 mt-2">Nonogram</h2>
	{#if figure}
		<table>
			<tbody>
				<tr>
					<td />
					{#each Array(figure.width) as _, column}
						<td>
							{#each contiguousTiles(column, 'column') as count}
								<span class="my-1 badge bg-secondary">{count}</span>
								<br />
							{/each}
						</td>
					{/each}
				</tr>
				{#each Array(figure.figure.length / figure.width) as _, row}
					<tr>
						{#each contiguousTiles(row, 'row') as count}
							<span class="mx-1 badge bg-secondary">{count}</span>
						{/each}
						{#each room.current.slice(row, row + figure.width) as _, column}
							<td>
								<button
									on:click={() =>
										handleClick(tile(row, column, figure.width), index(row, column, figure.width))}
									class={`btn p-3 p-md-4 ${figure.width < 10 && 'p-xl-5'} ${
										tile(row, column, figure.width) ? 'btn-primary' : 'btn-danger'
									}`}
									disabled={room.solved}
								/>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
