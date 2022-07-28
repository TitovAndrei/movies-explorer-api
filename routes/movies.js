const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { isValidationUrl } = require('../utils/isValidationUrl');

const {
  getMovies, saveMovies, deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().custom(isValidationUrl).required(),
      trailerLink: Joi.string().custom(isValidationUrl).required(),
      thumbnail: Joi.string().custom(isValidationUrl).required(),
      movieId: Joi.string().length(24).hex().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  saveMovies,
);

router.delete(
  '/_id/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovies,
);

module.exports = router;
