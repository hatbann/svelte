<script>
    import {num} from '../js/store'

    let numCount = 0;
    num.subscribe((data)=>{
        numCount = data;
    })
</script>

<p>child 2 : {numCount}</p>