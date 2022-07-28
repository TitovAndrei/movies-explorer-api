const Movies = require('../models/movies');
const NoteFoundsError = require('../middlewares/errors/NoteFoundsError');
const ValidationError = require('../middlewares/errors/ValidationError');
const BadPasswordError = require('../middlewares/errors/BadPasswordError');

module.exports.getMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.status(200).send(movies))
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
    nameRU,
    nameEN,
    thumbnail,
    movieId,
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
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
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
    Movies.findByIdAndDelete(req.params.movieId)
      .then((movie) => {
        if (!movie) {
          throw new NoteFoundsError('Карточка с указанным _id не найдена.');
        }
        res.status(200).send({ message: 'Карточка удалена' });
      })
      .catch(next);
  };

  Movies.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NoteFoundsError('Передан несуществующий _id карточки.');
      } if (req.user._id === movie.owner.toString()) {
        cardRemove();
      } else {
        throw new BadPasswordError('Карточка не содержит указанный идентификатор пользователя.');
      }
    })
    .catch(next);
};