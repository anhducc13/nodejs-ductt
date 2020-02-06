import path from 'path';
require('dotenv').config({path: path.join(__dirname, '../', '.env') });
export const environment = process.env.NODE_ENV || 'development';
export const port = process.env.PORT || 3000;
export const databaseUrl = process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/books';

export default {
  environment,
  port,
  databaseUrl,
}
