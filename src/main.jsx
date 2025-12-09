// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Importez le composant Router
import { BrowserRouter as Router } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Enveloppez l'application avec le Router */}
    <Router> 
      <App />
    </Router>
  </React.StrictMode>,
);