/* eslint-disable no-await-in-loop */
/* eslint-disable no-magic-numbers */
import { faker } from '@faker-js/faker';
import { PrismaClient } from './client';

const prisma = new PrismaClient();

faker.seed(123);

async function main() {}

void main()
  .then(() => void console.log('DB seeded with test data'))
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(() => void prisma.$disconnect());
