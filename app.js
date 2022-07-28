const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { dbConnect } = require('./utils/dbConfig');
const indexRouter = require('./routes/Index');

require('dotenv').config();

const options = {
  origin: {
    origin: [
      'http://localhost:3000',
      'https://titov.nomoredomains.xyz',
      'titov.nomoredomains.xyz',
      'https://praktikum.tk',
      'http://praktikum.tk',
      'localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
  credentials: true,
};

const { PORT = 3000 } = process.env;

const app = express();

app.use('*', cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbConnect, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(indexRouter);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Работа запущена, порт ${PORT}`);
});
