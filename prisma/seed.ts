/* eslint-disable no-await-in-loop */
/* eslint-disable no-magic-numbers */
import { faker } from '@faker-js/faker';
import { PrismaClient } from './client';

const prisma = new PrismaClient();

faker.seed(123);

async function main() {
  for (let i = 1; i <= 10; i += 1) {
    const values: { date: Date; value: string }[] = [];

    for (let j = 0; j < 10; j += 1) {
      values.push({
        value: faker.string.alpha(10),
        date: faker.date.past({ refDate: new Date(2021, 0, 1) }),
      });
    }
    await prisma.account.create({
      data: {
        id: i,
        name: faker.person.firstName(),
        values: {
          create: values,
        },
      },
    });
  }
}

void main()
  .then(() => void console.log('DB seeded with test data'))
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(() => void prisma.$disconnect());
