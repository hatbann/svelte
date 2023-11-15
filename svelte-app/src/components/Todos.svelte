<style>
    .todos{
        margin-top: 10px;
        width: 300px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border: none;
        border-radius: 10px;
        padding: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
    }
</style>

<script>
    import TodoItem from "./TodoItem.svelte";

    export let todoList;
    export let removeTodo
</script>

<div class:todos={todoList.length}>
    {#each todoList as todo}
        <TodoItem {todo} {removeTodo}/>
    {/each}
</div>