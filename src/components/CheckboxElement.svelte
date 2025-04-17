<script lang='ts'>
  import { Circle, CheckCircle } from 'svelte-bootstrap-icons';

  let props = $props();

  const switchIsChecked = () => {
    props?.setIsChecked(!props?.isChecked)
  }
</script>

{#if (props?.setIsChecked)}
  <button class='cursor-pointer my-auto'
  onclick={switchIsChecked}>
    {#if (props?.isChecked)}
      <CheckCircle class='text-green-500' />
    {:else}
      <Circle class='text-neutral-200' />
    {/if}
  </button>
{:else}
  <div class='my-auto'>
    {#if (props?.isChecked)}
      <CheckCircle class='text-green-500' />
    {:else}
      <Circle class='text-neutral-200' />
    {/if}
  </div>
{/if}