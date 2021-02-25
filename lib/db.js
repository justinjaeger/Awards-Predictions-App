const mysql = require('serverless-mysql')

let db;
switch(process.env.APP_ENV) {
  case 'local': 
    db = mysql({
      config: {
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
      }
    });
    break;
  case 'remote':
    db = mysql({
      config: {
        host: process.env.DO_HOST,
        database: process.env.DO_DATABASE,
        user: process.env.DO_USER,
        password: process.env.DO_PASSWORD,
        port: process.env.DO_PORT,
      }
    });
    break;
};

exports.query = async query => {
  try {
    const results = await db.query(query)
    await db.end()
    return results
  } catch (error) {
    return { error }
  }
}