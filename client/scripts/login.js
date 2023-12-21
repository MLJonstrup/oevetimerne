
//kode inspiretet fra følgene side: https://javascript.plainenglish.io/i-finally-figured-out-try-catch-and-async-await-ac15fa786f23
// Asynkron funktion for login
async function login() {
  // Henter brugernavn og kodeord fra inputfelterne
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // Opretter et objekt med loginoplysningerne
  const loginInfo = { username, password };

  try {
    // Sender en POST-anmodning til serveren for login
    const response = await fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginInfo),
    });

    // Tjekker om anmodningen blev behandlet succesfuldt
    if (response.ok) {
      console.log('User logged in successfully!');
      window.location.href = '/post'; // Omdiriger til Joe's Forum
    } else {
      console.error('Wrong username/password:', response.status);
      // Her kan en fejlmeddelelse vises til brugeren
    }
  } catch (error) {
    console.error('An error occurred:', error);
    // Her kan en fejlmeddelelse vises til brugeren
  }
}

// Funktion til at omdirigere til brugeroprettelsesside
function redirect(){
  window.location.href = '/user/createUser';
}

// Asynkron funktion for at tjekke loginstatus og opdatere UI
async function checkLoginStatusAndUpdateUI() {
  try {
    const response = await fetch('/check-login', { credentials: 'include' });
    const data = await response.json();
    // Opdaterer visning af elementer baseret på om brugeren er logget ind
    document.querySelectorAll('.loggedInLink').forEach(el => {
      el.style.display = data.loggedIn ? 'block' : 'none';
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Event listener der kører, når DOM'en er indlæst
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatusAndUpdateUI();
});
