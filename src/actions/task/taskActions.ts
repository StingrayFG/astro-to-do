import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

import { taskHandlers } from './taskHandlers';


const taskSchema = z.object({ // SHOULD BE ALWAYS BASED ON THE 'Task' TYPE
  id: z.number(),
  title: z.string().nullable(),
  contents: z.string().nullable(),
  priority: z.number(),
  isComplete: z.boolean(),
  editedAt: z.number().nullable(),
})


const generateSimpleAction = (handler: Function, schema?: any) => {
  if (schema) {
    return defineAction({
      input: schema,
      handler: async (input) => {
        try {
          const res = await handler(input);
          return res;
        } catch (err: any) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: err,
          });
        }
      }
    })
  } else {
    return defineAction({
      handler: async () => {
        try {
          const res = await handler();
          return res;
        } catch (err: any) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: err,
          });
        }
      }
    })
  }
}


// ACTIONS
export const taskActions = {
  getAllTasks: generateSimpleAction(taskHandlers.getAllTasks),
  getTaskById: generateSimpleAction(taskHandlers.getTaskById, z.number()),
  addTask: generateSimpleAction(taskHandlers.addTask, taskSchema),
  updateTask: generateSimpleAction(taskHandlers.updateTask, taskSchema),
  deleteTask: generateSimpleAction(taskHandlers.deleteTask, taskSchema),
}

