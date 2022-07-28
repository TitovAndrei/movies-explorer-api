const validator = require('validator');
const BadRequestError = require('../middlewares/errors/BadRequestError');

module.exports.isValidationEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Некорректная ссылка');
  }
  return email;
};
