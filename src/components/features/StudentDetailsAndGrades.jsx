// src/features/StudentDetailsAndGrades.jsx
import React, { useState, useEffect } from 'react';
import GradeEntryForm from './GradeEntryForm'; // 🚨 NOUVEL IMPORT

// ... (le reste du code est inchangé jusqu'à useEffect)

const StudentDetailsAndGrades = ({ eleve, professeurMatricule, onBack }) => {
    
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const nomComplet = `${eleve.nom} ${eleve.postnom} ${eleve.prenom}`;
    
    // Fonction unique pour récupérer les détails (pour le rafraîchissement)
    const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const apiUrl = `http://localhost:8080/api/grades/get_eleve_details.php?eleve_id=${eleve.matricule_eleve}&prof_id=${professeurMatricule}&cours_nom=${eleve.nom_cours}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                // Le 500 n'est plus un blocage, mais une erreur HTTP doit toujours être gérée.
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setDetails(data.data);
            } else {
                setError(data.message || "Impossible de charger les détails.");
            }
        } catch (err) {
            console.error("Erreur de récupération des détails:", err);
            setError("Erreur de connexion à l'API des détails.");
        } finally {
            setLoading(false);
        }
    };
    
    // Lancement de la récupération au montage du composant
    useEffect(() => {
        fetchDetails();
    }, [eleve.matricule_eleve, professeurMatricule, eleve.nom_cours]);


    // ... (le reste du code est inchangé jusqu'à la section "Vue principale")

    return (
        <div style={{ padding: '20px' }}>
            {/* ... Bouton retour et titre inchangé ... */}
            
            <hr />

            {/* Affichage des états de chargement/erreur */}
            {loading && <p>Chargement du parcours étudiant...</p>}
            {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}

            {/* Vue principale si les détails sont chargés */}
            {!loading && (
                <div>
                    <h3>1. Saisie des Notes</h3>
                    {/* 🚨 INTEGRATION DU FORMULAIRE ICI */}
                    <GradeEntryForm 
                        eleve={eleve} 
                        professeurMatricule={professeurMatricule}
                        onNoteSaved={fetchDetails} // 🚨 On rafraîchit la liste après la sauvegarde
                    />

                    <h3>2. Historique des Notes</h3>
                    <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '10px' }}>
                        {details && details.notes && details.notes.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '5px' }}>Date</th>
                                        <th style={{ textAlign: 'left', padding: '5px' }}>Type</th>
                                        <th style={{ textAlign: 'left', padding: '5px' }}>Note</th>
                                        <th style={{ textAlign: 'left', padding: '5px' }}>Commentaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.notes.map((note, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '5px' }}>{note.date_evaluation}</td>
                                            <td style={{ padding: '5px' }}>{note.type_evaluation}</td>
                                            <td style={{ padding: '5px', fontWeight: 'bold' }}>{note.note_obtenue}/{note.note_max}</td>
                                            <td style={{ padding: '5px' }}>{note.commentaire || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Aucune note enregistrée pour ce cours.</p>
                        )}
                        
                        <h4>Absences & Discipline</h4>
                        <p>Absences: {details && details.absences.length} | Discipline: {details && details.discipline.length}</p>
                        <p>... (Affichage des détails d'absence et discipline à implémenter plus tard)</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetailsAndGrades;