import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import type { Task } from '@prisma/client';

import TaskListElement from './TaskListElement.svelte';


describe('TaskListElement', () => {
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

  const selectTaskMock = vi.fn()

  const defaultRender = (props?: any) => {
    render(TaskListElement, { 
      ...props,
      selectTask: selectTaskMock
    })
  }
  

  // TESTS
  test('render values', async () => {
    defaultRender({ task: testTask });

    expect(screen.getByTestId('container-main-task')).toBeInTheDocument();
    expect(screen.getByText(testTask.title!)).toBeInTheDocument();
    expect(screen.getByText(testTask.contents!)).toBeInTheDocument();
  });

  test('select task', async () => {
    const user = userEvent.setup()
    defaultRender({ task: testTask });

    await user.click(screen.getByTestId('container-main-task'));
    expect(selectTaskMock).toBeCalled();
  });
});
