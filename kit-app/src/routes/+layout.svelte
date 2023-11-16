<script>
	import Header from './Header.svelte';
	import Lnb from './LNB.svelte';
	import './styles.css';
</script>

<div class="app">
	<Header />
	<Lnb/>
	<main>
		<slot />
	</main>

	<footer>
	</footer>
</div>

<style>
	main{
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgb(245, 245, 245);
		width: calc(100% - 350px);
		height: calc(100dvh - 120px);
		z-index: 50;
		margin-left: 250px;
		padding: 60px 50px;
	}
</style>
