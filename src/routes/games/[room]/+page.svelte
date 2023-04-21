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
				const res = await $page.data.supabase.from('rooms').select().eq('id', room?.id).single();
				console.log('Res: ', res);
			}
		});

	const handleClick = async (tile: boolean, position: number) => {
		room.current[position] = !tile;
		const { error } = await $page.data.supabase
			.from('rooms')
			.update({ current: room?.current })
			.eq('id', room?.id);
		if (error) console.log(error);
		console.log('Updated');
	};
</script>

<h1>Game</h1>
<!-- <p>{JSON.stringify(room, null, 2)}</p> -->

<div>
	{#each room?.current as tile, position}
		<button
			on:click={() => handleClick(tile, position)}
			class={`btn p-5 mb-1 ${tile ? 'btn-primary' : 'btn-danger'}`}
		/>

		{#if (position + 1) % 5 === 0}
			<br />
		{/if}
	{/each}
</div>
