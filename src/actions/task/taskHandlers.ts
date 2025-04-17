import prisma from 'instances/prisma'

import type { Task } from '@prisma/client'



// HANDLERS
const handleGetAllTasks = async (): Promise<(Array<Task> | string)> =>  {
  return new Promise(async (resolve, reject) => { 
    await prisma.task.findMany({
      orderBy: [
        {
          editedAt: 'desc',
        },
      ],
    })
    .then((res: Array<Task>) => {
      console.log(res)
      resolve(res)
    })
    .catch((err: any) => {
      console.log(err)
      reject(err.toString())
    })
  })
}

const handleGetTaskById = async (input: number): Promise<(Task | null | string)> =>  {
  return new Promise(async (resolve, reject) => { 
    await prisma.task.findUnique({
      where: {
        id: input
      }
    })
    .then((res: Task | null) => {
      console.log(res)
      resolve(res)
    })
    .catch((err: any) => {
      console.log(err)
      reject(err.toString())
    })
  })
}


const handleAddTask = async (input: Task): Promise<Task> =>  {
  return new Promise(async (resolve, reject) => { 
    await prisma.task.create({
      data: {
        title: input.title,
        contents: input.contents,
        priority: input.priority,
        isComplete: input.isComplete,
        editedAt: Math.floor(Date.now() / 1000)
      }
    })
    .then((res: Task) => {
      console.log(res)
      resolve(res)
    })
    .catch((err: any) => {
      console.log(err)
      reject(err.toString())
    })
  })
}

const handleUpdateTask = async (input: Task): Promise<Task> =>  {
  return new Promise(async (resolve, reject) => { 
    await prisma.task.update({
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
    .then((res: Task) => {
      console.log(res)
      resolve(res)
    })
    .catch((err: any) => {
      console.log(err)
      reject(err.toString())
    })
  })
}


const handleDeleteTask = async (input: Task): Promise<Task> =>  {
  return new Promise(async (resolve, reject) => { 
    await prisma.task.delete({
      where: {
        id: input.id
      },
    })
    .then((res: Task) => {
      console.log(res)
      resolve(res)
    })
    .catch((err: any) => {
      console.log(err)
      reject(err.toString())
    })
  })
}


// 
export const taskHandlers = {
  getAllTasks: handleGetAllTasks,
  getTaskById: handleGetTaskById,
  addTask: handleAddTask,
  updateTask: handleUpdateTask,
  deleteTask: handleDeleteTask,
}
