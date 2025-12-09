// src/components/forms/EleveInscriptionForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Données de base pour la démo
const CLASSES = ['1ère', '2ème', '3ème', '4ème', '5ème', '6ème'];
const OPTIONS = ['Scientifique', 'Littéraire', 'Commerciale', 'Technique', 'Biologie'];

const EleveInscriptionForm = ({ onInscrit }) => {
    const [formData, setFormData] = useState({
        matricule_eleve: '', nom: '', postnom: '', prenom: '',
        date_naissance: '', nom_classe: '', option_classe: '', promotion_annee: String(new Date().getFullYear())
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
            const response = await axios.post('http://localhost:8080/api/eleves/create_eleve.php', formData);
            setMessage(response.data.message);
            
            // Appeler la fonction de rappel si fournie
            if (onInscrit) {
                onInscrit(response.data.message);
            }
            // Réinitialiser le formulaire
            setFormData({
                matricule_eleve: '', nom: '', postnom: '', prenom: '',
                date_naissance: '', nom_classe: '', option_classe: '', promotion_annee: String(new Date().getFullYear())
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription de l\'élève.');
        } finally {
            setLoading(false);
        }
    };
    
    // Style minimal
    const inputStyle = { width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box' };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Inscrire un nouvel Élève (Dossier Scolaire)</h2>
            
            <form onSubmit={handleSubmit}>
                {/* Informations Personnelles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                    <input name="matricule_eleve" value={formData.matricule_eleve} onChange={handleChange} placeholder="Matricule Élève *" required style={inputStyle} />
                    <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom *" required style={inputStyle} />
                    <input name="postnom" value={formData.postnom} onChange={handleChange} placeholder="Postnom" style={inputStyle} />
                    <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom *" required style={inputStyle} />
                </div>

                {/* Date et Classe */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginTop: '10px' }}>
                    <input 
                        name="date_naissance" 
                        type="date" 
                        value={formData.date_naissance} 
                        onChange={handleChange} 
                        placeholder="Date de Naissance *" 
                        required 
                        style={inputStyle} 
                    />
                    
                    <select name="nom_classe" value={formData.nom_classe} onChange={handleChange} required style={inputStyle}>
                        <option value="">Classe *</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    <select name="option_classe" value={formData.option_classe} onChange={handleChange} required style={inputStyle}>
                        <option value="">Option *</option>
                        {OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>

                    <input 
                        name="promotion_annee" 
                        value={formData.promotion_annee} 
                        onChange={handleChange} 
                        placeholder="Année Scolaire" 
                        style={inputStyle} 
                        readOnly // Laissez l'année par défaut
                    />
                </div>

                {error && <p style={{ color: 'red', marginTop: '15px' }}>Erreur : {error}</p>}
                {message && <p style={{ color: 'green', marginTop: '15px' }}>Succès : {message}</p>}

                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ marginTop: '20px', padding: '10px 30px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'INSCRIPTION...' : 'CRÉER LE DOSSIER ÉLÈVE'}
                </button>
            </form>
        </div>
    );
};

export default EleveInscriptionForm;