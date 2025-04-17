<script lang='ts'>
  import { EmojiFrown, ExclamationCircle, Funnel, PlusLg } from 'svelte-bootstrap-icons';
  import type { Task } from '@prisma/client';
  import { allTasksStore, selectedTaskStore } from 'store.ts'

  import TaskListElement from 'components/TaskListElement/TaskListElement.svelte';
  import CheckboxElement from 'components/CheckboxElement.svelte';
  import { onMount } from 'svelte';

  
  // PROPS & STATE
  let props = $props();

  if (!$allTasksStore) {
    allTasksStore.set(props?.preloadedTasks); // set store value from the tasks loaded during the ssr / ssg
  }



  let hasMounted: Boolean = $state(false); // true if the ssr page has got loaded, false if only showing the ssg page is being shown

  onMount(() => {
    hasMounted = true;
  })


  // FUNCTIONS
  const selectTask = (task: Task) => {
    if ($allTasksStore && 
    ($allTasksStore.length > 0) &&
    task.id !== -1) {
      allTasksStore.set($allTasksStore.filter(t => t.id !== -1))
    }

    selectedTaskStore.set(task)
  }

</script>


<div class='w-full h-full 
relative flex flex-col
overflow-hidden
bg-gradient-to-br from-slate-900 to-gray-900'
data-testid='container-main-list'>
  <div class='noise-bg opacity-20'>
  </div>



  <div class={`w-full h-full overflow-y-auto`}
  data-testid='container-list'> <!-- tasks list -->
    {#if props?.hasPreloadingTasksFailed}
      <div class='w-full mt-[40vh]
      flex gap-2 place-content-center
      transition-all duration-300 animate-fadein'>
        <p class='text-xl'>
          {'Failed to load the tasks'}
        </p>
        <ExclamationCircle class='h-5 w-5 my-auto
        text-neutral-200'/>
      </div>
    {:else if ($allTasksStore && ($allTasksStore.length === 0) && hasMounted)}
      <div class='w-full mt-[40vh]
      flex gap-2 place-content-center
      transition-all duration-300 animate-fadein'>
        <p class='text-xl'>
          {'Nothing found'}
        </p>
        <EmojiFrown class='h-5 w-5 my-auto
        text-neutral-200'/>
      </div>
    {:else if ($allTasksStore && ($allTasksStore.length > 0))}
      {#each $allTasksStore as task (task.id)}
        <TaskListElement 
        task={task} 
        isSelected={task.id === $selectedTaskStore?.id} 
        selectTask={selectTask}
        hasMounted={hasMounted} />
      {/each}
    {/if}
  </div>

</div>
