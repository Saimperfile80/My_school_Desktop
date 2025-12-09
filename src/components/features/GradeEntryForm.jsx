// src/features/GradeEntryForm.jsx
import React, { useState } from 'react';

const GradeEntryForm = ({ eleve, professeurMatricule, onNoteSaved }) => {
    const [noteData, setNoteData] = useState({
        type_evaluation: 'Interrogation', // Valeur par défaut
        note_obtenue: '',
        note_max: 20,
        commentaire: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNoteData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);
        
        // Données complètes à envoyer à l'API
        const payload = {
            ...noteData,
            matricule_eleve: eleve.matricule_eleve,
            matricule_prof: professeurMatricule,
            nom_cours: eleve.nom_cours, // L'API PHP convertira le nom en ID
        };

        try {
            const response = await fetch('http://localhost:8080/api/grades/save_grade.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();

            if (data.success) {
                setMessage("Note enregistrée avec succès !");
                setIsError(false);
                // Réinitialiser le formulaire ou appeler le rafraîchissement
                setNoteData({ type_evaluation: 'Interrogation', note_obtenue: '', note_max: 20, commentaire: '' });
                if (onNoteSaved) onNoteSaved();
            } else {
                setMessage(data.message || "Erreur lors de l'enregistrement.");
                setIsError(true);
            }

        } catch (err) {
            setMessage("Impossible de se connecter à l'API de sauvegarde.");
            setIsError(true);
            console.error("Erreur de sauvegarde:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
            {message && (
                <p style={{ color: isError ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>
            )}

            <div style={{ marginBottom: '10px' }}>
                <label>Type d'évaluation:</label>
                <select name="type_evaluation" value={noteData.type_evaluation} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                    <option value="Interrogation">Interrogation</option>
                    <option value="Devoir">Devoir</option>
                    <option value="Examen">Examen</option>
                    <option value="Participation">Participation</option>
                </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Note obtenue / Maximum:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="number" 
                        name="note_obtenue" 
                        value={noteData.note_obtenue} 
                        onChange={handleChange} 
                        required 
                        placeholder="Note" 
                        min="0"
                        max={noteData.note_max}
                        style={{ padding: '8px', flex: 1 }}
                    />
                    <input 
                        type="number" 
                        name="note_max" 
                        value={noteData.note_max} 
                        onChange={handleChange} 
                        required 
                        placeholder="Max" 
                        min="1"
                        style={{ padding: '8px', flex: 1 }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Commentaire (Optionnel):</label>
                <textarea 
                    name="commentaire" 
                    value={noteData.commentaire} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                {loading ? 'Enregistrement...' : 'Enregistrer la Note'}
            </button>
        </form>
    );
};

export default GradeEntryForm;