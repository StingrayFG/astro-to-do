<script lang='ts'>
  import { ChevronCompactRight, ExclamationCircle } from 'svelte-bootstrap-icons';

  let props = $props();
</script>


<div class='w-full h-full
relative grid place-items-center'>
  <div class='absolute flex'>
    {#if (props?.priority === -1)}
      <ChevronCompactRight class='text-yellow-500' />
    {:else if (props?.priority === 0)}
      <ChevronCompactRight class='text-green-500' />
      <ChevronCompactRight class='text-green-500 -ml-2.5' />
    {:else if (props?.priority === 1)}
      <ChevronCompactRight class='text-blue-500' />
      <ChevronCompactRight class='text-blue-500 -ml-2.5' />
      <ChevronCompactRight class='text-blue-500 -ml-2.5' />
    {:else}
      <ExclamationCircle class='text-red-500' />
    {/if}
  </div>
</div>

