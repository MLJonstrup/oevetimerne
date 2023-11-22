const sqlite3 = require('sqlite3').verbose();
//Include constants from other files below
//const create = require('../createUser.js'); 
//const update = require('../updateUser.js'); 
//const remove = require('../deleteUser.js'); Please only one user at a time, only send userID. 
//const userId = require('../userId.js'); From client side script, send userID from cookie.
// Function to read the entire database and return it as an array
function getAllUsers() {
  const db = new sqlite3.Database('database.db');

  const query = 'SELECT * FROM users';

  let userData = [];

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    userData = rows.map((row) => {
      console.log({
        userUD: row.userUD,
        username: row.username,
        firstname: row.firstname,
        lastname: row.lastname,
        email: row.email,
        phone: row.phone,
        password: row.password,
        verified: row.verified,
      });
      return {
        userUD: row.userUD,
        username: row.username,
        firstname: row.firstname,
        lastname: row.lastname,
        email: row.email,
        phone: row.phone,
        password: row.password,
        verified: row.verified,
      };
    });

    db.close();
  });
  console.log(userData);
  return userData;
}

// Function to create a new user based on a constant from another file
function createNewUser() {
  const db = new sqlite3.Database('database.db');

  const insertStatement = `INSERT INTO users (userUD, username, firstname, lastname, email, phone, password, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const newUserData = create;

  db.run(insertStatement, newUserData, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('New user created successfully.');
    }

    db.close();
  });
}

// Function to update user information if it has changed
function updateUserInfo(userId, updatedData) {
  const db = new sqlite3.Database('database.db');

  const updateStatement = `UPDATE users SET `;

  for (const [key, value] of Object.entries(updatedData)) {
    if (value !== null) {
      updateStatement += `${key} = ?, `;
    }
  }

  updateStatement = updateStatement.slice(0, -2); // Remove trailing comma and space
  updateStatement += `WHERE userUD = ?`;

  const updateValues = Object.values(updatedData).filter((value) => value !== null);
  updateValues.push(userId);

  db.run(updateStatement, updateValues, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('User information updated successfully.');
    }

    db.close();
  });
}

// Function to delete a user from the database
function deleteUser(userId) {
  const db = new sqlite3.Database('database.db');

  const deleteStatement = `DELETE FROM users WHERE userUD = ?`;

  db.run(deleteStatement, userId, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('User deleted successfully.');
    }

    db.close();
  });
}
