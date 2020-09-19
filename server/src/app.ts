import cors from 'cors';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { mutation } from './mutation';
import { query } from './query';

const schema = new GraphQLSchema({
  query,
  mutation,
});

export const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
