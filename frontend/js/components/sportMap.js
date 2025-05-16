/**
 * Module pour afficher une carte interactive des événements sportifs
 */

// Configuration de la carte
// API Key will be fetched from backend
const DEFAULT_LOCATION = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
const DEFAULT_ZOOM = 13;

// Stock global pour les marqueurs et les infobulles
let map, markers = [], infoWindow, activeInfoWindow;
let sidebar, mapContainer, mapInstance, eventsList;
let currentLocation = DEFAULT_LOCATION;
let currentFilters = {
  sport: '',
  radius: 50
};

/**
 * Initialise et affiche la carte interactive
 * @param {HTMLElement} container - Conteneur où afficher la carte
 */
export default function renderSportMap(container) {
  // Créer la structure de base
  container.innerHTML = `
    <div class="max-w-full mx-auto p-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <h1 class="text-2xl font-bold p-4 bg-blue-600 text-white">Carte des événements sportifs</h1>
        
        <!-- Filtres -->
        <div class="p-4 border-b flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Sport</label>
            <select id="sport-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les sports</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
              <option value="Course à pied">Course à pied</option>
              <option value="Cyclisme">Cyclisme</option>
              <option value="Natation">Natation</option>
              <option value="Yoga">Yoga</option>
              <option value="Randonnée">Randonnée</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rayon (km)</label>
            <div class="flex items-center gap-2">
              <input type="range" id="radius-filter" min="1" max="100" value="50" class="flex-1">
              <span id="radius-value" class="text-sm font-medium w-10 text-center">50</span>
            </div>
          </div>
          
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <button id="use-my-location" class="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              Utiliser ma position
            </button>
          </div>
        </div>
        
        <!-- Conteneur pour la carte et la liste -->
        <div class="flex flex-col md:flex-row h-[600px]">
          <!-- Liste des événements (style Airbnb) -->
          <div id="events-sidebar" class="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto border-r border-gray-200 bg-gray-50">
            <div id="events-list" class="p-4 space-y-4">
              <div class="text-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p class="text-gray-500">Chargement des événements...</p>
              </div>
            </div>
          </div>
          
          <!-- Conteneur de la carte -->
          <div id="map-container" class="w-full md:w-2/3 h-1/2 md:h-full">
            <div class="h-full w-full bg-gray-200 flex items-center justify-center">
              <p class="text-gray-500">Chargement de la carte...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bouton retour -->
      <div class="text-center mb-6">
        <button id="back-to-dashboard" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition">
          Retour au tableau de bord
        </button>
      </div>
    </div>
  `;
  
  // Récupérer les éléments du DOM
  sidebar = container.querySelector('#events-sidebar');
  mapContainer = container.querySelector('#map-container');
  eventsList = container.querySelector('#events-list');
  
  // Ajouter les écouteurs d'événements pour les filtres
  container.querySelector('#sport-filter').addEventListener('change', updateFilters);
  container.querySelector('#radius-filter').addEventListener('input', updateRadiusValue);
  container.querySelector('#radius-filter').addEventListener('change', updateFilters);
  container.querySelector('#use-my-location').addEventListener('click', useMyLocation);
  
  // Ajouter l'écouteur pour le bouton retour
  container.querySelector('#back-to-dashboard').addEventListener('click', () => {
    import('./dashboard.js').then(module => {
      const renderDashboard = module.default;
      renderDashboard(document.getElementById('app'));
    });
  });
  
  // Charger l'API Google Maps
  loadGoogleMapsScript();
}

/**
 * Met à jour l'affichage de la valeur du rayon
 */
function updateRadiusValue() {
  const radiusFilter = document.getElementById('radius-filter');
  const radiusValue = document.getElementById('radius-value');
  radiusValue.textContent = radiusFilter.value;
}

/**
 * Met à jour les filtres et recharge les événements
 */
function updateFilters() {
  const sportFilter = document.getElementById('sport-filter');
  const radiusFilter = document.getElementById('radius-filter');
  
  currentFilters.sport = sportFilter.value;
  currentFilters.radius = parseInt(radiusFilter.value);
  
  // Recharger les événements avec les nouveaux filtres
  loadEvents();
}

/**
 * Utilise la géolocalisation du navigateur
 */
