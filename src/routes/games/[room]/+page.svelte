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
</script>

<div>
	<h1>Game</h1>
	<p>{room?.solved ? 'Solved' : 'Not Solved'}</p>
	<!-- <p>{JSON.stringify(room, null, 2)}</p> -->

	{#each room?.current as tile, position}
		<button
			on:click={() => handleClick(tile, position)}
			class={`btn p-5 mb-1 ${tile ? 'btn-primary' : 'btn-danger'}`}
			disabled={room?.solved}
		/>

		{#if (position + 1) % 5 === 0}
			<br />
		{/if}
	{/each}
</div>
