import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', 'password_rahasia', {
  host: '172.17.0.2',
  dialect: 'mysql',
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
