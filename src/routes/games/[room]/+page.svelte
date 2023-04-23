<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	let { session, room } = data;

	$page.data.supabase
		.channel('db-messages')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'rooms',
				filter: `id=eq.${room?.id}`
			},
			(payload: { new: any }) => (room = payload.new as any)
		)
		.subscribe(async (status: string) => {
			if (status === 'SUBSCRIBED') {
				const { data, error } = await $page.data.supabase
					.from('rooms')
					.select()
					.eq('id', room?.id)
					.single();

				if (error) throw error;
				room = data;
			}
		});

	const handleClick = async (tile: boolean, position: number) => {
		// Optimistically update the room state
		if (!room) throw new Error('Room not found');
		room.current[position] = !tile;
		room.solved = room?.current.every((val: any, index: number) => val === room?.solution[index]);

		// Syncronize the game state with the database
		const { error } = await $page.data.supabase
			.from('rooms')
			.update({ current: room?.current, solved: room?.solved })
			.eq('id', room?.id);

		// Rollback the change on error (i.e. network issue)
		if (error) {
			room.current[position] = tile;
			room.solved = room?.current.every((val: any, index: number) => val === room?.solution[index]);
		}
	};

	// Convert 2D array row and column to 1D array index
	const index = (row: number, column: number) => row * 5 + column;
	let tile = (row: number, column: number): boolean => room?.current[index(row, column)];

	$: contiguousForColumn = (column: number): number[] => {
		const result: number[] = [];

		let current_index = 0;
		for (let i = 0; i < 5; i++) {
			if (room?.solution[index(i, column)]) {
				if (!result[current_index]) result.push(0);
				result[current_index]++;
			} else if (result[current_index] > 0) {
				current_index++;
			}
		}

		return result;
	};

	$: contiguousForRow = (row: number): number[] => {
		const result: number[] = [];

		let current_index = 0;
		for (let i = 0; i < 5; i++) {
			if (room?.solution[index(row, i)]) {
				if (result.length === 0) result.push(0);
				result[current_index]++;
			} else if (result[current_index] > 0) {
				current_index++;
				result.push(0);
			}
		}

		return result;
	};
</script>

<div class="d-flex flex-column align-items-center">
	<h1>Game {room?.id.slice(0, 4)}</h1>
	<p>{room?.solved ? 'Solved' : 'Not Solved'}</p>

	<table>
		<tbody>
			<tr>
				<td />
				{#each Array(5) as _, column}
					<td>
						{#each contiguousForColumn(column) as count}
							<span class="m-1 badge bg-secondary">{count}</span>
							<br />
						{/each}
					</td>
				{/each}
			</tr>
			{#each Array(5) as _, row}
				<tr>
					{#each contiguousForRow(row) as count}
						<span class="m-1 badge bg-secondary">{count}</span>
					{/each}
					{#each room?.current.slice(row, row + 5) as _, column}
						<td>
							<button
								on:click={() => handleClick(tile(row, column), index(row, column))}
								class={`btn p-4 p-sm-5 ${
									room?.current[index(row, column)] ? 'btn-primary' : 'btn-danger'
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
