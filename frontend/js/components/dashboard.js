import renderCreateAnnonce from './createAnnonce.js';
import renderListeAnnonces from './listeAnnonces.js';
import renderSportMap from './sportMap.js';

export default function renderDashboard(container) {
  container.innerHTML = `
  <div class="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
  <header class="flex justify-between items-center mb-6">
    <h2 class="text-xl font-bold">Bienvenue ${localStorage.getItem('username') || ''} </h2>
  </header>
    
    <!-- Conteneur principal qui contrôle la largeur des deux éléments -->
    <div class="w-full flex flex-col gap-6">
      <!-- Conteneur d'animation sportive -->
      <div class="sports-animation-container relative w-full h-36 sm:h-48 md:h-56 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
        <!-- Effet de vague en bas -->
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-white opacity-10" style="border-radius: 100% 100% 0 0; transform: scaleX(1.5);"></div>
        
        <!-- Titre animé -->
        <div class="absolute top-4 left-0 right-0 text-center">
          <h3 class="text-white text-xl sm:text-2xl font-bold tracking-wider text-shadow-sm" style="animation: pulse 2s infinite;">SPORT GATHERING</h3>
          <p class="text-white text-xs sm:text-sm mt-1 opacity-80">Partagez votre passion du sport</p>
        </div>
        
        <!-- Balle de basket qui rebondit -->
        <div class="sports-ball absolute ball-basketball" style="animation: bounce 3s infinite ease-in-out; animation-delay: 0.2s; left: 15%;"></div>
        
        <!-- Balle de football -->
        <div class="sports-ball absolute ball-football" style="animation: floatBall 4s infinite ease-in-out; animation-delay: 0.7s; left: 35%;"></div>
        
        <!-- Balle de tennis -->
        <div class="sports-ball absolute ball-tennis" style="animation: bounce 2.5s infinite ease-in-out; animation-delay: 1.2s; left: 55%;"></div>
        
        <!-- Balle de volleyball -->
        <div class="sports-ball absolute ball-volleyball" style="animation: floatBall 3.5s infinite ease-in-out; animation-delay: 0.5s; left: 75%;"></div>
        
        <!-- Silhouettes de coureurs -->
        <div class="absolute bottom-3 runners-container">
          <div class="runner" style="animation: run 8s infinite linear;"></div>
          <div class="runner runner-delayed" style="animation: run 8s infinite linear; animation-delay: 1.3s;"></div>
          <div class="runner runner-delayed-more" style="animation: run 8s infinite linear; animation-delay: 3s;"></div>
        </div>
      </div>
      
      <!-- Conteneur des boutons avec la même largeur -->
      <div class="w-full p-5 sm:p-6 bg-white rounded-xl shadow-lg">
        <h2 class="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-center">Faites du sport en groupe</h2>
        <div class="flex justify-center gap-3 sm:gap-4 mb-5 sm:mb-6 flex-wrap">
          <button id="btnCreate" class="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base">
          Créer une annonce
        </button>
          <button id="btnListe" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base">
          Voir les annonces
        </button>
          <button id="btnMap" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 sm:px-4 py-2 rounded transition flex items-center text-sm sm:text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          Carte des événements
        </button>
      </div>
      <div id="dashboardContent" class="space-y-4"></div>
      </div>
    </div>
  </div>
  
  <style>
    @keyframes bounce {
      0%, 100% { bottom: 20px; height: 20px; width: 20px; }
      50% { bottom: 100px; height: 18px; width: 18px; }
    }
    
    @keyframes floatBall {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.03); }
    }
    
    @keyframes run {
      0% { transform: translateX(-50px); }
      100% { transform: translateX(calc(100vw + 50px)); }
    }
    
    .text-shadow-sm {
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .sports-ball {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      bottom: 20px;
    }
    
    .ball-basketball {
      background: linear-gradient(135deg, #ff7b00, #e25822);
      box-shadow: 0 0 0 2px #000, inset 0 0 0 2px #000;
    }
    
    .ball-football {
      background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      position: relative;
    }
    
    .ball-football::before {
      content: "";
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      background-image: radial-gradient(circle, transparent 30%, #333 30%, #333 33%, transparent 33%);
      background-size: 10px 10px;
      border-radius: 50%;
    }
    
    .ball-tennis {
      background: linear-gradient(135deg, #c5ff5e, #b3ee4e);
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      position: relative;
    }
    
    .ball-tennis::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.4);
    }
    
    .ball-volleyball {
      background: linear-gradient(135deg, #ffffff, #f0f0f0);
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      position: relative;
    }
    
    .ball-volleyball::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      border: 1px solid #cc0000;
      clip-path: polygon(0% 0%, 50% 50%, 100% 0%, 100% 100%, 50% 50%, 0% 100%);
    }
    
    .runners-container {
      width: 100%;
      height: 20px;
      position: relative;
    }
    
    .runner {
      width: 12px;
      height: 16px;
      background-color: rgba(255,255,255,0.7);
      position: absolute;
      bottom: 0;
      border-radius: 50% 50% 0 0;
    }
    
    .runner::before {
      content: "";
      position: absolute;
      width: 8px;
      height: 6px;
      background-color: rgba(255,255,255,0.7);
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 40% 40% 0 0;
      animation: legs 0.5s infinite alternate;
    }
    
    @keyframes legs {
      0% { width: 6px; }
      100% { width: 10px; }
    }
    
    .runner-delayed {
      opacity: 0.8;
      transform: scale(0.9);
    }
    
    .runner-delayed-more {
      opacity: 0.6;
      transform: scale(0.8);
    }
    
    /* Media queries pour l'adaptation mobile */
    @media (max-width: 640px) {
      .sports-ball {
        width: 16px;
        height: 16px;
      }
      
      @keyframes bounce {
        0%, 100% { bottom: 15px; height: 16px; width: 16px; }
        50% { bottom: 60px; height: 14px; width: 14px; }
      }
    }
  </style>
  `;

  // Initialize the sports animation
  initSportsAnimation();

  const btnCreate = container.querySelector('#btnCreate');
  const btnListe = container.querySelector('#btnListe');
  const btnMap = container.querySelector('#btnMap');
  
  const app = document.getElementById('app');

  btnCreate.addEventListener('click', () => {
    renderCreateAnnonce(app);
  });
  
  btnListe.addEventListener('click', () => {
    renderListeAnnonces(app);
  });
  
  btnMap.addEventListener('click', () => {
    renderSportMap(app);
  });
}

// Function to add some additional dynamic effects to the sports animation
function initSportsAnimation() {
  // Add random sparkles to the animation container
  const animContainer = document.querySelector('.sports-animation-container');
  if (!animContainer) return;
  
  // Create and add sparkles
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'absolute w-1 h-1 bg-white rounded-full opacity-60';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animation = `pulse ${(Math.random() * 2) + 1}s infinite ease-in-out`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    animContainer.appendChild(sparkle);
  }
}
