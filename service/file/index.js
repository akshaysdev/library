const fileSystem = require('fs');

const { csvPath, fileType } = require('../../constants');

module.exports = class FileService {
  constructor({ bookService, magazineService, authorService }) {
    this.bookService = bookService;
    this.magazineService = magazineService;
    this.authorService = authorService;
  }

  async uploadFile(filePath, file) {
    try {
      await fileSystem.writeFileSync(filePath, file.buffer);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'FileService.uploadFile': { filePath, file } };
      throw error;
    }
  }

  async saveDataToFile(type, file) {
    try {
      let result;

      switch (type) {
        case fileType.BOOKS:
          result = await this.saveBookToFile(file);
          break;
        case fileType.MAGAZINES:
         result =  await this.saveMagazineToFile(file);
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
};
