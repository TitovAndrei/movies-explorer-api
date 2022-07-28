const mongoose = require('mongoose');
const validator = require('validator');

const userShema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введенный Вами адрес электронной почты не соответствует необходимому формату.',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userShema);
