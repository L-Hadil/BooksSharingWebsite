function searchBooks(query) {
    const API_KEY = 'AIzaSyAQnKjGUhDDtOIn-af5w9P9Lp_F4k3LhCE';
  
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=books&maxResults=40&key=${API_KEY}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  