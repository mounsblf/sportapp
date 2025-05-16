import renderDashboard from "./dashboard.js";
import renderJouerEnLigne from "./jouerEnLigne.js";
import renderProfile from "./profile.js";

export function renderHeader(container) {
    container.innerHTML = `
    <div id='header-id' class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
        <nav class="max-w-6xl mx-auto px-4 py-3 relative">
            <!-- Contenu du header avec logo et menu hamburger -->
            <div class="flex items-center justify-between">
                <h1 class="text-xl sm:text-2xl font-bold text-white tracking-wide">Sport Gathering App</h1>
                
                <!-- Bouton hamburger pour mobile -->
                <button id="menu-toggle" class="lg:hidden text-white focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                
                <!-- Menu pour grands écrans -->
                <div class="hidden lg:flex items-center space-x-2">
                    <button id="accueil" class="nav-button bg-white hover:bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                        </svg>
                            Tableau de bord
                    </span>
                </button>
                    <button id="jouerEnLigne" class="nav-button bg-white hover:bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Jouer en ligne
                    </span>
                </button>
                    <button id="profile" class="nav-button bg-white hover:bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                    </span>
                </button>
                    <button id="logout" class="nav-button bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                    </span>
                </button>
                </div>
            </div>
            
            <!-- Sidebar pour mobile (caché par défaut) -->
            <div id="mobile-menu" class="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 hidden" aria-hidden="true">
                <div class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
                    <div class="p-5">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold text-blue-800">Menu</h2>
                            <button id="close-menu" class="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex flex-col space-y-3">
                            <button id="mobile-accueil" class="mobile-nav-button w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg transition">
                                <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                                    </svg>
                                    Tableau de bord
                                </span>
                            </button>
                            <button id="mobile-jouerEnLigne" class="mobile-nav-button w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg transition">
                                <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Jouer en ligne
                                </span>
                            </button>
                            <button id="mobile-profile" class="mobile-nav-button w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg transition">
                                <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </span>
                            </button>
                            <div class="border-t border-gray-200 my-2"></div>
                            <button id="mobile-logout" class="mobile-nav-button w-full text-left bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition">
                                <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Déconnexion
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    `;

    const app = document.getElementById("app");

    // Gestion du menu mobile
    const menuToggle = container.querySelector("#menu-toggle");
    const mobileMenu = container.querySelector("#mobile-menu");
    const closeMenu = container.querySelector("#close-menu");
    const mobileMenuContainer = mobileMenu.querySelector("div"); // La sidebar blanche
    
    function openMobileMenu() {
        document.body.style.overflow = "hidden"; // Empêcher le scroll de la page
        mobileMenu.classList.remove("hidden");
        // Petite animation pour faire apparaître la sidebar
        setTimeout(() => {
            mobileMenuContainer.classList.add("translate-x-0");
            mobileMenuContainer.classList.remove("translate-x-full");
        }, 10);
    }
    
    function closeMobileMenu() {
        // Animation de fermeture
        mobileMenuContainer.classList.remove("translate-x-0");
        mobileMenuContainer.classList.add("translate-x-full");
        setTimeout(() => {
            mobileMenu.classList.add("hidden");
            document.body.style.overflow = ""; // Réactiver le scroll
        }, 300); // Attendre la fin de l'animation
    }
    
    // Initialiser la position de la sidebar (hors écran au début)
    mobileMenuContainer.classList.add("translate-x-full");
    
    menuToggle.addEventListener("click", openMobileMenu);
    closeMenu.addEventListener("click", closeMobileMenu);
    
    // Fermer le menu mobile en cliquant en dehors de la sidebar
    mobileMenu.addEventListener("click", (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    // Fonctions de navigation
    function navigateToAccueil() {
        renderDashboard(app);
        if (!mobileMenu.classList.contains("hidden")) {
            closeMobileMenu();
        }
    }
    
    function navigateToJouerEnLigne() {
        renderJouerEnLigne(app);
        if (!mobileMenu.classList.contains("hidden")) {
            closeMobileMenu();
        }
    }

    function navigateToProfile() {
        renderProfile(app);
        if (!mobileMenu.classList.contains("hidden")) {
            closeMobileMenu();
        }
    }
    
    function logout() {
        // Clear local storage
        localStorage.removeItem('username');
        
        // Dispatch logout event (similar to login event pattern)
        const logoutEvent = new CustomEvent('userLoggedOut');
        document.dispatchEvent(logoutEvent);
        
        if (!mobileMenu.classList.contains("hidden")) {
            closeMobileMenu();
        }
    }
    
    // Event listeners pour le menu desktop
    container.querySelector("#accueil").addEventListener('click', navigateToAccueil);
    container.querySelector("#jouerEnLigne").addEventListener('click', navigateToJouerEnLigne);
    container.querySelector("#profile").addEventListener('click', navigateToProfile);
    container.querySelector("#logout").addEventListener('click', logout);
    
    // Event listeners pour le menu mobile
    container.querySelector("#mobile-accueil").addEventListener('click', navigateToAccueil);
    container.querySelector("#mobile-jouerEnLigne").addEventListener('click', navigateToJouerEnLigne);
    container.querySelector("#mobile-profile").addEventListener('click', navigateToProfile);
    container.querySelector("#mobile-logout").addEventListener('click', logout);
}

export function masquerHeader(container) {
    container.innerHTML = `
    <div class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md py-4">
      <h1 class="text-xl sm:text-2xl font-bold text-white text-center">Sport Gathering App</h1>
    </div>
    `;
}

export default renderHeader;

