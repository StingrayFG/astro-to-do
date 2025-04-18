<script lang='ts'>
  import PriorityElement from 'components/PriorityElement.svelte';
  import CheckboxElement from 'components/CheckboxElement.svelte';
    import { ClockHistory } from 'svelte-bootstrap-icons';

  let props = $props();
</script>


<button class={`w-full h-16 p-2 
grid grid-cols-[max-content_1fr]
transition-all duration-300 animate-fadein
select-none 
md:hover:drop-shadow-lg md:hover:bg-sky-500/40
${props?.isSelected ? 'md:bg-sky-500/20' : 'bg-transparent'}
${props?.hasMounted ? '' : 'blur-sm pointer-events-none'}`}
onclick={() => props?.selectTask(props?.task)}
data-testid='container-main-task'>

  <div class='pr-2
  grid grid-rows-2'>
    <div class='grid place-items-center'>
      <CheckboxElement isChecked={props?.task?.isComplete}/>
    </div>

    <PriorityElement priority={props?.task?.priority}/>
  </div>

  <div class='w-full pl-2 
  border-l border-sky-500
  grid grid-rows-2'>
    <div class='w-full h-full 
    flex gap-2 overflow-hidden'>
      <p class='grow
      text-sky-500 font-bold text-left whitespace-nowrap text-ellipsis overflow-hidden'>
        {props?.task?.title ? props?.task?.title : 'Unnamed'}
      </p>

      {#if props?.task?.expiresAt}
        <p class='shrink-0 
        flex
        text-sky-500 text-left text-sm whitespace-nowrap text-ellipsis overflow-hidden'>
          <ClockHistory class='h-3 w-3 mt-1.25 mr-1' />
          {new Date(props?.task?.expiresAt * 1000).toISOString().slice(0, 10)}
        </p>
      {/if}
    </div>

    <div class='w-full h-full overflow-hidden'>
      <p class='
      text-left whitespace-nowrap text-ellipsis overflow-hidden'>
        {props?.task?.contents ? props?.task?.contents : 'No description'}
      </p>
    </div>

  </div>

</button>
