import 'reflect-metadata';
import 'module-alias/register';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import toobusy from 'toobusy-js';
import compression from 'compression';
// import { connectToDatabase } from './database/utils';
import connectionDb from './database/connection';
import { ApiError, NotFoundError } from './utils/apiError';
import { asyncWrapper } from './utils/asyncWrapper';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from './utils/ErrorHandler';
import RequestValidator from './validators/RequestValidator';
import { CreateTestRequest } from './validators/createTestRequest';
import { Logger } from './logger';
const conf: any = dotenv.config().parsed;

const app: Application = express();
const PORT = process.env.PORT;

// logger.error("Something went wrong")

const customFunction = async () => {
  throw new ApiError(StatusCodes.BAD_REQUEST, 'This is just a bad request!');
};

let corsOpts = {
  origin: 'http://localhost:4000',
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOpts));
app.use(Logger.getHttpLoggerInstance());
app.use(compression());

app.use(function (req: Request, res: Response, next: NextFunction) {
  if (toobusy()) {
    res.send(503);
  } else {
    next();
  }
});

const logger = Logger.getInstance();

app.get('/ping/', (req: Request, res: Response) => {
  // console.log(req.body);
  logger.profile('meaningful-name');
  // do something
  logger.profile('meaningful-name');
  res.send('pong');
});

const childLogger = logger.child({ requestId: '451' });
// childLogger.error('Something went wrong');

app.get(
  '/protected',
  asyncWrapper(async (req: Request, res: Response) => {
    // await customFunction();
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized to access this!');
  }),
);

// app.get('/protected', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     throw new ApiError(401, 'You are not authorized to access this!'); // <- fake error
//   } catch (err) {
//     next(err);
//   }
// });

app.post('/create-user', RequestValidator.validate(CreateTestRequest), async (req: Request, res: Response) => {
  res.status(200).send({
    message: 'Hello World from post!',
  });
});

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello world!',
  });
});

app.post('/post', async (req: Request, res: Response): Promise<Response> => {
  console.log(req.body);
  return res.status(200).send({
    message: 'Hello World from post!',
  });
});

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});

app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError(req.path)));

app.use(ErrorHandler.handle());

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new ApiError(404, `Requested path ${req.path} not found`);
  next(err);
});

const startServer = async () => {
  try {
    await connectionDb.sync();
    app.listen(PORT, (): void => {
      console.log(`Connected successfully on port ${PORT}`);
    });
  } catch (error: any) {
    console.error(`Error occured: ${error.message}`);
  }
};

startServer();
