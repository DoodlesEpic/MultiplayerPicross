<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	$: if (data.session) goto('/games');
</script>

<svelte:head>
	<title>Multiplayer Picross</title>
</svelte:head>

<div class="text-center col-12 col-sm-10 col-md-8 col-lg-6">
	<section class="my-5">
		<h1>Multiplayer Picross</h1>
		<p>
			A multiplayer webgame
			<a class="text" href="https://github.com/DoodlesEpic">made by Doodles</a>
		</p>
	</section>

	<section class="my-5">
		<h2>Picross, but Multiplayer</h2>
		<p>
			This is a multiplayer game where you can solve nonogram puzzles with your friends or random
			strangers
		</p>
	</section>

	<section class="my-5">
		<h2>Nonograms are simple</h2>
		<p>
			<a class="text" href="https://en.wikipedia.org/wiki/Nonogram">From wikipedia:</a>
			Nonograms, also known as Hanjie, Paint by Numbers, Picross, Griddlers, and Pic-a-Pix, and by various
			other names, are picture logic puzzles in which cells in a grid must be colored or left blank according
			to numbers at the side of the grid to reveal a hidden pixel art-like picture.
		</p>
	</section>

	<section class="my-5">
		<h2 class="mb-4">Start playing</h2>
		<a href="/login" class="btn btn-primary shadow-sm px-5 py-2">Play</a>
	</section>
</div>
