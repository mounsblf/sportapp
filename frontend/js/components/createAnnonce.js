import renderDashboard from "./dashboard.js";

export default function renderCreateAnnonce(container) {
  container.innerHTML = `
    <section class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-center">Créer une annonce</h2>
      <form id="createForm" class="space-y-4">
        <input type="text" name="titre" placeholder="Titre de l'annonce" class="w-full border px-3 py-2 rounded" required />
        <textarea name="description" placeholder="Description" class="w-full border px-3 py-2 rounded"></textarea>
        <input type="text" name="lieu" placeholder="Lieu (ex: Parc, Terrain de sport, etc.)" class="w-full border px-3 py-2 rounded" required />
        <div class="relative">
          <div class="flex items-center">
            <input type="text" name="adresse" id="autocomplete" placeholder="Adresse précise" class="w-full border px-3 py-2 rounded" required />
            <button type="button" id="geolocateBtn" class="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Utiliser ma position actuelle">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
              </svg>
            </button>
          </div>
          <div id="addressError" class="text-red-500 text-sm mt-1 hidden"></div>
          <div id="geolocateStatus" class="text-sm mt-1 hidden"></div>
        </div>
        <input type="hidden" name="latitude" id="latitude" />
        <input type="hidden" name="longitude" id="longitude" />
        <input type="date" name="date_activite" class="w-full border px-3 py-2 rounded" required />
        <select name="sport" class="w-full border px-3 py-2 rounded" required>
          <option value="">-- Choisissez un sport --</option>
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
        <input type="number" name="places_max" placeholder="Nombre de places" class="w-full border px-3 py-2 rounded" required />
        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">Publier</button>
      </form>
      <p id="createMessage" class="text-center text-sm mt-3"></p>
    </section>
    <button id="backToDashboard" type="button" class="text-sm text-blue-600 hover:underline mt-4 block mx-auto">Retour au Dashboard</button>
  `;

  const backBtn = document.getElementById('backToDashboard');
    
  backBtn.addEventListener('click', () => {
    const app = document.getElementById('app');
    renderDashboard(app);
  });

  const form = container.querySelector('#createForm');
  const message = container.querySelector('#createMessage');
  const geolocateBtn = document.getElementById('geolocateBtn');
  const geolocateStatus = document.getElementById('geolocateStatus');

  // Empêche la sélection de dates passées
  const dateInput = form.querySelector('input[name="date_activite"]');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Fonction pour gérer la géolocalisation
  function handleGeolocation() {
    if (!navigator.geolocation) {
      showGeolocateStatus("La géolocalisation n'est pas supportée par votre navigateur", "red");
      return;
    }

    showGeolocateStatus("Récupération de votre position...", "blue");
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        
        // Mettre à jour les champs cachés
        document.getElementById("latitude").value = latitude;
        document.getElementById("longitude").value = longitude;
        
        // Faire une géocodage inverse pour obtenir l'adresse à partir des coordonnées
        if (window.google && window.google.maps) {
          const geocoder = new google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };
          
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results[0]) {
              const addressInput = document.getElementById("autocomplete");
              addressInput.value = results[0].formatted_address;
              
              // Essayer de remplir le champ lieu si possible
              const lieuInput = document.querySelector('input[name="lieu"]');
              if (!lieuInput.value) {
                for (const component of results) {
                  for (const addressComponent of component.address_components) {
                    if (addressComponent.types.includes("locality") || 
                        addressComponent.types.includes("neighborhood") ||
                        addressComponent.types.includes("sublocality")) {
                      lieuInput.value = addressComponent.long_name;
                      break;
                    }
                  }
                  if (lieuInput.value) break;
                }
              }
              
              showGeolocateStatus("Position récupérée avec succès!", "green");
              setTimeout(() => { hideGeolocateStatus(); }, 3000);
            } else {
              showGeolocateStatus("Impossible de déterminer l'adresse pour cette position", "red");
            }
          });
        } else {
          showGeolocateStatus("API Google Maps non disponible", "red");
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
        
        showGeolocateStatus(errorMsg, "red");
      }
    );
  }

  function showGeolocateStatus(message, color) {
    geolocateStatus.textContent = message;
    geolocateStatus.style.color = color;
    geolocateStatus.classList.remove("hidden");
  }

  function hideGeolocateStatus() {
    geolocateStatus.classList.add("hidden");
  }

  // Ajouter l'événement au bouton de géolocalisation
  if (geolocateBtn) {
    geolocateBtn.addEventListener('click', handleGeolocation);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch('../backend/annonces/create.php', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      message.innerText = data.message || data.error;
      message.style.color = data.error ? 'red' : 'green';
      if (!data.error){
        form.reset();
        message.innerText = 'Annonce créé avec succès. Redirection ..';
        setTimeout(() => {
          const app = document.getElementById('app');
          renderDashboard(app);
        })
      }
    } catch (err) {
      message.innerText = "Erreur lors de la création de l'annonce.";
      message.style.color = 'red';
    }
  });

  // Initialiser l'autocomplete Google Maps
  function initAutocomplete() {
    const input = document.getElementById("autocomplete");
    const addressError = document.getElementById("addressError");
    
    if (input && window.google && window.google.maps) {
      // Vérifier si la nouvelle API PlaceAutocompleteElement est disponible
      if (google.maps.places && google.maps.places.PlaceAutocompleteElement) {
        console.log("Utilisation de PlaceAutocompleteElement (recommandé) pour les adresses");
        
        try {
          // Créer un conteneur pour l'élément d'autocomplétion
          const autocompleteContainer = document.createElement('div');
          autocompleteContainer.className = 'gmp-autocomplete-container';
          
          // Masquer temporairement le champ de saisie existant mais garder sa taille
          input.style.visibility = 'hidden';
          input.style.position = 'absolute';
          
          // Insérer le conteneur au même endroit que le champ d'entrée
          const parentDiv = input.parentElement;
          parentDiv.insertBefore(autocompleteContainer, input);
          
          // Créer le nouvel élément d'autocomplétion
          const autocompleteElement = new google.maps.places.PlaceAutocompleteElement({
            types: ["address"],
            componentRestrictions: { country: "fr" },
            fields: ["address_components", "geometry", "formatted_address"]
          });
          
          // Ajouter l'élément au conteneur
          autocompleteContainer.appendChild(autocompleteElement);
          
          // Personnaliser le style pour qu'il corresponde au reste du formulaire
          const autocompleteInput = autocompleteContainer.querySelector('input');
          if (autocompleteInput) {
            autocompleteInput.className = input.className;
            autocompleteInput.placeholder = input.placeholder;
            
            // S'assurer que l'input a la bonne taille
            autocompleteInput.style.width = '100%';
          } else {
            // Si l'élément input n'est pas trouvé, réafficher l'input original
            console.error("L'élément input d'autocomplétion n'a pas été trouvé");
            input.style.visibility = 'visible';
            input.style.position = 'static';
            parentDiv.removeChild(autocompleteContainer);
            
            // Utiliser l'ancien autocomplete comme fallback
            useOldAutocomplete();
            return;
          }
          
          // Gérer l'événement de sélection d'un lieu
          autocompleteElement.addEventListener('gmp-placeselect', (event) => {
            const place = event.detail.place;
            
            if (!place || !place.geometry) {
              // Adresse invalide
              addressError.textContent = "Veuillez sélectionner une adresse valide dans la liste";
              addressError.classList.remove("hidden");
              document.getElementById("latitude").value = "";
              document.getElementById("longitude").value = "";
              return;
            }
            
            // Adresse valide sélectionnée
            addressError.classList.add("hidden");
            document.getElementById("latitude").value = place.geometry.location.lat();
            document.getElementById("longitude").value = place.geometry.location.lng();
            
            // Mettre à jour le champ caché
            input.value = place.formatted_address || '';
            
            // Remplir automatiquement le champ lieu si vide
            const lieuInput = document.querySelector('input[name="lieu"]');
            if (!lieuInput.value && place.address_components) {
              // Chercher le nom du lieu dans les composants d'adresse
              for (const component of place.address_components) {
                if (component.types.includes("park") || 
                    component.types.includes("stadium") || 
                    component.types.includes("sports_complex") ||
                    component.types.includes("locality") ||
                    component.types.includes("neighborhood")) {
                  lieuInput.value = component.long_name;
                  break;
                }
              }
            }
          });
        } catch (error) {
          console.error("Erreur lors de l'initialisation de PlaceAutocompleteElement:", error);
          // Fallback sur l'ancien Autocomplete
          useOldAutocomplete();
        }
      } else {
        console.log("Utilisation de l'ancien Autocomplete (déprécié) pour les adresses");
        useOldAutocomplete();
      }

      // Fonction pour utiliser l'ancien Autocomplete comme fallback
      function useOldAutocomplete() {
        // S'assurer que l'input est visible
        input.style.display = '';
        input.style.visibility = 'visible';
        input.style.position = 'static';
        
        // Fallback sur l'ancien Autocomplete
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["address"],
        componentRestrictions: { country: "fr" },
        fields: ["address_components", "geometry", "formatted_address"]
      });

      // Gérer la sélection d'une adresse
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
          // L'utilisateur a entré une adresse invalide
          addressError.textContent = "Veuillez sélectionner une adresse valide dans la liste";
          addressError.classList.remove("hidden");
          document.getElementById("latitude").value = "";
          document.getElementById("longitude").value = "";
          return;
        }

        // Adresse valide sélectionnée
        addressError.classList.add("hidden");
        document.getElementById("latitude").value = place.geometry.location.lat();
        document.getElementById("longitude").value = place.geometry.location.lng();
        
        // Remplir automatiquement le champ lieu si vide
        const lieuInput = document.querySelector('input[name="lieu"]');
        if (!lieuInput.value) {
          // Chercher le nom du lieu dans les composants d'adresse
          const addressComponents = place.address_components;
          for (const component of addressComponents) {
            if (component.types.includes("park") || 
                component.types.includes("stadium") || 
                component.types.includes("sports_complex") ||
                component.types.includes("locality") ||
                component.types.includes("neighborhood")) {
              lieuInput.value = component.long_name;
              break;
            }
          }
        }
      });
      }

      // Gérer la saisie manuelle (pour les deux versions)
      input.addEventListener("input", () => {
        if (!input.value) {
          document.getElementById("latitude").value = "";
          document.getElementById("longitude").value = "";
        }
      });
    }
  }

  // Charger l'API Google Maps si nécessaire
  if (!window.google || !window.google.maps) {
    import('../utils/googleMapsLoader.js').then(module => {
      const { loadGoogleMapsApiWithCallback } = module;
      loadGoogleMapsApiWithCallback('initAutocomplete', initAutocomplete, 'places');
    }).catch(error => {
      console.error('Erreur lors du chargement du module Google Maps Loader:', error);
      const addressError = document.getElementById("addressError");
      if (addressError) {
        addressError.textContent = "Fonctionnalité d'autocomplete non disponible actuellement";
        addressError.classList.remove("hidden");
      }
    });
  } else {
    initAutocomplete();
  }
}
