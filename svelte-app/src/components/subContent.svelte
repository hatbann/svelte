<script>
    let count = 0;
    $: double = count * 2;

    function handleClick(){
        count += 1;
    }

</script>

<span>sub content</span>
<button on:click={handleClick}>button</button>
<p>{count}</p>
<p>{double}</p>