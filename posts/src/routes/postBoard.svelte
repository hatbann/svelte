<script>
    import PostList from "../components/postList.svelte";

    const posts = fetch("/posts.json").then((res)=> res.json());



</script>


<style>
    .container{
        width:80%;
    }

h1{
    font-size: 40px;
    font-weight: 700;
    margin: 20px 0 10px 0;
}
</style>

<div class="container">
    <h1>Post</h1>
    {#await posts}
    <p>Loading...</p>
{:then posts}
    <PostList {posts}/>
{/await}
</div>