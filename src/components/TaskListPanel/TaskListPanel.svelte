<script lang='ts'>
  import { EmojiFrown, ExclamationCircle, Funnel, PlusLg } from 'svelte-bootstrap-icons';
  import type { Task } from '@prisma/client';
  import { allTasksStore, selectedTaskStore, isViewerOpenStore } from 'store.ts'

  import TaskListElement from 'components/TaskListElement/TaskListElement.svelte';
  import CheckboxElement from 'components/CheckboxElement.svelte';
  import { onMount } from 'svelte';

  
  // PROPS & STATE
  let props = $props();

  if (!$allTasksStore) {
    allTasksStore.set(props?.preloadedTasks); // set store value from the tasks loaded during the ssr / ssg
  }

  let isFilterOpen: Boolean = $state(false);
  let isCompleteOnly: Boolean = $state(false);
  let isHighPriorityOnly: Boolean = $state(false);

  let hasMounted: Boolean = $state(false); // true if the ssr page has got loaded, false if only showing the ssg page is being shown

  onMount(() => {
    hasMounted = true;
  })


  // FILTER
  let filteredTasks: Array<Task> = $state([]);

  const filterTasks = () => {
    let newFilteredTasks = [ ...$allTasksStore ];
    if (isCompleteOnly) {
      newFilteredTasks = newFilteredTasks.filter(t => t.isComplete);
    }
    if (isHighPriorityOnly) {
      newFilteredTasks = newFilteredTasks.filter(t => t.priority === 1);
    }
    filteredTasks = newFilteredTasks;
  }

  $effect(() => {
    if ($allTasksStore && (isCompleteOnly || isHighPriorityOnly)) {
      filterTasks();
    }
	});
  

  // FUNCTIONS
  const selectTask = (task: Task) => {
    if ($allTasksStore && 
    ($allTasksStore.length > 0) &&
    task.id !== -1) {
      allTasksStore.set($allTasksStore.filter(t => t.id !== -1))
    }

    selectedTaskStore.set(task)
    isViewerOpenStore.set(true)
  }

  const addTask = () => {
    if (($allTasksStore && 
    ($allTasksStore.length > 0) && 
    $allTasksStore[0].id !== -1)
    ||
    ($allTasksStore && 
    ($allTasksStore.length === 0))) {

      // id = -1 is reserved for the newly created tasks which are yet to be sent to the server
      const emptyTask: Task = {
        id: -1,
        title: '',
        contents: '',
        priority: 0,
        isComplete: false,
        editedAt: 0,
        expiresAt: ((new Date(Date.now() + 86400 * 1000 * 3)).setHours(0,0,0,0) / 1000) 
        // uses a unix timestamp in seconds (!) generated from the future date
      }

      allTasksStore.set([
        emptyTask,
        ...$allTasksStore
      ])

      selectedTaskStore.set(emptyTask)
    }
  }
</script>


<div class='w-full h-full 
relative flex flex-col
overflow-hidden
bg-gradient-to-br from-slate-900 to-gray-900'
data-testid='container-main-list'>
  <div class='noise-bg opacity-20'>
  </div>

  <div class={`w-full h-fit min-h-10
  overflow-hidden
  shrink-0
  transition-all duration-300
  bg-sky-900
  ${isFilterOpen ? 'max-h-48' : 'max-h-10'}`}> <!-- top panel, includes the task filter -->
  
    <div class='flex'>
      <button class={`common-button
      transition-all duration-300
      ${isFilterOpen ? 'w-full' : 'w-1/2'}`}
      onclick={() => isFilterOpen = !isFilterOpen}>
        <Funnel class='common-button-icon'/>
        <p class=''>
          {'Filter'}
        </p>
      </button>
  
      <button class='common-button w-1/2'
      onclick={addTask}>
        <p class=''>
          {'Create'}
        </p>
        <PlusLg class='common-button-icon'/>
      </button>
    </div>

    <div>
      <button class={`min-w-full
      ${isHighPriorityOnly ? 'common-button-selected' : 'common-button'}`}
      onclick={() => isHighPriorityOnly = !isHighPriorityOnly}
      data-testid={'button-filter-priority'}>
        <div class='w-full flex gap-2'>
          <CheckboxElement 
          isChecked={isHighPriorityOnly}/>
          <p>
            {'High priority only'}
          </p>
        </div>
      </button>

      <button class={`min-w-full
      ${isCompleteOnly ? 'common-button-selected' : 'common-button'}`}
      onclick={() => isCompleteOnly = !isCompleteOnly}
      data-testid={'button-filter-completion'}>
        <div class='w-full flex gap-2'>
          <CheckboxElement 
          isChecked={isCompleteOnly}/>
          <p>
            {'Completed only'}
          </p>
        </div>
      </button>
    </div>
  </div>


  <div class={`w-full h-full overflow-y-auto`}
  data-testid='container-list'> <!-- tasks list -->
    {#if props?.hasPreloadingTasksFailed}
      <div class='w-full mt-[40vh]
      flex gap-2 place-content-center
      transition-all duration-300 animate-fadein'
      data-testid='container-failed-to-load-tasks'>
        <p class='text-xl'>
          {'Failed to load the tasks'}
        </p>
        <ExclamationCircle class='h-5 w-5 my-auto
        text-neutral-200'/>
      </div>
    {:else if ($allTasksStore && ($allTasksStore.length === 0) && hasMounted)}
      <div class='w-full mt-[40vh]
      flex gap-2 place-content-center
      transition-all duration-300 animate-fadein'
      data-testid='container-nothing-found'>
        <p class='text-xl'>
          {'Nothing found'}
        </p>
        <EmojiFrown class='h-5 w-5 my-auto
        text-neutral-200'/>
      </div>
    {:else if (filteredTasks && (isCompleteOnly || isHighPriorityOnly))}
      {#each filteredTasks as task (task.id)}
        <TaskListElement 
        task={task} 
        isSelected={task.id === $selectedTaskStore?.id} 
        selectTask={selectTask}
        hasMounted={hasMounted} />
      {/each}
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
