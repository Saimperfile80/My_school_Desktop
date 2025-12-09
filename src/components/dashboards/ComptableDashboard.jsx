// src/components/dashboards/ComptableDashboard.jsx

import React from 'react';

const ComptableDashboard = ({ user }) => {
    return (
        <div>
            <h2>Tableau de Bord du Comptable</h2>
            <p>Bienvenue, **{user.nom_complet}**.</p>
            <p>Ici, vous gérerez les paiements, les frais de scolarité, etc.</p>
        </div>
    );
};

// 🚨 Ligne manquante
export default ComptableDashboard;