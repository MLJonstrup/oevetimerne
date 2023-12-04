const sqlite3 = require('sqlite3').verbose();

const dbPath = '../../database.db';

const userId = 15; //need to be the userId written in a cookie gathered from client side

const newUserData = { //also need to gether from client side
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
  // if 'verified' is empty or undefined, set it to false
  if (newUserData.verified === undefined || newUserData.verified === '') {
    newUserData.verified = false;
  }

  // SQLite query to insert a new user
  const query = `
    INSERT INTO users (username, firstname, lastname, phone, email, password, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  //create connection to database
  const db = new sqlite3.Database(dbPath);

  //run query
  db.run(query, [newUserData.username, newUserData.firstname, newUserData.lastname, newUserData.phone, newUserData.email, newUserData.password, newUserData.verified], function (err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`User added successfully. User ID: ${this.lastID}`);
    }

    //close the database connection
    db.close();
  });
};

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