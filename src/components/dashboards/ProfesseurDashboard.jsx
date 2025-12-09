// src/components/dashboards/ProfesseurDashboard.jsx
import React from 'react';

const ProfesseurDashboard = ({ user }) => {
    
    // 🚨 CORRECTION 1 : Construction du nom complet à partir des clés disponibles
    const nomComplet = `${user.nom} ${user.postnom} ${user.prenom}`;

    return (
        <div>
            {/* 🚨 CORRECTION 2 : Utilisation de nomComplet */}
            <h2>Bienvenue, Professeur {nomComplet} !</h2> 
            
            {/* 🚨 CORRECTION 3 : Utilisation de nom_role */}
            <p>Rôle: {user.nom_role}</p> 
            <hr />
            <h3>Statistiques du Professeur</h3>
            <p>1. Voir la liste de vos classes affectées.</p>
            <p>2. Enregistrer les notes (Cotes).</p>
            <p>3. Consulter les listes d'élèves par cours.</p>
        </div>
    );
};

export default ProfesseurDashboard;