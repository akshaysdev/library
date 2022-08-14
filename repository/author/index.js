const { bulkWriteQuery } = require('./query');
const AuthorSchema = require('./schema');

module.exports = class AuthorRepository {
  constructor({ mongoDb }) {
    this.repository = AuthorSchema(mongoDb);
  }

  /**
   * Inserts many authors into the database
   * @param authors - The array of authors to insert.
   * @returns The authors that were inserted.
   */
  async insertMany(authors) {
    try {
      return await this.repository.insertMany(authors, { ordered: false, runValidators: true });
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorRepository.insertMany': { authors } };
      throw error;
    }
  }

  /**
   * Find authors by emails
   * @param emails - An array of emails to search for.
   * @returns An array of authors
   */
  async findAuthorsByEmails(emails) {
    try {
      const authors = await this.repository.find({ email: { $in: emails } }).select('email');
      return authors;
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorRepository.findAuthorsByEmails': { emails } };
      throw error;
    }
  }

  /**
   * It takes an array of authors, and returns a promise that resolves to the result of a bulkWrite
   * operation
   * @param authors - An array of authors to update.
   * @returns The return value is the result of the bulkWrite operation.
   */
  async bulkUpdateAuthors(authors) {
    try {
      const operations = bulkWriteQuery(authors);

      return await this.repository.bulkWrite(operations, { ordered: false });
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorRepository.bulkUpdateAuthors': { authors } };
      throw error;
    }
  }

  /**
   * It fetches all authors from the database and returns them
   * @returns An array of authors
   */
  async fetchAllAuthors() {
    try {
      const authors = await this.repository.find({}).select('-_id -__v');
      
      return authors;
    } catch (error) {
      throw error;
    }
  }
};
