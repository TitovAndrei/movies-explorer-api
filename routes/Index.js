const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { createUser, loginUser } = require('../controllers/auth');
const usersRoutes = require('./users');
const movieRoutes = require('./movies');
const NoteFoundsError = require('../middlewares/errors/NoteFoundsError');
const auth = require('../middlewares/auth');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/movies', movieRoutes);

router.use((req, res, next) => {
  next(new NoteFoundsError('Страницы не существует'));
});

module.exports = router;
