const { bookTable, magazineTable, booksAndMagazinesTable } = require('../../helpers/table');
const { validateISBN, validateEmail } = require('../../helpers/form');

module.exports = class LibraryService {
  constructor({ bookRepository, magazineRepository, authorRepository }) {
    this.bookRepository = bookRepository;
    this.magazineRepository = magazineRepository;
    this.authorRepository = authorRepository;
  }

  /**
   * It validates the search filter object and throws an error if the filter is invalid
   * @param filter - The filter object that we want to validate.
   */
  async validateSearchFilter(filter) {
    try {
      const { isbn, authors } = filter;

      if (!isbn && !authors) {
        const error = new Error('Please provide either ISBN or Authors');
        error.status = 422;
        throw error;
      }

      if (isbn && !validateISBN(isbn)) {
        const error = new Error('Invalid ISBN');
        error.status = 422;
        throw error;
      }

      if (authors) {
        authors.forEach(validateEmail);
      }
    } catch (error) {
      error.meta = { ...error.meta, 'LibraryService.validateSearchFilter': { filter } };
      throw error;
    }
  }

  /**
   * It fetches all books from the database and returns them in a table
   * @returns An object with a message and content property.
   */
  async fetchAllBooks() {
    try {
      const books = await this.bookRepository.fetchAllBooks();

      const table = bookTable();

      return { message: { status: 'success' }, content: books, table };
    } catch (error) {
      throw error;
    }
  }

  /**
   * It fetches all magazines from the database and returns them in a table
   * @returns An object with a message and content property.
   */
  async fetchAllMagazines() {
    try {
      const magazines = await this.magazineRepository.fetchAllMagazines();

      const table = magazineTable();

      return { message: { status: 'success' }, content: magazines, table };
    } catch (error) {
      throw error;
    }
  }

  /**
   * It fetches all books and magazines from the database, sorts them by title, and returns them in a
   * table
   * @returns An object with a message and content property.
   */
  async fetchAllBooksAndMagazines() {
    try {
      const books = await this.bookRepository.fetchAllBooks();
      const magazines = await this.magazineRepository.fetchAllMagazines();

      const booksAndMagazines = [...books, ...magazines].sort((a, b) => (a.title > b.title ? 1 : -1));

      const table = booksAndMagazinesTable();

      return { message: { status: 'success' }, content: booksAndMagazines, table };
    } catch (error) {
      throw error;
    }
  }

  /**
   * It searches for books and magazines by a filter
   * @param filter - {
   * @returns An object with a message and content.
   */
  async searchByFilter(filter) {
    try {
      let books;
      let magazines;
      let booksAndMagazines;

      if (filter?.authors) {
        filter.authors = filter.authors.replaceAll(' ', '').split(',');
      }

      if (filter?.isbn) {
        books = await this.bookRepository.searchByISBN(filter.isbn);
        magazines = await this.magazineRepository.searchByISBN(filter.isbn);
      }

      if (filter?.authors) {
        const authorIds = (await this.authorRepository.findAuthorsByEmails(filter.authors)).map((author) => author._id);

        books = await this.bookRepository.searchByAuthorIds(authorIds);
        magazines = await this.magazineRepository.searchByAuthorIds(authorIds);
      }

      booksAndMagazines = [...books, ...magazines].sort((a, b) => (a.title > b.title ? 1 : -1));
      const table = booksAndMagazinesTable();

      return { message: { status: 'success' }, content: booksAndMagazines, table };
    } catch (error) {
      error.meta = { ...error.meta, 'LibraryService.searchByFilter': { filter } };
      throw error;
    }
  }
};
