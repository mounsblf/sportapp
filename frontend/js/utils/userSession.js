/**
 * Module pour gérer les informations de session utilisateur côté client
 * Permet de stocker l'ID et le nom de l'utilisateur connecté pour les utiliser dans différents composants
 */

// Variable globale pour stocker les données de l'utilisateur courant
window.currentUser = null;

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {Promise<Object|null>} Les informations de l'utilisateur ou null si non connecté
 */
export async function getCurrentUser() {
  // Si l'utilisateur est déjà chargé, retourner simplement la valeur
  if (window.currentUser) {
    return window.currentUser;
  }
  
  try {
    // Récupérer les informations de session du serveur
    const response = await fetch('../backend/user/get_session.php');
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération de la session:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.logged_in && data.user_id) {
      // Stocker les informations dans la variable globale
      window.currentUser = {
        id: data.user_id,
        username: data.username
      };
      return window.currentUser;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {Promise<boolean>} true si connecté, false sinon
 */
export async function isLoggedIn() {
  const user = await getCurrentUser();
  return user !== null;
}

// Charger l'utilisateur au démarrage
getCurrentUser()
  .then(user => {
    if (user) {
      console.log('Utilisateur connecté:', user.username);
    } else {
      console.log('Aucun utilisateur connecté');
    }
  })
  .catch(error => {
    console.error('Erreur lors du chargement de la session:', error);
  }); 