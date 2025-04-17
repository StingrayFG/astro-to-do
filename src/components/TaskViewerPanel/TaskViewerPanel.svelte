<script lang='ts'>
  import { actions } from 'astro:actions';
  import { Arrow90degLeft, ArrowDownLeft, ArrowLeft, ExclamationCircle, Floppy, Trash, XLg } from 'svelte-bootstrap-icons';
  import autosize from 'svelte-autosize';
  import { swipeable } from '@react2svelte/swipeable';
  import type { SwipeEventData } from '@react2svelte/swipeable';
  import type { Task } from '@prisma/client';

  import { selectedTaskStore, isViewerOpenStore, allTasksStore } from 'store'

  import PriorityElement from 'components/PriorityElement.svelte';
  import CheckboxElement from 'components/CheckboxElement.svelte';


  // PROPS & STATE
  let props = $props();

  let editedTask: Task | null = $state(null); // used for editing the task before saving it

  let hasRequestFailed: Boolean = $state(false);
  let isDeleting: Boolean = $state(false);


  $effect(() => { // updates the edited task in case a different task has been selected
		if (!editedTask || 
    ($selectedTaskStore && (editedTask.id != $selectedTaskStore.id))) {
      editedTask = { ...$selectedTaskStore! }
    }
	});


  // FUNCTIONS
  const handleCloseButton = () => {
    isDeleting = false;
    isViewerOpenStore.set(false);
  }

  const handleSaveButton = async () => {
    if (editedTask) {
      // id = -1 is reserved for the newly created tasks which are yet to be sent to the server
      if (editedTask.id === -1) {
        const { data, error } = await actions.task.addTask(editedTask)

        if (error) {
          hasRequestFailed = true;
          setTimeout(() => hasRequestFailed = false, 2000);
        } else {
          allTasksStore.set([
            data,
            ...$allTasksStore.filter(a => a.id !== editedTask!.id)
          ])
          selectedTaskStore.set(data)
          editedTask = { ...data };
        }
      } else {
        const { data, error } = await actions.task.updateTask(editedTask)

        if (error) {
          hasRequestFailed = true;
          setTimeout(() => hasRequestFailed = false, 2000);
        } else {
          allTasksStore.set([
            data,
            ...$allTasksStore.filter(a => a.id !== editedTask!.id)
          ])
          selectedTaskStore.set(data)
          editedTask = { ...data };
        }
      }
    }
  }

  const handleRevertButton = () => {
    editedTask = $selectedTaskStore;  
  }
  
  const handleDeleteButton = () => {
    isDeleting = true;
  }

  const handleConfirmDeletionButton = async () => {
    const { data, error } = await actions.task.deleteTask(editedTask!)

    if (error) {
      hasRequestFailed = true;
      setTimeout(() => hasRequestFailed = false, 2000);
    } else {
      allTasksStore.set([
        ...$allTasksStore.filter(a => a.id !== editedTask!.id)
      ])
      selectedTaskStore.set(null)
      editedTask = null;

      isDeleting = false;
      isViewerOpenStore.set(false);
    }
  }

  const handleCancelDeletionButton = () => {
    isDeleting = false;
  }


  // GETS
  const getCanSaveChanges = () => {
    if ((JSON.stringify(editedTask) !== JSON.stringify($selectedTaskStore)) && 
    (editedTask?.title)) {
      return true;
    }
  }

  const getCanRevertChanges = () => {
    if ((JSON.stringify(editedTask) !== JSON.stringify($selectedTaskStore)) &&
    (editedTask && (editedTask.id !== -1))) { 
      return true;
    }
  }

  const getCanDelete = () => {
    if (editedTask && (editedTask.id !== -1)) { 
      return true;
    }
  }


  // SWIPE
  const handleSwipe = (e: CustomEvent<SwipeEventData>) => {
    if (e?.detail?.deltaX && (e?.detail?.deltaX > 100)) {
      handleCloseButton()
    }
  }


  // AUTORESIZE
  let textarea: any = $state(null);

  $effect(() => {
    autosize.update(textarea);
	});

</script>


