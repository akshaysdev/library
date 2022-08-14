const { Readable } = require('stream');
const { parse } = require('csv-parse');

const { validateEmail } = require('../../helpers/form');
const { authorCsvHeaders } = require('../../helpers/table');

module.exports = class AuthorService {
  constructor({ magazineRepository, authorRepository }) {
    this.magazineRepository = magazineRepository;
    this.authorRepository = authorRepository;
  }

  /**
   * > Validate the author's email address
   * @param author - The author object to validate.
   * @returns A boolean value.
   */
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

  /**
   * It takes a CSV file, converts it to JSON, and returns the JSON
   * @param file - The file that was uploaded.
   * @returns An array of objects.
   */
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

  /**
   * It takes a CSV file, converts it to JSON, checks if the authors already exist, and if not, saves
   * them to the database
   * @param file - The file that contains the authors to be uploaded.
   */
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


  /**
   * It fetches all authors from the database, creates a CSV header row, creates a CSV data row for
   * each author, and returns the CSV data as a string
   * @returns A string of csv data.
   */
  async jsonDataToCsvData() {
    try {
      const authors = await this.authorRepository.fetchAllAuthors();

      let csvData = [];
      const csvHeaders = authorCsvHeaders();
      csvData.push(csvHeaders);

      for (let author of authors) {
        const row = [author.email, author.firstname, author.lastname];
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
