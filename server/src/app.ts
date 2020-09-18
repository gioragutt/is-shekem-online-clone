import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql-schema';

export const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
