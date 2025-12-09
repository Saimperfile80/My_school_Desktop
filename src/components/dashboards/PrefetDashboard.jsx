// src/components/dashboards/PrefetDashboard.jsx
import React, { useState } from 'react';
import AgentCreationForm from '../forms/AgentCreationForm'; // Nous allons le créer ci-dessous

const PrefetDashboard = ({ user }) => {
    const [view, setView] = useState('accueil'); // État pour gérer la vue (Accueil, Utilisateurs)
    const nomComplet = `${user.nom} ${user.postnom} ${user.prenom}`;

    return (
        <div className="prefet-dashboard">
            <header className="dashboard-header">
                <h2>Bienvenue, Préfet {nomComplet} !</h2>
                <p>Rôle: {user.nom_role}</p>
                <nav>
                    <button onClick={() => setView('accueil')} className={view === 'accueil' ? 'active' : ''}>Accueil</button>
                    <button onClick={() => setView('utilisateurs')} className={view === 'utilisateurs' ? 'active' : ''}>Gestion des Utilisateurs</button>
                    {/* Ajoutez d'autres vues ici (Classes, Cours, etc.) */}
                </nav>
            </header>

            <hr />

            <div className="dashboard-content">
                {view === 'accueil' && (
                    <div>
                        <h3>Tableau de Bord Général</h3>
                        <p>Aperçu des statistiques globales de My School ERP.</p>
                        {/* Insérez ici les widgets Comptes, Éléves, etc. */}
                    </div>
                )}

                {view === 'utilisateurs' && (
                    <div className="users-management">
                        <div className="users-header">
                            <h3>Utilisateurs - Gestion des agents</h3>
                            <button 
                                className="add-agent-button" 
                                onClick={() => setView('creation-agent')}
                            >
                                + AJOUTER UN AGENT
                            </button>
                        </div>
                        {/* Tableau des utilisateurs existants (Pour plus tard) */}
                        <p>Liste des agents actuellement enregistrés (Professeurs, Comptables, etc.).</p>
                    </div>
                )}
                
                {view === 'creation-agent' && (
                    <AgentCreationForm user={user} setView={setView} />
                )}
            </div>
        </div>
    );
};

export default PrefetDashboard;