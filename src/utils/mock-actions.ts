import { vi } from 'vitest'

import type { Task } from '@prisma/client';

export const mockTaskActions = {

  getAllTasks: () => {
    return []
  },

  addTask: (input: Task) => {
    return { data: { ...input }, error: null }
  },

  updateTask: (input: Task) => {
    return { data: { ...input }, error: null }
  },

  deleteTask: (input: Task) => {
    return { data: { ...input }, error: null }
  },
  
}


export const mockActions = {
  actions: {
    task: mockTaskActions
  }
}
