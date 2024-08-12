import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';
import WithInputPlugin from '@pothos/plugin-with-input';
import { DateTimeResolver, JSONResolver } from 'graphql-scalars';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtilsPlugin from '@pothos/plugin-prisma-utils';
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import TracingPlugin, { isRootField } from '@pothos/plugin-tracing';
import ValidationPlugin from '@pothos/plugin-zod';
import { createSentryWrapper } from '@pothos/tracing-sentry';
import type PrismaTypes from '../prisma/generated';
import { Prisma, PrismaClient } from '../prisma/client';

const db = new PrismaClient();

const traceResolver = createSentryWrapper({
  includeArgs: true,
  includeSource: true,
});

const builder = new SchemaBuilder<{
  AuthScopes: {};
  Context: {};
  Objects: {};
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: {
      Output: number | string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
    JSONObject: {
      Input: any;
      Output: any;
    };
  };
  Tracing: boolean | { formatMessage: (duration: number) => string };
}>({
  plugins: [
    TracingPlugin,
    WithInputPlugin,
    RelayPlugin,
    ScopeAuthPlugin,
    PrismaPlugin,
    PrismaUtilsPlugin,
    ValidationPlugin,
  ],
  relay: {
    cursorType: 'ID',
  },
  scopeAuth: {
    cacheKey: (value) => JSON.stringify(value),
    authScopes: async (context) => ({}),
  },
  prisma: {
    client: db,
    dmmf: Prisma.dmmf,
  },
  tracing: {
    default: (config) => isRootField?.(config),
    wrap: (resolver, options) => traceResolver(resolver, options),
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType('DateTime', DateTimeResolver, {});
builder.addScalarType('JSONObject', JSONResolver, {});

builder.prismaObject('Comment', {
  fields: (t) => ({
    comment: t.exposeString('comment', {}),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

const schema = builder.toSchema({});

const query = /* graphql */ `
  query {
    user {
      id
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

const port = 4000;

server.listen(port, () => console.log(`Server is running on http://localhost:${port}/graphql`));
