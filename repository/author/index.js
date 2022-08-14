const { bulkWriteQuery } = require('./query');
const AuthorSchema = require('./schema');

module.exports = class AuthorRepository {
  constructor({ mongoDb }) {
    this.repository = AuthorSchema(mongoDb);
  }

  async insertMany(authors) {
    try {
      return await this.repository.insertMany(authors, { ordered: false, runValidators: true });
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorRepository.insertMany': { authors } };
      throw error;
    }
  }

  async findAuthorsByEmails(emails) {
    try {
      const authors = await this.repository.find({ email: { $in: emails } }).select('email');
      return authors;
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorRepository.findAuthorsByEmails': { emails } };
      throw error;
    }
  }

  async bulkUpdateAuthors(authors) {
    try {
      const operations = bulkWriteQuery(authors);

      return await this.repository.bulkWrite(operations, { ordered: false });
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorRepository.bulkUpdateAuthors': { authors } };
      throw error;
    }
  }
};
