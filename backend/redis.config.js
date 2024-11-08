// require('dotenv').config()
// const redis = require('redis')

// const client = redis.createClient({
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     host: process.env.REDIS_HOSTNAME,
//     port: process.env.REDIS_PORT
//   }
// });
//  (async () => {
//     // client.on('error', (error) =>
//     //   console.error(`Error hai bhai isme: ${error}`)
//     // )

//     await client.connect()
//   })()

// module.exports = { redisClient: client }


// . my
// // redis.config.js
// const Redis = require('ioredis');

// const redisClient = new Redis({
//   host: 'localhost',
//   port: 6379,
//   // Any additional configurations like password, db, etc.
// });

// module.exports = { redisClient };


//.
// redis.config.js
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL // Update if using a different Redis host/port
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  await redisClient.connect();
})();

module.exports = { redisClient };


