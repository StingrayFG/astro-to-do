import { writable } from 'svelte/store';

import type { Task } from '@prisma/client';


export const allTasksStore = writable<Array<Task>>()

export const selectedTaskStore = writable<Task | null>()

export const isViewerOpenStore = writable<Boolean>(false)
