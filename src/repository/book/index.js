const BookSchema = require('./schema');
const { bookFormatter } = require('./formatter');

module.exports = class BookRepository {
  constructor({ mongoDb }) {
    this.repository = BookSchema(mongoDb);
  }

 /**
  * It creates a book
  * @param book - The book object to be created.
  * @returns The response from the repository.
  */
  async create(book) {
    try {
      const response = await this.repository.create(book);

      return response;
    } catch (error) {
      error.meta = { ...error.meta, 'BookRepository.create': { book } };
      throw error;
    }
  }

  /**
   * Inserts many books into the database
   * @param books - An array of books to insert.
   * @returns The result of the insertMany operation.
   */
  async insertMany(books) {
    try {
      return await this.repository.insertMany(books, { ordered: true });
    } catch (error) {
      error.meta = { ...error.meta, 'BookRepository.insertMany': { books } };
      throw error;
    }
  }

  /**
   * It fetches all books from the database and returns them in a formatted way
   * @returns An array of books
   */
  async fetchAllBooks() {
    try {
      const books = await this.repository.find({});

      const forattedBooks = await bookFormatter(this.repository, books);

      return forattedBooks;
    } catch (error) {
      throw error;
    }
  }

  /**
   * It searches for books by author ids
   * @param ids - An array of author ids.
   * @returns An array of books that have the author ids passed in.
   */
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

  /**
   * It searches for books by ISBN and returns a list of books
   * @param isbn - The isbn of the book to search for.
   * @returns An array of books
   */
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
