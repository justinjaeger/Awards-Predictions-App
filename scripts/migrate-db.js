const path = require('path')
const envPath = path.resolve(process.cwd(), '.env.local')

console.log({ envPath })

require('dotenv').config({ path: envPath })

const mysql = require('serverless-mysql')

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
})

async function query(q) {
  try {
    console.log('trying...')
    const results = await db.query(q) // this is the line it gets stuck on
    console.log('ending...')
    await db.end()
    return results
  } catch (e) {
    throw Error(e.message)
  }
}

// Create "entries" table if doesn't exist
async function migrate() {
  try {
    console.log('attempting migration...')
    await query(`
    CREATE TABLE IF NOT EXISTS 'users' (
      'user_id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      'email' VARCHAR(100) UNIQUE NOT NULL,
      'username' VARCHAR(20) UNIQUE NOT NULL,
      'password' VARCHAR(100) NOT NULL,
      'admin' BIT(1) DEFAULT 0,
      'authenticated' BIT(1) DEFAULT 0,
      'image' VARCHAR(10000),
      'dateCreated' DATETIME,
      'lastLoggedIn' DATETIME
    );

    CREATE TABLE IF NOT EXISTS 'tokens' (
      'access_token' VARCHAR(250) PRIMARY KEY NOT NULL,
      'user_id' INT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS 'followers' (
      'username' VARCHAR(20) NOT NULL,
      'follower' VARCHAR(20) NOT NULL,
      'dateCreated' DATETIME,
      PRIMARY KEY ('username', 'follower')
    );
    
    CREATE TABLE IF NOT EXISTS 'awardsShows' (
      'awardsShow_id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      'name' VARCHAR(100) UNIQUE NOT NULL,
      'year' INT NOT NULL,
      'open' BIT(1) DEFAULT 0,
      'dateCloses' DATETIME
    );
    
    CREATE TABLE IF NOT EXISTS 'users_awardsShows' (
      'user_id' INT NOT NULL,
      'awardsShow_id' INT NOT NULL,
      'dateCreated' DATETIME,
      PRIMARY KEY ('user_id', 'awardsShow_id')
    );
    
    CREATE TABLE IF NOT EXISTS 'awardsCategories' (
      'awardsCategory_id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      'awardsShow_id' INT NOT NULL,
      'name' VARCHAR(100) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS 'awardsContenders' (
      'awardsContender_id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      'awardsCategory_id' INT NOT NULL,
      'movie_id' INT NOT NULL,
      'person' VARCHAR(100),
      'personImage' VARCHAR(10000),
      'nomOrWin' BIT(1) DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS 'movies' (
      'movie_id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      'title' VARCHAR(100) NOT NULL,
      'director' VARCHAR(100),
      'starring' VARCHAR(1000),
      'logline' VARCHAR(1000),
      'poster' VARCHAR(10000)
    );
    
    CREATE TABLE IF NOT EXISTS 'userPredictions' (
      'userPrediction_id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      'user_id' INT NOT NULL,
      'awardsContender_id' INT NOT NULL,
      'place' INT
    );
    
    ALTER TABLE 'tokens' ADD FOREIGN KEY ('user_id') REFERENCES 'users' ('user_id');
    
    ALTER TABLE 'followers' ADD FOREIGN KEY ('username') REFERENCES 'users' ('username');
    
    ALTER TABLE 'users_awardsShows' ADD FOREIGN KEY ('user_id') REFERENCES 'users' ('user_id');
    
    ALTER TABLE 'users_awardsShows' ADD FOREIGN KEY ('awardsShow_id') REFERENCES 'awardsShows' ('awardsShow_id');
    
    ALTER TABLE 'awardsCategories' ADD FOREIGN KEY ('awardsShow_id') REFERENCES 'awardsShows' ('awardsShow_id');
    
    ALTER TABLE 'awardsContenders' ADD FOREIGN KEY ('awardsCategory_id') REFERENCES 'awardsCategories' ('awardsCategory_id');
    
    ALTER TABLE 'awardsContenders' ADD FOREIGN KEY ('movie_id') REFERENCES 'movies' ('movie_id');
    
    ALTER TABLE 'userPredictions' ADD FOREIGN KEY ('user_id') REFERENCES 'users' ('user_id');
    
    ALTER TABLE 'userPredictions' ADD FOREIGN KEY ('awardsContender_id') REFERENCES 'awardsContenders' ('awardsContender_id');
    
    ALTER TABLE 'followers' ADD FOREIGN KEY ('follower') REFERENCES 'users' ('username');
    
    CREATE UNIQUE INDEX 'followers_index_0' ON 'followers' ('username', 'follower');
    
    CREATE UNIQUE INDEX 'users_awardsShows_index_1' ON 'users_awardsShows' ('user_id', 'awardsShow_id');
    
    `)
    console.log('migration ran successfully')
  } catch (e) {
    console.error('could not run migration, double check your credentials.')
    process.exit(1)
  }
}

migrate().then(() => process.exit())
