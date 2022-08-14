const moment = require('moment');
const { Readable } = require('stream');
const { parse } = require('csv-parse');

const { validateISBN, validateEmail, unique, validateDate } = require('../../helpers/form');
const { magazineCsvHeaders } = require('../../helpers/table');

module.exports = class MagazineService {
  constructor({ magazineRepository, authorRepository }) {
    this.magazineRepository = magazineRepository;
    this.authorRepository = authorRepository;
  }

  /**
   * It validates the magazine object and throws an error if it's invalid
   * @param magazine - The magazine object to validate.
   * @returns A boolean value.
   */
  async validateMagazine(magazine) {
    try {
      if (!magazine.title) {
        const error = new Error('Title is required');
        error.status = 422;
        throw error;
      }

      if (!magazine.isbn) {
        const error = new Error('ISBN is required');
        error.status = 422;
        throw error;
      }

      if (!validateISBN(magazine.isbn)) {
        const error = new Error('ISBN is invalid');
        error.status = 422;
        throw error;
      }

      if (!magazine.publishedAt) {
        const error = new Error('Published Date is required');
        error.status = 422;
        throw error;
      }

      if (!validateDate(magazine.publishedAt)) {
        const error = new Error('Published Date is invalid');
        error.status = 422;
        throw error;
      }

      if (!magazine.authors || (magazine.authors && magazine.authors.length === 0)) {
        const error = new Error('Authors is required');
        error.status = 422;
        throw error;
      }

      for (let author of magazine.authors) {
        if (!validateEmail(author)) {
          const error = new Error('Author Email is invalid');
          error.status = 422;
          throw error;
        }
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineService.validateMagazine': { magazine } };
      throw error;
    }
  }

  /**
   * It takes a CSV file, converts it to JSON, and returns the JSON
   * @param file - The file that was uploaded.
   * @returns An array of objects.
   */
  async magazineCsvToJson(file) {
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
      error.meta = { ...error.meta, 'MagazineService.magazineCsvToJson': { file } };
      throw error;
    }
  }

  /**
   * It takes a CSV file, converts it to JSON, validates the JSON, saves the JSON to the database
   * @param file - The file to be uploaded.
   */
  async saveMagazinesFromFile(file) {
    try {
      const magazines = await this.magazineCsvToJson(file);

      for (let magazine of magazines) {
        await this.validateMagazine(magazine);
      }

      const emails = magazines
        .map((magazine) => magazine.authors)
        .flat()
        .filter(unique);
      const authorEmails = (await this.authorRepository.findAuthorsByEmails(emails)).map((author) => author.email);

      const newAuthors = emails.filter((email) => !authorEmails.includes(email)).map((email) => ({ email }));
      await this.authorRepository.insertMany(newAuthors);

      for (let magazine of magazines) {
        const authorIds = (await this.authorRepository.findAuthorsByEmails(magazine.authors)).map(
          (author) => author._id
        );
        magazine.authors = authorIds;
        magazine.publishedAt = moment(magazine.publishedAt, 'DD.MM.YYYY').toDate();
      }

      try {
        await this.magazineRepository.insertMany(magazines);
      } catch (bulkError) {
        return { status: 'warn', text: 'One or Many Magazine already exists' };
      }

      return { status: 'success', text: 'Magazines uploaded successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineService.saveMagazinesFromFile': { file } };
      throw error;
    }
  }

  /**
   * It takes a magazine object, validates it, creates new authors if needed, creates the magazine and
   * returns a success message
   * @param magazine - The magazine object that we want to create.
   * @returns A magazine object
   */
  async createMagazine(magazine) {
    try {
      magazine.authors = magazine.authors.replaceAll(' ', '').split(',');
      magazine.authors = magazine.authors.map((author) => author.replace('null-', ''));

      await this.validateMagazine(magazine);

      const emails = magazine.authors.filter(unique);
      const authorEmails = (await this.authorRepository.findAuthorsByEmails(emails)).map((author) => author.email);

      const newAuthors = emails.filter((email) => !authorEmails.includes(email)).map((email) => ({ email }));
      await this.authorRepository.insertMany(newAuthors);

      const authorIds = (await this.authorRepository.findAuthorsByEmails(magazine.authors)).map((author) => author._id);
      magazine.authors = authorIds;
      magazine.publishedAt = moment(magazine.publishedAt, 'DD.MM.YYYY').toDate();

      try {
        await this.magazineRepository.create(magazine);
      } catch (createError) {
        return { status: 'warn', text: createError.message };
      }

      return { status: 'success', text: 'Magazine uploaded successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineService.createMagazine': { magazine } };
      throw error;
    }
  }

  /**
   * It fetches all magazines from the database, transforms them into CSV data and returns the CSV data
   * @returns A string of csv data.
   */
  async jsonDataToCsvData() {
    try {
      const magazines = await this.magazineRepository.fetchAllMagazines();

      let csvData = [];
      const csvHeaders = magazineCsvHeaders();
      csvData.push(csvHeaders);

      for (let magazine of magazines) {
        const authors = magazine.authors.map((author) => author.email);
        const publishedAt = moment(new Date(magazine.publishedAt)).format('DD.MM.YYYY').toString();
        const row = [magazine.title, magazine.isbn, authors.join(','), publishedAt];
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
