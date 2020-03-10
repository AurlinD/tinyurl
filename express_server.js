const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { urlDatabase, users } = require("./database");
const {
  checkUserEmail,
  generateRandomString,
  checkUserPassword,
  urlsForUser
} = require("./helper");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  let personalDB = urlsForUser(req.cookies.userId);
  let templateVars = {
    urls: personalDB,
    user: users[req.cookies.userId]
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let userId = users[req.cookies.userId];
  let templateVars = {
    user: userId
  };
  if (userId) {
    res.render("urls_new", templateVars);
  } else {
    res.render("login", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.cookies.userId) {
    res.redirect("/login");
  }
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies.userId]
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies.userId]
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies.userId]
  };
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  let short = generateRandomString();
  urlDatabase[short] = {
    longURL: req.body.longURL,
    userID: req.cookies.userId
  };
  res.redirect(`/urls/${short}`);
  // console.log(req.body); // Log the POST request body to the console
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies.userId
  };
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send(`${res.statusCode} Please enter a valid email or password`);
  } else if (!checkUserEmail(users, req.body.email)) {
    res.status(403);
    res.send(`${res.statusCode} Cannot find email address`);
  } else if (!checkUserPassword(users, req.body.password)) {
    res.status(403);
    res.send(`${res.statusCode} Password does not match`);
  } else {
    for (const userRandom in users) {
      let email = users[userRandom].email;
      if (email === req.body.email) {
        userId = users[userRandom].id;
      }
    }
    res.cookie("userId", userId);
    res.redirect("/urls");
  }
});

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  if (
    req.body.email === "" ||
    req.body.password === "" ||
    req.body.name === ""
  ) {
    res.status(400);
    res.send(
      `${res.statusCode} Please make sure you enter a email and password`
    );
  } else if (checkUserEmail(users, req.body.email)) {
    res.status(400);
    res.send(
      `${res.statusCode} Seems like you already have an account, please login!`
    );
  } else {
    users[userID] = {
      id: userID,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    //console.log(users);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("userId", "");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
