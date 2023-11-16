<script>
	import { page } from '$app/stores';
	import Logo from '../svg/logo.svelte';
	import UserIcon from '../svg/userIcon.svelte';
</script>

<header>
	<div class="logo">
		<Logo/>
	</div>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/" class:focused={$page.url.pathname === "/"}>Home</a>
			</li>
			<li aria-current={$page.url.pathname.startsWith('/notice') ? 'page' : undefined}>
				<a href="/notice"  class:focused={$page.url.pathname === "/notice"}>Notice</a>
			</li>
		</ul>
	</nav>
	<div class="user-icon">
		<UserIcon/>
	</div>
</header>

<style lang="scss">
	header{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		height: 60px;
		background-color: black;
	}

	.logo{
		width: 15%;
		text-align: center;
	}
	
	nav{
		width: 80%;
		padding-left: 40px;
		ul{
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	li{
		text-decoration: none;
		list-style: none;
		margin-right: 60px;
	}

	a{
		text-decoration: none;
		color: black;
		font-size: 20px;
		color: #888;
		font-weight: 600;

		&:hover{
			color: white;
		}

		&.focused{
			color: white;
		}

	}
	}


	.user-icon{
		width: 5%;
	}

</style>
