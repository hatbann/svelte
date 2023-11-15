<style lang="scss">
    .post-card{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 50px;
        border-bottom: 1px solid rgb(233, 233, 233);
        cursor: pointer;

        span{
            text-align: center;
        }
    }

    .post-index{
        width : 5%;
    }

    .post-title{
        width : 85%;
    }

    .post-writer{
        width: 10%; 
    }
</style>

<script>
    import {push, pop, replace} from 'svelte-spa-router'
    export let post;
    export let index;

    const hanleClick = ()=>{
        push(`/post/${index+1}`)
    }
</script>

<div class="post-card" on:click={hanleClick}>
    <span class="post-index">{index + 1}</span>
    <span class="post-title">{post.title}</span>
    <span class="post-writer">{post.writer}</span>
</div>