const Movies = require('../models/movies');
const NoteFoundsError = require('../middlewares/errors/NoteFoundsError');
const ValidationError = require('../middlewares/errors/ValidationError');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.saveMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovies = (req, res, next) => {
  const cardRemove = () => {
    Movies.findOneAndDelete({ movieId: req.params.movieId })
      .then((movie) => {
        if (!movie) {
          throw new NoteFoundsError('Карточка с указанным _id не найдена.');
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(next);
  };

  Movies.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NoteFoundsError('Передан несуществующий _id карточки.');
      }
      if (req.user._id === movie.owner.toString()) {
        cardRemove(movie.movieId);
      } else {
        throw new ForbiddenError(
          'Карточка не содержит указанный идентификатор пользователя.',
        );
      }
    })
    .catch(next);
};
