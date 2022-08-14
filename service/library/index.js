const fileSystem = require('fs');

const { csvPath, jsonPath } = require('../../constants');

module.exports = class LibraryService {
  constructor({ bookRepository, authorRepository }) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
  }

  async getData(filePath) {
    try {
      const data = fileSystem.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      error.meta = { ...error.meta, 'LibraryService.getData': { filePath } };
      throw error;
    }
  }

  async saveData(filePath, data) {
    try {
      fileSystem.writeFileSync(jsonPath.books, JSON.stringify(data));
    } catch (error) {
      error.meta = { ...error.meta, 'LibraryService.saveData': { filePath } };
      throw error;
    }
  }

  async storeBook(book) {
    try {
      await this.validateBook(book);

      data.push(book);

      await this.saveData(filePath, data);
    } catch (error) {
      error.meta = { ...error.meta, 'LibraryService.storeBook': { book } };
      throw error;
    }
  }
  async storeManyBooks(file) {
    try {
      // const booksData = await this.fileRepository.csvToJson(file);

      // data.push(book);

      // await this.saveData(filePath, data);
    } catch (error) {
      error.meta = { ...error.meta, 'LibraryService.storeManyBooks': { file } };
      throw error;
    }
  }

  async storeMagazine(magazine) {
    try {
      const filePath = jsonPath.magazines;
      const data = await this.getData(filePath);

      data.push(magazine);

      await this.saveData(filePath, data);
    } catch (error) {
      error.meta = { ...error.meta, 'LibraryService.storeMagazine': { magazine } };
      throw error;
    }
  }
};
