import * as dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
};

export default env;
