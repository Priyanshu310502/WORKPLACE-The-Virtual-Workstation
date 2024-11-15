// import React, { useState, useRef, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import './faceverify.css';
// import { toast } from 'react-toastify';

// const FaceVerification = () => {
//   const [error, setError] = useState(null);
//   const [imageSrc, setImageSrc] = useState(null);
//   const [message, setMessage] = useState(null);
//   const webcamRef = useRef(null);

//   // Capture function to take a screenshot from the webcam
//   const capture = useCallback(() => {
//     const capturedImageSrc = webcamRef.current.getScreenshot();
//     setImageSrc(capturedImageSrc);
//   }, [webcamRef]);

//   // Function to send the captured image to backend for saving face data
//   const handleCaptureFace = async () => {
//     try {
//       if (!imageSrc) {
//         throw new Error("No image captured.");
//       }

//       const faceImage = imageSrc.split(',')[1]; // Remove the prefix from base64 data
//       const response = await axios.post('http://localhost:5000/api/capture-face', {
//         image: `data:image/png;base64,${faceImage}`
//       });

//       setMessage(response.data.message);
//       setError(null); // Clear any previous errors
//       toast.success(response.data.message);
//     } catch (error) {
//       console.error("Capture error:", error);
//       const errorMessage = error.response?.data?.error || 'Error capturing face.';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     }
//   };

//   // Function to send the captured image to backend for face verification
//   const handleVerifyFace = async () => {
//     try {
//       if (!imageSrc) {
//         throw new Error("No image captured.");
//       }

//       const faceImage = imageSrc.split(',')[1]; // Extract base64 part only
//       // console.log("Sending verification request with image base64 data:", faceImage);

//       const response = await axios.post('http://localhost:5000/api/verify-face', {
//         image: `data:image/png;base64,${faceImage}`
//       });

//       console.log("Verification response from backend:", response.data);
//       setMessage(response.data.message);
//       setError(null); // Clear any previous errors
//       toast.success(response.data.message);
//     } catch (error) {
//       console.error("Verification error:", error);
//       const errorMessage = error.response?.data?.error || 'Error verifying face.';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="face-verification-container">
//       <h1 className="heading">Face Verification</h1>

//       <div className="webcam-container">
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/png"
//           width="100%"
//           videoConstraints={{ facingMode: 'user' }}
//           className="webcam"
//         />
//       </div>

//       <div className="action-buttons">
//         <button className="capture-btn" onClick={capture}>
//           Capture Face
//         </button>
//         {imageSrc && <img src={imageSrc} alt="Captured Face" className="captured-image" />}

//         <button className="save-btn" onClick={handleCaptureFace} disabled={!imageSrc}>
//           Save Face
//         </button>
//         <button className="verify-btn" onClick={handleVerifyFace} disabled={!imageSrc}>
//           Verify Face
//         </button>
//       </div>

//       {error && <p className="error-message">{error}</p>}
//       {message && <p className="success-message">{message}</p>}
//     </div>
//   );
// };

// export default FaceVerification;





import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import './faceverify.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FaceVerification = () => {
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [message, setMessage] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // New state for capture and verify actions
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [facesDetected, setFacesDetected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      setModelLoading(false); // Set model loading state to false after loading
    };
    loadModels();
  }, []);

  const detectFace = async () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    if (resizedDetections.length > 0) {
      setFacesDetected(resizedDetections.map(detection => detection.box));
    } else {
      setFacesDetected([]);
    }
  };

  useEffect(() => {
    if (modelLoading) return;
    const intervalId = setInterval(() => {
      detectFace();
    }, 100);

    return () => clearInterval(intervalId);
  }, [modelLoading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas on each update
    if (facesDetected.length > 0) {
      facesDetected.forEach(face => {
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 4;
        ctx.strokeRect(face.x, face.y, face.width, face.height);
      });
    }
  }, [facesDetected]);

  const capture = useCallback(() => {
    setImageSrc(webcamRef.current.getScreenshot());
  }, [webcamRef]);

  const handleCaptureFace = async () => {
    try {
      setActionLoading(true); // Set loading state for capture action
      if (!imageSrc) throw new Error("No image captured.");

      const faceImage = imageSrc.split(',')[1];
      const response = await axios.post('http://localhost:5000/api/capture-face', {
        image: `data:image/png;base64,${faceImage}`
      });

      setMessage(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || 'Error capturing face.');
      toast.error(error.response?.data?.error || 'Error capturing face.');
    } finally {
      setActionLoading(false); // Reset loading state after capture action
    }
  };

  const handleVerifyFace = async () => {
    try {
      setActionLoading(true); // Set loading state for verify action
      if (!imageSrc) throw new Error("No image captured.");

      const faceImage = imageSrc.split(',')[1];
      const response = await axios.post('http://localhost:5000/api/verify-face', {
        image: `data:image/png;base64,${faceImage}`
      });

      setMessage(response.data.message);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error verifying face.');
      toast.error(error.response?.data?.error || 'Error verifying face.');
    } finally {
      setActionLoading(false); // Reset loading state after verify action
    }
  };

  return (
    <div className="face-verification-container">
      <h1 className="heading">Face Verification</h1>
      {modelLoading && <p>Loading model...</p>} {/* Show loading message for model */}

      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width="100%"
          videoConstraints={{ facingMode: 'user' }}
          className="webcam"
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: facesDetected.length > 0 ? 'block' : 'none',
          }}
        />
      </div>

      <div className="action-buttons">
        <button className="capture-btn" onClick={capture} disabled={actionLoading}>
          {actionLoading ? 'Capturing...' : 'Capture Face'}
        </button>
        {imageSrc && <img src={imageSrc} alt="Captured Face" className="captured-image" />}
        <button className="save-btn" onClick={handleCaptureFace} disabled={!imageSrc || actionLoading}>
          {actionLoading ? 'Saving...' : 'Save Face'}
        </button>
        <button className="verify-btn" onClick={handleVerifyFace} disabled={!imageSrc || actionLoading}>
          {actionLoading ? 'Verifying...' : 'Verify Face'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default FaceVerification;
