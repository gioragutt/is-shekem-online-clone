import mongoose from 'mongoose';

const {
  MONGO_URL = 'mongodb://localhost:27017/test',
} = process.env;

export const createConnection = () => mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to mongodb'))

export * from './report.model';
