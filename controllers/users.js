const User = require('../models/user');
const ValidationError = require('../middlewares/errors/ValidationError');
const NoteFoundsError = require('../middlewares/errors/NoteFoundsError');

module.exports.getUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError('Пользователь по указанному _id не найден.');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError('Пользователь c данными идентификатором не найден.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
};
