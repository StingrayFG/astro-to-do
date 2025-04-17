import { PrismaClient } from '@prisma/client';
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended';
import { beforeEach, vi } from 'vitest';

import prisma from 'instances/prisma';

vi.mock('instances/prisma.ts', () => mockDeep());

beforeEach(() => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
