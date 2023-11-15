<script>
    import PostList from "../components/postList.svelte";

    const posts = fetch("/posts.json").then((res)=> res.json());



</script>


<div>
    <h1>Post</h1>
    {#await posts}
    <p>Loading...</p>
{:then posts}
    <PostList {posts}/>
{/await}
</div>