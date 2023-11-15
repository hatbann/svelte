<style>
    input{
        width: 250px;
        height: 35px;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 16px;
    }

    button{
        width: 50px;
        height: 35px;
        border-radius: 25px;
        border: none;
        background-color: rgb(195, 231, 255);
        font-size: 13px;
        cursor: pointer;
    }
</style>

<script>
    export let todo;
    export let addTodo;
    export let handleKeyUp;
</script>

<div>
    <input type="text" placeholder="할일을 입력하세요" bind:value={todo} on:keyup={e=> handleKeyUp(e)}>
    <button on:click={addTodo}>ADD</button>
</div>