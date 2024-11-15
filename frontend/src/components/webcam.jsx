import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './FaceDetectionComponent.css';  // Importing CSS file for styling

const FaceDetectionComponent = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);  // Send the captured image to the parent or backend
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
            videoConstraints={{
              facingMode: "user",
            }}
            className="webcam-view"
          />
          <div className="action-buttons">
            <button className="capture-btn" onClick={captureImage}>
              Capture Face
            </button>
            <button className="close-camera-btn" onClick={() => setIsCameraOpen(false)}>
              Close Camera
            </button>
          </div>
        </div>
      ) : (
        <div className="open-camera-container">
          <button className="open-camera-btn" onClick={() => setIsCameraOpen(true)}>
            Open Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceDetectionComponent;