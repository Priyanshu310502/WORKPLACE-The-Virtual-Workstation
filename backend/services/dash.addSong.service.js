// const { redisClient } = require('../redis.config')

// const addSongService = async (req, res) => {
//   const { username, queueId, songTitle, channelName, thumbnailUrl, videoId } = req.body
//   try {
//     await redisClient.json.ARRAPPEND(queueId, '.songs', {
//       songTitle,
//       channelName,
//       thumbnailUrl,
//       videoId,
//       addedBy: username
//     })
//     res.status(200).json({
//       status: 'ok'
//     })
//   } catch (err) {
//     console.log(err.message)
//     res.status(500).json({ err: err.message })
//   }
// }

// module.exports = {
//   addSongService
// }


const { redisClient } = require('../redis.config');

const addSongService = async (req, res) => {
  const { username, queueId, songTitle, channelName, thumbnailUrl, videoId } = req.body;

  try {
    // Retrieve and parse the existing queue data from Redis
    let queueData = await redisClient.get(queueId);
    queueData = queueData ? JSON.parse(queueData) : { _id: queueId, songs: [], members: [] };

    // Create a new song object
    const newSong = {
      songTitle,
      channelName,
      thumbnailUrl,
      videoId,
      addedBy: username
    };

    // Append the new song to the songs array
    queueData.songs.push(newSong);

    // Save the updated queue data back to Redis
    await redisClient.set(queueId, JSON.stringify(queueData));

    res.status(200).json({
      status: 'ok'
    });
  } catch (err) {
    console.log("Error occurred:", err.message);
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  addSongService
};
