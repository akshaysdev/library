const { Readable } = require('stream');
const { parse } = require('csv-parse');

const { validateEmail } = require('../../helpers/form');

module.exports = class AuthorService {
  constructor({ magazineRepository, authorRepository }) {
    this.magazineRepository = magazineRepository;
    this.authorRepository = authorRepository;
  }

  async validateAuthor(author) {
    try {
      if (!validateEmail(author)) {
        const error = new Error('Author Email is invalid');
        error.status = 422;
        throw error;
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorService.validateAuthor': { author } };
      throw error;
    }
  }

  async authorCsvToJson(file) {
    try {
      const stream = Readable.from(file.buffer);

      const jsonData = [];

      await stream.pipe(parse({ columns: true, delimiter: ';' })).on('data', (data) => jsonData.push(data));

      for (let data of jsonData) {
        data.email = data.email.replace('null-', '');
      }

      return jsonData;
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorService.authorCsvToJson': { file } };
      throw error;
    }
  }

  async saveAuthorsFromFile(file) {
    try {
      const authors = await this.authorCsvToJson(file);

      const existingAuthors = (
        await this.authorRepository.findAuthorsByEmails(authors.map((author) => author.email))
      ).map((author) => author.email);

      const newAuthors = authors.filter((author) => !existingAuthors.includes(author.email));
      const updateAuthors = authors.filter(
        (author) =>
          existingAuthors.includes(author.email) &&
          (existingAuthors.includes(author.firstname) || existingAuthors.includes(author.lastname))
      );

      for (let author of newAuthors) {
        await this.validateAuthor(author);
      }

      if (newAuthors.length) {
        await this.authorRepository.insertMany(newAuthors);
      }

      if (updateAuthors.length) {
        await this.authorRepository.bulkUpdateAuthors(updateAuthors);
      }

      if (!newAuthors.length && !updateAuthors.length) {
        return { status: 'warn', text: 'One or Many Author already exists!' };
      }

      return { status: 'success', text: 'Authors uploaded successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'AuthorService.saveAuthorsFromFile': { file } };
      throw error;
    }
  }
};
