<script>
    import LnbCard from "../components/lnbCard.svelte";
</script>


<div class="lnb">
    <div class="user-info">
        <h1>(주) 지니뮤직</h1>
        <p><span class="user-id">M002***님</span> 환영합니다!</p>
    </div>
    <div class="nav-bar">
        <LnbCard title={"유통사"} num={100}/>
        <LnbCard title={"아티스트"} num={7000}/>
        <LnbCard title={"앨범"} num={300}/>
        <LnbCard title={"곡"} num={400}/>
    </div>
</div>

<style lang="scss">
    .lnb{
        position: fixed;
        top: 60px;
        width: 250px;
        height: auto;
        z-index: 100;
        background-color: white;
    }

    .user-info{
        text-align: center;
        position: relative;
        padding: 25px 0;
        h1{
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 10px;
        }

        p{
            font-size: 14px;

            .user-id{
                font-weight: 600;
                color: rgb(255, 128, 30);
            }
        }
    }

    .user-info:before {
        content : "";
        position: absolute;
        left    : 50%;
        bottom  : 0;
        height  : 1px;
        width   : 80%;  /* or 100px */
        transform: translate(-50%,0);
        border-bottom: 1px solid rgb(226, 226, 226);
    }   

    .nav-bar{
        width: 250px;
        margin-top: 25px;
    }
</style>