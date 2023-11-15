

<style>
	main{
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container{
		border-radius: 10px;
		box-shadow: rgba(50, 50, 93, 0.2) 0px 20px 50px -20px, rgba(0, 0, 0, 0.2) 0px 30px 0px -30px, rgba(10, 37, 64, 0.25) 0px -2px 6px 0px inset;
		padding: 20px 10px 10px 10px;
		display: flex;
		width : 400px;
		height: 1000px;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}

	h1{
		margin: 0 0 10px 0;
		text-align: center;
	}
</style>

<script>
	import Input from "./components/input.svelte";
	import Todos from "./components/Todos.svelte";

	let todoList = [];
	let todo = ""; // input 입력값
	let lastId = 0;

	let addTodo = ()=>{
		if(todo.length){
			let newTodo = {
				id : lastId++,
				text : todo,
				complete : false
			}
			todoList[todoList.length] = newTodo;
			todo = "";
		}
	}

	let removeTodo = (id) =>{
		todoList = todoList.filter((todo) => todo.id !== id);
	}

	let handleKeyUp = e => {
		todo = e.target.value;
		if(e.keyCode === 13){
			addTodo()
		}
	}
</script>



<main>
	<div class="container">
		<h1>Todo List</h1>
		<Input {todo} {addTodo} {handleKeyUp}/>
		<Todos {todoList} {removeTodo}/>
	</div>
</main>