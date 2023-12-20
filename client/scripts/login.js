async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginInfo = { username, password };

  try {
    const response = await fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginInfo),
    });

    if (response.ok) {
      console.log('User logged in successfully!');
      window.location.href = '/post'; // Omdiriger til Joe's Forum
    } else {
      console.error('Wrong username/password:', response.status);
      // Vis eventuelt en fejlmeddelelse her
    }
  } catch (error) {
    console.error('An error occurred:', error);
    // Vis eventuelt en fejlmeddelelse her
  }
}

function redirect(){
  window.location.href = '/user/createUser';
}

async function checkLoginStatusAndUpdateUI() {
  try {
    const response = await fetch('/check-login', { credentials: 'include' });
    const data = await response.json();

    document.querySelectorAll('.loggedInLink').forEach(el => {
      el.style.display = data.loggedIn ? 'block' : 'none';
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatusAndUpdateUI();
});
