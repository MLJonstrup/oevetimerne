//kode inspiretet fra følgene side: https://docs.amplify.aws/javascript/build-a-backend/auth/delete-user-account/

// Asynkron funktion til at fjerne en bruger
async function remove() {
    // Henter brugernavn og kodeord fra inputfelter
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // Opretter et objekt med loginoplysningerne
    loginInfo = { username, password };

    try {
        // Sender en POST-anmodning til serveren for at slette brugeren
        const response = await fetch('/user/deleteUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Konverterer loginInfo til en JSON-streng og sender som anmodningens body
            body: JSON.stringify(loginInfo),
        });
        // Tjekker om anmodningen blev behandlet succesfuldt
        if (response.ok) {
            console.log('User deleted successfully!');
        } else {
            // Logger en fejl, hvis brugernavn/kodeord er forkert
            console.error('Wrong username/password:', response.status);
        }
    } catch (error) {
        // Fanger og logger eventuelle fejl, der opstår under anmodningen
        console.error('An error occurred:', error);
    }
}