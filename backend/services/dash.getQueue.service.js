// const { redisClient } = require('../redis.config')

// const getQueueService = async (req, res) => {
//   const { queueId } = req.params
//   try {
//     const queue = await redisClient.json.get(queueId, '.')
//     console.log("queue", queue);
//     res.status(200).json({
//       status: 'ok',
//       data: {
//         songs: queue.songs,
//         members: queue.members
//       }
//     })
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ err: 'Something went wrong yhi error' })
//   }
// }

// module.exports = {
//   getQueueService
// }




//.
const { redisClient } = require('../redis.config');

const getQueueService = async (req, res) => {
  const { queueId } = req.params;
  try {
    // Use regular `get` if JSON is unsupported
    const queueData = await redisClient.get(queueId);
    const queue = JSON.parse(queueData); // Parse JSON if needed
    console.log("queue", queue);

    res.status(200).json({
      status: 'ok',
      data: {
        songs: queue?.songs,
        members: queue?.members,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Something went wrong yhi error' });
  }
};

module.exports = { getQueueService };
