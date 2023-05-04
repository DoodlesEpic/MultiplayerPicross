<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let { session, room, supabase } = data;

	const dbMessages = supabase
		.channel('db-messages')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'rooms',
				filter: `id=eq.${room?.id}`
			},
			(payload: { new: { current: boolean[]; solved: boolean; players: any[] } }) => {
				// Don't update everything in our local object
				// Since the JOIN on the figure/creator won't be performed in this listener
				if (room) {
					room.current = payload.new.current;
					room.solved = payload.new.solved;
				}
			}
		)
		.subscribe();

	let players: any = {};
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
			if (status === 'SUBSCRIBED') {
				await playersChannel.track({ room: room?.id });
			}
		});

	const handleClick = async (tile: boolean, position: number) => {
		// Optimistically update the room state
		if (!room) throw new Error('Room not found');
		room.current[position] = !tile;
		room.solved = room?.current.every(
			(val: boolean, index: number) => val === room?.figure?.figure[index]
		);

		// Syncronize the game state with the database
		const { error } = await supabase
			.from('rooms')
			.update({ current: room?.current, solved: room?.solved })
			.eq('id', room?.id);

		// Rollback the change on error (i.e. network issue)
		if (error) {
			room.current[position] = tile;
			room.solved = room?.current.every((val: any, index: number) => val === room?.current[index]);
		}
	};

	// Convert 2D array row and column to 1D array index
	$: index = (row: number, column: number, width: number) => row * width + column;
	$: tile = (row: number, column: number, width: number): boolean =>
		room?.current[index(row, column, width)];

	$: contiguousTiles = (position: number, type: 'column' | 'row') => {
		let result: number[] = [0];

		let current_index = 0;
		for (let i = 0; i < room?.figure?.width; i++) {
			const isRow = type === 'row';
			const isChecked =
				room?.figure?.figure[
					isRow ? index(position, i, room?.figure?.width) : index(i, position, room?.figure?.width)
				];

			if (isChecked) result[current_index] = (result[current_index] || 0) + 1;
			else if (result[current_index] > 0) current_index++;
		}

		return result;
	};
</script>

<div class="d-flex flex-column align-items-center">
	<h1>Game {room?.id.slice(0, 4)}</h1>
	<p>{room?.solved ? 'Solved' : 'Not Solved'}</p>

	<h2 class="h4 mt-2">Players</h2>
	<ul class="p-0">
		{#each Object.keys(players) as player}
			{#if players[player].slice(-1)[0].room === room?.id}
				{#await supabase.from('profiles').select().eq('id', player).single()}
					<li class="list-group-item">Loading username...</li>
				{:then result}
					<li class="list-group-item">{result.data?.username}</li>
				{/await}
			{/if}
		{/each}
	</ul>

	<h2 class="h4 mt-2">Nonogram</h2>
	<table>
		<tbody>
			<tr>
				<td />
				{#each Array(room?.figure?.width) as _, column}
					<td>
						{#each contiguousTiles(column, 'column') as count}
							<span class="m-1 badge bg-secondary">{count}</span>
							<br />
						{/each}
					</td>
				{/each}
			</tr>
			{#each Array(room?.figure?.figure?.length / room?.figure?.width) as _, row}
				<tr>
					{#each contiguousTiles(row, 'row') as count}
						<span class="m-1 badge bg-secondary">{count}</span>
					{/each}
					{#each room?.current.slice(row, row + room?.figure?.width) as _, column}
						<td>
							<button
								on:click={() =>
									handleClick(
										tile(row, column, room?.figure?.width),
										index(row, column, room?.figure?.width)
									)}
								class={`btn p-3 p-sm-4 p-xl-5 ${
									tile(row, column, room?.figure?.width) ? 'btn-primary' : 'btn-danger'
								}`}
								disabled={room?.solved}
							/>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
