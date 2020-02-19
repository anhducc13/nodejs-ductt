// import path from 'path';
require('dotenv').config();
const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL || 'url';
const secretKey = process.env.SECRET_KEY || "secret";
const expiredTime = process.env.EXPIRED_TIME || 10;

export default {
  environment,
  port,
  databaseUrl,
  secretKey,
  expiredTime
};
