const sqlite3 = require('sqlite3').verbose();
const dbPath = '../../database.db';

// Gather the userId and newUserData from the client side
const userId = 15; // Replace with the actual userId received from the client
const newUserData = {
  // Replace with the data received from the client
  username: 'newexample',
  firstname: 'Mike',
  lastname: 'Johns',
  phone: '12345678',
  email: 'mikejohns@example.com',
  password: 'safepassword',
  //verified:  false //automatically set to false when user is created and won't be able to post/comment till verified done in function createUser
}

const updatedUserData = { //also need to gether from client side
  username: 'Peter'
}

function createUser (newUserData) {
  bcrypt.hash(newUserData.password, saltRounds, function(err, hash) {
    if (err) {
      console.error(err.message);
      return;
    }
    newUserData.password = hash;

    const db = new sqlite3.Database(dbPath);
    db.run(query, [newUserData.username, newUserData.firstname, newUserData.lastname, newUserData.phone, newUserData.email, newUserData.password, newUserData.verified], function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`User added successfully. User ID: ${this.lastID}`);
      }

      db.close();
    });
  });
}



function deleteUser(userId) {
  const query = `
    DELETE FROM users
    WHERE id = ?;
  `;

  const db = new sqlite3.Database(dbPath);

  db.run(query, [userId], function (err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`User with ID ${userId} deleted successfully.`);
    }

    db.close();
  });
}




function updateUser(userId, updatedUserData) {
  if (updatedUserData.password) {
    bcrypt.hash(updatedUserData.password, saltRounds, function(err, hash) {
      if (err) {
        console.error(err.message);
        return;
      }
      updatedUserData.password = hash;
      executeUpdate(userId, updatedUserData);
    });
  } else {
    executeUpdate(userId, updatedUserData);
  }
}

function executeUpdate(userId, updatedUserData) {
  const fields = Object.keys(updatedUserData);
  const setStatements = fields.map(field => `${field} = ?`).join(', ');

  const query = `
    UPDATE users
    SET ${setStatements}
    WHERE id = ?;
  `;

  const values = fields.map(field => updatedUserData[field]);
  values.push(userId);

  const db = new sqlite3.Database(dbPath);

  db.run(query, values, function (err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`User with ID ${userId} updated successfully.`);
    }

    db.close();
  });
}

//createUser(newUserData);

//need to be the userId written in a cookie
//deleteUser(userId);

//need to be the userId written in a cookie
//updateUser(userId, updatedUserData);
