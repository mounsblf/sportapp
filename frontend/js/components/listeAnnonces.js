/**
 * Module pour afficher la liste des annonces sportives
 * Permet de voir, rejoindre et gérer les annonces d'activités sportives
 */
import renderDashboard from "./dashboard.js";
import renderOtherUserProfile from "./otherUserProfile.js";
import { loadGoogleMapsApiWithCallback } from "../utils/googleMapsLoader.js";

// Tableau pour stocker les informations nécessaires à l'initialisation des mini-cartes
let mapInitQueue = [];

/**
 * Affiche et gère la liste des annonces disponibles
 * @param {HTMLElement} container - Élément DOM où afficher la liste des annonces
 */
export default async function renderListeAnnonces(container) {
    // Réinitialiser la file d'attente des cartes
    mapInitQueue = [];
    
    // Affichage initial avec message de chargement
    container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-2xl font-bold text-blue-800 mb-6">Annonces disponibles</h2>
      <div id="annonceList" class="space-y-6">Chargement...</div>
      <button id="backToDashboard" class="mt-6 text-sm text-blue-600 hover:text-blue-800 hover:underline transition">Retour au Dashboard</button>
    </div>
    `;
    
    const backBtn = container.querySelector('#backToDashboard');
    
    backBtn.addEventListener('click', () => {
      const app = document.getElementById('app');
      renderDashboard(app);
    });

    try {
      // Récupération de toutes les annonces depuis l'API
      const res = await fetch('../backend/annonces/read.php');
      const data = await res.json();
  
      const list = document.getElementById('annonceList');
      // Gestion du cas où aucune annonce n'est disponible
      if (data.length === 0) {
        list.innerHTML = `<p class="text-gray-500 text-center py-8">Aucune annonce disponible.</p>`;
        return;
      }
  
      // Récupération des informations de session de l'utilisateur connecté
      const sessionRes = await fetch('../backend/auth/session.php');
      const sessionData = await sessionRes.json();
  
      // Vide le conteneur avant d'ajouter les nouvelles annonces
      list.innerHTML = '';
      
      // Génération des cartes pour chaque annonce
      for (const annonce of data) {
        // Récupération du nombre de participants pour cette annonce
        const countRes = await fetch(`../backend/participations/count.php?annonce_id=${annonce.id}`);
        const countData = await countRes.json();
        const nbParticipants = countData.count ?? 0;
  
        const card = document.createElement('div');
        card.className = "bg-white border border-blue-100 rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition cursor-pointer";
        card.title = "Cliquez pour voir les détails de l'événement";
        card.setAttribute('data-annonce-id', annonce.id);
        card.innerHTML = `
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 space-y-2">
              <h3 class="text-lg font-semibold text-blue-800">${annonce.titre}</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p><strong class="text-gray-700">Sport :</strong> ${annonce.sport}</p>
                <p><strong class="text-gray-700">Lieu :</strong> ${annonce.lieu}</p>
                <p><strong class="text-gray-700">Date :</strong> ${annonce.date_activite}</p>
                <p><strong class="text-gray-700">Participants :</strong> ${nbParticipants} / ${annonce.places_max}</p>
                <p class="sm:col-span-2"><strong class="text-gray-700">Créée par :</strong> <a href="#" class="text-blue-600 hover:underline user-link" data-username="${annonce.auteur}">${annonce.auteur}</a></p>
              </div>
              
              <p class="text-sm text-gray-600 my-2">${annonce.description || ''}</p>

          <div class="mt-3 flex flex-wrap gap-2 items-center">
                <button data-id="${annonce.id}" class="participation-btn bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-1 rounded-lg text-sm transition">Chargement...</button>
                <button class="toggleParticipantsBtn text-blue-600 hover:text-blue-800 hover:underline text-sm" data-id="${annonce.id}">Voir les participants</button>
              </div>
            </div>
            
            <!-- Mini-carte -->
            <div class="lg:w-[350px] xl:w-[400px] flex-shrink-0">
              <div class="mini-map-container w-full h-[220px] bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all" id="map-${annonce.id}" data-annonce-id="${annonce.id}">
                <div class="h-full flex items-center justify-center">
                  <p class="text-gray-400 text-sm">Chargement de la carte...</p>
                </div>
              </div>
            </div>
          </div>

          <div class="participantsList mt-3 text-sm text-gray-700 p-2 bg-gray-50 rounded-lg" id="participants-${annonce.id}" style="display: none;"></div>
          <div id="msg-${annonce.id}" class="text-sm mt-2"></div>
        `;
  
        // Ajout de la carte au conteneur de liste
        list.appendChild(card);
  
        // Récupérer l'adresse la plus complète possible
        let adresseComplete = '';
        
        if (annonce.address) {
          adresseComplete = annonce.address;
        } else if (annonce.adresse) {
          adresseComplete = annonce.adresse;
        } else {
          // Construire une adresse à partir des informations disponibles
          if (annonce.lieu) adresseComplete += annonce.lieu;
          if (annonce.ville) {
            if (adresseComplete) adresseComplete += ', ';
            adresseComplete += annonce.ville;
          }
          if (annonce.code_postal) {
            if (adresseComplete) adresseComplete += ' ';
            adresseComplete += annonce.code_postal;
          }
          // Si aucune information d'adresse n'est disponible
          if (!adresseComplete) adresseComplete = 'Emplacement non spécifié';
        }

        // Ajouter cette annonce à la file d'attente pour initialiser sa mini-carte
        // Vérifier si nous avons les coordonnées
        if (annonce.latitude && annonce.longitude) {
          console.log(`Annonce ${annonce.id} - Coordonnées [${annonce.latitude}, ${annonce.longitude}]`); 
          
          mapInitQueue.push({
            id: annonce.id,
            lat: parseFloat(annonce.latitude),
            lng: parseFloat(annonce.longitude),
            title: annonce.titre || 'Événement',
            address: adresseComplete
          });
        } else if (adresseComplete && adresseComplete !== 'Emplacement non spécifié') {
          // Si nous avons une adresse mais pas de coordonnées, on ajoute à la file d'attente pour géocodage
          console.log(`Annonce ${annonce.id} - Pas de coordonnées, géocodage de l'adresse: ${adresseComplete}`);
          mapInitQueue.push({
            id: annonce.id,
            address: adresseComplete,
            title: annonce.titre || 'Événement',
            needsGeocoding: true
          });
          
          // Afficher un message temporaire dans le conteneur
          document.getElementById(`map-${annonce.id}`).innerHTML = `
            <div class="h-full flex items-center justify-center flex-col">
              <p class="text-gray-400 text-sm">Localisation de l'adresse...</p>
              <p class="text-gray-400 text-xs">${adresseComplete}</p>
            </div>
          `;
        } else {
          // Si pas de coordonnées ni d'adresse utilisable, afficher un message d'erreur
          console.warn(`Annonce ${annonce.id} - Coordonnées et adresse manquantes`);
          document.getElementById(`map-${annonce.id}`).innerHTML = `
            <div class="h-full flex items-center justify-center flex-col">
              <p class="text-gray-400 text-sm">Coordonnées non disponibles</p>
              <p class="text-gray-400 text-xs">${adresseComplete}</p>
            </div>
          `;
        }
  
        // Récupération des références aux éléments interactifs de la carte
        const btn = card.querySelector('.participation-btn');
        const toggleBtn = card.querySelector('.toggleParticipantsBtn');
        const participantsDiv = card.querySelector(`#participants-${annonce.id}`);
  
        // Vérification si l'utilisateur participe déjà à cette annonce
        const statusRes = await fetch(`../backend/participations/status.php?annonce_id=${annonce.id}`);
        const status = await statusRes.json();
  
        // Vérification du nombre de participants (double vérification pour éviter des problèmes de concurrence)
        const countRes2 = await fetch(`../backend/participations/count.php?annonce_id=${annonce.id}`);
        const countData2 = await countRes2.json();
        const nbParticipants2 = countData2.count ?? 0;
  
        // Détermine si l'annonce est complète (nombre max de participants atteint)
        const isFull = nbParticipants2 >= annonce.places_max;
  
        // État pour confirmer l'annulation (évite les annulations accidentelles)
        let confirmCancel = false;
  
        // Configuration du bouton de participation en fonction de l'état
        if (isFull && !status.participe) {
          // Si l'annonce est complète et que l'utilisateur n'y participe pas
          btn.innerText = "Complet";
          btn.disabled = true;
          btn.classList.add('bg-gray-200', 'text-gray-500');
          btn.classList.remove('bg-blue-100', 'hover:bg-blue-200', 'text-blue-900');
        } else {
          // Adaptation du texte du bouton selon que l'utilisateur participe déjà ou non
          btn.innerText = status.participe ? 'Annuler' : 'Participer';
          
          // Créer un div pour contenir les boutons de confirmation
          const confirmBtnsContainer = document.createElement('div');
          confirmBtnsContainer.className = 'confirm-buttons mt-2 hidden flex gap-2';
          confirmBtnsContainer.innerHTML = `
            <button class="confirm-yes bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition">Confirmer</button>
            <button class="confirm-no bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition">Annuler</button>
          `;
          
          // Ajouter le conteneur après le bouton de participation
          btn.parentNode.insertBefore(confirmBtnsContainer, btn.nextSibling);
          
          // Gestionnaire de clic pour rejoindre ou annuler la participation
          btn.onclick = async () => {
            const formData = new FormData();
            formData.append('annonce_id', annonce.id);
  
            const isCancel = status.participe;
            const msg = document.getElementById(`msg-${annonce.id}`);
  
            // Première étape de confirmation pour annuler
            if (isCancel) {
              // Afficher les boutons de confirmation et masquer le bouton principal
              btn.style.display = 'none';
              confirmBtnsContainer.style.display = 'flex';
              return;
            }
  
            // Sinon, c'est une participation (pas besoin de confirmation)
            const url = '../backend/participations/join.php';
  
            // Envoi de la requête au serveur
            const res = await fetch(url, {
              method: 'POST',
              body: formData
            });
  
            // Traitement de la réponse
            const data = await res.json();
            msg.innerText = data.message || data.error;
            msg.className = `px-5 py-2 text-sm ${data.error ? 'text-red-600' : 'text-green-600'}`;
  
            // Réinitialisation de l'état et mise à jour de l'affichage
            renderListeAnnonces(container);
          };
          
          // Bouton de confirmation "Oui"
          const confirmYesBtn = confirmBtnsContainer.querySelector('.confirm-yes');
          confirmYesBtn.addEventListener('click', async () => {
            const formData = new FormData();
            formData.append('annonce_id', annonce.id);
            const msg = document.getElementById(`msg-${annonce.id}`);
            
            // Envoi de la requête au serveur pour annuler la participation
            const res = await fetch('../backend/participations/cancel.php', {
              method: 'POST',
              body: formData
            });
            
            // Traitement de la réponse
            const data = await res.json();
            msg.innerText = data.message || data.error;
            msg.className = `px-5 py-2 text-sm ${data.error ? 'text-red-600' : 'text-green-600'}`;
            
            // Recharger l'affichage
            renderListeAnnonces(container);
          });
          
          // Bouton de confirmation "Non" (annulation de l'action)
          const confirmNoBtn = confirmBtnsContainer.querySelector('.confirm-no');
          confirmNoBtn.addEventListener('click', () => {
            // Cacher les boutons de confirmation et réafficher le bouton principal
            confirmBtnsContainer.style.display = 'none';
            btn.style.display = 'inline-block';
          });
        }
  
        // Gestionnaire pour afficher/masquer la liste des participants
        toggleBtn.addEventListener('click', async () => {
          if (participantsDiv.style.display === 'none') {
            // Si la liste est cachée, on la charge et l'affiche
            const participantsRes = await fetch(`../backend/participations/participants.php?annonce_id=${annonce.id}`);
            const participants = await participantsRes.json();
  
            participantsDiv.innerHTML = `
              <strong class="text-gray-700">Participants :</strong> ${participants.join(', ') || 'Aucun inscrit.'}
            `;
            participantsDiv.style.display = 'block';
            toggleBtn.innerText = 'Cacher les participants';
          } else {
            // Si la liste est visible, on la cache
            participantsDiv.style.display = 'none';
            toggleBtn.innerText = 'Voir les participants';
          }
        });
  
        // Ajout d'un bouton de suppression si l'utilisateur est l'auteur de l'annonce
        if (sessionData.user_id === annonce.user_id) {
            // Créer le bouton de suppression
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Supprimer cette annonce";
            deleteBtn.className = "mt-3 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition";
            
            // Créer le conteneur pour les boutons de confirmation
            const deleteConfirmContainer = document.createElement('div');
            deleteConfirmContainer.className = 'delete-confirm-buttons mt-3 hidden';
            deleteConfirmContainer.innerHTML = `
              <div class="flex gap-2">
                <button class="delete-confirm-yes bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Confirmer la suppression</button>
                <button class="delete-confirm-no bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">Annuler</button>
              </div>
            `;

            // Gestionnaire pour montrer les boutons de confirmation
            deleteBtn.addEventListener('click', () => {
                deleteBtn.style.display = 'none';
                deleteConfirmContainer.style.display = 'block';
            });
            
            // Gestionnaire pour le bouton "Confirmer la suppression"
            const confirmDeleteBtn = deleteConfirmContainer.querySelector('.delete-confirm-yes');
            confirmDeleteBtn.addEventListener('click', async () => {
            const formData = new FormData();
            formData.append('annonce_id', annonce.id);

            const res = await fetch('../backend/annonces/delete.php', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            alert(data.message || data.error);
            renderListeAnnonces(container);
            });
            
            // Gestionnaire pour le bouton "Annuler"
            const cancelDeleteBtn = deleteConfirmContainer.querySelector('.delete-confirm-no');
            cancelDeleteBtn.addEventListener('click', () => {
                deleteConfirmContainer.style.display = 'none';
                deleteBtn.style.display = 'inline-block';
            });

            // Ajouter les éléments à la carte
            const actionContainer = card.querySelector('.flex.flex-wrap.gap-2');
            actionContainer.appendChild(deleteBtn);
            actionContainer.appendChild(deleteConfirmContainer);
        }

        // Rendre toute la carte cliquable pour aller vers les détails de l'annonce
        card.addEventListener('click', (event) => {
          // Ne pas déclencher le clic sur la carte si l'utilisateur a cliqué sur un bouton ou un autre élément interactif
          if (event.target.closest('button') || event.target.tagName === 'BUTTON' || 
              event.target.closest('.confirm-buttons') || event.target.closest('.delete-confirm-buttons') ||
              event.target.closest('.user-link')) {
            return;
          }
          
          // Importation dynamique pour éviter les dépendances circulaires
          import('./annonceDetails.js').then(module => {
            const renderAnnonceDetails = module.default;
            const app = document.getElementById('app');
            renderAnnonceDetails(app, annonce.id);
          }).catch(err => {
            console.error("Erreur lors du chargement du module annonceDetails:", err);
          });
        });

        // Ajouter un gestionnaire de clic pour les liens utilisateur
        const userLinks = card.querySelectorAll('.user-link');
        userLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Empêcher la propagation de l'événement
            const username = link.dataset.username;
            if (username) {
              const app = document.getElementById('app');
              renderOtherUserProfile(app, username, true);
            }
          });
        });
      }
      
      // Initialiser les mini-cartes après avoir créé tous les éléments
      initMinimaps();
      
    } catch (err) {
      // Gestion des erreurs générales (problèmes réseau, serveur, etc.)
      container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4">
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Erreur lors du chargement des annonces.</p>
            <p class="text-xs mt-1">${err.message || ''}</p>
          </div>
          <button id="backToDashboard" class="mt-6 text-sm text-blue-600 hover:text-blue-800 hover:underline transition">Retour au Dashboard</button>
        </div>
      `;
      console.error(err);
      
      const backBtn = container.querySelector('#backToDashboard');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          const app = document.getElementById('app');
          renderDashboard(app);
        });
      }
    }
}

/**
 * Géocode une adresse textuelle en coordonnées lat/lng
 * @param {string} address - L'adresse à géocoder
 * @returns {Promise<{lat: number, lng: number} | null>} - Les coordonnées ou null si échec
 */
async function geocodeAddress(address) {
  return new Promise((resolve) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error('API Google Maps Geocoder non disponible');
      resolve(null);
      return;
    }
    
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        console.warn(`Échec du géocodage pour "${address}": ${status}`);
        resolve(null);
      }
    });
  });
}

/**
 * Crée les mini-cartes pour chaque annonce dans la file d'attente
 */
function createMiniMaps() {
  console.log('Création des mini-cartes pour', mapInitQueue.length, 'annonces');
  
  // Pour chaque annonce dans la file d'attente, avec gestion du géocodage si nécessaire
  const processMapItem = async (item) => {
    const mapContainer = document.getElementById(`map-${item.id}`);
    
    // Vérifier si le conteneur existe encore
    if (!mapContainer) {
      console.warn(`Conteneur map-${item.id} introuvable`);
      return;
    }
    
    // S'assurer que le conteneur a une taille visible
    mapContainer.style.height = '220px';
    mapContainer.style.width = '100%';
    mapContainer.style.display = 'block'; // Forcer l'affichage
    
    try {
      // Si nous avons besoin de géocoder l'adresse d'abord
      if (item.needsGeocoding) {
        console.log(`Géocodage de l'adresse pour l'annonce ${item.id}: ${item.address}`);
        const coords = await geocodeAddress(item.address);
        
        if (!coords) {
          console.warn(`Impossible de géocoder l'adresse pour l'annonce ${item.id}`);
          mapContainer.innerHTML = `
            <div class="h-full flex items-center justify-center flex-col">
              <p class="text-red-400 text-sm">Géolocalisation impossible</p>
              <p class="text-gray-400 text-xs">${item.address}</p>
            </div>
          `;
          return;
        }
        
        // Mettre à jour avec les coordonnées trouvées
        item.lat = coords.lat;
        item.lng = coords.lng;
        console.log(`Géocodage réussi pour l'annonce ${item.id}: [${item.lat}, ${item.lng}]`);
      }
      
      console.log(`Initialisation de la carte pour l'annonce ${item.id} à la position [${item.lat}, ${item.lng}]`);
      
      // Créer la mini-carte avec des options simplifiées
      const miniMap = new google.maps.Map(mapContainer, {
        center: { lat: item.lat, lng: item.lng },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
      
      // Améliorer le redimensionnement pour résoudre les problèmes d'affichage
      window.addEventListener('resize', () => {
        google.maps.event.trigger(miniMap, 'resize');
        miniMap.setCenter({ lat: item.lat, lng: item.lng });
      });
      
      // Forcer plusieurs redimensionnements pour s'assurer que la carte s'affiche correctement
      setTimeout(() => {
        google.maps.event.trigger(miniMap, 'resize');
        miniMap.setCenter({ lat: item.lat, lng: item.lng });
      }, 100);
      
      setTimeout(() => {
        google.maps.event.trigger(miniMap, 'resize');
        miniMap.setCenter({ lat: item.lat, lng: item.lng });
      }, 500);
      
      setTimeout(() => {
        google.maps.event.trigger(miniMap, 'resize');
        miniMap.setCenter({ lat: item.lat, lng: item.lng });
      }, 1000);
      
      // Créer le contenu du marqueur
      const markerContent = document.createElement('div');
      markerContent.className = 'marker-content';
      markerContent.innerHTML = '<div style="background-color: #4285F4; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">●</div>';
      
      // Utiliser AdvancedMarkerElement au lieu de Marker (API moderne)
      let marker;
      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        // Utiliser le nouveau AdvancedMarkerElement si disponible
        marker = new google.maps.marker.AdvancedMarkerElement({
          map: miniMap,
          position: { lat: item.lat, lng: item.lng },
          title: item.title,
          content: markerContent
        });
      } else {
        // Fallback sur l'ancien Marker si AdvancedMarkerElement n'est pas disponible
        marker = new google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map: miniMap,
          title: item.title
        });
      }
      
      // Améliorer l'infoWindow pour afficher des informations plus détaillées
      const infoContent = document.createElement('div');
      infoContent.className = 'p-3';
      infoContent.style.maxWidth = '240px';
      
      const titleElement = document.createElement('strong');
      titleElement.className = 'text-blue-800 text-sm block mb-1';
      titleElement.textContent = item.title;
      infoContent.appendChild(titleElement);
      
      if (item.address && item.address.trim() !== '') {
        const addressElement = document.createElement('p');
        addressElement.className = 'text-gray-700 text-sm mb-2';
        addressElement.textContent = item.address;
        infoContent.appendChild(addressElement);
      }
      
      // Ajouter un lien pour ouvrir dans Google Maps
      const mapLink = document.createElement('a');
      mapLink.href = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
      mapLink.target = '_blank';
      mapLink.className = 'text-xs text-blue-600 hover:text-blue-800 hover:underline block mt-2';
      mapLink.textContent = 'Voir sur Google Maps';
      infoContent.appendChild(mapLink);
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      
      // Ouvrir l'infoWindow au chargement de la carte pour montrer l'adresse immédiatement
      setTimeout(() => {
        infoWindow.open(miniMap, marker);
      }, 300);
      
      // Réouvrir l'infoWindow au clic sur le marqueur
      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        // Pour AdvancedMarkerElement
        marker.addEventListener('click', () => {
          infoWindow.open(miniMap, marker);
        });
      } else {
        // Pour l'ancien Marker
        marker.addListener('click', () => {
          infoWindow.open(miniMap, marker);
        });
      }
      
      // Ajouter un écouteur de clic sur la carte pour fermer l'infoWindow
      miniMap.addListener('click', () => {
        infoWindow.close();
      });
      
      // Ajouter un attribut pour indiquer que la carte a été initialisée avec succès
      mapContainer.dataset.mapInitialized = "true";
      
    } catch (error) {
      console.error(`Erreur lors de l'initialisation de la carte ${item.id}:`, error);
      mapContainer.innerHTML = `
        <div class="h-full flex items-center justify-center flex-col">
          <p class="text-red-400 text-sm mb-1">Erreur d'affichage de la carte</p>
          <p class="text-gray-400 text-xs">${item.address || 'Adresse non disponible'}</p>
        </div>
      `;
    }
  };
  
  // Traiter les éléments de la file d'attente un par un
  const processQueue = async () => {
    for (const item of mapInitQueue) {
      await processMapItem(item);
    }
    
    // Vider la file d'attente une fois toutes les cartes initialisées
    mapInitQueue = [];
  };
  
  // Lancer le traitement
  processQueue();
}

/**
 * Initialise les mini-cartes Google Maps pour chaque annonce
 */
function initMinimaps() {
  // Ne rien faire s'il n'y a pas de cartes à initialiser
  if (mapInitQueue.length === 0) return;
  
  console.log('Initialisation des mini-cartes pour', mapInitQueue.length, 'annonces');
  
  // Initialiser l'API Google Maps si nécessaire
  if (!window.google || !window.google.maps) {
    console.log('API Google Maps non chargée, chargement en cours...');
    // Charger l'API Google Maps et initialiser les cartes une fois chargée
    loadGoogleMapsApiWithCallback('initMiniMapsCallback', () => {
      console.log('API Google Maps chargée, création des mini-cartes...');
      // On retarde légèrement la création des cartes pour s'assurer que l'API est complètement initialisée
      setTimeout(createMiniMaps, 500);
    }, 'places,geocode');  // Ajout du service de géocodage
  } else {
    console.log('API Google Maps déjà chargée, création des mini-cartes...');
    // L'API est déjà chargée, initialiser les cartes directement mais avec un léger délai
    setTimeout(createMiniMaps, 300);
  }
}
  
  
  
  