<div class={`w-full h-full
transition-all duration-300
flex flex-col overflow-hidden
bg-gradient-to-br from-slate-900 to-gray-900
fixed md:relative
${$isViewerOpenStore ? 'translate-x-0' : 
'translate-x-[60vw] md:translate-x-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}
use:swipeable
onswiped={handleSwipe}
data-testid='container-main-viewer'> <!-- the viewer panel slides to the right in the mobile version -->

  <div class='noise-bg opacity-40'>
  </div>

  <div class='w-full h-fit min-h-10
  shrink-0
  relative flex overflow-hidden
  bg-sky-950'> <!-- top panel, includes delete, save, and cancel buttons -->
    {#if editedTask && editedTask.id}
      <div class={`w-full absolute left-0
      transition-all duration-300
      flex
      ${isDeleting ? '-top-12 opacity-0 pointer-events-none' : 'top-0'}`}>
        <button class='common-button
        md:hidden'
        onclick={handleCloseButton}>
          <ArrowLeft class='common-button-icon scale-125'/>
        </button>
  
        <button class={`common-button ml-auto
        ${getCanDelete() ? '' : 'opacity-50 pointer-events-none'}`}
        onclick={handleDeleteButton}
        data-testid='button-delete'>
          <p class='text-red-500'>
            {'Delete'}
          </p>
          <Trash class='common-button-icon text-red-500'/>
        </button>
  
        <button class={`common-button
        ${getCanRevertChanges() ? '' : 'opacity-50 pointer-events-none'}`}
        onclick={handleRevertButton}>
          <p class=''>
            {'Cancel'}
          </p>
          <Arrow90degLeft class='common-button-icon'/>
        </button>
  
        <button class={`common-button 
        ${getCanSaveChanges() ? '' : 'opacity-50 pointer-events-none'}`}
        onclick={handleSaveButton}
        data-testid='button-save'>
          <p class=''>
            {'Save'}
          </p>
          <Floppy class='common-button-icon'/>
        </button>
      </div>

      <div class={`w-full absolute left-0
      transition-all duration-300
      flex
      ${!isDeleting ? 'top-12 opacity-0 pointer-events-none' : 'top-0'}`}>
        <button class={`common-button w-1/2`}
        onclick={handleCancelDeletionButton}>
          <p class=''>
            {'Cancel'}
          </p>
          <XLg class='common-button-icon'/>
        </button>
  
        <button class={`common-button w-1/2`}
        onclick={handleConfirmDeletionButton}
        data-testid='button-delete-confirm'>
          <p class='text-red-500'>
            {'Confirm'}
          </p>
          <Trash class='common-button-icon text-red-500'/>
        </button>
  
      </div>
    {:else if (props?.hasLoadedAtLeastOneTask)}
      <div class='pl-3 py-2
      flex gap-2'>
        <ArrowDownLeft class='my-auto text-neutral-200'/>
        <p class='my-auto'>
          {'Choose a task in the list first'}
        </p>
      </div>
    {:else if (!props?.hasLoadedAtLeastOneTask)}
      <div class='pl-3 py-2
      flex gap-2'>
        <ArrowLeft class='my-auto text-neutral-200'/>
        <p class='my-auto'>
          {'Create a task first'}
        </p>
      </div>
    {/if}
  </div>

  <div class='h-full w-full pb-20
  overflow-y-auto'> <!--task data -->
    {#if editedTask && editedTask.id}
      <div class='w-full h-fit px-2
      grid grid-cols-[3fr_2fr] gap-2'>
        <div>
          <p class='w-full py-1
          text-center
          border-b border-sky-500'>
            {'Priority'}
          </p>

          <div class='w-full
          grid grid-cols-3'>
            {#each [-1, 0, 1] as shownPriority (shownPriority)}
              <button class={`
              ${(editedTask?.priority === shownPriority) ? 'common-button-selected' : 'common-button'}`}
              onclick={() => editedTask!.priority = shownPriority}
              data-testid={'button-priority-' + shownPriority}>
                <PriorityElement priority={shownPriority} />
              </button>
            {/each}
          </div>
        </div>

        <div>
          <p class='w-full py-1
          text-center
          border-b border-sky-500'>
            {'Completion'}
          </p>

          <div class='w-full
          grid'>
            <button class={`
            ${editedTask?.isComplete ? 'common-button-selected' : 'common-button'}`}
            onclick={() => editedTask!.isComplete = !editedTask?.isComplete}
            data-testid='button-completion'>
              <CheckboxElement isChecked={editedTask?.isComplete} />
            </button>
          </div>
        </div>

      </div>
    
      <div class='pt-4 px-2'>
        <p class='ml-2
        text-sm text-sky-500'>
          {'Title'}
        </p>
    
        <input class='w-full
        border-b border-sky-500 focus:bg-sky-500/20'
        bind:value={editedTask.title}
        data-testid='input-title'/>
      </div>
    
      <div class='pt-4 px-2'>
        <p class='ml-2
        text-sm text-sky-500'>
          {'Description'}
        </p>
    
        <textarea class='w-full w-40
        border-b border-sky-500 focus:bg-sky-500/20'
        rows='1'
        use:autosize
        bind:this={textarea}
        bind:value={editedTask.contents}
        data-testid='textarea-contents'> 
        </textarea>
      </div>
    {/if}
  </div>

</div>

<!-- notifications -->
<div class={`w-screen h-20 pt-4
  fixed left-0
  flex place-content-center
  transition-all duration-300
  ${hasRequestFailed ? 'top-0' : '-top-20'}`}>

    <div class='p-2 h-fit
    flex gap-2 place-content-center
    bg-sky-900 drop-shadow-lg'>
      <p class=''>
        {'Request failed'}
      </p>
      <ExclamationCircle class='h-5 w-5 my-auto
      text-neutral-200'/>
    </div>

  </div>