import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import type { Task } from '@prisma/client';

import { mockAllTasksStore, mockSelectedTaskStore, mockIsViewerOpenStore } from 'utils/mock-store';
import { mockActions } from 'utils/mock-actions';

import TaskListPanel from './TaskListPanel.svelte';


describe('TaskListPanel', () => {
  // SETUP
  const testTask: Task = {
    id: 1,
    title: 'test-title',
    contents: 'test-contents',
    priority: 0,
    isComplete: false,
    editedAt: 0,
  }

  const testAllTasks: Array<Task> = [
    {
      id: 3,
      title: 'test-title',
      contents: 'test-contents',
      priority: 1,
      isComplete: true,
      editedAt: 0,
    },
    {
      id: 2,
      title: 'test-title',
      contents: 'test-contents',
      priority: 1,
      isComplete: false,
      editedAt: 0,
    },
    testTask
  ]

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
    mockAllTasksStore.mockSetSubscribeValue(testAllTasks)
  }

  const defaultRender = (props: any = {}) => {
    render(TaskListPanel, props)
  }


  // TESTS
  test('render values', async () => {
    resetStores();
    defaultRender();

    expect(screen.getByTestId('container-main-list')).toBeInTheDocument();

    expect(screen.getAllByTestId('container-main-task').length).toBe(testAllTasks.length)
  });

  test('render values when there is no tasks', async () => {
    resetStores();
    mockAllTasksStore.mockSetSubscribeValue([])
    defaultRender();

    expect(screen.getByTestId('container-main-list')).toBeInTheDocument();
    expect(screen.getByTestId('container-nothing-found')).toBeInTheDocument();

    expect(screen.queryAllByTestId('container-main-task').length).toBe(0)
  });

  test('render values when loading fails', async () => {
    resetStores();
    mockAllTasksStore.mockSetSubscribeValue([])
    defaultRender({ hasPreloadingTasksFailed: true });

    expect(screen.getByTestId('container-main-list')).toBeInTheDocument();
    expect(screen.getByTestId('container-failed-to-load-tasks')).toBeInTheDocument();

    expect(screen.queryAllByTestId('container-main-task').length).toBe(0)
  });

  test('filter tasks', async () => {
    const user = userEvent.setup()
    resetStores();
    defaultRender();

    expect(screen.getByTestId('container-main-list')).toBeInTheDocument();

    expect(screen.getAllByTestId('container-main-task').length)
    .toBe(testAllTasks.length)

    await user.click(screen.getByTestId('button-filter-priority'));
    expect(screen.getAllByTestId('container-main-task').length)
    .toBe(testAllTasks
      .filter(t => t.priority === 1)
      .length)

    await user.click(screen.getByTestId('button-filter-completion'));
    expect(screen.getAllByTestId('container-main-task').length)
    .toBe(testAllTasks
      .filter(t => t.priority === 1)
      .filter(t => t.isComplete === true)
      .length)
  });
});
