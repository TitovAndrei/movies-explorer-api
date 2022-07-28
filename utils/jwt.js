const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'develop';
const creatureToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7 day' });
const checkToken = (token) => jwt.verify(token, SECRET_KEY);

module.exports = { creatureToken, checkToken };
