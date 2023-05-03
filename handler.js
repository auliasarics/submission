const { nanoid } = require('nanoid');
const books = require('./books');

//menambah buku
const addBook = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
    if (newBook.name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } else if (newBook.pageCount < newBook.readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;

    } else if (!(newBook.name === undefined) && (newBook.pageCount >= newBook.readPage)) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        books.push(newBook);

        response.code(201);
        return response;
    }
};

//menampilkan detail buku
const getBookById = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((book) => book.id === bookId);

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

//memperbarui buku
const updateBook = (request, h) => {
    const { bookId } = request.params;
  
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    //jika id tidak ditemukan
    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
  
      response.code(404);
      return response;
    }
  
    //jika tidak melampirkan nama
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
  
      response.code(400);
      return response;
    }
  
    //jika read page lebih dari read count
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
  
      response.code(400);
      return response;
    }
  
    //jika berhasil diperbarui
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
  
    response.code(200);
    return response;
  };
  
//menghapus buku
const deleteBook = (request, h) => {
    const { bookId } = request.params;
  
    const index = books.findIndex((book) => book.id === bookId);
  
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
  
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  
    response.code(404);
    return response;
  };
  

module.exports = {
    addBook,
    getBookById,
    updateBook,
    deleteBook,
  };
