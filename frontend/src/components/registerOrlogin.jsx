// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import FaceDetectionComponent from './webcam';

// // const RegisterOrLogin = () => {
// //   const [authResult, setAuthResult] = useState(null);

// //   const handleCapture = async (imageSrc) => {
// //     // Send captured image to backend for face recognition
// //     try {
// //       const formData = new FormData();
// //       formData.append('image', imageSrc);
// //       const response = await axios.post('http://localhost:1337/api/auth/capture-face', formData, {
// //         headers: { 'Content-Type': 'multipart/form-data' },
// //       });
// //       setAuthResult(response.data.message);
// //     } catch (error) {
// //       console.error('Error during face authentication', error);
// //       setAuthResult('Error during authentication');
// //     }
// //   };

// //   return (
// //     <div>
// //       <FaceDetectionComponent onCapture={handleCapture} />
// //       {authResult && <p>{authResult}</p>}
// //     </div>
// //   );
// // };

// // export default RegisterOrLogin;



// import React, { useState } from 'react';
// import axios from 'axios';
// import FaceDetectionComponent from './webcam';


// const RegisterOrLogin = () => {
//   const [authResult, setAuthResult] = useState(null);

//   const handleCapture = async () => {
//     const video = document.createElement('video');
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//     video.play();

//     const canvas = document.createElement('canvas');
//     canvas.width = 200;
//     canvas.height = 200;
//     const ctx = canvas.getContext('2d');

//     setTimeout(() => {
//       ctx.drawImage(video, 0, 0, 200, 200);
//       const imageSrc = canvas.toDataURL('image/png');
//       stream.getTracks().forEach((track) => track.stop());

//       axios.post('http://localhost:1337/api/auth/capture-face', { image: imageSrc })
//         .then((response) => setAuthResult(response.data.message))
//         .catch(() => setAuthResult('Authentication failed'));
//     }, 2000);
//   };

//   return (
//     <div>
//       {/* <button onClick={handleCapture}>Capture Face</button> */}
//       <div>
//       <FaceDetectionComponent onCapture={handleCapture} />
//       {authResult && <p>{authResult}</p>}
//      </div>
//     </div>
//   );
// };

// export default RegisterOrLogin;

