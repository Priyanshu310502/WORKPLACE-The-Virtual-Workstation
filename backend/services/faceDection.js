const express = require('express');
const multer = require('multer');
const path = require('path');
const faceapi = require('face-api.js');
const { Canvas, Image } = require('canvas');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load face-api models
faceapi.env.monkeyPatch({ Canvas, Image });
faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

app.post('/api/auth/face-recognition', upload.single('image'), async (req, res) => {
  try {
    const imgPath = path.join(__dirname, req.file.path);
    const image = await canvas.loadImage(imgPath);
    const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

    if (!detections) {
      return res.status(400).json({ message: 'No face detected' });
    }

    // Match the captured face with stored faces (in MongoDB or other storage)
    const isMatch = await matchFace(detections);
    if (isMatch) {
      return res.status(200).json({ message: 'Face authenticated successfully!' });
    } else {
      return res.status(401).json({ message: 'Face authentication failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during face recognition' });
  }
});

// Function to match face with stored data (face embeddings in MongoDB)
const matchFace = async (detectedFace) => {
  // This is where you compare detected face descriptor with stored descriptors
  const storedFace = await getStoredFace();  // Implement a function to retrieve stored face data from MongoDB
  return compareFaceDescriptors(detectedFace.descriptor, storedFace.descriptor);  // Compare the face embeddings
};

const getStoredFace = async () => {
  // Fetch user face embeddings from MongoDB or another storage
  return { descriptor: [/* Pre-stored face descriptor */] };
};

const compareFaceDescriptors = (desc1, desc2) => {
  // Compare the face descriptors, using a threshold to determine a match
  const threshold = 0.6;
  const distance = faceapi.euclideanDistance(desc1, desc2);
  return distance < threshold;
};

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
