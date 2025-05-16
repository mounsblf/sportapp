/**
 * Renders the online games section
 * @param {HTMLElement} container - The container to render the content in
 */
export default function renderJouerEnLigne(container) {
    container.innerHTML = `
    <div class="py-8 max-w-4xl mx-auto">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Ping Pong</h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                Jouez au ping-pong contre l'ordinateur et améliorez vos réflexes entre deux séances sportives.
            </p>
        </div>
        
        <div class="grid md:grid-cols-1 gap-6 mb-10">
            <!-- Ping Pong Game Card -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div class="h-48 bg-gradient-to-br from-orange-700 to-orange-900 relative flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                         alt="Ping Pong Table" class="object-cover w-full h-full opacity-60">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 4.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V4.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                    </div>
                </div>
                <div class="p-5 flex-grow">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-xl font-bold text-gray-800">Ping Pong</h3>
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Populaire</span>
                    </div>
                    <p class="text-gray-600 mb-4">Jouez au ping-pong contre l'ordinateur. Utilisez les flèches haut et bas pour déplacer votre raquette.</p>
                    <div class="flex items-center text-sm text-gray-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                        <span>Temps de jeu moyen: 5 min</span>
                    </div>
                </div>
                <div class="px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <button id="playPingPong" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition">
                        Jouer maintenant
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Add event listener for the game button
    const btnPlayPingPong = container.querySelector("#playPingPong");
    
    btnPlayPingPong.addEventListener('click', () => {
        launchPingPong(container);
    });
}

/**
 * Launches the ping pong game interface
 * @param {HTMLElement} container - The container to render the ping pong game in
 */
function launchPingPong(container) {
    const username = localStorage.getItem('username') || 'Joueur';
    
    container.innerHTML = `
    <div class="py-4 max-w-4xl mx-auto">
        <!-- Header avec score et temps -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mb-8 border border-white/20">
            <div class="p-4 bg-gradient-to-r from-gray-900 to-gray-800">
                <div class="flex justify-between items-center">
                    <!-- Score CPU -->
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <span class="text-white font-bold">CPU</span>
                        </div>
                        <div>
                            <p class="text-white font-medium">CPU</p>
                            <p class="text-3xl font-bold text-orange-500" id="cpuScore">0</p>
                        </div>
                    </div>

                    <!-- Temps de jeu -->
                    <div class="text-center">
                        <p class="text-gray-400 text-sm mb-1">Temps de jeu</p>
                        <div class="flex items-center justify-center space-x-2">
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <span class="text-white text-xl font-bold" id="gameTimer">--:--</span>
                            </div>
                        </div>
                        <div class="mt-2 flex items-center justify-center space-x-2">
                            <div class="flex items-center space-x-2">
                                <input type="number" id="gameTimeInput" min="0.5" max="60" value="5" step="0.5"
                                       class="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none">
                                <span class="text-gray-400 text-sm">minutes</span>
                            </div>
                            <button id="setGameTimeBtn" class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors">
                                Définir
                            </button>
                        </div>
                        <p class="text-gray-500 text-xs mt-1">Temps minimum: 30 secondes</p>
                    </div>

                    <!-- Score Joueur -->
                    <div class="flex items-center space-x-4">
                        <div>
                            <p class="text-white font-medium text-right">${username}</p>
                            <p class="text-3xl font-bold text-blue-500" id="playerScore">0</p>
                        </div>
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <span class="text-white font-bold">P2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Zone de jeu principale avec effet de verre -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mb-8 border border-white/20">
            <!-- En-tête des joueurs avec design moderne -->
            <div class="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 animate-pulse">
                        Ping Pong
                    </h1>
                    <button id="backToGames" class="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                        </svg>
                        Retour aux jeux
                    </button>
                </div>
            </div>
            
            <!-- Zone de jeu avec effet de néon -->
            <div id="ping-pong-game" class="w-full max-w-4xl mx-auto p-4 bg-gradient-to-b from-gray-900 to-black relative" style="aspect-ratio: 16/9;">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
                <!-- Lignes de terrain -->
                <div class="absolute inset-0 border-2 border-white/20 rounded-lg">
                    <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20"></div>
                    <div class="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20"></div>
                </div>
                <canvas id="pingPongCanvas" class="w-full h-full relative z-10"></canvas>
            </div>
            
            <!-- Contrôles avec design moderne -->
            <div class="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-white/10">
                <div class="flex flex-wrap gap-4 justify-center">
                    <button id="newGameBtn" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                            </svg>
                        Nouvelle partie
                        </span>
                    </button>
                    <button id="pauseBtn" class="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            Pause
                        </span>
                    </button>
                    <button id="settingsBtn" class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                            </svg>
                            Paramètres
                        </span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Instructions de jeu -->
        <div class="mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
            <h3 class="text-lg font-bold text-white mb-4">Comment jouer</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span class="text-blue-500">↑</span>
                    </div>
                    <p class="text-gray-300">Déplacer la raquette vers le haut</p>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span class="text-blue-500">↓</span>
            </div>
                    <p class="text-gray-300">Déplacer la raquette vers le bas</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Add event listener to go back to games list
    container.querySelector("#backToGames").addEventListener('click', () => {
        renderJouerEnLigne(container);
    });
    
    // Add event listeners for ping pong game controls
    container.querySelector("#newGameBtn").addEventListener('click', () => {
        gameState.score.player = 0;
        gameState.score.cpu = 0;
        updateScore();
        resetBall();
        gameState.isGameStarted = false;
        gameState.isPaused = true;
        resetTimer();
        document.getElementById('gameTimer').textContent = '--:--';
        container.querySelector("#pauseBtn").textContent = 'Pause';
    });
    
    container.querySelector("#pauseBtn").addEventListener('click', () => {
        if (!gameState.isGameOver && gameState.isGameStarted) {
            gameState.isPaused = !gameState.isPaused;
            container.querySelector("#pauseBtn").textContent = gameState.isPaused ? 'Reprendre' : 'Pause';
            if (gameState.isPaused) {
                stopTimer();
            } else {
                startTimer();
            }
        }
    });
    
    container.querySelector("#settingsBtn").addEventListener('click', () => {
        alert("Cette fonctionnalité sera disponible dans une version future.");
    });
    
    // Add event listener for setting game time
    container.querySelector("#setGameTimeBtn").addEventListener('click', () => {
        const input = container.querySelector("#gameTimeInput");
        const minutes = parseFloat(input.value);
        
        if (minutes >= 0.5 && minutes <= 60) {
            gameState.maxGameTime = Math.floor(minutes * 60);
            gameState.isGameStarted = true;
            resetTimer();
            updateTimerDisplay();
            startTimer();
            gameState.isPaused = false;
            container.querySelector("#pauseBtn").textContent = 'Pause';
        } else {
            alert("Veuillez entrer un temps entre 30 secondes (0.5 minute) et 60 minutes");
            input.value = Math.max(0.5, Math.min(60, minutes));
        }
    });

    // Initialize the ping pong game canvas
    const canvas = document.getElementById('pingPongCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Game objects
    const paddleHeight = canvas.height * 0.2; // 20% de la hauteur du canvas
    const paddleWidth = canvas.width * 0.02; // 2% de la largeur du canvas
    const ballSize = canvas.width * 0.015; // 1.5% de la largeur du canvas
    
    // Game state
    let gameState = {
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            dx: canvas.width * 0.005,
            dy: canvas.height * 0.005,
            size: ballSize
        },
        playerPaddle: {
            x: canvas.width * 0.05,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            dy: 0,
            speed: canvas.height * 0.01
        },
        cpuPaddle: {
            x: canvas.width * 0.95 - paddleWidth,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            dy: 0,
            speed: canvas.height * 0.008
        },
        score: {
            player: 0,
            cpu: 0
        },
        isPaused: true,
        gameTime: 0,
        gameTimer: null,
        maxGameTime: 0,
        isGameOver: false,
        isGameStarted: false
    };

    // Update score display
    function updateScore() {
        document.getElementById('cpuScore').textContent = gameState.score.cpu;
        document.getElementById('playerScore').textContent = gameState.score.player;
    }

    // Draw game objects
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#1F2937'; // bg-gray-800
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw center line
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw ball
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();

        // Draw player paddle (blue)
        ctx.fillStyle = '#3B82F6'; // blue-500
        ctx.fillRect(
            gameState.playerPaddle.x, 
            gameState.playerPaddle.y, 
            gameState.playerPaddle.width, 
            gameState.playerPaddle.height
        );

        // Draw CPU paddle (orange)
        ctx.fillStyle = '#F97316'; // orange-500
        ctx.fillRect(
            gameState.cpuPaddle.x, 
            gameState.cpuPaddle.y, 
            gameState.cpuPaddle.width, 
            gameState.cpuPaddle.height
        );
    }

    // Update game state
    function update() {
        if (gameState.isPaused) return;

        // Move ball
        gameState.ball.x += gameState.ball.dx;
        gameState.ball.y += gameState.ball.dy;

        // Ball collision with top and bottom
        if (gameState.ball.y - gameState.ball.size / 2 <= 0 || 
            gameState.ball.y + gameState.ball.size / 2 >= canvas.height) {
            gameState.ball.dy *= -1;
        }

        // Ball collision with paddles
        if (gameState.ball.x - gameState.ball.size / 2 <= gameState.playerPaddle.x + gameState.playerPaddle.width &&
            gameState.ball.y >= gameState.playerPaddle.y && 
            gameState.ball.y <= gameState.playerPaddle.y + gameState.playerPaddle.height) {
            gameState.ball.dx *= -1;
            // Add some randomness to the bounce
            gameState.ball.dy += (Math.random() - 0.5) * 2;
        }

        if (gameState.ball.x + gameState.ball.size / 2 >= gameState.cpuPaddle.x &&
            gameState.ball.y >= gameState.cpuPaddle.y && 
            gameState.ball.y <= gameState.cpuPaddle.y + gameState.cpuPaddle.height) {
            gameState.ball.dx *= -1;
            // Add some randomness to the bounce
            gameState.ball.dy += (Math.random() - 0.5) * 2;
        }

        // Score points
        if (gameState.ball.x - gameState.ball.size / 2 <= 0) {
            gameState.score.cpu++;
            resetBall();
            updateScore();
        }
        if (gameState.ball.x + gameState.ball.size / 2 >= canvas.width) {
            gameState.score.player++;
            resetBall();
            updateScore();
        }

        // Move player paddle
        gameState.playerPaddle.y += gameState.playerPaddle.dy;
        gameState.playerPaddle.y = Math.max(0, Math.min(canvas.height - gameState.playerPaddle.height, gameState.playerPaddle.y));

        // Move CPU paddle
        const cpuTarget = gameState.ball.y - gameState.cpuPaddle.height / 2;
        if (gameState.cpuPaddle.y < cpuTarget) {
            gameState.cpuPaddle.y += Math.min(gameState.cpuPaddle.speed, cpuTarget - gameState.cpuPaddle.y);
        } else if (gameState.cpuPaddle.y > cpuTarget) {
            gameState.cpuPaddle.y -= Math.min(gameState.cpuPaddle.speed, gameState.cpuPaddle.y - cpuTarget);
        }
    }

    // Reset ball to center
    function resetBall() {
        gameState.ball.x = canvas.width / 2;
        gameState.ball.y = canvas.height / 2;
        gameState.ball.dx = (Math.random() > 0.5 ? 1 : -1) * canvas.width * 0.005;
        gameState.ball.dy = (Math.random() > 0.5 ? 1 : -1) * canvas.height * 0.005;
    }

    // Game loop
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            // Empêcher le défilement de la page
            e.preventDefault();
            
            if (e.key === 'ArrowUp') {
                gameState.playerPaddle.dy = -gameState.playerPaddle.speed;
            } else if (e.key === 'ArrowDown') {
                gameState.playerPaddle.dy = gameState.playerPaddle.speed;
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            // Empêcher le défilement de la page
            e.preventDefault();
            gameState.playerPaddle.dy = 0;
        }
    });

    // Timer functions
    function startTimer() {
        if (gameState.gameTimer || !gameState.isGameStarted) return;
        gameState.gameTimer = setInterval(() => {
            if (!gameState.isPaused && !gameState.isGameOver) {
                gameState.gameTime++;
                updateTimerDisplay();
                
                if (gameState.gameTime >= gameState.maxGameTime) {
                    endGame();
                }
            }
        }, 1000);
    }

    function stopTimer() {
        if (gameState.gameTimer) {
            clearInterval(gameState.gameTimer);
            gameState.gameTimer = null;
        }
    }

    function resetTimer() {
        stopTimer();
        gameState.gameTime = 0;
        gameState.isGameOver = false;
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        if (!gameState.isGameStarted) {
            document.getElementById('gameTimer').textContent = '--:--';
            return;
        }
        const remainingTime = Math.max(0, gameState.maxGameTime - gameState.gameTime);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function endGame() {
        gameState.isGameOver = true;
        stopTimer();
        
        const username = localStorage.getItem('username') || 'Joueur';
        let winner = gameState.score.player > gameState.score.cpu ? username : 
                    gameState.score.player < gameState.score.cpu ? 'CPU' : 'Match nul';
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 scale-0" id="endGameModal">
                <div class="text-center">
                    <div class="mb-6">
                        ${winner === username ? 
                            '<div class="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">' +
                            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>' +
                            '</svg></div>' :
                            winner === 'CPU' ?
                            '<div class="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mx-auto flex items-center justify-center animate-bounce">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">' +
                            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>' +
                            '</svg></div>' :
                            '<div class="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full mx-auto flex items-center justify-center animate-bounce">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">' +
                            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>' +
                            '</svg></div>'
                        }
                    </div>
                    
                    <h2 class="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${winner === username ? 'from-green-500 to-emerald-600' : winner === 'CPU' ? 'from-red-500 to-pink-600' : 'from-yellow-500 to-orange-600'}">
                        ${winner === username ? 'Victoire !' : winner === 'CPU' ? 'Défaite !' : 'Match nul !'}
                    </h2>
                    
                    <div class="bg-gray-800 rounded-xl p-6 mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <div class="text-center">
                                <p class="text-gray-400 text-sm mb-1">${username}</p>
                                <p class="text-2xl font-bold text-blue-500">${gameState.score.player}</p>
                            </div>
                            <div class="text-gray-500">VS</div>
                            <div class="text-center">
                                <p class="text-gray-400 text-sm mb-1">CPU</p>
                                <p class="text-2xl font-bold text-orange-500">${gameState.score.cpu}</p>
                            </div>
                        </div>
                        <div class="text-center text-gray-400 text-sm">
                            Temps de jeu: ${Math.floor(gameState.gameTime / 60)}:${(gameState.gameTime % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                    
                    <div class="flex flex-col space-y-3">
                        <button id="newGameEndBtn" class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                            Nouvelle partie
                        </button>
                        <button id="backToMenuEndBtn" class="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
                            Retour au menu
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animation d'entrée
        setTimeout(() => {
            document.getElementById('endGameModal').classList.remove('scale-0');
            document.getElementById('endGameModal').classList.add('scale-100');
        }, 100);
        
        // Event listeners pour les boutons
        document.getElementById('newGameEndBtn').addEventListener('click', () => {
            modal.remove();
            gameState.score.player = 0;
            gameState.score.cpu = 0;
            updateScore();
            resetBall();
            gameState.isGameStarted = false;
            gameState.isPaused = true;
            resetTimer();
            document.getElementById('gameTimer').textContent = '--:--';
            container.querySelector("#pauseBtn").textContent = 'Pause';
        });
        
        document.getElementById('backToMenuEndBtn').addEventListener('click', () => {
            modal.remove();
            renderJouerEnLigne(container);
        });
    }

    // Start the game loop but don't start the timer yet
    gameLoop();
}