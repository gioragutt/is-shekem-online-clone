import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql-schema';
import cors from 'cors';

export const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
