"use strict";
const bcrypt = require("bcrypt");
const Sqlite = require("better-sqlite3");

var express = require("express");
var mustache = require("mustache-express");
const cookieSession = require("cookie-session");
var model = require("./model");
var app = express();
app.use('/images', express.static(__dirname + '/images'));

app.engine("html", mustache());
app.set("view engine", "html");
app.set("views", "./views");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const crypto = require('crypto');

const newKey = crypto.randomBytes(32).toString('hex');

app.use(cookieSession({
  name: "session",
  secret: newKey,
}));


function is_authenticated(req, res, next) {
  req.user = {};

  if (req.session.name === undefined) {
    res.locals.is_authenticated = false;
    if (req.originalUrl !== '/') {
      res.status(401).send('Unauthorized');
    } else {
      next();
    }
  } else {
    res.locals.is_authenticated = true;
    res.locals.name = req.session.name;
    req.user.id=model.getUserId(req.session.name) ; 
    next();
  }
}

app.get('/search',is_authenticated, (req, res) => {
  var found = model.search(req.query.query, req.query.page);
  res.render('search', found);
});

app.get('/',is_authenticated, (req, res) => {
  res.render('index', { 
    name: req.session.name
  });
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {


  let register = model.register(req.body.name, bcrypt.hashSync(req.body.password, 10), req.body.mail, req.body.phone,  req.body.address);
  if (register) {
    req.session.user = {
      name: req.body.name,
    };
    res.redirect("/login");
  } else {
    res.render("register", { error: "Username already exists" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {

  let login = await model.login(req.body.name, req.body.password);
  if (login) {
    req.session.name = req.body.name;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

app.get("/logout", (req, res) => {
  req.session = null;

  res.clearCookie("session");
  res.redirect("/");
});


app.get('/book/:id', is_authenticated, (req, res) => {
  const id = req.params.id;
  const book = model.read(id);

  let comments = model.getBookComments(id) || [];

  if (!book) {
    res.sendStatus(404);
    return;
  }
  comments = comments.map(comment => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const containsLink = urlRegex.test(comment.comment);
    
    return {...comment, isLink: containsLink};
  });

  res.render('book', { book: book, comments: comments, bookId: id });
});
app.post('/book/:id/comment', is_authenticated,(req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;
  let comment = req.body.comment;

  model.insertComment(userId, bookId, comment);

  res.redirect('/book/' + bookId);
});

app.post('/book/:id/rating', is_authenticated,(req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;
  const rating = req.body.rating;


  model.insertRating(userId, bookId, rating); 


  res.redirect('/book/' + bookId);

});



app.get('/search/:category',is_authenticated, (req, res) => {

  var found = model.searchByCategory(req.params.category, req.query.page);

  res.render('search', found);
});

app.get('/sharedbooks',is_authenticated, (req, res) => {


  var found = model.searchSharedBooks(req.query.query, req.query.page);

  res.render('shared', found);



});

app.get('/sharedbooks/:id',is_authenticated, (req, res) => {

  const bookId = req.params.id;

  const book = model.readshared(bookId);


  const id = req.params.id;
  let comments = model.getBookComments(id) || [];
  var found = model.getUserlocation(req.session.name);


  if (!book) {
    res.sendStatus(404);
    return;
  }
  comments = comments.map(comment => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const containsLink = urlRegex.test(comment.comment);
    
    return {...comment, isLink: containsLink};
  });

  res.render('sharedbook', { book: book, comments: comments, bookId: id, location: found, name: req.session.name });

});

app.get('/share',is_authenticated, (req, res) => {
var found = model.getUserlocation(req.session.name);
  res.render('addBook', {name : req.session.name, location: found});


});


app.post('/share', (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    publicationDate: req.body.publicationDate,
    description: req.body.description,
    editor: req.body.editor,
    language: req.body.language,
    category: req.body.category,
    image: req.body.image,
  };

  model.create(book);
  res.redirect('/');
});






app.listen(3000, () => console.log("listening on http://localhost:3000"));
