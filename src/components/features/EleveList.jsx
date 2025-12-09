import React, { useState, useEffect } from 'react';
// Importez le nouveau composant que nous allons créer
import StudentDetailsAndGrades from './StudentDetailsAndGrades'; 

// ===========================================
// DÉFINITION GLOBALE DES STYLES
// ===========================================
const tableHeaderStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
};

const tableCellStyle = {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer', // Ajoutez un curseur pour indiquer que la ligne est cliquable
};
// ===========================================


const EleveList = ({ user }) => { 
    // Nouvel état pour gérer la navigation vers la vue détaillée
    const [selectedEleve, setSelectedEleve] = useState(null); 
    
    // États existants pour la liste
    const [eleves, setEleves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let professeurMatricule = user?.matricule; 
    
    if (!professeurMatricule) {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                professeurMatricule = parsedUser?.matricule; 
            }
        } catch (e) {
            console.error("Erreur de lecture du localStorage :", e);
        }
    }
    
    // Fonction pour gérer le clic sur l'élève
    const handleEleveClick = (eleve) => {
        // Enregistre toutes les données de l'élève pour les passer au composant de détails
        setSelectedEleve(eleve);
    };

    // VÉRIFICATION INITIALE ET LOGIQUE DE CHARGEMENT... (inchangée)

    if (!professeurMatricule) {
        return <div style={{padding: '20px'}}>Synchronisation des données du professeur en cours...</div>;
    }


    useEffect(() => {
        // ... (Logique fetchEleves inchangée)
        const fetchEleves = async () => {
            setLoading(true); 
            setError(null);
            
            try {
                const response = await fetch(`http://localhost:8080/api/eleves/get_eleves_by_prof.php?prof_id=${professeurMatricule}`);
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    setEleves(data.data);
                } else {
                    setEleves([]);
                    setError(data.message || "Aucune donnée d'élève trouvée.");
                }

            } catch (err) {
                console.error("Erreur de récupération des élèves:", err);
                setError("Impossible de se connecter à l'API ou erreur de format des données.");
            } finally {
                setLoading(false);
            }
        };

        fetchEleves();
    }, [professeurMatricule]);

    
    // 🚨 NOUVELLE LOGIQUE : Afficher la vue détaillée si un élève est sélectionné
    if (selectedEleve) {
        return (
            <StudentDetailsAndGrades 
                eleve={selectedEleve}
                professeurMatricule={professeurMatricule}
                onBack={() => setSelectedEleve(null)} // Fonction pour revenir à la liste
            />
        );
    }

    // --- Affichage des états de la liste ---

    if (loading) {
        return <div style={{padding: '20px'}}>Chargement de la liste des élèves...</div>;
    }

    if (error) {
        return <div style={{padding: '20px', color: 'red'}}>Erreur: {error}</div>;
    }

    if (eleves.length === 0) {
        return <div style={{padding: '20px', color: '#333'}}>
            <h3>Liste des Élèves</h3>
            <p>Le professeur **{professeurMatricule}** n'a pas encore d'élèves affectés. (Veuillez vérifier les affectations dans la base de données).</p>
        </div>;
    }

    // --- Affichage du Tableau (Liste des élèves) ---

    return (
        <div style={{padding: '20px'}}>
            <h3>Liste des Élèves Affectés ({eleves.length})</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>ID Élève</th>
                        <th style={tableHeaderStyle}>Nom Complet</th>
                        <th style={tableHeaderStyle}>Classe</th>
                        <th style={tableHeaderStyle}>Cours</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Le clic sur la ligne déclenche la fonction handleEleveClick */}
                    {eleves.map((eleve) => (
                        <tr 
                            key={eleve.matricule_eleve} 
                            onClick={() => handleEleveClick(eleve)} 
                            style={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f9f9f9' } }}
                        >
                            <td style={tableCellStyle}>{eleve.matricule_eleve}</td>
                            <td style={tableCellStyle}>{eleve.nom} {eleve.postnom} {eleve.prenom}</td>
                            <td style={tableCellStyle}>{eleve.nom_classe}</td>
                            <td style={tableCellStyle}>{eleve.nom_cours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EleveList;