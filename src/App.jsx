// src/App.jsx 

import React, { useState, useEffect } from 'react';
// 🚨 AJOUT DE useLocation pour vérifier la route actuelle
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout'; 

function App() {
  // Initialisation de l'état utilisateur : tente de récupérer les données du localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  const location = useLocation(); // 🚨 Ajout de l'instance useLocation

  // Synchronise l'état utilisateur avec le stockage local ET gère la redirection
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      
      // 🚨 CORRECTION DU TIMING : Redirige vers la page d'accueil après la connexion, 
      // UNIQUEMENT si nous sommes sur la page de login.
      if (location.pathname === '/login' || location.pathname === '/login/') {
          navigate('/');
      }
      
    } else {
      localStorage.removeItem('user');
      // Si l'utilisateur est perdu ou déconnecté, on s'assure qu'il est redirigé vers le login.
      if (location.pathname !== '/login' && location.pathname !== '/login/') {
          navigate('/login');
      }
    }
  // Dépendances : user (pour le changement d'état), navigate et location.pathname (pour la redirection)
  }, [user, navigate, location.pathname]); 

  // Fonction appelée par la composante Login en cas de succès
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // 🚨 SUPPRESSION DE navigate('/') ICI. C'est désormais géré par l'useEffect ci-dessus.
  };
  
  // Fonction de déconnexion (sera appelée depuis Layout.jsx)
  const handleLogout = () => {
      setUser(null);
      // La redirection vers /login sera gérée automatiquement par l'useEffect car user devient null.
  };

  return (
    <Routes>
      {/* 1. Route pour la page de connexion */}
      <Route 
        path="/login/*" // Chemin corrigé pour les avertissements
        element={user ? <Layout user={user} onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} />} 
      />
      
      {/* 2. Route principale (/*) : Gère toutes les routes de l'application connectée */}
      <Route 
        path="/*" 
        element={user ? <Layout user={user} onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} />} 
      />
    </Routes>
  );
}

export default App;