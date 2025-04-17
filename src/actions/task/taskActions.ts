import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

import prisma from 'instances/prisma'


const taskSchema = z.object({ // SHOULD BE ALWAYS BASED ON THE 'Task' TYPE
  id: z.number(),
  title: z.string().nullable(),
  contents: z.string().nullable(),
  priority: z.number(),
  isComplete: z.boolean(),
  editedAt: z.number().nullable(),
})



// ACTIONS
export const taskActions = {
  getAllTasks: defineAction({
    handler: async () => {
      try {
        const res = prisma.task.findMany({
          orderBy: [
            {
              editedAt: 'desc',
            },
          ],
        })
        return res;
      } catch (err: any) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err,
        });
      }
    }
  }),

  getTaskById: defineAction({
    input: z.number(),
    handler: async (input) => {
      try {
        const res = await prisma.task.findUnique({
          where: {
            id: input
          }
        })
        return res;
      } catch (err: any) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err,
        });
      }
    }
  }),

  addTask: defineAction({
    input: taskSchema,
    handler: async (input) => {
      try {
        const res = await prisma.task.create({
          data: {
            title: input.title,
            contents: input.contents,
            priority: input.priority,
            isComplete: input.isComplete,
            editedAt: Math.floor(Date.now() / 1000)
          }
        })
        return res;
      } catch (err: any) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err,
        });
      }
    }
  }),

  updateTask: defineAction({
    input: taskSchema,
    handler: async (input) => {
      try {
        const res = await prisma.task.update({
          where: {
            id: input.id
          },
          data: {
            title: input.title,
            contents: input.contents,
            priority: input.priority,
            isComplete: input.isComplete,
            editedAt: Math.floor(Date.now() / 1000)
          }
        })
        return res;
      } catch (err: any) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err,
        });
      }
    }
  }),


  deleteTask: defineAction({
    input: taskSchema,
    handler: async (input) => {
      try {
        const res = await prisma.task.delete({
          where: {
            id: input.id
          },
        })
        return res;
      } catch (err: any) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err,
        });
      }
    }
  }),

}

