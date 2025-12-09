// src/components/Layout.jsx 

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 

// Import des Tableaux de Bord (Dashboards)
import PrefetDashboard from './dashboards/PrefetDashboard';
import ComptableDashboard from './dashboards/ComptableDashboard';
import ProfesseurDashboard from './dashboards/ProfesseurDashboard';

// Import des pages/features spécifiques
import EleveList from './features/EleveList'; 
import AgentCreationForm from './forms/AgentCreationForm'; 
import EleveInscriptionForm from './forms/EleveInscriptionForm'; // 🚨 NOUVEL IMPORT

const Layout = ({ user, onLogout }) => {
    
    const roleId = user?.id_role; 
    
    // Fonction pour rendre le tableau de bord spécifique au rôle
    const renderDashboard = () => {
        
        // Vérification critique du rôle
        if (!user || !user.nom_role || !roleId) {
             return (
                <div style={{ padding: '20px', color: 'red' }}>
                    <h1>Accès non autorisé ou rôle inconnu (ID: {roleId} / Rôle: {user?.nom_role}).</h1>
                    <button onClick={onLogout}>Se déconnecter</button>
                </div>
            );
        }

        switch (roleId) {
            case 1: // Préfet (Administrateur principal)
                return <PrefetDashboard user={user} onLogout={onLogout} />;
            case 3: // Comptable
                return <ComptableDashboard user={user} onLogout={onLogout} />;
            case 4: // Professeur
                return <ProfesseurDashboard user={user} onLogout={onLogout} />;
            default:
                return <div>Rôle {user.nom_role} (ID: {roleId}) non pris en charge.</div>;
        }
    };


    // ----------------------------------------------------
    // Logique de Navigation (SIDEBAR)
    // ----------------------------------------------------
    let navLinks = [];

    if (roleId === 1) { // Préfet
        navLinks = [
            { path: '/', name: 'Tableau de Bord', icon: '🏠' },
            { path: '/utilisateurs', name: 'Gestion des Utilisateurs', icon: '🧑‍💼' },
            { path: '/eleves', name: 'Liste des Élèves', icon: '👨‍🎓' },
            // ... autres liens du Préfet
        ];
    } else if (roleId === 4) { // Professeur
        navLinks = [
            { path: '/', name: 'Tableau de Bord', icon: '🏠' },
            { path: '/eleves', name: 'Liste des Élèves', icon: '👨‍🎓' },
            { path: '/saisie-cotes', name: 'Saisie des Cotes', icon: '📝' },
        ];
    }

    else if (roleId === 3) { // Comptable
        navLinks = [
            { path: '/', name: 'Tableau de Bord', icon: '🏠' },
            { path: '/eleves/inscrire', name: 'Inscrire un Élève', icon: '📝' },
            { path: '/paiements', name: 'Gestion des Paiements', icon: '💰' },
        ];
    }
    // Ajoutez des conditions pour d'autres rôles (Comptable, Directeur, etc.)


    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>

            {/* 1. Zone de Menu Latéral (SIDEBAR) */}
            <div style={{ width: '250px', backgroundColor: '#343a40', color: 'white', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '30px' }}>{user?.nom_role}</h3>

                {/* Liens de Navigation Dynamiques */}
                <nav>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            style={styles.navLink} 
                        >
                            {link.icon} {link.name}
                        </Link>
                    ))}
                </nav>

                <button onClick={onLogout} style={{ marginTop: '50px', ...styles.logoutButton }}>
                    Déconnexion
                </button>
            </div>

            {/* 2. Zone de Contenu Principal (MAIN CONTENT) */}
            <div style={{ flexGrow: 1, padding: '20px' }}>
                <h1 style={{ marginBottom: '20px' }}>My School ERP - Tableau de Bord</h1>
                <main style={{ marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' }}>
                    <Routes>
                        {/* Route de base (le Dashboard) : Affiche l'aiguillage des rôles */}
                        <Route path="/" element={renderDashboard()} /> 

                        {/* Routes de Fonctionnalités Partagées ou Spécifiques */}
                        
                        {/* Liste des élèves (peut être utilisée par Professeur et Préfet) */}
                        <Route path="/eleves" element={<EleveList user={user} />} /> 

                        {/* Route de Création d'Agent (Pour le Préfet) */}
                        <Route path="/utilisateurs/creer" element={
                            roleId === 1 ? (
                                <AgentCreationForm setView={() => { /* Optionnel: fonction pour gérer l'affichage dans le PrefetDashboard */ }} />
                            ) : (
                                <div>Accès refusé.</div>
                            )
                        } />
                        
                        {/* Route de base pour la gestion des utilisateurs (Redirige vers le Dashboard du Préfet si nécessaire) */}
                        <Route path="/utilisateurs" element={renderDashboard()} /> 

                        {/* Saisie des cotes */}
                        <Route path="/saisie-cotes" element={<div>Page de Saisie des Cotes (À faire)</div>} />
                        
                        {/* 🚨 NOUVELLE ROUTE : Inscription de l'Élève (pour le Comptable) */}
                        <Route path="/eleves/inscrire" element={
                            roleId === 3 ? (
                                <EleveInscriptionForm />
                            ) : (
                                <div>Accès refusé. Seul le Comptable peut inscrire un élève.</div>
                            )
                        } />

                    </Routes>
                </main>
            </div>
        </div>
    );
};

// Styles
const styles = {
    navLink: {
        display: 'block',
        padding: '10px 15px',
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        marginBottom: '5px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    logoutButton: {
        padding: '10px 15px',
        width: '100%',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    }
};

export default Layout;