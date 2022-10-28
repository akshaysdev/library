const fileSystem = require('fs');

const { csvPath, fileType } = require('../../constants');

module.exports = class FileService {
  constructor({ bookService, magazineService, authorService }) {
    this.bookService = bookService;
    this.magazineService = magazineService;
    this.authorService = authorService;
  }

  /**
   * It takes a file path and a file object, and writes the file to the file system
   * @param filePath - The path to the file you want to upload.
   * @param file - The file object that was uploaded.
   * @returns A boolean value.
   */
  async uploadFile(filePath, file) {
    try {
      await fileSystem.writeFileSync(filePath, file.buffer);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.uploadFile': { filePath, file } };
      throw error;
    }
  }

  /**
   * It takes a file path and some data, and writes the data to the file path
   * @param filePath - The path to the file you want to write to.
   * @param csvData - The data that will be written to the file.
   * @returns A boolean value.
   */
  async downloadFile(filePath, csvData) {
    try {
      await fileSystem.writeFileSync(filePath, csvData);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.downloadFile': { filePath, csvData } };
      throw error;
    }
  }

  /**
   * It saves data to a file
   * @param type - fileType.BOOKS, fileType.MAGAZINES, fileType.AUTHORS
   * @param file - the file to be saved
   */
  async saveDataToFile(type, file) {
    try {
      let result;

      switch (type) {
        case fileType.BOOKS:
          result = await this.saveBookToFile(file);
          break;
        case fileType.MAGAZINES:
          result = await this.saveMagazineToFile(file);
          break;
        case fileType.AUTHORS:
          result = await this.saveAuthorToFile(file);
          break;
        default:
          const error = new Error('Type is not selected');
          error.status = 400;
          throw error;
      }

      return result;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.saveDataToFile': { type, file } };
      throw error;
    }
  }

  /**
   * It saves the books from a file to the database and uploads the file to the server
   * @param file - The file to be uploaded
   * @returns The result of the saveBooksFromFile function.
   */
  async saveBookToFile(file) {
    try {
      const result = await this.bookService.saveBooksFromFile(file);

      await this.uploadFile(csvPath.books, file);

      return result;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.saveBookToFile': { file } };
      throw error;
    }
  }

  /**
   * It saves the magazines from a file to the database
   * @param file - The file to be uploaded.
   * @returns The result of the saveMagazinesFromFile function.
   */
  async saveMagazineToFile(file) {
    try {
      const result = await this.magazineService.saveMagazinesFromFile(file);

      await this.uploadFile(csvPath.magazines, file);

      return result;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.saveMagazineToFile': { file } };
      throw error;
    }
  }

  async saveAuthorToFile(file) {
    try {
      const result = await this.authorService.saveAuthorsFromFile(file);

      await this.uploadFile(csvPath.author, file);

      return result;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.saveAuthorToFile': { file } };
      throw error;
    }
  }

  /**
   * It downloads data to a file
   * @param type - Type of the data
   */
  async downloadDataToFile(type) {
    try {
      let result;

      switch (type) {
        case fileType.BOOKS:
          result = await this.downloadBookToFile();
          break;
        case fileType.MAGAZINES:
          result = await this.downloadMagazineToFile();
          break;
        case fileType.AUTHORS:
          result = await this.downloadAuthorToFile();
          break;
        default:
          const error = new Error('Type is not selected');
          error.status = 400;
          throw error;
      }

      return result;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.downloadDataToFile': { type } };
      throw error;
    }
  }

  /**
   * It downloads a book file to the server
   * @returns Result of the operation
   */
  async downloadBookToFile() {
    try {
      const bookCsvData = await this.bookService.jsonDataToCsvData();

      const randomeString = Math.random().toString(36).substring(2, 12);

      await this.downloadFile(csvPath.books, bookCsvData);

      const filename = `books_${randomeString}.csv`;

      return { text: 'Book file is downloaded', status: 'success', download: { data: bookCsvData, filename } };
    } catch (error) {
      throw error;
    }
  }

  /**
   * It downloads a file to the server
   * @returns Result of the operation
   */
  async downloadMagazineToFile() {
    try {
      const magazineCsvData = await this.magazineService.jsonDataToCsvData();

      const randomeString = Math.random().toString(36).substring(2, 12);

      await this.downloadFile(csvPath.magazines, magazineCsvData);

      const filename = `magazines_${randomeString}.csv`;

      return { text: 'Magazine file is downloaded', status: 'success', download: { data: magazineCsvData, filename } };
    } catch (error) {
      throw error;
    }
  }

  /**
   * It downloads the author data to a file
   * @returns Result of the operation
   */
  async downloadAuthorToFile() {
    try {
      const authorCsvData = await this.authorService.jsonDataToCsvData();

      const randomeString = Math.random().toString(36).substring(2, 12);

      await this.downloadFile(csvPath.author, authorCsvData);

      const filename = `authors_${randomeString}.csv`;

      return { text: 'Author file is downloaded', status: 'success', download: { data: authorCsvData, filename } };
    } catch (error) {
      throw error;
    }
  }
};
