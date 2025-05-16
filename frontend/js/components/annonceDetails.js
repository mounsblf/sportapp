/**
 * Module pour afficher les détails d'une annonce sportive
 * Permet de voir toutes les informations, la carte et les participants d'un événement
 */
import renderHeader from "./header.js";
import renderListeAnnonces from "./listeAnnonces.js";
import renderOtherUserProfile from "./otherUserProfile.js";
import { loadGoogleMapsApiWithCallback } from "../utils/googleMapsLoader.js";

/**
 * Affiche les détails complets d'une annonce sportive
 * @param {HTMLElement} container - Élément DOM où afficher les détails
 * @param {string|number} annonceId - ID de l'annonce à afficher
 */
export default async function renderAnnonceDetails(container, annonceId) {
  // Assurer que le header est affiché
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    renderHeader(headerContainer);
  }
  
  // Add CSS styles for the current user highlight
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .current-user {
      color: #4f46e5 !important; /* Indigo-600 */
      font-weight: 600 !important;
      position: relative;
    }
    .current-user::after {
      content: '(vous)';
      display: inline-block;
      margin-left: 4px;
      font-size: 0.75rem;
      color: #6366f1;
      font-weight: 400;
      opacity: 0.8;
    }
    .message-current-user {
      border-left: 3px solid #4f46e5;
    }
  `;
  document.head.appendChild(styleEl);
  
  // Variables pour le chat
  let lastMessageId = 0;
  let chatPollingInterval = null;
  
  // Affichage initial avec message de chargement
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex items-center mb-6">
        <button id="backButton" class="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux annonces
        </button>
        <h1 class="text-2xl font-bold text-blue-800">Chargement des détails...</h1>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    </div>
  `;
  
  // Ajouter l'écouteur d'événement pour le bouton retour
  const backButton = container.querySelector('#backButton');
  backButton.addEventListener('click', () => {
    renderListeAnnonces(container);
  });
  
  try {
    // Récupérer les données de l'annonce
    const annonceRes = await fetch(`../backend/annonces/read_one.php?id=${annonceId}`);
    
    // Vérification plus détaillée de la réponse
    if (!annonceRes.ok) {
      const statusText = annonceRes.statusText;
      if (annonceRes.status === 500) {
        const errorData = await annonceRes.json().catch(() => null);
        throw new Error(`Erreur serveur (${annonceRes.status}): ${errorData?.message || 'Problème avec la base de données ou le serveur'}`);
      } else {
        throw new Error(`Erreur HTTP: ${annonceRes.status} ${statusText}`);
      }
    }
    
    // Essayons de parser la réponse JSON
    let annonceData;
    try {
      annonceData = await annonceRes.json();
    } catch (jsonError) {
      throw new Error(`Erreur lors du traitement de la réponse du serveur: ${jsonError.message}`);
    }
    
    if (!annonceData) {
      throw new Error("Données d'annonce vides");
    }

    if (annonceData.error) {
      throw new Error(annonceData.error || "Annonce introuvable");
    }
    
    // Récupérer le nombre de participants
    const countRes = await fetch(`../backend/participations/count.php?annonce_id=${annonceId}`);
    const countData = await countRes.json();
    const nbParticipants = countData.count ?? 0;
    
    // Récupérer la liste des participants
    const participantsRes = await fetch(`../backend/participations/participants.php?annonce_id=${annonceId}`);
    const participants = await participantsRes.json();
    
    // Récupérer si l'utilisateur actuel participe
    const statusRes = await fetch(`../backend/participations/status.php?annonce_id=${annonceId}`);
    const status = await statusRes.json();
    
    // Construire l'adresse complète
    let adresseComplete = '';
    if (annonceData.address) {
      adresseComplete = annonceData.address;
    } else if (annonceData.adresse) {
      adresseComplete = annonceData.adresse;
    } else {
      if (annonceData.lieu) adresseComplete += annonceData.lieu;
      if (annonceData.ville) {
        if (adresseComplete) adresseComplete += ', ';
        adresseComplete += annonceData.ville;
      }
      if (annonceData.code_postal) {
        if (adresseComplete) adresseComplete += ' ';
        adresseComplete += annonceData.code_postal;
      }
    }
    
    // Détermine si l'annonce est complète (nombre max de participants atteint)
    const isFull = nbParticipants >= annonceData.places_max;
    
    // Mettre à jour l'affichage avec les détails complets de l'annonce
    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center mb-6">
          <button id="backButton" class="flex items-center text-blue-600 hover:text-blue-800 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux annonces
          </button>
          <h1 class="text-2xl font-bold text-blue-800">${annonceData.titre}</h1>
        </div>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <!-- Informations principales et carte -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <!-- Informations de l'événement -->
            <div class="p-6">
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="mb-2"><strong class="text-gray-700">Sport :</strong> ${annonceData.sport}</p>
                    <p class="mb-2"><strong class="text-gray-700">Lieu :</strong> ${annonceData.lieu}</p>
                    <p class="mb-2"><strong class="text-gray-700">Date :</strong> ${annonceData.date_activite}</p>
                    <p class="mb-2"><strong class="text-gray-700">Participants :</strong> ${nbParticipants} / ${annonceData.places_max}</p>
                    <p class="mb-2"><strong class="text-gray-700">Créée par :</strong> <a href="#" class="text-blue-600 hover:underline user-link" data-username="${annonceData.auteur}">${annonceData.auteur}</a></p>
                  </div>
                </div>
                
                <div class="border-t border-gray-100 pt-4">
                  <h3 class="font-medium text-gray-800 mb-2">Description</h3>
                  <p class="text-gray-600">${annonceData.description || 'Aucune description fournie.'}</p>
                </div>
                
                <div class="border-t border-gray-100 pt-4">
                  <h3 class="font-medium text-gray-800 mb-2">Actions</h3>
                  <div class="flex flex-wrap gap-2">
                    <button id="participation-btn" class="bg-blue-100 hover:bg-blue-200 text-blue-900 px-4 py-2 rounded-lg text-sm font-medium transition ${isFull && !status.participe ? 'opacity-50 cursor-not-allowed' : ''}">
                      ${isFull && !status.participe ? 'Complet' : (status.participe ? 'Annuler ma participation' : 'Participer')}
                    </button>
                    <!-- Ajout des boutons de confirmation d'annulation (cachés par défaut) -->
                    <div id="confirm-buttons" class="hidden flex gap-2">
                      <button id="confirm-cancel-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        Confirmer
                      </button>
                      <button id="abort-cancel-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Carte détaillée -->
            <div id="detail-map" class="h-[400px] lg:h-[500px] bg-gray-100 lg:border-l border-gray-100 relative">
              <div class="h-full w-full absolute inset-0 flex items-center justify-center">
                <p class="text-gray-400">Chargement de la carte...</p>
              </div>
            </div>
          </div>
          
          <!-- Liste des participants -->
          <div class="border-t border-gray-100 p-6">
            <h3 class="font-medium text-gray-800 mb-4">Participants (${nbParticipants}/${annonceData.places_max})</h3>
            <div class="participantsList">
              ${participants.length > 0 
                ? `<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    ${participants.map(participant => `
                      <li class="bg-gray-50 rounded-lg px-3 py-2 text-sm">
                        <span class="inline-block bg-blue-100 rounded-full w-2 h-2 mr-2"></span>
                        <a href="#" class="text-blue-600 hover:underline user-link" data-username="${participant}">${participant}</a>
                      </li>
                    `).join('')}
                   </ul>` 
                : '<p class="text-gray-500 italic">Aucun participant inscrit pour le moment.</p>'}
            </div>
          </div>
          
          <!-- Chat de l'événement -->
          <div class="border-t border-gray-100 p-6">
            <h3 class="font-medium text-gray-800 mb-4">Discussion</h3>
            <div id="chat-container" class="bg-gray-50 rounded-lg p-4">
              <!-- Messages du chat -->
              <div id="chat-messages" class="mb-4 overflow-y-auto max-h-60 space-y-3">
                <div class="text-center text-gray-400 text-sm py-2">
                  Chargement des messages...
                </div>
              </div>
              
              <!-- Formulaire d'envoi de message -->
              <div id="chat-form" class="flex gap-2">
                <input type="text" id="chat-input" placeholder="Votre message..." 
                  class="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <button id="chat-send" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                  Envoyer
                </button>
              </div>
              
              <div id="chat-status" class="text-sm text-gray-500 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Récupérer les références aux éléments interactifs
    const backButton = container.querySelector('#backButton');
    const participationBtn = container.querySelector('#participation-btn');
    
    // Ajouter l'écouteur d'événement pour le bouton retour
    backButton.addEventListener('click', () => {
      // Nettoyer l'intervalle de polling pour le chat
      if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
      }
      renderListeAnnonces(container);
    });
    
    // Ajouter l'écouteur d'événement pour le bouton de participation
    let confirmCancel = false;
    const confirmButtons = container.querySelector('#confirm-buttons');
    const confirmCancelBtn = container.querySelector('#confirm-cancel-btn');
    const abortCancelBtn = container.querySelector('#abort-cancel-btn');
    
    participationBtn.addEventListener('click', async () => {
      if (isFull && !status.participe) return; // Bouton désactivé si complet
      
      const formData = new FormData();
      formData.append('annonce_id', annonceId);
      
      const isCancel = status.participe;
      
      // Première étape de confirmation pour annuler
      if (isCancel) {
        // Masquer le bouton principal et afficher les boutons de confirmation
        participationBtn.style.display = 'none';
        confirmButtons.style.display = 'flex';
        return;
      }
      
      // Sinon, c'est une participation (pas besoin de confirmation)
      const url = '../backend/participations/join.php';
      
      // Envoi de la requête au serveur
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      // Nettoyer l'intervalle de polling pour le chat
      if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
      }
      
      // Recharger la page pour voir les changements
      renderAnnonceDetails(container, annonceId);
    });
    
    // Écouteur pour confirmer l'annulation
    confirmCancelBtn.addEventListener('click', async () => {
      const formData = new FormData();
      formData.append('annonce_id', annonceId);
      
      // Envoi de la requête au serveur
      const url = '../backend/participations/cancel.php';
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      // Nettoyer l'intervalle de polling pour le chat
      if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
      }
      
      // Recharger la page pour voir les changements
      renderAnnonceDetails(container, annonceId);
    });
    
    // Écouteur pour abandonner l'annulation
    abortCancelBtn.addEventListener('click', () => {
      // Cacher les boutons de confirmation et réafficher le bouton principal
      confirmButtons.style.display = 'none';
      participationBtn.style.display = 'inline-flex';
    });
    
    // Initialiser la carte Google Maps
    initializeDetailMap(annonceData);
    
    // Initialiser le chat
    initializeChat(annonceId);
    
    // Rendre les noms d'utilisateurs cliquables
    const userLinks = container.querySelectorAll('.user-link');
    userLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const username = link.dataset.username;
        if (username) {
          // Nettoyer l'intervalle de polling pour le chat
          if (chatPollingInterval) {
            clearInterval(chatPollingInterval);
          }
          renderOtherUserProfile(container, username, true);
        }
      });
    });
    
  } catch (error) {
    console.error("Erreur lors du chargement des détails de l'annonce:", error);
    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center mb-6">
          <button id="backButton" class="flex items-center text-blue-600 hover:text-blue-800 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux annonces
          </button>
          <h1 class="text-2xl font-bold text-blue-800">Erreur</h1>
        </div>
        
        <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <p class="font-medium">Impossible de charger les détails de l'annonce.</p>
          <p class="text-sm mt-2">${error.message}</p>
          <div class="mt-4 flex justify-end">
            <button id="debugBtn" class="text-xs underline text-gray-600">Détails techniques</button>
          </div>
          <div id="debugInfo" class="mt-3 hidden">
            <pre class="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-48">${error.stack || 'Pas de stack trace disponible'}</pre>
          </div>
        </div>
      </div>
    `;
    
    // Ajouter l'écouteur d'événement pour le bouton retour
    const backButton = container.querySelector('#backButton');
    backButton.addEventListener('click', () => {
      renderListeAnnonces(container);
    });
    
    // Ajouter l'écouteur pour afficher les détails techniques
    const debugBtn = container.querySelector('#debugBtn');
    const debugInfo = container.querySelector('#debugInfo');
    if (debugBtn && debugInfo) {
      debugBtn.addEventListener('click', () => {
        debugInfo.classList.toggle('hidden');
      });
    }
  }
  
  /**
   * Initialise le chat pour l'annonce
   * @param {number} annonceId - ID de l'annonce
   */
  async function initializeChat(annonceId) {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatStatus = document.getElementById('chat-status');
    
    // Si les éléments n'existent pas, ne rien faire
    if (!chatMessages || !chatInput || !chatSend || !chatStatus) return;
    
    // Récupérer l'ID de l'utilisateur courant si ce n'est pas déjà fait
    if (!window.currentUser) {
      try {
        const userResponse = await fetch('../backend/users/get_current_user.php');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.user) {
            window.currentUser = {
              id: userData.user.id,
              username: userData.user.username
            };
            console.log('Current user set:', window.currentUser);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }
    
    // Fonction pour charger les messages
    async function loadChatMessages() {
      try {
        // Construire l'URL avec les paramètres
        let url = `../backend/chat/get_messages.php?annonce_id=${annonceId}`;
        if (lastMessageId > 0) {
          url += `&last_id=${lastMessageId}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Erreur lors du chargement des messages');
        }
        
        // Si c'est le premier chargement et qu'il n'y a pas de messages
        if (lastMessageId === 0 && (!data.messages || data.messages.length === 0)) {
          chatMessages.innerHTML = `
            <div class="text-center text-gray-400 text-sm py-2">
              Aucun message dans cette discussion. Soyez le premier à écrire !
            </div>
          `;
          return;
        }
        
        // S'il y a de nouveaux messages, les ajouter
        if (data.messages && data.messages.length > 0) {
          // Première fois que nous chargeons des messages
          if (lastMessageId === 0) {
            chatMessages.innerHTML = '';
          }
          
          // Ajouter les nouveaux messages
          for (const message of data.messages) {
            // Mettre à jour le dernier ID de message
            if (parseInt(message.id) > lastMessageId) {
              lastMessageId = parseInt(message.id);
            }
            
            // Vérifier si ce message est déjà affiché
            if (document.getElementById(`message-${message.id}`)) {
              continue;
            }
            
            // Créer et ajouter le message
            const messageEl = document.createElement('div');
            messageEl.id = `message-${message.id}`;
            messageEl.className = 'p-3 rounded-lg';
            
            // Appliquer une classe différente selon si c'est notre message ou celui d'un autre utilisateur
            // Nous devons vérifier si l'utilisateur est connecté et comparer avec l'ID de l'utilisateur du message
            const isCurrentUser = message.user_id === (window.currentUser?.id || -1);
            if (isCurrentUser) {
              messageEl.classList.add('bg-blue-50', 'ml-12', 'message-current-user');
            } else {
              messageEl.classList.add('bg-gray-100', 'mr-12');
            }
            
            const date = new Date(message.created_at);
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const formattedDate = date.toLocaleDateString();
            
            messageEl.innerHTML = `
              <div class="flex justify-between items-start mb-1">
                <span class="font-medium text-sm ${isCurrentUser ? 'text-indigo-600' : 'text-gray-700'}">
                  <a href="#" class="user-link hover:underline ${isCurrentUser ? 'current-user' : ''}" data-username="${message.username}" style="${isCurrentUser ? 'color: #4f46e5; font-weight: 600;' : ''}">${message.username}</a>
                </span>
                <span class="text-xs text-gray-500">${formattedTime} · ${formattedDate}</span>
              </div>
              <p class="text-sm text-gray-800">${message.message}</p>
            `;
            
            chatMessages.appendChild(messageEl);
          }
          
          // Scroll vers le bas pour voir les nouveaux messages
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Ajouter les gestionnaires de clic pour les liens utilisateur dans le chat
          const chatUserLinks = chatMessages.querySelectorAll('.user-link');
          chatUserLinks.forEach(link => {
            // Vérifier si ce lien a déjà un gestionnaire d'événements
            if (!link.hasEventListener) {
              link.hasEventListener = true;
              link.addEventListener('click', (e) => {
                e.preventDefault();
                const username = link.dataset.username;
                if (username) {
                  // Nettoyer l'intervalle de polling pour le chat
                  if (chatPollingInterval) {
                    clearInterval(chatPollingInterval);
                  }
                  renderOtherUserProfile(container, username, true);
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        chatStatus.textContent = 'Erreur lors du chargement des messages. Réessayez plus tard.';
        chatStatus.classList.add('text-red-500');
      }
    }
    
    // Fonction pour envoyer un message
    async function sendChatMessage() {
      const message = chatInput.value.trim();
      if (!message) return;
      
      try {
        chatInput.disabled = true;
        chatSend.disabled = true;
        chatStatus.textContent = 'Envoi du message...';
        chatStatus.classList.remove('text-red-500');
        
        const formData = new FormData();
        formData.append('annonce_id', annonceId);
        formData.append('message', message);
        
        const response = await fetch('../backend/chat/send_message.php', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Erreur lors de l'envoi du message");
        }
        
        // Réinitialiser le champ de saisie
        chatInput.value = '';
        
        // Afficher le nouveau message immédiatement
        loadChatMessages();
        
        chatStatus.textContent = '';
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        chatStatus.textContent = error.message || 'Erreur lors de l\'envoi du message';
        chatStatus.classList.add('text-red-500');
      } finally {
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.focus();
      }
    }
    
    // Charger les messages initiaux
    await loadChatMessages();
    
    // Configurer le polling pour les nouveaux messages (toutes les 5 secondes)
    chatPollingInterval = setInterval(loadChatMessages, 5000);
    
    // Ajouter les écouteurs d'événements
    chatSend.addEventListener('click', sendChatMessage);
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }
}

/**
 * Initialise la carte Google Maps pour la vue détaillée
 * @param {Object} annonceData - Données de l'annonce
 */
async function initializeDetailMap(annonceData) {
  // Conteneur de la carte
  const mapContainer = document.getElementById('detail-map');
  if (!mapContainer) return;
  
  // Vérifier si nous avons des coordonnées ou si nous devons géocoder l'adresse
  let lat, lng;
  
  if (annonceData.latitude && annonceData.longitude) {
    lat = parseFloat(annonceData.latitude);
    lng = parseFloat(annonceData.longitude);
    createMap(lat, lng);
  } else {
    // Construire l'adresse complète pour le géocodage
    let adresseComplete = '';
    if (annonceData.address) {
      adresseComplete = annonceData.address;
    } else if (annonceData.adresse) {
      adresseComplete = annonceData.adresse;
    } else {
      if (annonceData.lieu) adresseComplete += annonceData.lieu;
      if (annonceData.ville) {
        if (adresseComplete) adresseComplete += ', ';
        adresseComplete += annonceData.ville;
      }
      if (annonceData.code_postal) {
        if (adresseComplete) adresseComplete += ' ';
        adresseComplete += annonceData.code_postal;
      }
    }
    
    if (adresseComplete) {
      // Géocoder l'adresse
      mapContainer.innerHTML = `
        <div class="h-full flex items-center justify-center flex-col">
          <p class="text-gray-400 text-sm">Localisation de l'adresse...</p>
          <p class="text-gray-400 text-xs">${adresseComplete}</p>
        </div>
      `;
      
      // Charger l'API Google Maps si nécessaire
      if (!window.google || !window.google.maps) {
        try {
          await new Promise((resolve, reject) => {
            loadGoogleMapsApiWithCallback('detailMapCallback', resolve, 'places,geocode');
            // Ajouter un timeout pour éviter d'attendre indéfiniment
            setTimeout(() => reject(new Error('Timeout lors du chargement de l\'API Google Maps')), 10000);
          });
        } catch (error) {
          console.error('Erreur lors du chargement de l\'API Google Maps:', error);
          mapContainer.innerHTML = `
            <div class="h-full flex items-center justify-center flex-col">
              <p class="text-red-400 text-sm">Impossible de charger la carte</p>
              <p class="text-gray-400 text-xs">${adresseComplete}</p>
            </div>
          `;
          return;
        }
      }
      
      // Géocoder l'adresse
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: adresseComplete }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          lat = location.lat();
          lng = location.lng();
          createMap(lat, lng);
        } else {
          console.warn(`Échec du géocodage pour "${adresseComplete}": ${status}`);
          mapContainer.innerHTML = `
            <div class="h-full flex items-center justify-center flex-col">
              <p class="text-red-400 text-sm">Géolocalisation impossible</p>
              <p class="text-gray-400 text-xs">${adresseComplete}</p>
            </div>
          `;
        }
      });
    } else {
      // Pas d'adresse disponible
      mapContainer.innerHTML = `
        <div class="h-full flex items-center justify-center flex-col">
          <p class="text-gray-400 text-sm">Coordonnées non disponibles</p>
        </div>
      `;
    }
  }
  
  function createMap(lat, lng) {
    // S'assurer que l'API Google Maps est chargée
    if (!window.google || !window.google.maps) {
      loadGoogleMapsApiWithCallback('detailMapCallback', () => {
        createMap(lat, lng);
      }, 'places');
      return;
    }
    
    // Forcer l'affichage du conteneur
    mapContainer.style.display = 'block';
    
    // Créer la carte
    const map = new google.maps.Map(mapContainer, {
      center: { lat, lng },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true
    });
    
    // Améliorer le redimensionnement pour éviter les problèmes d'affichage
    window.addEventListener('resize', () => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat, lng });
    });
    
    // Forcer plusieurs redimensionnements de la carte
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat, lng });
    }, 100);
    
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat, lng });
    }, 500);
    
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat, lng });
    }, 1000);
    
    // Créer le contenu du marqueur
    const markerContent = document.createElement('div');
    markerContent.className = 'marker-content';
    markerContent.innerHTML = `
      <div style="background-color: #4285F4; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">
        ●
      </div>
    `;
    
    // Créer le marqueur
    let marker;
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat, lng },
        title: annonceData.titre || 'Événement',
        content: markerContent
      });
    } else {
      marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: annonceData.titre || 'Événement'
      });
    }
    
    // Créer l'infowindow
    const infoContent = document.createElement('div');
    infoContent.className = 'p-3';
    infoContent.style.maxWidth = '300px';
    
    const titleElement = document.createElement('strong');
    titleElement.className = 'text-blue-800 text-base block mb-2';
    titleElement.textContent = annonceData.titre || 'Événement';
    infoContent.appendChild(titleElement);
    
    // Construire l'adresse complète
    let adresseComplete = '';
    if (annonceData.address) {
      adresseComplete = annonceData.address;
    } else if (annonceData.adresse) {
      adresseComplete = annonceData.adresse;
    } else {
      if (annonceData.lieu) adresseComplete += annonceData.lieu;
      if (annonceData.ville) {
        if (adresseComplete) adresseComplete += ', ';
        adresseComplete += annonceData.ville;
      }
      if (annonceData.code_postal) {
        if (adresseComplete) adresseComplete += ' ';
        adresseComplete += annonceData.code_postal;
      }
    }
    
    if (adresseComplete) {
      const addressElement = document.createElement('p');
      addressElement.className = 'text-gray-700 text-sm mb-2';
      addressElement.textContent = adresseComplete;
      infoContent.appendChild(addressElement);
    }
    
    const dateElement = document.createElement('p');
    dateElement.className = 'text-gray-700 text-sm mb-3';
    dateElement.textContent = `Date: ${annonceData.date_activite}`;
    infoContent.appendChild(dateElement);
    
    // Ajouter un lien pour ouvrir dans Google Maps
    const mapLink = document.createElement('a');
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    mapLink.target = '_blank';
    mapLink.className = 'text-sm text-blue-600 hover:text-blue-800 hover:underline block mt-2';
    mapLink.textContent = 'Ouvrir dans Google Maps';
    infoContent.appendChild(mapLink);
    
    const infoWindow = new google.maps.InfoWindow({
      content: infoContent
    });
    
    // Ouvrir l'infoWindow au chargement
    setTimeout(() => {
      infoWindow.open(map, marker);
    }, 500);
    
    // Réouvrir l'infoWindow au clic sur le marqueur
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      marker.addEventListener('click', () => {
        infoWindow.open(map, marker);
      });
    } else {
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    }
  }
} 