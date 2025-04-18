import { get, writable } from 'svelte/store';
import { vi } from 'vitest'

import type { Task } from '@prisma/client';


export const mockAllTasks = writable<Array<Task>>()

export const mockSelectedTask = writable<Task | null>()

export const mockIsViewerOpen = writable<Boolean>(false)


export const mockAllTasksStore = {
  subscribe: mockAllTasks.subscribe,
  set: vi.fn(),
  mockSetSubscribeValue: (value: Array<Task>): void => mockAllTasks.set(value),
  mockDollarPrefix: () => get(mockAllTasks)
}

export const mockSelectedTaskStore = {
  subscribe: mockSelectedTask.subscribe,
  set: vi.fn(),
  mockSetSubscribeValue: (value: Task | null): void => mockSelectedTask.set(value),
  mockDollarPrefix: () => get(mockSelectedTask)
}

export const mockIsViewerOpenStore = {
  subscribe: mockSelectedTask.subscribe,
  set: vi.fn(),
  mockSetSubscribeValue: (value: Boolean): void => mockIsViewerOpen.set(value),
  mockDollarPrefix: () => get(mockIsViewerOpen)
}
