<style lang="scss">
    .detail-container{
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }

    .title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-top: 2px solid rgb(38, 38, 38);
        border-bottom: 1px solid rgb(75, 75, 75);
        height: 60px;
        padding: 0px 10px;

        h3{
            font-size: 23px;
            margin: 0;
            line-height: 60px;
            font-weight: 700;
        }

        span {
            line-height: 60px;
            font-size: 14px;
            color: rgb(118, 118, 118);
        }
    }


    .content{
        display: flex;
    flex-direction: column;
    justify-content: space-between;
        width: 100%;
        margin-top: 20px;
        min-height: 400px;

        button{
            width: 90px;
            height: 35px;
            border: none;
            background-color: rgb(255, 180, 41);
            color: white;
            border-radius: 25px;
            cursor: pointer;
        }
    }

    .button{
        display: flex;
        justify-content: center;
        width: 100%;
    }
</style>

<script>
    import getPost from '../util/getPost';
    import {push, pop, replace} from 'svelte-spa-router'
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

    const goBack = ()=>{
        push("/");
    }
</script>

<div class="detail-container">

    {#if finishFetch && info}
         <div class="title">
            <h3>{info.title}</h3><span>{info.writer}</span></div>   
        <div class="content">
            <p>{info.content}</p>
            <div class="button">
                <button on:click="{goBack}">목록</button>
            </div>
        </div>
    {:else if finishFetch && !info}
        No Post
    {:else}
        <p>Loading...</p>
    {/if}
</div>