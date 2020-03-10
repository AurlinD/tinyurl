const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {
  checkUserEmail,
  generateRandomString,
  checkUserPassword
} = require("./helper");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "1"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "2"
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.userId };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies.userId };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.userId
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.userId
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.userId
  };
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  let short = generateRandomString();
  urlDatabase[short] = req.body.longURL;
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
  urlDatabase[req.params.shortURL] = req.body.longURL;
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
    console.log(users);
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
