const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, updateUserProfile,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUserProfile,
);

module.exports = router;
