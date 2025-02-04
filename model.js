

const Sqlite = require('better-sqlite3');
const bcrypt = require('bcrypt');

let db = new Sqlite('db.sqlite');

exports.search = (query, page) => {
  const num_per_page = 32;
  query = query || "";
  page = parseInt(page || 1);

  var num_found = db.prepare('SELECT count(*) FROM Books WHERE Title LIKE ?').get('%' + query + '%')['count(*)'];
  var results = db.prepare('SELECT id_Book as entry, Title, Image FROM Books WHERE Title LIKE ? ORDER BY id_Book LIMIT ? OFFSET ?').all('%' + query + '%', num_per_page, (page - 1) * num_per_page);

  return {
    results: results,
    num_found: num_found, 
    query: query,
    next_page: page + 1,
    previous_page : (page > 1) ? page - 1 : 0,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1,
  };
};

exports.searchSharedBooks = (query, page) => {
  const num_per_page = 32;
  query = query || "";
  page = parseInt(page || 1);

  var num_found = db.prepare('SELECT count(*) FROM SharedBooks WHERE Title LIKE ?').get('%' + query + '%')['count(*)'];
  var results = db.prepare('SELECT id_Book as entry, Title, Image FROM SharedBooks WHERE Title LIKE ? ORDER BY id_Book LIMIT ? OFFSET ?').all('%' + query + '%', num_per_page, (page - 1) * num_per_page);

  return {
    results: results,
    num_found: num_found, 
    query: query,
    next_page:(num_found > 32) ? page + 1 : 0 ,
    previous_page : (page > 1) ? page - 1 : 0,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1,
  };
};
exports.searchByCategory = (query, page) => {
    const num_per_page = 36;
  query = query || "";
  page = parseInt(page || 1);

  var num_found = db.prepare('SELECT count(*) FROM Books WHERE Category LIKE ?').get('%' + query + '%')['count(*)'];
  var results = db.prepare('SELECT id_Book as entry, Title, Image FROM Books WHERE Category LIKE ? ORDER BY id_Book LIMIT ? OFFSET ?').all('%' + query + '%', num_per_page, (page - 1) * num_per_page);

  const num_pages = parseInt(num_found / num_per_page) + 1;
  const next = (page > 0) ? page + 1 : 0;
  const prev = (page > 1) ? page - 1 : 0;

  return {
    results: results,
    num_found: num_found,
    query: query,
    page: page,
    num_pages: num_pages,
    next: next,
    prev: prev
  };
};

exports.read = (id) => {
  var found = db.prepare('SELECT * FROM Books WHERE id_Book = ?').get(id);
 return found;
};

exports.readshared = (id) => {
  var found = db.prepare('SELECT * FROM SharedBooks WHERE id_Book = ?').get(id);
 return found;
};

exports.login = async function (name, password) {

  let statement = db.prepare('SELECT * FROM Users WHERE Name = ?').get(name);
  if (statement === undefined) {
    return null;
  } else {
    const isMatch = await bcrypt.compare(password, statement.Password);
    if (isMatch) { 
      return statement.id_User;
    } else {
      return null;
    }
  }
}


  exports.register=function (name, password, email, phone,  address){

    let statment = db.prepare('INSERT INTO Users (name,password,Localisation,Telephone,mail) VALUES (?,?,?,?,?)').run(name,password,address,phone,email);
    return statment.lastInsertRowid;
  }

  exports.getBookComments = function(bookId) {
    const query = `
      SELECT Comments.Comment, Comments.date, Users.Name AS UserName
      FROM Comments
      JOIN Users ON Comments.id_User = Users.id_User
      WHERE Comments.id_Book = ?;
    `;
    const rows = db.prepare(query).all(bookId);
    return rows;
  };
  exports.insertComment = function(userId, bookId, comment) {
    const sql = 'INSERT INTO Comments (id_User, id_Book, Comment) VALUES (?, ?, ?)';
    const statement = db.prepare(sql);
    statement.run(userId, bookId, comment);
    return;
  }
  
  
  
  exports.getUserId=function(name) {
  
    const row = db.prepare("SELECT id_User FROM Users WHERE Name = ?").get(name);
  
    if (row === undefined) {
      return null;
    } else {
      return row.id_User;
    }
  }
  
  exports.getUserlocation=function(id) {
  
    const row = db.prepare("SELECT Localisation FROM Users WHERE Name = ?").get(id);
  
    if (row === undefined) {
      return null;
    } else {
      return row.Localisation;
    }
  }
  
  exports.insertRating = function(userId, bookId, rating) {
    const sql = 'INSERT INTO Ratings (id_User, id_Book, Rate) VALUES (?, ?, ?)';
    const statement = db.prepare(sql);
    statement.run(userId, bookId, rating);
  };

  exports.getBookRating = function(bookId) {
    const query = `
      SELECT AVG(Rate) AS Rating
      FROM Ratings
      WHERE Ratings.id_Book = ?;
    `;
    const row = db.prepare(query).get(bookId);
    return row.Rating;
  };

  exports.create = function(book) {
    const sql = 'INSERT INTO SharedBooks (Title, Autor, PublicationDate, description, Editor, Language, Category, Image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const statement = db.prepare(sql);
    statement.run(book.title, book.author, book.publicationDate, book.description, book.editor, book.language, book.category, book.image);
  };
  