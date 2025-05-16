import './utils/userSession.js';
import renderDashboard from './components/dashboard.js';
import renderAuthForm from './components/authForm.js';
import renderHeader from './components/header.js';
import { masquerHeader } from './components/header.js';
import { loadGoogleMapsApi } from './utils/googleMapsLoader.js';
import renderListeAnnonces from './components/listeAnnonces.js';

// Configuration du cache
const APP_VERSION = "1.0.2";
const CACHE_ENABLED = true;

/**
 * Gestion automatique du cache de l'application
 * Cette fonction vérifie la version, nettoie le cache si nécessaire
 * et effectue les opérations de maintenance automatiquement
 */
const manageCacheAutomatically = async () => {
  console.log("Gestion automatique du cache...");
  
  // Récupérer la version stockée
  const storedVersion = localStorage.getItem('appVersion');
  
  // Si la version est différente ou inexistante, nettoyer le cache
  if (!storedVersion || storedVersion !== APP_VERSION) {
    console.log(`Mise à jour détectée (${storedVersion || 'nouvelle installation'} -> ${APP_VERSION}), nettoyage du cache...`);
    
    try {
      // Nettoyer le cache du navigateur si disponible
      if (CACHE_ENABLED && 'caches' in window) {
        await caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              console.log(`Suppression du cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
          );
        });
      }
      
      // Nettoyer les service workers
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            console.log('Désenregistrement du service worker');
            registration.unregister();
          }
        });
      }
      
      // Sauvegarder les informations de session importantes
      const username = localStorage.getItem('username');
      
      // Nettoyer le localStorage mais conserver les données utilisateur
      const keysToPreserve = ['username'];
      const preservedData = {};
      
      // Sauvegarder les données à conserver
      keysToPreserve.forEach(key => {
        preservedData[key] = localStorage.getItem(key);
      });
      
      // Vider le localStorage
      localStorage.clear();
      
      // Restaurer les données préservées
      Object.keys(preservedData).forEach(key => {
        if (preservedData[key]) {
          localStorage.setItem(key, preservedData[key]);
        }
      });
      
      // Mettre à jour la version et le timestamp
      localStorage.setItem('appVersion', APP_VERSION);
      localStorage.setItem('lastCacheCleanup', Date.now().toString());
      
      console.log("Cache nettoyé avec succès, rechargement de l'application...");
      
      // Recharger la page pour appliquer les changements
      window.location.reload(true);
    } catch (error) {
      console.error("Erreur lors du nettoyage du cache:", error);
    }
  } else {
    console.log(`Version actuelle: ${APP_VERSION}, aucune mise à jour nécessaire`);
    
    // Ajouter un timestamp pour le dernier démarrage
    localStorage.setItem('lastAppStart', Date.now().toString());
  }
};

// Exécuter la gestion automatique du cache au démarrage
manageCacheAutomatically().catch(error => {
  console.error("Erreur lors de la gestion du cache:", error);
});

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  const header = document.getElementById('header');
  
  // Try to load Google Maps API early (but don't block the UI rendering)
  loadGoogleMapsApi().catch(error => {
    console.error('Error pre-loading Google Maps API:', error);
    // Non-blocking error, the UI will still render
  });
  
  // Check if user is already logged in
  const username = localStorage.getItem('username');
  
  if (username) {
    // User is logged in, show dashboard
    renderDashboard(app);
    renderHeader(header);
  } else {
    // User is not logged in, show auth form
    renderAuthForm(app);
    masquerHeader(header);
  }
});

// Listen for login event
document.addEventListener('userLoggedIn', (e) => {
  console.log('Event received:', e);
  const username = e.detail?.username;
  
  if (!username) {
    console.log('Event received without username');
    return;
  }
  
  // Store user in localStorage
  localStorage.setItem('username', username);
  
  // Update UI after login - Show dashboard
  const app = document.getElementById('app');
  const header = document.getElementById('header');
  renderDashboard(app);
  renderHeader(header);
});

// Listen for logout event
document.addEventListener('userLoggedOut', () => {
  console.log('Logout event received');
  
  // Update UI after logout
  const app = document.getElementById('app');
  const header = document.getElementById('header');
  
  // Show login form and masked header
  renderAuthForm(app);
  masquerHeader(header);
});