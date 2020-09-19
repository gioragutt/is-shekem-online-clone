import cors from 'cors';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { createConnection } from './database';
import { mutation } from './mutation';
import { query } from './query';

async function main() {
  await createConnection();

  const schema = new GraphQLSchema({
    query,
    mutation,
  });

  const app = express();

  app.use(cors());

  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
  }));

  app.listen(4000,
    () => console.log('Running a GraphQL API server at http://localhost:4000/graphql'));
}

main().catch(err => {
  console.error(err);
  process.exit();
});