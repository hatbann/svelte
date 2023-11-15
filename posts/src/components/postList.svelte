<style>
    .post-board{
        border: 1px solid gray;
        padding: 0 10px;
        width: 100%;
    }
</style>

<script>
  import PostCard from './postCard.svelte';
    export let posts

    
</script>

<div class="post-board">
    {#each posts as post, index}
        <PostCard {index} {post}/>
    {/each}
</div>