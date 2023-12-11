app.post('/login-and-delete', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database to check if the username and password match
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (row) {
        // User found, delete the user from the database
        db.run('DELETE FROM users WHERE username = ? AND password = ?', [username, password], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
  
          // User deleted successfully, send a success response
          res.status(200).send('Login successful! User deleted.');
        });
      } else {
        // User not found or incorrect password, send an error response
        res.status(401).send('Invalid username or password');
      }
    });
  });