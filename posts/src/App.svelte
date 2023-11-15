<style>
	main{
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

<script>
	import PostBoard from "./routes/postBoard.svelte";
	import Home from './routes/home.svelte';
	import PostDetail from './routes/postDetail.svelte';
	import Router from 'svelte-spa-router'
	import {wrap} from 'svelte-spa-router/wrap';

	const routes = {
		'/' : PostBoard,
		'/post/:id' : wrap({
			asyncComponent : () => PostDetail,
			
		})
	}
</script>

<main>
	<Router {routes}/>
</main>
