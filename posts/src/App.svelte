<script>
	import PostBoard from "./routes/postBoard.svelte";
	import Home from './routes/home.svelte';
	import PostDetail from './routes/postDetail.svelte';
	import Router from 'svelte-spa-router'
	import {wrap} from 'svelte-spa-router/wrap';

	const routes = {
		'/' : Home,
		'/post' : PostBoard,
		'/post/detail/:id' : wrap({
			asyncComponent : () => PostDetail,
			
		})
	}
</script>

<main>
	<div>
		<a href="#/">Home</a>
		<a href="#/post">Post</a>
	</div>
	<Router {routes}/>
</main>
