const { users, urlDatabase } = require("./express_server.js");

const generateRandomString = () => {
  return Math.random(36)
    .toString(36)
    .slice(2, 8);
};

const checkUserEmail = (database, formEmail) => {
  for (var userId in database) {
    let email = database[userId].email;
    if (email === formEmail) {
      return true;
    }
  }
  return false;
};

const checkUserPassword = (usersDatabase, formPassword) => {
  for (const userId in usersDatabase) {
    let password = usersDatabase[userId].password;
    if (formPassword === password) {
      return true;
    }
  }
  return false;
};

module.exports = { generateRandomString, checkUserEmail, checkUserPassword };
