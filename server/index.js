const server = require('frappejs/server');
const postStart = require('./postStart');

async function start() {
  await server.start({
    backend: 'mysql',
    connectionParams: { db_name="smallbm", username="root", password="Olimpo452", host="127.0.0.1" },
    models: require('../models')
  });
  // await server.start({
  //   backend: 'sqlite',
  //   connectionParams: { dbPath: 'test.db', enableCORS: true },
  //   models: require('../models')
  // });

  await postStart();
}

start();

module.exports = {
  start
};
