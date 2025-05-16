/**
 * Utilitaire pour charger l'API Google Maps de manière sécurisée
 * en récupérant la clé API depuis le backend
 */

// Garde une référence de la promesse pour éviter plusieurs requêtes
let apiKeyPromise = null;

/**
 * Récupère la clé API Google Maps depuis le backend
 * @returns {Promise<string>} La clé API
 */
export async function getGoogleMapsApiKey() {
  if (!apiKeyPromise) {
    apiKeyPromise = fetch('../backend/get_api_key.php')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.apiKey) {
          throw new Error('Clé API non trouvée dans la réponse');
        }
        return data.apiKey;
      });
  }
  
  return apiKeyPromise;
}

/**
 * Charge l'API Google Maps si elle n'est pas déjà chargée
 * @param {string} libraries - Liste des bibliothèques à charger (séparées par des virgules)
 * @param {string} callback - Nom de la fonction de callback globale
 * @returns {Promise<void>} - Se résout quand l'API est chargée
 */
export async function loadGoogleMapsApi(libraries = 'places', callback = null) {
  // Si l'API est déjà chargée, retourner immédiatement
  if (window.google && window.google.maps) {
    console.log('Google Maps API already loaded');
    return Promise.resolve();
  }

  try {
    // Récupérer la clé API
    const apiKey = await getGoogleMapsApiKey();
    
    // Créer l'URL de l'API avec les paramètres appropriés
    let url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&loading=async&v=weekly`;
    
    // Ajouter le callback si spécifié
    if (callback) {
      url += `&callback=${callback}`;
    }
    
    // Ajouter un timestamp pour éviter les problèmes de cache
    url += `&t=${Date.now()}`;
    
    // Créer une promesse qui se résoudra lorsque le script sera chargé
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;
      
      // Résoudre la promesse lorsque le script est chargé
      script.onload = resolve;
      
      // Rejeter la promesse en cas d'erreur
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };
      
      // Ajouter le script au document
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
    throw error;
  }
}

/**
 * Charge l'API Google Maps avec un callback global
 * @param {string} callbackName - Nom de la fonction de callback globale
 * @param {Function} callbackFn - Fonction à exécuter lorsque l'API est chargée
 * @param {string} libraries - Liste des bibliothèques à charger (séparées par des virgules)
 */
export function loadGoogleMapsApiWithCallback(callbackName, callbackFn, libraries = 'places') {
  // Si l'API est déjà chargée, exécuter le callback directement
  if (window.google && window.google.maps) {
    console.log('Google Maps API already loaded, executing callback directly');
    callbackFn();
    return;
  }
  
  // Définir la fonction de callback globale
  window[callbackName] = callbackFn;
  
  // Charger l'API avec le callback
  loadGoogleMapsApi(libraries, callbackName).catch(error => {
    console.error(`Error in loadGoogleMapsApiWithCallback:`, error);
  });
} 