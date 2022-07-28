const { NODE_ENV } = process.env;
const dbDefaultConnect = 'mongodb://localhost:27017/bitfilmsdb';
const dbProductionConnect = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const dbConnect = NODE_ENV === 'production' ? dbProductionConnect : dbDefaultConnect;

module.exports = { dbConnect };
