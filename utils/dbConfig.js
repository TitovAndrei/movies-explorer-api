const { NODE_ENV, PRODUCTION_DB_URL, DEVELOP_DB_URL } = process.env;

const dbConnect = NODE_ENV === 'production' ? PRODUCTION_DB_URL : DEVELOP_DB_URL;

module.exports = { dbConnect };
