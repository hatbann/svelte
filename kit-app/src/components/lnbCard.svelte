<script lang="ts">
    import MenuArrow from "../svg/menuArrow.svelte";

    export let title : string;
    export let num : number;
</script>

<div class="lnb-container">
    <div class="lnb-left">
        <span class="title">{title}</span><span>{num}</span>
    </div>
    <div class="lnb-right">
        <MenuArrow/>
    </div>
</div>

<style lang="scss">
    .lnb-container{

        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 0 20px;
        cursor: pointer;
    }

    .lnb-left{
        font-weight: 700;
        .title{
            margin-right: 10px;
        }
    }
</style>