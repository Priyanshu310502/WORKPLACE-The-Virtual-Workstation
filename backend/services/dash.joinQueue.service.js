// const { model: User } = require('../models/user.model')
// const { redisClient } = require('../redis.config')

// const joinQueueService = async (req, res) => {
//   const { username, queueId } = req.body
//   const user = await User.findOne({ username: username })
//   console.log("username kya hai", user);
//   try {
//     await redisClient.json.ARRAPPEND(queueId, '.members', user)
//     res.status(200).json({
//       status: 'ok'
//     })
//   } catch (err) {
//     console.log(err.message)
//     res.status(500).json({ err: err.message })
//   }
// }

// module.exports = {
//   joinQueueService
// }


//.
const { model: User } = require('../models/user.model');
const { redisClient } = require('../redis.config');

const joinQueueService = async (req, res) => {
  const { username, queueId } = req.body;
  const user = await User.findOne({ username: username });
  console.log("Fetched user:", user);

  try {
    // Retrieve and parse the existing queue data from Redis
    let queueData = await redisClient.get(queueId);
    queueData = queueData ? JSON.parse(queueData) : { _id: queueId, songs: [], members: [] };

    // Append the user to the members array
    queueData.members.push(user);

    // Save the updated data back to Redis
    await redisClient.set(queueId, JSON.stringify(queueData));

    res.status(200).json({
      status: 'ok'
    });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  joinQueueService
};
