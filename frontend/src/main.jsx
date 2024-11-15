import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'

import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} /> */}
    <ToastContainer
      transition={Slide}   // Set global transition
      autoClose={4000}     // Auto-close duration for all toasts
      position="top-right"
      hideProgressBar={false}
    />

  </React.StrictMode>
)
