const bcrypt = require('bcrypt');
const User = require('../models/user');
const ValidationError = require('../middlewares/errors/ValidationError');
const AuthError = require('../middlewares/errors/AuthError');
const DuplicateErrorCode = require('../middlewares/errors/DuplicateErrorCode');
const { creatureToken } = require('../utils/jwt');
const {
  MONGO_DUPLICATE_ERROR_CODE,
  SALT_ROUNDS,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS).then((hash) => User.create({
    email, name, password: hash,
  }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new DuplicateErrorCode('Пользователь с этим Email уже зарегистрирован, введите другой Email для регистрации'));
      } if (err.name === 'ValidationError') {
        next(new ValidationError('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Передан неверный email или пароль');
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordTrue]) => {
      if (!isPasswordTrue) {
        throw new AuthError('Передан неверный email или пароль');
      }
      const token = creatureToken({ _id: user._id });
      res.send({ token });
    })
    .catch(next);
};
