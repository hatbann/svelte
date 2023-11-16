<script lang="ts">
	import type { NoticeType } from '../../types/notice';
	import type { PageData } from './$types';
    import {goto} from '$app/navigation';
	/** @type {import('./$types').PageData}*/
	export let data: PageData;
	let notices: NoticeType[];
	$: ({ notices } = data);

    const routePage = (index : number)=>{
        goto(`notice/${index}`);
    }
</script>


<div class="notice-container">
    <h1>Notice</h1>
    <div class="notice-list">
        {#each notices as notice, idx}
            <div class="notice-list-card" on:click={()=>{
                routePage(idx)
            }}>
                <span>{idx + 1}</span>
                <span>{notice.title}</span>
                <span>{notice.writer}</span>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .notice-container{
        width: 100%;
        height: 700px;
        background-color: white;
        padding: 30px;

        h1{
            font-weight: 700;
            font-size: 25px;
        }
    }

	.notice-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
        margin-top: 20px;
        border: 1px solid rgb(52, 52, 52);
        padding: 0 20px;
	}

	.notice-list-card {
		width: 100%;
		display: flex;
		justify-content: space-between;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid rgb(240, 240, 240);
        cursor: pointer;

        &:last-child{
            border-bottom: none;
        }

        span{
            &:first-child{

            }

            &:nth-child(2){

            }

            &:last-child{

            }
        }
	}
</style>
