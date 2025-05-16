/**
 * Composant de formulaire d'authentification
 * Gère à la fois la connexion et l'inscription des utilisateurs
 */

import { loadGoogleMapsApiWithCallback } from '../utils/googleMapsLoader.js';

/**
 * Rendu du formulaire d'authentification dans le conteneur spécifié
 * @param {HTMLElement} container - Élément DOM où afficher le formulaire
 */
export default function renderAuthForm(container) {
  // Sauvegarde de la référence du conteneur pour une utilisation ultérieure
  const appContainer = container;
  
  // Initialiser le contenu HTML du conteneur 
  appContainer.innerHTML = `
    <div class="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Animation sportive -->
      <div class="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-r-[3rem]">
        <div class="relative w-64 h-64">
          <!-- Ballon de football animé -->
          <div class="absolute w-16 h-16 bg-white rounded-full animate-bounce" style="animation-duration: 2s;">
            <div class="w-full h-full rounded-full border-4 border-black"></div>
          </div>
          <!-- Silhouette de sportif -->
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48">
            <div class="w-8 h-24 bg-white rounded-full mx-auto animate-pulse"></div>
            <div class="w-16 h-16 bg-white rounded-full mx-auto mt-2"></div>
          </div>
        </div>
      </div>
      
      <!-- Formulaire d'authentification -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
        <section class="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl transform transition-all hover:scale-105">
          <h2 class="text-3xl font-bold mb-6 text-center text-gray-800" id="formTitle">Connexion</h2>
          <form id="authForm" class="space-y-6">
            <!-- Email toujours visible par défaut (mode connexion) -->
            <div class="relative">
              <input type="email" name="email" placeholder="Email" 
                class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                required autocomplete="email" />
            </div>
            <!-- Nom d'utilisateur (caché en mode connexion, visible en mode inscription) -->
            <div class="relative">
              <input type="text" name="username" placeholder="Nom d'utilisateur" 
                class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all hidden" />
            </div>
            <!-- Mot de passe toujours visible -->
            <div class="relative">
              <input type="password" name="password" placeholder="Mot de passe" 
                class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                required />
            </div>
            <!-- Champs additionnels pour l'inscription (cachés par défaut) -->
            <div id="cityContainer" class="hidden">
              <div class="flex items-center gap-2">
                <div class="relative flex-grow">
                  <input type="text" id="cityInput" name="city" placeholder="Rechercher une ville" 
                    class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                    autocomplete="off" />
                  <div id="locationStatus" class="text-xs mt-1 hidden"></div>
                </div>
                <button type="button" id="detectLocationBtn" 
                  class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center transition-all hover:scale-105" 
                  title="Détecter ma position">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
                  </svg>
                </button>
              </div>
              <input type="hidden" name="city_lat" id="cityLat" />
              <input type="hidden" name="city_lng" id="cityLng" />
            </div>
            <!-- Liste déroulante des sports (cachée par défaut) -->
            <select name="sport" 
              class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all hidden">
              <option value="">-- Choisissez un sport --</option>
              <!-- Options de sports disponibles -->
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
              <option value="Paddle">Paddle</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Rugby">Rugby</option>
              <option value="Natation">Natation</option>
              <option value="Course à pied">Course à pied</option>
              <option value="Cyclisme">Cyclisme</option>
              <option value="Randonnée">Randonnée</option>
              <option value="Escalade">Escalade</option>
              <option value="Boxe">Boxe</option>
              <option value="Badminton">Badminton</option>
              <option value="Danse">Danse</option>
              <option value="Yoga">Yoga</option>
              <option value="Fitness">Fitness</option>
              <option value="Musculation">Musculation</option>
              <option value="Ski">Ski</option>
              <option value="Snowboard">Snowboard</option>
              <option value="Surf">Surf</option>
            </select>
            <!-- Bouton de soumission du formulaire -->
            <button type="submit" 
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-105 transform">
              Se connecter
            </button>
          </form>
          <!-- Zone pour afficher les messages temporaires (succès/erreur) avec animation de fondu -->
          <p id="authMessage" class="text-center text-sm mt-4 transition-opacity duration-500 opacity-0"></p>
          <!-- Bouton pour basculer entre les modes connexion et inscription -->
          <button id="toggleAuth" 
            class="text-blue-600 hover:text-blue-800 text-sm mt-6 block text-center transition-colors">
            Créer un compte
          </button>
        </section>
      </div>
    </div>
  `;

  // Récupération des références aux éléments DOM importants pour manipulation
  const form = container.querySelector('#authForm');
  const message = container.querySelector('#authMessage');
  const toggle = container.querySelector('#toggleAuth');
  const formTitle = container.querySelector('#formTitle');
  const email = form.querySelector('input[name="email"]');
  const username = form.querySelector('input[name="username"]');
  const cityContainer = container.querySelector('#cityContainer');
  const cityInput = container.querySelector('#cityInput');
  const cityLat = container.querySelector('#cityLat');
  const cityLng = container.querySelector('#cityLng');
  const detectLocationBtn = container.querySelector('#detectLocationBtn');
  const locationStatus = container.querySelector('#locationStatus');
  const sport = form.querySelector('select[name="sport"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Initialiser Google Maps pour l'autocomplétion des villes
  function initializeGoogleMapsAutocomplete() {
    // Chargement de l'API Google Maps avec callback
    loadGoogleMapsApiWithCallback('initGoogleAutocomplete', () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error('Google Maps API non disponible');
        showLocationStatus("Service de recherche de ville non disponible", "red");
        return;
      }

      console.log('Initialisation de l\'autocomplétion Google Maps');
      
      // Création de l'objet Autocomplete standard
      const autocomplete = new google.maps.places.Autocomplete(cityInput, {
        types: ['(cities)'],
        fields: ['geometry', 'name', 'address_components']
      });

      // Écouter l'événement de sélection d'un lieu
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place || !place.geometry) {
          showLocationStatus("Veuillez sélectionner une ville dans la liste", "red");
          cityLat.value = '';
          cityLng.value = '';
          return;
        }
        
        // Extraire les coordonnées
        cityLat.value = place.geometry.location.lat();
        cityLng.value = place.geometry.location.lng();
        
        // Trouver le nom de la ville dans les composants d'adresse
        let cityName = place.name;
        if (place.address_components) {
          for (const component of place.address_components) {
            if (component.types.includes('locality') || 
                component.types.includes('administrative_area_level_1')) {
              cityName = component.long_name;
              break;
            }
          }
        }
        
        // Mettre à jour le champ avec le nom de la ville
        cityInput.value = cityName;
        showLocationStatus(`Ville sélectionnée : ${cityName}`, "green");
      });
      
      // Empêcher la soumission du formulaire quand on appuie sur Entrée dans le champ ville
      cityInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      });
    });
  }

  // Fonction pour afficher les messages de statut de localisation
  function showLocationStatus(message, color) {
    locationStatus.textContent = message;
    locationStatus.style.color = color === "red" ? "#ef4444" : 
                                 color === "green" ? "#10b981" : 
                                 color === "blue" ? "#3b82f6" : "#6b7280";
    locationStatus.classList.remove("hidden");
    
    // Cacher le message après 5 secondes pour les succès
    if (color === "green") {
      setTimeout(() => {
        locationStatus.classList.add("hidden");
      }, 5000);
    }
  }

  // Fonction pour gérer la géolocalisation
  function handleGeolocation() {
    if (!navigator.geolocation) {
      showLocationStatus("La géolocalisation n'est pas supportée par votre navigateur", "red");
      return;
    }

    showLocationStatus("Récupération de votre position...", "blue");
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        
        // Mettre à jour les champs cachés
        cityLat.value = latitude;
        cityLng.value = longitude;
        
        // Faire une géocodage inverse pour obtenir la ville à partir des coordonnées
        if (window.google && window.google.maps) {
          const geocoder = new google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };
          
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results[0]) {
              let cityName = "";
              
              // Chercher le composant ville dans les résultats
              for (const result of results) {
                for (const component of result.address_components) {
                  if (component.types.includes("locality") || 
                      component.types.includes("administrative_area_level_1")) {
                    cityName = component.long_name;
                    break;
                  }
                }
                if (cityName) break;
              }
              
              if (cityName) {
                cityInput.value = cityName;
                showLocationStatus("Localisation réussie : " + cityName, "green");
              } else {
                cityInput.value = results[0].formatted_address;
                showLocationStatus("Adresse détectée, veuillez préciser votre ville", "blue");
              }
            } else {
              showLocationStatus("Impossible de déterminer la ville pour cette position", "red");
            }
          });
        } else {
          showLocationStatus("API Google Maps non disponible", "red");
        }
      },
      error => {
        let errorMsg = "Erreur lors de la géolocalisation";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Vous avez refusé la géolocalisation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMsg = "La demande de localisation a expiré";
            break;
        }
        
        showLocationStatus(errorMsg, "red");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  // Ajouter l'événement au bouton de détection de localisation
  detectLocationBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    handleGeolocation();
  });

  // Mode initial du formulaire (connexion par défaut)
  let mode = 'login';

  // Fonction pour basculer vers le mode connexion
  const switchToLoginMode = () => {
    // Masque les champs spécifiques à l'inscription
    username.classList.add('hidden');
    cityContainer.classList.add('hidden');
    sport.classList.add('hidden');
    
    // Retire l'attribut required des champs masqués
    username.removeAttribute('required');
    cityInput.removeAttribute('required');
    sport.removeAttribute('required');
    
    // Met à jour le texte de l'interface
    formTitle.innerText = 'Connexion';
    submitBtn.innerText = 'Se connecter';
    toggle.innerText = 'Créer un compte';
    
    // Change le mode après avoir modifié l'interface
    mode = 'login';
  };

  // Fonction pour basculer vers le mode inscription
  const switchToRegisterMode = () => {
    // Affiche les champs spécifiques à l'inscription
    username.classList.remove('hidden');
    cityContainer.classList.remove('hidden');
    sport.classList.remove('hidden');
    
    // Rend ces champs obligatoires pour l'inscription
    username.setAttribute('required', 'required');
    cityInput.setAttribute('required', 'required');
    sport.setAttribute('required', 'required');
    
    // Met à jour le texte de l'interface
    formTitle.innerText = 'Inscription';
    submitBtn.innerText = "S'inscrire";
    toggle.innerText = 'Déjà inscrit ? Se connecter';
    
    // Change le mode après avoir modifié l'interface
    mode = 'register';
    
    // Initialiser l'autocomplete une fois le champ visible
    initializeGoogleMapsAutocomplete();
  };

  // Gestionnaire d'événement pour basculer entre les modes connexion et inscription
  toggle.addEventListener('click', () => {
    if (mode === 'login') {
      switchToRegisterMode();
    } else {
      switchToLoginMode();
      form.reset(); // Réinitialise le formulaire uniquement quand on retourne à la connexion manuellement
    }
  });

  // Gestionnaire d'événement pour la soumission du formulaire
  form.addEventListener('submit', async (e) => {
    // Empêche le comportement par défaut (rechargement de la page)
    e.preventDefault();
    
    // Validation supplémentaire pour le champ ville en mode inscription
    if (mode === 'register' && cityInput.value.trim() === '') {
      message.innerText = "Veuillez sélectionner une ville valide";
      message.style.color = 'red';
      message.classList.remove('opacity-0');
      message.classList.add('opacity-100');
      
      setTimeout(() => {
        message.classList.remove('opacity-100');
        message.classList.add('opacity-0');
      }, 5000);
      return;
    }
    
    // Désactive le bouton de soumission pendant le traitement
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-70');
    
    // Collecte toutes les données du formulaire
    const formData = new FormData(form);
    
    // Sauvegarde le mode actuel et l'email pour référence ultérieure
    const currentMode = mode;
    const currentEmail = email.value;

    try {
      // Envoi des données au serveur selon le mode actuel
      const res = await fetch(`../backend/auth/${currentMode}.php`, {
        method: 'POST',
        body: formData
      });

      // Traitement de la réponse JSON du serveur
      const data = await res.json();
      
      // Réactive le bouton de soumission
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-70');
      
      // Si erreur, affiche le message d'erreur et termine
      if (data.error) {
        message.innerText = data.error;
        message.style.color = 'red';
        message.classList.remove('opacity-0');
        message.classList.add('opacity-100');
        
        setTimeout(() => {
          message.classList.remove('opacity-100');
          message.classList.add('opacity-0');
        }, 5000);
        return;
      }
      
      // Si succès, affiche le message de succès
      message.innerText = data.message || "Opération réussie";
      message.style.color = 'green';
      message.classList.remove('opacity-0');
      message.classList.add('opacity-100');

      // Traitement spécifique pour l'inscription réussie
      if (currentMode === 'register') {
        console.log("Inscription réussie, préparation du basculement vers connexion");
        
        // Attendre quelques secondes avant de basculer
        setTimeout(() => {
          // Efface le message d'inscription réussie
          message.classList.remove('opacity-100');
          message.classList.add('opacity-0');
          
          // Réinitialise le formulaire
          form.reset();
          
          // Bascule vers le mode connexion
          switchToLoginMode();
          
          // Pré-remplit l'email pour faciliter la connexion
          setTimeout(() => {
            email.value = currentEmail;
            
            // Affiche un nouveau message pour guider l'utilisateur
            message.innerText = "Inscription réussie! Vous pouvez maintenant vous connecter";
            message.style.color = 'green';
            message.classList.remove('opacity-0');
            message.classList.add('opacity-100');
            
            setTimeout(() => {
              message.classList.remove('opacity-100');
              message.classList.add('opacity-0');
            }, 5000);
          }, 100);
        }, 3000);
      } 
      // Si c'est une connexion réussie
      else if (currentMode === 'login' && data.username) {
        console.log('Connexion réussie, envoi de l\'événement avec', data);
        // Cache progressivement le message
        setTimeout(() => {
          message.classList.remove('opacity-100');
          message.classList.add('opacity-0');
        }, 2000);
        
        // Déclenche l'événement de connexion
        const loginEvent = new CustomEvent('userLoggedIn', {
          detail: { username: data.username }
        });
        document.dispatchEvent(loginEvent);
      }
      // Autres cas (messages standards)
      else {
        setTimeout(() => {
          message.classList.remove('opacity-100');
          message.classList.add('opacity-0');
        }, 5000);
      }
    } catch (err) {
      console.error("Erreur lors de la requête:", err);
      
      // Réactive le bouton de soumission en cas d'erreur
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-70');
      
      // Affiche un message d'erreur
      message.innerText = "Une erreur est survenue lors de la communication avec le serveur.";
      message.style.color = 'red';
      message.classList.remove('opacity-0');
      message.classList.add('opacity-100');
      
      setTimeout(() => {
        message.classList.remove('opacity-100');
        message.classList.add('opacity-0');
      }, 5000);
    }
  });
}