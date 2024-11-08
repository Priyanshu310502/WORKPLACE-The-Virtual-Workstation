// // const Room = require('../models/room.model')
// // const { model: User } = require('../models/user.model')
// // const { v4: uuidv4 } = require('uuid')
// // const { redisClient } = require('../redis.config')

// // const createRoomService = async (req, res) => {
// //   const { username, name, isPublic, description } = req.body
// //   const user = await User.findOne({ username: username })
// //   const queueId = `queue:${uuidv4()}`
// //   console.log("queueId ye se",queueId)
// //   try {
// //     // const newQueue = await Queue.create({});

// //     await redisClient.json.set(queueId, '.', {
// //       _id: queueId,
// //       songs: [],
// //       members: []
// //     })
// //     const value = await redisClient.json.get(queueId)

// //     console.log(`value of playlist: ${JSON.stringify(value)}`)
// //     const newRoom = await Room.create({
// //       name: name,
// //       description: description,
// //       isPublic: isPublic,
// //       createdBy: username,
// //       members: [user],
// //       queue: queueId
// //     })
// //     res.status(201).json({
// //       status: 'ok',
// //       data: {
// //         roomId: newRoom._id
// //       }
// //     })
// //   } catch (err) {
// //     console.log("error occure", err);
// //     res.status(500).json({ err: 'Error! Cannot create room' })
// //   }
// // }

// // module.exports = {
// //   createRoomService
// // }


// //.

// const Room = require('../models/room.model');
// const { model: User } = require('../models/user.model');
// const { v4: uuidv4 } = require('uuid');
// const { redisClient } = require('../redis.config');

// const createRoomService = async (req, res) => {
//   const { username, name, isPublic, description } = req.body;
//   const user = await User.findOne({ username: username });
//   const queueId = `queue:${uuidv4()}`;
//   console.log("Generated queueId:", queueId);

//   try {
//     // Save the queue object in Redis JSON format
//     await redisClient.json.set(queueId, '.', {
//       _id: queueId,
//       songs: [],
//       members: []
//     });

//     // Verify data by retrieving it from Redis
//     const value = await redisClient.json.get(queueId);
//     console.log(`Value of playlist in Redis: ${JSON.stringify(value)}`);

//     // Create a new room document in MongoDB
//     const newRoom = await Room.create({
//       name: name,
//       description: description,
//       isPublic: isPublic,
//       createdBy: username,
//       members: [user],
//       queue: queueId
//     });

//     // Send a successful response with the room ID
//     res.status(201).json({
//       status: 'ok',
//       data: { roomId: newRoom._id }
//     });
//   } catch (err) {
//     console.log("Error occurred:", err.message);
//     res.status(500).json({ err: 'Error! Cannot create room' });
//   }
// };

// module.exports = {
//   createRoomService
// };


//.
const Room = require('../models/room.model');
const { model: User } = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const { redisClient } = require('../redis.config');

const createRoomService = async (req, res) => {
  const { username, name, isPublic, description } = req.body;
  const user = await User.findOne({ username: username });
  const queueId = `queue:${uuidv4()}`;
  console.log("Generated queueId:", queueId);

  try {
    // Stringify JSON data to store it as a simple string
    await redisClient.set(queueId, JSON.stringify({
      _id: queueId,
      songs: [],
      members: []
    }));

    // Retrieve and parse JSON data from Redis
    const value = JSON.parse(await redisClient.get(queueId));
    console.log(`Value of playlist: ${JSON.stringify(value)}`);

    // Save room data in MongoDB
    const newRoom = await Room.create({
      name: name,
      description: description,
      isPublic: isPublic,
      createdBy: username,
      members: [user],
      queue: queueId
    });

    res.status(201).json({
      status: 'ok',
      data: {
        roomId: newRoom._id
      }
    });
  } catch (err) {
    console.log("Error occurred:", err);
    res.status(500).json({ err: 'Error! Cannot create room' });
  }
};

module.exports = {
  createRoomService
};
