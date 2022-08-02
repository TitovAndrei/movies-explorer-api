const validator = require('validator');
const BadRequestError = require('../middlewares/errors/BadRequestError');

module.exports.isValidationUrl = (url) => {
  if (!validator.isURL(url)) {
    throw new BadRequestError('Некорректная ссылка');
  }
  return url;
};
