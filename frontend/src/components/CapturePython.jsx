// import React, { useState } from 'react';
// import axios from 'axios';
// import FaceDetectionComponent from './webcam';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';


// const RegisterOrLogin = () => {
//   const [authResult, setAuthResult] = useState(null);
//   const navigate = useNavigate();
//   const goToProfileAfterDelay = () => {
//     setTimeout(() => {
//       navigate('/dashboard');
//     }, 2000); // 2000 milliseconds = 2 seconds
//   };

//   const handleCapture = async () => {
//     const video = document.createElement('video');
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//     video.play();

//     const canvas = document.createElement('canvas');
//     canvas.width = 200;
//     canvas.height = 200;
//     const ctx = canvas.getContext('2d');

//     setTimeout(async () => {
//       ctx.drawImage(video, 0, 0, 200, 200);
//       const imageSrc = canvas.toDataURL('image/png');
//       stream.getTracks().forEach((track) => track.stop());

//       try {
//         const response = await axios.post('http://localhost:5000/api/capture-face', { image: imageSrc });
//         setAuthResult(response.data.message);
//         toast.success("Registration successful! \nWelcome to our community!");

//       } catch (error) {
//         console.error('Error during face authentication', error);
//         setAuthResult('Error during authentication');
//       }
//     }, 2000);
//   };

//   return (
//     <div>
//       <FaceDetectionComponent onCapture={handleCapture} />

//       {authResult && <p>{authResult}</p>}
//       {navigate('/dashboard')}
//     </div>
//   );
// };

// export default RegisterOrLogin;




import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FaceDetectionComponent.css';
import { toast } from 'react-toastify';

const RegisterOrLogin = () => {
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [authResult, setAuthResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const captureImage = async () => {
    if (!webcamRef.current) {
      setAuthResult('Camera not accessible');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setAuthResult('Failed to capture image. Please try again.');
      return;
    }

    setIsLoading(true); // Show loading state while sending request
    setAuthResult(null); // Clear previous results

    // Retrieve token from local storage
    const token = localStorage.getItem('token'); // Replace 'auth-token' with the key you use to store the token

    // Send the captured image to the backend with Authorization header
    try {
      const response = await axios.post(
        'http://localhost:5000/api/capture-face',
        { image: imageSrc },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to Authorization header
          },
        }
      );

      const { message, success } = response.data;
      setAuthResult(message);

      // Navigate to dashboard if authentication succeeds
      toast.success("Registration successful! \nWelcome to our community!");

      if (response.data) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error during face authentication', error);
      setAuthResult('Error during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="face-detection-container">
      <div className="face-detection-header">
        <h2>Face Authentication</h2>
        <p>Ensure a clear face image for successful registration or login.</p>
      </div>

      {isCameraOpen ? (
        <div className="camera-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: "user" }}
            className="webcam-view"
          />
          <div className="action-buttons">
            <button className="capture-btn" onClick={captureImage} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Capture Face'}
            </button>
            <button className="close-camera-btn" onClick={() => setIsCameraOpen(false)} disabled={isLoading}>
              Close Camera
            </button>
          </div>
        </div>
      ) : (
        <div className="open-camera-container">
          <button className="open-camera-btn" onClick={() => setIsCameraOpen(true)} disabled={isLoading}>
            Open Camera
          </button>
        </div>
      )}

      {authResult && (
        <p className={`auth-result ${authResult.includes('Error') ? 'error' : 'success'}`}>
          {authResult}
        </p>
      )}
    </div>
  );
};

export default RegisterOrLogin;
