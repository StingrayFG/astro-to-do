import { describe, test, expect, vi } from 'vitest'
import type { Task } from '@prisma/client';

import { prismaMock } from 'utils/mock-prisma';
import { taskHandlers } from './taskHandlers';


describe('taskActions', async () => {
  // SETUP
  const clientTask = {
    id: -1,
    title: 'test-title',
    contents: 'test-contents',
    priority: 0,
    isComplete: false,
    editedAt: 0,
  }  
  
  const serverTestTask: Task = {
    id: 11,
    title: 'test-title-server',
    contents: 'test-contents-server',
    priority: 1,
    isComplete: true,
    editedAt: 171000000,
  }


  // TESTS
  test('get all', async () => {
    prismaMock.task.findMany.mockResolvedValue([ { ...serverTestTask } ]);

    const res = await taskHandlers.getAllTasks();
    expect(res).toStrictEqual([ serverTestTask ]);
  });

  test('get by id', async () => {
    prismaMock.task.findUnique.mockResolvedValue({ ...serverTestTask });

    const res = await taskHandlers.getTaskById(11);
    expect(res).toStrictEqual(serverTestTask);
  });


  test('add', async () => {
    prismaMock.task.create.mockResolvedValue({ ...serverTestTask });

    const res = await taskHandlers.addTask(clientTask);
    expect(res).toEqual(serverTestTask);
  });

  test('update', async () => {
    prismaMock.task.update.mockResolvedValue({ ...serverTestTask });

    const res = await taskHandlers.updateTask(clientTask)
    expect(res).toEqual(serverTestTask);
  });

  test('delete', async () => {
    prismaMock.task.delete.mockResolvedValue({ ...serverTestTask });

    const res = await taskHandlers.deleteTask(clientTask);
    expect(res).toEqual(serverTestTask);
  });
});

