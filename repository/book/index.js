const BookSchema = require('./schema');
const { bookFormatter } = require('./formatter');

module.exports = class BookRepository {
  constructor({ mongoDb }) {
    this.repository = BookSchema(mongoDb);
  }

  async create(book) {
    try {
      const response = await this.repository.create(book);

      return response;
    } catch (error) {
      error.meta = { ...error.meta, 'BookRepository.create': { book } };
      throw error;
    }
  }

  async insertMany(books) {
    try {
      return await this.repository.insertMany(books, { ordered: true });
    } catch (error) {
      error.meta = { ...error.meta, 'BookRepository.insertMany': { books } };
      throw error;
    }
  }

  async fetchAllBooks() {
    try {
      const books = await this.repository.find({});

      const forattedBooks = await bookFormatter(this.repository, books);

      return forattedBooks;
    } catch (error) {
      throw error;
    }
  }

  async searchByAuthorIds(ids) {
    try {
      const books = await this.repository.find({ authors: { $in: ids } });

      const forattedBooks = await bookFormatter(this.repository, books);

      return forattedBooks;
    } catch (error) {
      error.meta = { ...error.meta, 'BookRepository.searchByAuthorIds': { ids } };
      throw error;
    }
  }

  async searchByISBN(isbn) {
    try {
      const books = await this.repository.find({ isbn });

      const forattedBooks = await bookFormatter(this.repository, books);

      return forattedBooks;
    } catch (error) {
      error.meta = { ...error.meta, 'BookRepository.searchByISBN': { isbn } };
      throw error;
    }
  }
};
