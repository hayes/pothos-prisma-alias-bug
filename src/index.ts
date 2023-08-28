import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtilsPlugin from '@pothos/plugin-prisma-utils';
import RelayPlugin from '@pothos/plugin-relay';
import { PrismaClient } from '../prisma/client';
import PrismaTypes from '../prisma/generated';
import { DateResolver } from 'graphql-scalars';

const prisma = new PrismaClient();

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: { Input: Date; Output: Date };
    ID: { Input: string; Output: string | number };
  };
}>({
  relayOptions: {
    cursorType: 'String',
    clientMutationId: 'omit',
  },
  prisma: {
    client: prisma,
  },
  plugins: [PrismaPlugin, RelayPlugin, PrismaUtilsPlugin],
});

builder.addScalarType('Date', DateResolver, {});

builder.queryType({
  fields: (t) => ({
    account: t.prismaField({
      type: 'Account',
      args: {
        id: t.arg.id({ required: true }),
      },
      nullable: true,
      resolve: (query, root, args) => {
        return prisma.account.findUnique({ ...query, where: { id: Number.parseInt(args.id, 10) } });
      },
    }),
  }),
});

const AccountValuesFilter = builder.prismaWhere('Value', {
  fields: (t) => ({
    date: builder.prismaFilter('Date', {
      ops: ['gte', 'lte', 'equals'],
    }),
  }),
});

builder.prismaObject('Account', {
  name: 'Property',
  fields: (t) => ({
    id: t.exposeID('id'),
    values: t.relatedConnection('values', {
      cursor: 'id',
      totalCount: true,
      defaultSize: 10000,
      args: {
        filter: t.arg({ type: AccountValuesFilter }),
      },
      query: (args) => {
        console.log('-> args', args);
        return {
          where: args.filter ?? {},
        };
      },
    }),
  }),
});

builder.prismaObject('Value', {
  fields: (t) => ({
    id: t.exposeID('id'),
    value: t.exposeString('value'),
    date: t.expose('date', {
      type: 'Date',
    }),
  }),
});

const schema = builder.toSchema({});

const query = /* graphql */ `
  query {
    account(id: 1) {
      values(first: 2) {
        edges {
          node {
            id
            value
            date
          }
        }
      }
      values2: values(first: 2, filter: { date: { lte: "2020-05-01" } }) {
        edges {
          node {
            id
            value
            date
          }
        }
      }
    }
  }
`;

const yoga = createYoga({
  schema,
  graphiql: {
    defaultQuery: query,
  },
});

const server = createServer(yoga);

const port = 3000;

server.listen(port, () => console.log(`Server is running on http://localhost:${port}/graphql`));
