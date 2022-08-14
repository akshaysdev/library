const BookSchema = require('./schema');

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
};
