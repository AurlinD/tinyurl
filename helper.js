const { users, urlDatabase } = require("./database.js");

/**
 * generate a random string of 6 alpha-numeric characters
 * that will be used to assign the short URL to the long URL
 * or the userID
 */
const generateRandomString = () => {
  return Math.random(36)
    .toString(36)
    .slice(2, 8);
};

/**
 * takes the userDatabase and checks if the email
 * is valid and part of the database
 */
const checkUserEmail = (database, formEmail) => {
  for (var userId in database) {
    let email = database[userId].email;
    if (email === formEmail) {
      return true;
    }
  }
  return false;
};

/**
 * check is the password the user enters is the password
 * of his account and if it is in the database.
 */
const checkUserPassword = (usersDatabase, formPassword) => {
  for (const userId in usersDatabase) {
    let password = usersDatabase[userId].password;
    if (formPassword === password) {
      return true;
    }
  }
  return false;
};

/**
 * check if the urls belong to the user
 * based on his ID
 */
const urlsForUser = userID => {
  let result = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID == userID) {
      result[url] = urlDatabase[url];
    }
  }
  return result;
};

module.exports = {
  generateRandomString,
  checkUserEmail,
  checkUserPassword,
  urlsForUser
};
