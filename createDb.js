"use strict";

const fs = require('fs');
const Sqlite = require('better-sqlite3');

const db = new Sqlite('db.sqlite');






const subjects = [ 'fantasy', 'histoire', 'manga', 'Science fiction', 'horreur', 'literature', 'art','action', 'fiction'];
db.prepare('DROP TABLE IF EXISTS Comments').run();
db.prepare('DROP TABLE IF EXISTS Books').run();
db.prepare('DROP TABLE IF EXISTS Users').run();
db.prepare('DROP TABLE IF EXISTS SharedBooks').run();
db.prepare('DROP TABLE IF EXISTS Ratings').run();

db.prepare('CREATE TABLE IF NOT EXISTS Comments (id INTEGER PRIMARY KEY AUTOINCREMENT, id_Book INTEGER NOT NULL, id_User INTEGER NOT NULL, comment TEXT NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(id_User) REFERENCES Users(id_User), FOREIGN KEY(id_Book) REFERENCES Books(id_Book))').run();
db.prepare('CREATE TABLE IF NOT EXISTS Users (id_User INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Password TEXT NOT NULL, Localisation TEXT NOT NULL, Telephone TEXT NOT NULL, Mail TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS Books (id_Book INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT NOT NULL, Autor TEXT, PublicationDate TEXT,description TEXT ,Editor TEXT, Language TEXT, Category TEXT, Image TEXT NULL, rate   INTEGER  )').run();
db.prepare('CREATE TABLE IF NOT EXISTS SharedBooks (id_Book INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT NOT NULL, Autor TEXT, PublicationDate TEXT,description TEXT ,Editor TEXT, Language TEXT, Category TEXT, Image TEXT NULL, rate   INTEGER  )').run();
db.prepare('CREATE TABLE IF NOT EXISTS Ratings (id_Rating INTEGER PRIMARY KEY AUTOINCREMENT, id_User INTEGER NOT NULL, id_Book INTEGER NOT NULL, Rate INTEGER NOT NULL, FOREIGN KEY(id_User) REFERENCES Users(id_User), FOREIGN KEY(id_Book) REFERENCES Books(id_Book))').run();

const load = function(filename) {

  const books = JSON.parse(fs.readFileSync(filename));

  const stmt = db.prepare('INSERT INTO Books (Title, Autor, PublicationDate, description, Editor, Language, Category, Image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

  db.transaction((books) => {
    for (let book of books.items) {
      const volumeInfo = book.volumeInfo;
      const title = volumeInfo.title;
      const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : null;
      const description = volumeInfo.description;
      const date = volumeInfo.publishedDate;
      const publisher = volumeInfo.publisher;
      const language = volumeInfo.language;
      const categories = volumeInfo.categories ? volumeInfo.categories.join(', ') : null;
      const thumbnail = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'images/49666.pinterest.jpg';

      stmt.run(title, author, date, description, publisher, language, categories, thumbnail);
    }
  })(books);
};

for (let subject of subjects) {
  const filename = `data/data-${subject}.json`;
  load(filename);
}
