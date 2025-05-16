/**
 * Module pour afficher le profil d'un autre utilisateur
 * Permet de voir les informations publiques et les annonces créées par cet utilisateur
 */
import renderHeader from "./header.js";
import renderAnnonceDetails from "./annonceDetails.js";

/**
 * Affiche le profil d'un autre utilisateur
 * @param {HTMLElement} container - Élément DOM où afficher le profil
 * @param {string|number} userId - ID de l'utilisateur à afficher ou username
 * @param {boolean} isUsername - Indique si userId est un nom d'utilisateur plutôt qu'un ID
 */
export default async function renderOtherUserProfile(container, userId, isUsername = false) {
  // Assurer que le header est affiché
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    renderHeader(headerContainer);
  }
  
  // Affichage initial avec message de chargement
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex items-center mb-6">
        <button id="backButton" class="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        <h1 class="text-2xl font-bold text-blue-800">Chargement du profil...</h1>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        </div>
      </div>
    </div>
  `;
  
  // Ajouter l'écouteur d'événement pour le bouton retour
  const backButton = container.querySelector('#backButton');
  backButton.addEventListener('click', async () => {
    try {
      // Utiliser l'importation dynamique pour éviter les dépendances circulaires
      const module = await import('./listeAnnonces.js');
      const renderListeAnnonces = module.default;
      renderListeAnnonces(container);
    } catch (error) {
      console.error('Erreur lors du chargement du module listeAnnonces:', error);
      // Fallback en cas d'erreur: retour à la page précédente
      window.location.href = './index.html';
    }
  });
  
  try {
    // Préparer l'URL en fonction de si nous avons un ID ou un nom d'utilisateur
    const queryParam = isUsername ? 'username' : 'id';
    const endpoint = `../backend/users/get_user.php?${queryParam}=${encodeURIComponent(userId)}`;
    
    // Récupérer les informations de l'utilisateur
    const userRes = await fetch(endpoint);
    
    if (!userRes.ok) {
      throw new Error(`Erreur HTTP: ${userRes.status} ${userRes.statusText}`);
    }
    
    const userData = await userRes.json();
    
    if (userData.error) {
      throw new Error(userData.error || "Utilisateur introuvable");
    }
    
    // Récupérer les annonces créées par cet utilisateur
    const annoncesRes = await fetch(`../backend/annonces/get_user_annonces.php?user_id=${userData.id}`);
    const annoncesData = await annoncesRes.json();
    
    // Mettre à jour l'affichage avec les informations de l'utilisateur
    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center mb-6">
          <button id="backButton" class="flex items-center text-blue-600 hover:text-blue-800 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <h1 class="text-2xl font-bold text-blue-800">Profil de ${userData.username}</h1>
        </div>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <!-- Informations de l'utilisateur -->
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                ${userData.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 class="text-xl font-semibold">${userData.username}</h2>
                <p class="text-gray-600">Membre depuis ${new Date(userData.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div class="border-t border-gray-100 pt-4 mt-4">
              <h3 class="text-lg font-medium mb-2">À propos</h3>
              <p class="text-gray-700">${userData.bio || 'Aucune information fournie.'}</p>
            </div>
            
            <div class="border-t border-gray-100 pt-4 mt-4">
              <h3 class="text-lg font-medium mb-2">Sports préférés</h3>
              <p class="text-gray-700">${userData.favorite_sports || 'Aucun sport spécifié.'}</p>
            </div>
          </div>
        </div>
        
        <!-- Annonces créées par l'utilisateur -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Annonces créées par ${userData.username}</h2>
          <div id="userAnnonces" class="space-y-4">
            ${annoncesData.length > 0 
              ? annoncesData.map(annonce => `
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition" data-annonce-id="${annonce.id}">
                  <h3 class="font-medium text-blue-800">${annonce.titre}</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-2">
                    <p><strong class="text-gray-700">Sport :</strong> ${annonce.sport}</p>
                    <p><strong class="text-gray-700">Date :</strong> ${annonce.date_activite}</p>
                    <p><strong class="text-gray-700">Lieu :</strong> ${annonce.lieu}</p>
                  </div>
                </div>
              `).join('')
              : '<p class="text-gray-500 italic">Cet utilisateur n\'a pas encore créé d\'annonces.</p>'
            }
          </div>
        </div>
        
        <!-- Participations de l'utilisateur (optionnel) -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Participations récentes</h2>
          <div id="userParticipations" class="space-y-4">
            <p class="text-gray-500 italic">Impossible d'accéder aux participations de cet utilisateur.</p>
          </div>
        </div>
      </div>
    `;
    
    // Rendre les annonces cliquables
    const annonceElements = container.querySelectorAll('[data-annonce-id]');
    annonceElements.forEach(element => {
      element.addEventListener('click', () => {
        const annonceId = element.dataset.annonceId;
        renderAnnonceDetails(container, annonceId);
      });
    });
    
    // Ajouter l'écouteur d'événement pour le bouton retour dans la section de succès
    const backButton = container.querySelector('#backButton');
    backButton.addEventListener('click', async () => {
      try {
        // Utiliser l'importation dynamique pour éviter les dépendances circulaires
        const module = await import('./listeAnnonces.js');
        const renderListeAnnonces = module.default;
        renderListeAnnonces(container);
      } catch (error) {
        console.error('Erreur lors du chargement du module listeAnnonces:', error);
        // Fallback en cas d'erreur: retour à la page précédente
        window.location.href = './index.html';
      }
    });
    
  } catch (error) {
    console.error("Erreur lors du chargement du profil de l'utilisateur:", error);
    
    // Afficher un message d'erreur
    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center mb-6">
          <button id="backButton" class="flex items-center text-blue-600 hover:text-blue-800 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <h1 class="text-2xl font-bold text-blue-800">Erreur</h1>
        </div>
        
        <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <p class="font-medium">Impossible de charger le profil de l'utilisateur.</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>
      </div>
    `;
    
    // Ajouter l'écouteur d'événement pour le bouton retour dans la section d'erreur
    const backButton = container.querySelector('#backButton');
    backButton.addEventListener('click', async () => {
      try {
        // Utiliser l'importation dynamique pour éviter les dépendances circulaires
        const module = await import('./listeAnnonces.js');
        const renderListeAnnonces = module.default;
        renderListeAnnonces(container);
      } catch (error) {
        console.error('Erreur lors du chargement du module listeAnnonces:', error);
        // Fallback en cas d'erreur: retour à la page précédente
        window.location.href = './index.html';
      }
    });
  }
} 