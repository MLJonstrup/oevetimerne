customerRoutes.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (row) {
        // User found, send a success response
        res.status(200).send('Login successful!');
      } else {
        // User not found or incorrect password, send an error response
        res.status(401).send('Invalid username or password');
      }
    });
  });

    /*if (customer) {
      res.cookie("userAuth", username, { maxAge: 3600000 }).sendStatus(200);
    } else {
      res.status(401).send({ message: "Forkert brugernavn eller adgangskode" });
    }
  });
  
  customerRoutes.get("/protected", (req, res) => {
    const customer = customers.find(u => u.username === req.cookies.userAuth);
    if (customer) {
      res.send("Hej.");
    } else {
      res.status(401).send("Ingen eller ugyldig authentication cookie.");
    }
  });*/