import { Sequelize } from 'sequelize-typescript';

import { Test } from '@models/TestModel';

const connectionDb = new Sequelize({
  dialect: 'mysql',
  host: '172.17.0.2',
  username: 'root',
  password: 'password_rahasia',
  database: 'test_db',
  logging: false,
  models: [Test],
});

export default connectionDb;
