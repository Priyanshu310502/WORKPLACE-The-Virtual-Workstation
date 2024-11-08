const mongoose = require('mongoose');
mongoose.set('strictQuery', true);  // or set to false if you prefer


async function connectToMongoDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB using Mongoose");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

module.exports = connectToMongoDB;







// mongoose
//   .connect(process.env.DB_CONNECT)
//   .then(() => {
//     console.log('Mongo Connection Successful!');
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//   });
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });