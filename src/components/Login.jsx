import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api/auth/login.php';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 🚨 CORRECTION CRITIQUE : Nettoyage des espaces blancs accidentels
    const cleanMatricule = matricule.trim();
    const cleanPassword = password.trim();

    // Vérification de base après nettoyage
    if (!cleanMatricule || !cleanPassword) {
        setError("Le matricule et le mot de passe ne peuvent pas être vides.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Utilisation des variables nettoyées
        body: JSON.stringify({ matricule: cleanMatricule, password: cleanPassword }),
      });

      const data = await response.json();
      
      if (data.success) {
        
        console.log("Connexion réussie! Rôle:", data.user.nom_role);
        
        // Stockage et redirection
        onLoginSuccess(data.user); 
        
      } else {
        
        setError(data.message || "Erreur de connexion inconnue.");
      }
    } catch (err) {
      
      console.error("Erreur de l'API de connexion:", err);
      setError("Impossible de se connecter au serveur API. Vérifiez le backend et le port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Connexion My School</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        
        <label htmlFor="matricule" style={styles.label}>Matricule (Ex: P002)</label>
        <input
          type="text"
          id="matricule"
          // Utiliser toUpperCase() à la saisie est bon, mais .trim() à la soumission est crucial
          value={matricule}
          onChange={(e) => setMatricule(e.target.value.toUpperCase())}
          required
          style={styles.input}
        />

        <label htmlFor="password" style={styles.label}>Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Connexion...' : 'Se Connecter'}
        </button>
      </form>
    </div>
  );
};


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
        marginTop: '10px',
    },
    input: {
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
        textAlign: 'center',
    }
};

export default Login;