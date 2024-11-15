import React, { useState, useEffect, useRef } from 'react';
import './VideoConferencePage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const VideoConferencePage = () => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Get media (video + audio) from the user's device
  useEffect(() => {
    if (isCallStarted) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCallStarted]);

  // Toggle microphone
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === 'audio') {
          track.enabled = !track.enabled;
        }
      });
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === 'video') {
          track.enabled = !track.enabled;
        }
      });
    }
  };

  // Start the call
  const startCall = () => {
    setIsCallStarted(true);
  };

  // End the call
  const endCall = () => {
    setIsCallStarted(false);
  };

  return (
    <div className="video-conference-wrapper">
      <header className="conference-header">
        <h2>LiveMeet Conference</h2>
        {isCallStarted && (
          <button className="end-call-button" onClick={endCall}>
            End Call
          </button>
        )}
      </header>

      <div className="video-section">
        <div className="video-container">
          <video
            ref={videoRef}
            className="conference-video"
            autoPlay
            muted={!isMicOn}
            playsInline
          ></video>
          <p className="video-placeholder"></p>
        </div>

        {/* Mic and Camera Controls */}
        <div className="controls">
          {!isCallStarted ? (
            <button className="start-call-button" onClick={startCall}>
              Start Call
            </button>
          ) : (
            <>
              <button
                className={`control-button ${isMicOn ? 'active' : 'inactive'}`}
                onClick={toggleMic}
              >
                <i className="fas fa-microphone"></i>
              </button>
              <button
                className={`control-button ${isCameraOn ? 'active' : 'inactive'}`}
                onClick={toggleCamera}
              >
                <i className="fas fa-video"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoConferencePage;
