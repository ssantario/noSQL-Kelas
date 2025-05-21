import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import axios from 'axios';

// Set base URL for axios requests
axios.defaults.baseURL = 'http://localhost:4000'; // Backend URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);