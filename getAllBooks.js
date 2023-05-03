const books = require('./books');

const mapBook = (book) => ({
  id: book.id,
  name: book.name,
  publisher: book.publisher,
});

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  let booksFiltered = [];

  if (reading !== undefined) {
    const isReading = reading === '1';
    booksFiltered = books.filter((book) => book.reading === isReading);
  } else if (finished !== undefined) {
    const isFinished = finished === '1';
    booksFiltered = books.filter((book) => book.finished === isFinished);
  } else if (name !== undefined) {
    const nameQuery = name.toLowerCase();
    booksFiltered = books.filter((book) => book.name.toLowerCase().includes(nameQuery));
  } else {
    booksFiltered = books;
  }

  const booksResponse = booksFiltered.map(mapBook);

  const response = h.response({
    status: 'success',
    data: {
      books: booksResponse,
    },
  });

  response.code(200);
  return response;
};

module.exports = getAllBooks;
