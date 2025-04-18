import { describe, test, expect, vi } from 'vitest'
import type { Task } from '@prisma/client';

import { prismaMock } from 'utils/mock-prisma';
import { taskHandlers } from './taskHandlers';
import prisma from 'instances/prisma'


describe('taskActions', async () => {
  // SETUP
  const clientTask = {
    id: 1,
    title: 'test-title',
    contents: 'test-contents',
    priority: 0,
    isComplete: false,
    editedAt: 171000000,
    expiresAt: 175000000,
  }  
  
  const returnedTestTask: Task = {
    id: 11,
    title: 'test-title-server',
    contents: 'test-contents-server',
    priority: 1,
    isComplete: true,
    editedAt: 172000000,
    expiresAt: 175000000,
  }


  // TESTS

  // GET
  test('get all', async () => {
    prismaMock.task.findMany.mockResolvedValue([ { ...returnedTestTask } ]);
    const prismaSpy = vi.spyOn(prisma.task, 'findMany');

    const res = await taskHandlers.getAllTasks();
    expect(res).toStrictEqual([ returnedTestTask ]);
    expect(prismaSpy.mock.calls[0][0]).not.toBeNull()
  });

  test('get by id', async () => {
    prismaMock.task.findUnique.mockResolvedValue({ ...returnedTestTask });
    const prismaSpy = vi.spyOn(prisma.task, 'findUnique');

    const res = await taskHandlers.getTaskById(11);
    expect(res).toStrictEqual(returnedTestTask);
    expect(prismaSpy.mock.calls[0][0].where.id).toBe(11)
  });

  test('get nonexisting', async () => {
    prismaMock.task.findUnique.mockRejectedValue('error');

    const wrap = async () => {
      return await taskHandlers.getTaskById(22)
    }
    expect(wrap).rejects.toEqual('error')
  });


  // ADD
  test('add', async () => {
    prismaMock.task.create.mockResolvedValue({ ...returnedTestTask });
    const prismaSpy = vi.spyOn(prisma.task, 'create');
    
    const res = await taskHandlers.addTask({ 
      ...clientTask,
      id: -1,
      editedAt: 0,
    });
    expect(res).toEqual(returnedTestTask);
    expect(prismaSpy.mock.calls[0][0].data).not.toContain('id')
    expect(prismaSpy.mock.calls[0][0].data?.editedAt).not.toBe(0)
  });

  test('add with invalid priority', async () => {
    prismaMock.task.create.mockResolvedValue({ ...returnedTestTask });
    const prismaSpy = vi.spyOn(prisma.task, 'create');
    
    const res = await taskHandlers.addTask({ 
      ...clientTask,
      id: -1,
      editedAt: 0,
      priority: 2,
    });
    expect(res).toEqual(returnedTestTask);
    expect(prismaSpy.mock.calls[0][0].data).not.toContain('id')
    expect(prismaSpy.mock.calls[0][0].data?.editedAt).not.toBe(0)
    expect(prismaSpy.mock.calls[0][0].data?.priority).not.toBe(2)
    expect([-1, 0, 1]).toContain(prismaSpy.mock.calls[0][0].data?.priority)
  });


  // UPDATE
  test('update', async () => {
    prismaMock.task.update.mockResolvedValue({ ...returnedTestTask });
    const prismaSpy = vi.spyOn(prisma.task, 'update');

    const res = await taskHandlers.updateTask({ 
      ...clientTask,
      id: 22,
      title: 'test-title-2',
      editedAt: 0,
    })
    expect(res).toEqual(returnedTestTask);
    expect(prismaSpy.mock.calls[0][0].where?.id).toBe(22)
    expect(prismaSpy.mock.calls[0][0].data?.title).toBe('test-title-2')
  });

  test('update with invalid priority', async () => {
    prismaMock.task.update.mockResolvedValue({ ...returnedTestTask });
    const prismaSpy = vi.spyOn(prisma.task, 'update');

    const res = await taskHandlers.updateTask({ 
      ...clientTask,
      id: 22,
      title: 'test-title-2',
      editedAt: 0,
      priority: 2,
    })
    expect(res).toEqual(returnedTestTask);
    expect(prismaSpy.mock.calls[0][0].where?.id).toBe(22)
    expect(prismaSpy.mock.calls[0][0].data?.title).toBe('test-title-2')
    expect(prismaSpy.mock.calls[0][0].data?.editedAt).not.toBe(0)
    expect(prismaSpy.mock.calls[0][0].data?.priority).not.toBe(2)
  });

  test('update nonexisting', async () => {
    prismaMock.task.update.mockRejectedValue('error');

    const wrap = async () => {
      return await taskHandlers.updateTask({ 
        ...clientTask,
        id: 22,
        title: 'test-title-2',
        editedAt: 0,
      })
    }
    expect(wrap).rejects.toEqual('error')
  });


  // DELETE
  test('delete', async () => {
    prismaMock.task.delete.mockResolvedValue({ ...returnedTestTask });
    const prismaSpy = vi.spyOn(prisma.task, 'delete');

    const res = await taskHandlers.deleteTask({ 
      ...clientTask,
      id: 22,
    })
    expect(res).toEqual(returnedTestTask);
    expect(prismaSpy.mock.calls[0][0].where?.id).toBe(22)
  });

  test('delete nonexisting', async () => {
    prismaMock.task.delete.mockRejectedValue('error');

    const wrap = async () => {
      return await taskHandlers.deleteTask({ 
        ...clientTask,
        id: 22,
      })
    }
    expect(wrap).rejects.toEqual('error')
  });
});

