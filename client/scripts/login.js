async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  loginInfo = {username , password};

  try {
    const response = await fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginInfo),
    });

    if (response.ok) {
      console.log('User logged in successfully!');
      await checkCookie();
    } else {
      console.error('Wrong username/password:', response.status);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

async function checkCookie() {
  try {
    const response = await fetch('/user/details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Add this line to include cookies
    });

    if (response.ok) {
      const userDetails = await response.json();
      console.log('User ID:', userDetails.userId);
    } else {
      console.error('Error fetching user details:', response.status);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}