function useMyLocation() {
  if (navigator.geolocation) {
    // Afficher un indicateur de chargement
    document.getElementById('use-my-location').innerHTML = `
      <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Localisation...
    `;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Recentrer la carte et recharger les événements
        if (map) {
          map.setCenter(currentLocation);
          
          // Ajouter un marqueur pour la position de l'utilisateur
          if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
            // Utiliser le nouveau marqueur avancé
            const userMarkerContent = document.createElement('div');
            userMarkerContent.innerHTML = '<div style="background-color: #4285F4; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white;">●</div>';
            
            new google.maps.marker.AdvancedMarkerElement({
              map: map,
              position: currentLocation,
              title: 'Votre position',
              content: userMarkerContent
            });
          } else {
            // Fallback sur l'ancien marqueur
          new google.maps.Marker({
            position: currentLocation,
            map: map,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            },
            title: 'Votre position'
          });
          }
        }
        
        loadEvents();
        
        // Restaurer le bouton
        document.getElementById('use-my-location').innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          Utiliser ma position
        `;
      },
      (error) => {
        // Gérer les erreurs de géolocalisation
        console.error('Erreur de géolocalisation:', error);
        
        // Restaurer le bouton avec un message d'erreur
        document.getElementById('use-my-location').innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Localisation impossible
        `;
        
        // Utiliser la position par défaut
        loadEvents();
        
        // Rétablir le bouton normal après 3 secondes
        setTimeout(() => {
          document.getElementById('use-my-location').innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            Utiliser ma position
          `;
        }, 3000);
      }
    );
  } else {
    alert('La géolocalisation n\'est pas supportée par votre navigateur.');
  }
}

/**
 * Charge le script Google Maps
 */
async function loadGoogleMapsScript() {
  if (window.google && window.google.maps) {
    // L'API est déjà chargée
    initMap();
    return;
  }
  
  try {
    // Utiliser le module de chargement de l'API Google Maps
    const { loadGoogleMapsApiWithCallback } = await import('../utils/googleMapsLoader.js');
    loadGoogleMapsApiWithCallback('initMapCallback', initMap, 'places');
  } catch (error) {
    console.error('Erreur lors du chargement de l\'API Google Maps:', error);
    if (mapContainer) {
      mapContainer.innerHTML = '<p class="text-red-500 p-4 text-center">Erreur de chargement de la carte. Veuillez réessayer plus tard.</p>';
    }
  }
}

/**
 * Initialise la carte Google Maps
 */
function initMap() {
  // Options de la carte
  const options = {
    center: currentLocation,
    zoom: DEFAULT_ZOOM,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };
  
  // Créer la carte
  map = new google.maps.Map(mapContainer, options);
  
  // Créer l'infoWindow pour les marqueurs
  infoWindow = new google.maps.InfoWindow();
  
  // Ajouter un événement de clic sur la carte pour fermer l'infoWindow active
  map.addListener('click', () => {
    if (activeInfoWindow) {
      activeInfoWindow.close();
      activeInfoWindow = null;
    }
  });
  
  // Charger les événements
  loadEvents();
}

/**
 * Charge les événements depuis l'API
 */
function loadEvents() {
  // Vider la liste des événements
  eventsList.innerHTML = `
    <div class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-500">Chargement des événements...</p>
    </div>
  `;
  
  // Construire l'URL de l'API avec les paramètres
  let url = `../backend/maps/get_events_map.php?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=${currentFilters.radius}`;
  if (currentFilters.sport) {
    url += `&sport=${encodeURIComponent(currentFilters.sport)}`;
  }
  
  // Ajouter un timestamp pour éviter le cache
  const timestamp = Date.now();
  url += `&t=${timestamp}`;
  
  // Appeler l'API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des événements');
      }
      
      // Effacer les marqueurs existants
      clearMarkers();
      
      // Afficher les événements
      displayEvents(data.events);
    })
    .catch(error => {
      console.error('Erreur:', error);
      eventsList.innerHTML = `
        <div class="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-500 font-medium mb-2">Erreur de chargement</p>
          <p class="text-gray-500">${error.message}</p>
          <button id="retry-loading" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
            Réessayer
          </button>
        </div>
      `;
      
      // Ajouter un écouteur pour réessayer
      document.getElementById('retry-loading')?.addEventListener('click', loadEvents);
    });
}

/**
 * Efface tous les marqueurs de la carte
 */
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

/**
 * Affiche les événements sur la carte et dans la liste
 * @param {Array} events - Liste des événements
 */
function displayEvents(events) {
  if (events.length === 0) {
    eventsList.innerHTML = `
      <div class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <p class="text-gray-500 font-medium mb-2">Aucun événement trouvé</p>
        <p class="text-gray-400">Essayez d'élargir votre recherche ou de changer de filtre</p>
      </div>
    `;
    return;
  }
  
  // Vider la liste des événements
  eventsList.innerHTML = '';
  
  // Afficher le nombre d'événements trouvés
  eventsList.innerHTML = `
    <div class="mb-4 pb-2 border-b border-gray-200">
      <p class="text-gray-700 font-medium">${events.length} événement${events.length > 1 ? 's' : ''} trouvé${events.length > 1 ? 's' : ''}</p>
    </div>
  `;
  
  // Créer un div pour contenir les événements
  const eventsContainer = document.createElement('div');
  eventsContainer.className = 'space-y-4';
  
  // Ajouter chaque événement à la liste et à la carte
  events.forEach((event, index) => {
    // Créer le marqueur sur la carte
    let marker;

    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      // Utiliser le nouveau AdvancedMarkerElement si disponible
      const markerContent = document.createElement('div');
      markerContent.innerHTML = `
        <div style="
          background-color: #3b82f6; 
          color: white; 
          border-radius: 8px; 
          padding: 6px; 
          font-size: 12px; 
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 1px solid #2563eb;"
        >
          ${event.sport || '●'}
        </div>
      `;
      
      marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) },
        title: event.title,
        content: markerContent
      });
    } else {
      // Fallback sur l'ancien Marker
      marker = new google.maps.Marker({
      position: { lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) },
      map: map,
      title: event.title,
      animation: google.maps.Animation.DROP,
      // Retarder l'animation pour un effet en cascade
      animationDelay: index * 100
    });
    
    // Retarder l'animation
    setTimeout(() => {
      marker.setAnimation(google.maps.Animation.DROP);
    }, index * 100);
    }
    
    // Ajouter le marqueur à la liste des marqueurs
    markers.push(marker);
    
    // Créer le contenu de l'infoWindow
    const infoContent = `
      <div class="p-2 max-w-xs">
        <h3 class="font-bold text-gray-800 mb-1">${event.title || 'Sans titre'}</h3>
        <p class="text-sm text-gray-600 mb-1">${event.sport || event.sport_type || 'Sport non spécifié'}</p>
        <p class="text-sm text-gray-600 mb-1">${event.address || 'Adresse non spécifiée'}</p>
        <p class="text-sm text-gray-600 mb-1">À ${event.distance_formatted} de vous</p>
        <p class="text-sm text-blue-600 mb-1">${event.participants_count || 0}/${event.max_participants || 0} participants</p>
        <button
          data-event-id="${event.id}"
          class="show-event-details w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
        >
          Voir les détails
        </button>
      </div>
    `;
    
    // Ajouter un écouteur de clic sur le marqueur
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      // Pour AdvancedMarkerElement
      marker.addEventListener('click', () => {
        // Fermer l'infoWindow active si elle existe
        if (activeInfoWindow) {
          activeInfoWindow.close();
        }
        
        // Définir le contenu et ouvrir la nouvelle infoWindow
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
        activeInfoWindow = infoWindow;
        
        // Ajouter un écouteur pour le bouton de détails
        setTimeout(() => {
          document.querySelector('.show-event-details[data-event-id="' + event.id + '"]')?.addEventListener('click', () => {
            showEventDetails(event.id);
          });
        }, 100);
      });
    } else {
      // Pour l'ancien Marker
    marker.addListener('click', () => {
      // Fermer l'infoWindow active si elle existe
      if (activeInfoWindow) {
        activeInfoWindow.close();
      }
      
      // Définir le contenu et ouvrir la nouvelle infoWindow
      infoWindow.setContent(infoContent);
      infoWindow.open(map, marker);
      activeInfoWindow = infoWindow;
      
      // Ajouter un écouteur pour le bouton de détails
      setTimeout(() => {
        document.querySelector('.show-event-details[data-event-id="' + event.id + '"]')?.addEventListener('click', () => {
          showEventDetails(event.id);
        });
      }, 100);
    });
    }
    
    // Créer l'élément de liste pour cet événement
    const eventElement = document.createElement('div');
    eventElement.className = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer overflow-hidden';
    eventElement.innerHTML = `
      <div class="p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">${event.sport || event.sport_type || 'Sport'}</span>
          <span class="text-sm text-gray-500">${event.distance_formatted}</span>
        </div>
        <h3 class="font-medium text-gray-800 mb-1 truncate">${event.title || 'Sans titre'}</h3>
        <p class="text-sm text-gray-600 mb-2 truncate">${event.address || 'Adresse non spécifiée'}</p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">
            <span class="font-medium ${event.is_full ? 'text-red-600' : 'text-green-600'}">
              ${event.participants_count || 0}/${event.max_participants || 0}
            </span> participants
          </span>
          <span class="text-xs text-gray-500">Par ${event.creator_name || 'Anonyme'}</span>
        </div>
      </div>
    `;
    
    // Ajouter un écouteur de clic sur l'élément de liste
    eventElement.addEventListener('click', () => {
      // Centrer la carte sur cet événement
      map.setCenter({ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) });
      map.setZoom(15);
      
      // Afficher l'infoWindow
      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        // Déclencher un clic manuellement pour le nouveau marqueur
        marker.dispatchEvent(new Event('click'));
      } else {
        // Déclencher un clic via l'API pour l'ancien marqueur
      google.maps.event.trigger(marker, 'click');
      }
      
      // Mettre en évidence cet élément
      document.querySelectorAll('#events-list > div.bg-blue-50').forEach(el => {
        el.classList.remove('bg-blue-50');
        el.classList.add('bg-white');
      });
      eventElement.classList.remove('bg-white');
      eventElement.classList.add('bg-blue-50');
    });
    
    // Ajouter l'élément à la liste
    eventsContainer.appendChild(eventElement);
  });
  
  // Ajouter le conteneur à la liste
  eventsList.appendChild(eventsContainer);
}

/**
 * Affiche les détails d'un événement
 * @param {number} eventId - ID de l'événement
 */
function showEventDetails(eventId) {
  // Rediriger vers la page de détails de l'événement
  import('./annonceDetails.js').then(module => {
    const renderAnnonceDetails = module.default;
    renderAnnonceDetails(document.getElementById('app'), eventId);
  }).catch(err => {
    console.error("Erreur lors du chargement du module annonceDetails:", err);
  });
} 