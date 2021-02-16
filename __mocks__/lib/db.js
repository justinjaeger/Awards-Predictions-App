const mysql = require('serverless-mysql')

const db = mysql({
  config: {
    host: process.env.TEST_HOST,
    database: process.env.TEST_DATABASE,
    user: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD
  }
})

exports.query = async query => {
  try {
    const results = await db.query(query)
    await db.end()
    return results
  } catch (error) {
    return { error }
  }
}
exports.isTestingDb = true;