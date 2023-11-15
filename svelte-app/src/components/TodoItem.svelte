<style>
    .item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 5px 0;
    }

    input, p, button{
        margin : 0
    }

    input { 
        margin-right: 5px;
    }

    p{
        margin-right: 15px;

        &.done{
            text-decoration: line-through;
        }
    }

    button{
        width: 25px;
        height: 25px;
        font-size: 15px;
        font-weight: 600;
    line-height: 25px;
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 50%;
    color: tomato;
    cursor: pointer;
    }

    .item-content{
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
</style>

<script>
    export let todo;
    export let removeTodo

</script>

<div class="item">
    <div class="item-content">
        <input type="checkbox" bind:checked={todo.complete}>
        <p class:done={todo.complete}>{todo.text}</p>
    </div>
    <button on:click={()=>removeTodo(todo.id)}>X</button>
</div>