// const fs = require('fs');
// const { faceCapture, faceVerify } = require('../utils/faceRecognition');  // We'll define these functions in a utils file
// const User = require('../models/User');

// // Registration Route Controller - Process face capture
// async function registerUser(req, res) {
//   try {
//     const { username, email, password } = req.body;
//     const faceImage = req.file;

//     if (!faceImage) {
//       return res.status(400).json({ error: 'Face image is required' });
//     }

//     // Process face image to extract face embeddings (features)
//     const faceEmbedding = await faceCapture(faceImage.path);
    
//     // Save the user data, including the face embedding in the database
//     const newUser = new User({
//       username,
//       email,
//       password,  // Don't forget to hash the password before saving
//       faceEmbedding,
//     });

//     await newUser.save();
//     fs.unlinkSync(faceImage.path); // Delete the temporary image after processing

//     return res.status(201).json({ message: 'User registered successfully, proceed with face verification' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'An error occurred during registration' });
//   }
// }

// // Login Route Controller - Handle face verification
// async function verifyFace(req, res) {
//   try {
//     const { userId } = req.body;  // User ID is passed from frontend after login
//     const faceImage = req.file;

//     if (!faceImage) {
//       return res.status(400).json({ error: 'Face image is required' });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     // Verify the face by comparing the uploaded image to the stored face embedding
//     const isVerified = await faceVerify(faceImage.path, user.faceEmbedding);

//     fs.unlinkSync(faceImage.path); // Delete the temporary image after processing

//     if (isVerified) {
//       return res.status(200).json({ message: 'Face verification successful', userId: user._id });
//     } else {
//       return res.status(400).json({ error: 'Face verification failed' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'An error occurred during face verification' });
//   }
// }

// module.exports = {
//   registerUser,
//   verifyFace,
// };



//.

// const User = require('../models/user.model');
// const faceapi = require('face-api.js');
// const { Canvas, Image } = require('canvas');
// const path = require('path');

// // Face-api.js setup
// faceapi.env.monkeyPatch({ Canvas, Image });
// faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
// faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
// faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

// const storeFaceData = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const imgPath = path.join(__dirname, '../uploads', req.file.filename);
//     const image = await faceapi.bufferToImage(imgPath);

//     const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

//     if (!detections) {
//       return res.status(400).json({ error: 'No face detected' });
//     }

//     // Store face descriptor in the user document
//     await User.findByIdAndUpdate(userId, { faceDescriptor: detections.descriptor });

//     res.status(200).json({ message: 'Face data captured successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error capturing face data' });
//   }
// };

// module.exports = { storeFaceData };



//.
const Jimp = require('jimp').default; // or try require('jimp').default if needed

async function faceRecognition(req, res) {
  try {
    // Remove the 'data:image/png;base64,' part if it exists
    const base64Image = req.body.image.split(',')[1];
    const buffer = Buffer.from(base64Image, 'base64');

    // Try reading the image with Jimp
    const image = await Jimp.read(buffer);

    // Resize or process as needed
    image.resize(200, 200).grayscale();

    // (Optional) Save the processed image
    await image.writeAsync(`./images/face.png`);

    res.status(200).json({ message: 'Face captured and processed successfully' });
  } catch (error) {
    console.error('Face recognition error:', error);
    res.status(500).json({ error: 'Face recognition failed' });
  }
}

module.exports = { faceRecognition };


