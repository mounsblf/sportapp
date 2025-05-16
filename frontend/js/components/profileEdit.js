/**
 * Composant d'édition de profil utilisateur
 * @param {HTMLElement} container - Conteneur où afficher l'interface
 */
export default function renderProfileEdit(container) {
  // Afficher un loader pendant le chargement des données
  container.innerHTML = `
    <div class="max-w-4xl mx-auto py-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-8">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
          <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  `;

  // Récupérer les informations du profil depuis le backend
  fetchUserProfile(container);
}

/**
 * Récupère les informations du profil utilisateur
 * @param {HTMLElement} container - Conteneur où afficher l'interface
 */
function fetchUserProfile(container) {
  fetch('../backend/user/get_profile.php')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showError(container, data.error);
        return;
      }
      
      // Afficher le formulaire d'édition avec les données de l'utilisateur
      renderEditForm(container, data.user);
    })
    .catch(error => {
      showError(container, 'Erreur de connexion au serveur');
      console.error('Erreur:', error);
    });
}

/**
 * Affiche un message d'erreur
 * @param {HTMLElement} container - Conteneur où afficher l'erreur
 * @param {string} message - Message d'erreur
 */
function showError(container, message) {
  container.innerHTML = `
    <div class="max-w-4xl mx-auto py-8">
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-center">
        ${message}
      </div>
      <div class="text-center">
        <button id="backToProfile" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
          Retour au profil
        </button>
      </div>
    </div>
  `;
  
  container.querySelector('#backToProfile').addEventListener('click', () => {
    import('./profile.js').then(module => {
      const renderProfile = module.default;
      renderProfile(container);
    });
  });
}

/**
 * Affiche le formulaire d'édition du profil
 * @param {HTMLElement} container - Conteneur où afficher le formulaire
 * @param {Object} user - Données de l'utilisateur
 */
function renderEditForm(container, user) {
  const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });
  
  container.innerHTML = `
    <div class="max-w-4xl mx-auto py-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div class="border-b border-gray-200 py-4 px-6">
          <h1 class="text-2xl font-bold text-gray-800">Modifier mon profil</h1>
          <p class="text-gray-600 text-sm">Membre depuis ${joinDate}</p>
        </div>
        
        <form id="profileForm" class="p-6">
          <!-- Informations de base -->
          <div class="mb-6">
            <h2 class="text-lg font-medium text-gray-700 mb-4">Informations personnelles</h2>
            
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" value="${user.username}" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" value="${user.email}" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input type="text" id="city" name="city" value="${user.city || ''}"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="sport_preference" class="block text-sm font-medium text-gray-700 mb-1">Sport préféré</label>
                <select id="sport_preference" name="sport_preference"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" ${!user.sport_preference ? 'selected' : ''}>Choisir un sport</option>
                  <option value="Football" ${user.sport_preference === 'Football' ? 'selected' : ''}>Football</option>
                  <option value="Basketball" ${user.sport_preference === 'Basketball' ? 'selected' : ''}>Basketball</option>
                  <option value="Tennis" ${user.sport_preference === 'Tennis' ? 'selected' : ''}>Tennis</option>
                  <option value="Cyclisme" ${user.sport_preference === 'Cyclisme' ? 'selected' : ''}>Cyclisme</option>
                  <option value="Course à pied" ${user.sport_preference === 'Course à pied' ? 'selected' : ''}>Course à pied</option>
                  <option value="Natation" ${user.sport_preference === 'Natation' ? 'selected' : ''}>Natation</option>
                  <option value="Yoga" ${user.sport_preference === 'Yoga' ? 'selected' : ''}>Yoga</option>
                  <option value="Autre" ${user.sport_preference && !['Football', 'Basketball', 'Tennis', 'Cyclisme', 'Course à pied', 'Natation', 'Yoga'].includes(user.sport_preference) ? 'selected' : ''}>Autre</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Modification du mot de passe (optionnel) -->
          <div class="mb-6">
            <h2 class="text-lg font-medium text-gray-700 mb-1">Changer le mot de passe</h2>
            <p class="text-sm text-gray-500 mb-4">Laissez vide si vous ne souhaitez pas modifier votre mot de passe</p>
            
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label for="current_password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                <input type="password" id="current_password" name="current_password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="new_password" class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <input type="password" id="new_password" name="new_password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>
          
          <!-- Messages d'erreur ou de succès -->
          <div id="formMessage" class="mb-6 hidden"></div>
          
          <!-- Boutons d'action -->
          <div class="flex items-center justify-between gap-4">
            <button type="button" id="cancelEdit" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Gérer l'annulation de l'édition
  container.querySelector('#cancelEdit').addEventListener('click', () => {
    import('./profile.js').then(module => {
      const renderProfile = module.default;
      renderProfile(container);
    });
  });
  
  // Gérer la soumission du formulaire
  container.querySelector('#profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Créer un objet FormData pour envoyer les données
    const formData = new FormData(e.target);
    
    // Si les champs de mot de passe sont vides, les supprimer du FormData
    if (!formData.get('current_password') && !formData.get('new_password')) {
      formData.delete('current_password');
      formData.delete('new_password');
    }
    
    // Afficher un indicateur de chargement
    const formMessage = container.querySelector('#formMessage');
    formMessage.innerHTML = `
      <div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-center">
        <div class="flex items-center justify-center">
          <svg class="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mise à jour en cours...
        </div>
      </div>
    `;
    formMessage.classList.remove('hidden');
    
    // Envoyer les données au serveur
    fetch('../backend/user/update_profile.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        // Afficher l'erreur
        formMessage.innerHTML = `
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
            ${data.error}
          </div>
        `;
        return;
      }
      
      // Mettre à jour le nom d'utilisateur dans le localStorage si changé
      if (data.username) {
        localStorage.setItem('username', data.username);
      }
      
      // Afficher le message de succès
      formMessage.innerHTML = `
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
          ${data.message}
        </div>
      `;
      
      // Rediriger vers le profil après 2 secondes
      setTimeout(() => {
        import('./profile.js').then(module => {
          const renderProfile = module.default;
          renderProfile(container);
        });
      }, 2000);
    })
    .catch(error => {
      // Afficher une erreur générique en cas de problème
      formMessage.innerHTML = `
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
          Erreur de connexion au serveur. Veuillez réessayer.
        </div>
      `;
      console.error('Erreur:', error);
    });
  });
} 