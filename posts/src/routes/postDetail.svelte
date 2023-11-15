<script>
    import {beforeUpdate, onMount} from 'svelte';
    import getPost from '../util/getPost';

    let finishFetch = false;

    let info;
    export let params = {};
    const getDetail = async(id)=>{
        const posts = await getPost(id-1);
        finishFetch = true;
        info = posts;
    }

    $ : if(params.id){
        getDetail(params.id);
    } 
</script>

<div>

    {#if finishFetch && info}
        {info.content}
    {:else if finishFetch && !info}
        No Post
    {:else}
        <p>Loading...</p>
    {/if}
</div>