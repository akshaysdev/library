const { Readable } = require('stream');
const { parse } = require('csv-parse');

const { validateISBN, validateEmail, unique } = require('../../helpers/form');
const { bookCsvHeaders } = require('../../helpers/table');

module.exports = class BookService {
  constructor({ bookRepository, authorRepository }) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
  }

  /**
   * It validates a book object
   * @param book - The book object to validate.
   * @returns A boolean value
   */
  async validateBook(book) {
    try {
      if (!book.title) {
        const error = new Error('Title is required');
        error.status = 422;
        throw error;
      }

      if (!book.isbn) {
        const error = new Error('ISBN is required');
        error.status = 422;
        throw error;
      }

      if (!validateISBN(book.isbn)) {
        const error = new Error('ISBN is invalid');
        error.status = 422;
        throw error;
      }

      if (!book.description) {
        const error = new Error('Description is required');
        error.status = 422;
        throw error;
      }

      if (!book.authors || (book.authors && book.authors.length === 0)) {
        const error = new Error('Authors is required');
        error.status = 422;
        throw error;
      }

      for (let author of book.authors) {
        if (!validateEmail(author)) {
          const error = new Error('Author Email is invalid');
          error.status = 422;
          throw error;
        }
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'BookService.validateBook': { book } };
      throw error;
    }
  }

  /**
   * It takes a CSV file, converts it to JSON, and returns the JSON
   * @param file - The file object that was uploaded.
   * @returns An array of objects.
   */
  async bookCsvToJson(file) {
    try {
      const stream = Readable.from(file.buffer);

      const jsonData = [];

      await stream.pipe(parse({ columns: true, delimiter: ';' })).on('data', (data) => jsonData.push(data));

      for (let data of jsonData) {
        let authors = data.authors.split(',');
        authors = authors.map((author) => author.replace('null-', ''));
        data.authors = authors;
      }

      return jsonData;
    } catch (error) {
      error.meta = { ...error.meta, 'BookService.bookCsvToJson': { file } };
      throw error;
    }
  }

  /**
   * It takes a CSV file, converts it to JSON, validates the JSON, saves the authors, and then saves
   * the books
   * @param file - The file to be uploaded.
   * @returns A promise that resolves to an object with a status and text property.
   */
  async saveBooksFromFile(file) {
    try {
      const books = await this.bookCsvToJson(file);

      for (let book of books) {
        await this.validateBook(book);
      }

      const emails = books
        .map((book) => book.authors)
        .flat()
        .filter(unique);
      const authorEmails = (await this.authorRepository.findAuthorsByEmails(emails)).map((author) => author.email);

      const newAuthors = emails.filter((email) => !authorEmails.includes(email)).map((email) => ({ email }));
      await this.authorRepository.insertMany(newAuthors);

      for (let book of books) {
        const authorIds = (await this.authorRepository.findAuthorsByEmails(book.authors)).map((author) => author._id);
        book.authors = authorIds;
      }

      try {
        await this.bookRepository.insertMany(books);
      } catch (bulkError) {
        return { status: 'warn', text: 'One or Many Book already exists' };
      }

      return { status: 'success', text: 'Books uploaded successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'BookService.saveBooksFromFile': { file } };
      throw error;
    }
  }

  /**
   * It creates a book
   * @param book - The book object to be created.
   * @returns A promise that resolves to an object with a status and text property.
   */
  async createBook(book) {
    try {
      book.authors = book.authors.replaceAll(' ', '').split(',');
      book.authors = book.authors.map((author) => author.replace('null-', ''));

      await this.validateBook(book);

      const emails = book.authors.filter(unique);
      const authorEmails = (await this.authorRepository.findAuthorsByEmails(emails)).map((author) => author.email);

      const newAuthors = emails.filter((email) => !authorEmails.includes(email)).map((email) => ({ email }));
      await this.authorRepository.insertMany(newAuthors);

      const authorIds = (await this.authorRepository.findAuthorsByEmails(book.authors)).map((author) => author._id);
      book.authors = authorIds;

      try {
        await this.bookRepository.create(book);
      } catch (createError) {
        return { status: 'warn', text: createError.message };
      }

      return { status: 'success', text: 'Book uploaded successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'BookService.createBook': { book } };
      throw error;
    }
  }

  /**
   * It fetches all books from the database, transforms them into CSV data, and returns the CSV data
   * @returns A string of csv data.
   */
  async jsonDataToCsvData() {
    try {
      const books = await this.bookRepository.fetchAllBooks();

      let csvData = [];
      const csvHeaders = bookCsvHeaders();
      csvData.push(csvHeaders);

      for (let book of books) {
        const authors = book.authors.map((author) => author.email);
        const row = [book.title, book.isbn, authors.join(','), book.description];
        csvData.push(row);
      }
      csvData = csvData.map((row) => row.join(';'));      
      csvData = csvData.join('\n');

      return csvData;
    } catch (error) {
      throw error;
    }
  }
};
