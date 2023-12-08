function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  logInInfo = {username , password};

  try {
    const response = fetch('/post/logIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logInInfo),
    });
    if (response.ok) {
      console.log('User logged in successfully!');
    } else {
      console.error('Wrong username/password:', response.status);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};