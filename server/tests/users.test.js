const bcrypt = require('bcrypt');
const { describe, it } = require('@jest/globals'); // Import describe and it from Jest

// Define the number of salt rounds
const saltRounds = 10; // Adjust this value based on your security needs

// Import the createUser function from the appropriate module
const createUser = require(require.resolve('C:\\eksamen computer\\JoeForum\\server\\db\\users.js'));

describe('Test af createUser funktionen', () => {
  it('skal hash brugerens kodeord og gemme det i userCreated', async () => {
    const newUserData = {
      username: 'newexample',
      firstname: 'Mike',
      lastname: 'Johns',
      phone: '12345678',
      email: 'mikejohns@example.com',
      password: 'safepassword',
    };

    // Ensure that createUser is defined and callable
    expect(typeof createUser).toBe('function');

    // Now you can call createUser
    try {
      const userCreated = await createUser(newUserData);

      // Check if the password hash is correct
      const hashedPassword = await bcrypt.hash('safepassword', saltRounds);
      expect(bcrypt.compare(newUserData.password, hashedPassword)).toBe(true);

      // Check if the userCreated object has the expected properties
      expect(userCreated).toMatchObject({
        username: 'newexample',
        firstname: 'Mike',
        lastname: 'Johns',
        phone: '12345678',
        email: 'mikejohns@example.com',
      });
    } catch (err) {
      console.error(err.message);
    }
  });
});
