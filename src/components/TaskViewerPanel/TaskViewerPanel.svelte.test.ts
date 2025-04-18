import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import type { Task } from '@prisma/client';

import { mockAllTasksStore, mockSelectedTaskStore, mockIsViewerOpenStore } from 'utils/mock-store';
import { mockActions } from 'utils/mock-actions';

import { selectedTaskStore } from 'store';
import TaskViewerPanel from './TaskViewerPanel.svelte';


describe('TaskViewerPanel', () => {
  // SETUP
  const testTask: Task = {
    id: 1,
    title: 'test-title',
    contents: 'test-contents',
    priority: 0,
    isComplete: false,
    editedAt: 171000000,
    expiresAt: 175000000,
  }
  const editedTestTask: Task = {
    id: 1,
    title: 'test-title-2',
    contents: 'test-contents-2',
    priority: 1,
    isComplete: true,
    editedAt: 171000000,
    expiresAt: 175000000,
  }

  vi.mock('store', () => ({
    allTasksStore: mockAllTasksStore,
    selectedTaskStore: mockSelectedTaskStore,
    isViewerOpenStore: mockIsViewerOpenStore,
  }));

  vi.mock('astro:actions', () => (
    mockActions
  ));

  const resetStores = () => {
    mockSelectedTaskStore.mockSetSubscribeValue(testTask)
    mockAllTasksStore.mockSetSubscribeValue([ testTask ])
  }

  const defaultRender = (props: any = {}) => {
    render(TaskViewerPanel, props)
  }


  // TESTS
  test('render values', async () => {
    const user = userEvent.setup()
    resetStores();
    defaultRender();

    expect(screen.getByTestId('container-main-viewer')).toBeInTheDocument();
    
    expect(screen.getByDisplayValue(testTask.title!)).toBeInTheDocument();
    expect(screen.getByDisplayValue(testTask.contents!)).toBeInTheDocument();
  });

  test('render when there is no selected task', async () => {
    const user = userEvent.setup()
    resetStores();
    mockSelectedTaskStore.mockSetSubscribeValue(null);
    defaultRender();

    expect(screen.queryByTestId('button-save')).toBeNull()
    expect(screen.queryByTestId('button-cancel')).toBeNull()
    expect(screen.queryByTestId('button-delete')).toBeNull()
    
    expect(screen.queryByTestId('input-title')).toBeNull()
    expect(screen.queryByTestId('textarea-contente')).toBeNull()
    expect(screen.queryByTestId('button-completion')).toBeNull()
  });

  test('edit and save task', async () => {
    const user = userEvent.setup()
    resetStores();
    defaultRender();
    const setSpy = vi.spyOn(selectedTaskStore, 'set');

    const titleInput = screen.getByTestId('input-title');
    await user.clear(titleInput);
    await user.type(titleInput, editedTestTask.title!);

    const contentsTextarea = screen.getByTestId('textarea-contents');
    await user.clear(contentsTextarea);
    await user.type(contentsTextarea, editedTestTask.contents!)
    
    await user.click(screen.getByTestId('button-priority-' + editedTestTask.priority));
    if (testTask.isComplete !== editedTestTask.isComplete) {
      await user.click(screen.getByTestId('button-completion'));
    }

    await user.click(screen.getByTestId('button-save'));
    expect(setSpy.mock.calls[0][0]).toEqual(expect.objectContaining({
      ...editedTestTask,
      editedAt: expect.any(Number),
    }))
  });

  test('try saving a task without a title', async () => {
    const user = userEvent.setup()
    resetStores();
    defaultRender();
    const setSpy = vi.spyOn(selectedTaskStore, 'set');

    const titleInput = screen.getByTestId('input-title');
    await user.clear(titleInput);

    await user.click(screen.getByTestId('button-priority-' + editedTestTask.priority));
    if (testTask.isComplete !== editedTestTask.isComplete) {
      await user.click(screen.getByTestId('button-completion'));
    }

    await user.click(screen.getByTestId('button-save'));
    expect(setSpy.mock.calls).toEqual([])
  });

  test('delete task', async () => {
    const user = userEvent.setup()
    resetStores();
    defaultRender();
    const setSpy = vi.spyOn(selectedTaskStore, 'set');

    await user.click(screen.getByTestId('button-delete'));
    await user.click(screen.getByTestId('button-delete-confirm'));

    await user.click(screen.getByTestId('button-save'));
    expect(setSpy.mock.calls[0][0]).toBeNull();
  });

});
