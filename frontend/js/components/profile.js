/**
 * Renders the user profile component
 * @param {HTMLElement} container - Container element to render the profile in
 */
export default function renderProfile(container) {
  const username = localStorage.getItem('username');
  
  if (!username) {
    container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-red-600">Vous devez être connecté pour voir votre profil.</p>
        <button id="loginRedirect" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
          Se connecter
        </button>
      </div>
    `;
    
    container.querySelector('#loginRedirect').addEventListener('click', () => {
      window.location.reload();
    });
    
    return;
  }
  
  // Calculate display stats (placeholders for MVP)
  const memberSince = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  const activitiesCount = Math.floor(Math.random() * 5);
  
  // Render the profile UI with improved layout
  container.innerHTML = `
    <div class="max-w-4xl mx-auto py-8">
      <!-- Profile header with user info -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div class="md:flex">
          <div class="md:flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 md:w-48 flex items-center justify-center py-8 md:py-0">
            <div class="rounded-full bg-white p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div class="p-8 w-full">
            <div class="flex flex-wrap items-center justify-between mb-5">
              <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-1">${username}</h2>
                <p class="text-gray-600 text-sm">Membre depuis ${memberSince}</p>
              </div>
              <button id="editProfileBtn" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition text-sm">
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Modifier mon profil
                </span>
              </button>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div class="bg-blue-50 rounded-lg p-3">
                <p class="text-2xl font-bold text-blue-600">${activitiesCount}</p>
                <p class="text-xs text-gray-600">Activités</p>
              </div>
              <div class="bg-indigo-50 rounded-lg p-3">
                <p class="text-2xl font-bold text-indigo-600">0</p>
                <p class="text-xs text-gray-600">Participations</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-3">
                <p class="text-2xl font-bold text-purple-600">0</p>
                <p class="text-xs text-gray-600">Parties d'échecs</p>
              </div>
              <div class="bg-green-50 rounded-lg p-3">
                <p class="text-2xl font-bold text-green-600">⭐</p>
                <p class="text-xs text-gray-600">Novice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Tabs -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex">
            <button class="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium text-sm">Mon activité</button>
            <button class="px-6 py-4 text-gray-500 font-medium text-sm">Statistiques</button>
            <button class="px-6 py-4 text-gray-500 font-medium text-sm">Paramètres</button>
          </nav>
        </div>
        
        <div class="p-6">
          <!-- Mes participations -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium text-gray-800">Mes participations</h3>
              <a href="#" class="text-blue-600 hover:text-blue-800 text-sm">Voir tout</a>
            </div>
            <div id="user-participations" class="text-gray-600 bg-gray-50 rounded-lg p-4">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          
          <!-- Mes annonces -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium text-gray-800">Mes annonces</h3>
              <a href="#" class="text-blue-600 hover:text-blue-800 text-sm">Voir tout</a>
            </div>
            <div id="user-annonces" class="text-gray-600 bg-gray-50 rounded-lg p-4">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          
          <!-- Mes activités en ligne -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium text-gray-800">Mes activités en ligne</h3>
              <a href="#" id="seeAllGames" class="text-blue-600 hover:text-blue-800 text-sm">Voir tout</a>
            </div>
            <div id="user-games" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition">
                <div class="flex items-center">
                  <span class="text-3xl mr-3">♟️</span>
                  <div class="flex-grow">
                    <p class="font-medium text-gray-800">Échecs</p>
                    <p class="text-xs text-gray-500">Dernière partie il y a 2 jours</p>
                  </div>
                  <a href="#" id="playChessFromProfile" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded transition">
                    Jouer
                  </a>
                </div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 opacity-60">
                <div class="flex items-center">
                  <span class="text-3xl mr-3">🎯</span>
                  <div class="flex-grow">
                    <p class="font-medium text-gray-800">Dames</p>
                    <p class="text-xs text-gray-500">Bientôt disponible</p>
                  </div>
                  <span class="bg-gray-200 text-gray-500 text-sm font-medium px-3 py-1 rounded">
                    À venir
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Load user participations - to be implemented in full version
  loadUserParticipations(container);
  
  // Load user announcements - to be implemented in full version
  loadUserAnnouncements(container);
  
  // Add event listener for editing profile - maintenant avec la nouvelle fonctionnalité
  container.querySelector('#editProfileBtn').addEventListener('click', () => {
    import('./profileEdit.js').then(module => {
      const renderProfileEdit = module.default;
      renderProfileEdit(container);
    });
  });
  
  // Add event listener for "Voir tout" games button
  container.querySelector('#seeAllGames').addEventListener('click', (e) => {
    e.preventDefault();
    import('./jouerEnLigne.js').then(module => {
      const renderJouerEnLigne = module.default;
      renderJouerEnLigne(container);
    });
  });
  
  // Add event listener for playing chess from profile
  container.querySelector('#playChessFromProfile').addEventListener('click', (e) => {
    e.preventDefault();
    // Import the jouerEnLigne module dynamically
    import('./jouerEnLigne.js').then(module => {
      const renderJouerEnLigne = module.default;
      renderJouerEnLigne(container);
      // Wait for the component to render then trigger the chess button
      setTimeout(() => {
        const chessBtn = container.querySelector('#playChess');
        if (chessBtn) {
          chessBtn.click();
        }
      }, 100);
    });
  });
}

/**
 * Loads and displays user participations
 * @param {HTMLElement} container - The container element
 */
function loadUserParticipations(container) {
  const participationsContainer = container.querySelector('#user-participations');
  
  try {
    // This would be a real API call in the full version
    // For MVP, we'll just simulate with a setTimeout
    setTimeout(() => {
      participationsContainer.innerHTML = `
        <div class="text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p class="text-gray-500 mb-2">Aucune participation pour le moment.</p>
          <button id="findActivities" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition text-sm">
            Découvrir des activités
          </button>
        </div>
      `;
      
      // Add event listener for the find activities button
      container.querySelector('#findActivities').addEventListener('click', () => {
        import('./dashboard.js').then(module => {
          const renderDashboard = module.default;
          renderDashboard(container);
        });
      });
    }, 1000);
  } catch (error) {
    participationsContainer.innerHTML = `<p class="text-red-500">Erreur lors du chargement des participations.</p>`;
  }
}

/**
 * Loads and displays user announcements
 * @param {HTMLElement} container - The container element
 */
function loadUserAnnouncements(container) {
  const annoncesContainer = container.querySelector('#user-annonces');
  
  try {
    // This would be a real API call in the full version
    // For MVP, we'll just simulate with a setTimeout
    setTimeout(() => {
      annoncesContainer.innerHTML = `
        <div class="text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p class="text-gray-500 mb-2">Vous n'avez pas encore créé d'annonces.</p>
          <button id="createAnnonce" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition text-sm">
            Créer une annonce
          </button>
        </div>
      `;
      
      // Add event listener for the create annonce button
      container.querySelector('#createAnnonce').addEventListener('click', () => {
        import('./dashboard.js').then(module => {
          const renderDashboard = module.default;
          renderDashboard(container);
        });
      });
    }, 1500);
  } catch (error) {
    annoncesContainer.innerHTML = `<p class="text-red-500">Erreur lors du chargement des annonces.</p>`;
  }
}