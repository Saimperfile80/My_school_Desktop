// src/components/forms/AgentCreationForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous d'avoir axios installé (npm install axios)

const ROLES_DISPONIBLES = ['Professeur', 'Comptable', 'Directeur', 'Administrateur Système']; 
// Note: Le Préfet est aussi un rôle, mais on ne veut généralement pas qu'il s'auto-crée.

const AgentCreationForm = ({ setView }) => {
    const [formData, setFormData] = useState({
        nom: '', postnom: '', prenom: '', email: '',
        telephone: '', matricule: '', password: '', nom_role: '' 
        // Note: Genre et Service ne sont pas dans le schéma PERSONNEL actuel, on les omet ici
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/personnel/create_agent.php', formData);
            setMessage(response.data.message);
            // Réinitialiser le formulaire après succès
            setFormData({
                nom: '', postnom: '', prenom: '', email: '',
                telephone: '', matricule: '', password: '', nom_role: ''
            });
            // Optionnel : Retourner à la liste des utilisateurs après un court délai
            setTimeout(() => setView('utilisateurs'), 2000); 

        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de l\'agent.');
        } finally {
            setLoading(false);
        }
    };
    
    // Style minimal pour simuler l'affichage de la fenêtre modale
    const modalStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', 
        justifyContent: 'center', alignItems: 'center', zIndex: 1000
    };
    
    const formContainerStyle = {
        backgroundColor: '#2e3440', padding: '30px', borderRadius: '10px', 
        width: '500px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
    };
    
    const inputStyle = {
        width: '100%', padding: '10px', margin: '8px 0', 
        boxSizing: 'border-box', border: '1px solid #4c566a', 
        borderRadius: '4px', backgroundColor: '#3b4252', color: '#eceff4'
    };


    return (
        <div style={modalStyle}>
            <div style={formContainerStyle}>
                <h4>Créer un nouvel agent</h4>
                <form onSubmit={handleSubmit}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom *" required style={inputStyle} />
                        <input name="postnom" value={formData.postnom} onChange={handleChange} placeholder="Postnom" style={inputStyle} />
                        <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom *" required style={inputStyle} />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email *" required style={inputStyle} />
                        <input name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Matricule *" required style={inputStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" style={inputStyle} />
                        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe *" required style={inputStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        {/* Les champs Genre et Service ne sont pas gérés dans l'API/DB actuelle */}
                        <select disabled style={inputStyle}><option>Genre</option></select>
                        <select disabled style={inputStyle}><option>Service</option></select>
                        
                        {/* Rôle */}
                        <select name="nom_role" value={formData.nom_role} onChange={handleChange} required style={inputStyle}>
                            <option value="">Rôle *</option>
                            {ROLES_DISPONIBLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
                    {message && <p style={{ color: 'green' }}>Succès : {message}</p>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <button type="button" onClick={() => setView('utilisateurs')} disabled={loading}>
                            ANNULER
                        </button>
                        <button type="submit" disabled={loading} style={{ backgroundColor: '#5e81ac', color: 'white' }}>
                            {loading ? 'CRÉATION...' : 'CRÉER'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgentCreationForm;