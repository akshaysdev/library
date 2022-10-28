const MagazineSchema = require('./schema');
const { magazineFormatter } = require('./formatter');

module.exports = class MagazineRepository {
  constructor({ mongoDb }) {
    this.repository = MagazineSchema(mongoDb);
  }

 /**
  * It creates a new magazine
  * @param magazine - The magazine object to be created.
  * @returns The response from the repository.
  */
  async create(magazine) {
    try {
      const response = await this.repository.create(magazine);

      return response;
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineRepository.create': { magazine } };
      throw error;
    }
  }

  /**
   * Inserts many magazines into the database
   * @param magazines - An array of magazine objects to be inserted into the database.
   * @returns The result of the insertMany operation.
   */
  async insertMany(magazines) {
    try {
      return await this.repository.insertMany(magazines, { ordered: true });
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineRepository.insertMany': { magazines } };
      throw error;
    }
  }

  /**
   * It fetches all the magazines from the database and returns them in a formatted way
   * @returns An array of magazines
   */
  async fetchAllMagazines() {
    try {
      const magazines = await this.repository.find({});

      const forattedMagazines = await magazineFormatter(this.repository, magazines);

      return forattedMagazines;
    } catch (error) {
      throw error;
    }
  }


  /**
   * It searches for magazines by author ids
   * @param ids - An array of author ids.
   * @returns An array of magazines that have the author ids passed in.
   */
  async searchByAuthorIds(ids) {
    try {
      const magazines = await this.repository.find({ authors: { $in: ids } });

      const forattedMagazines = await magazineFormatter(this.repository, magazines);

      return forattedMagazines;
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineRepository.searchByAuthorIds': { ids } };
      throw error;
    }
  }

  /**
   * It searches for magazines by ISBN and returns the formatted magazines
   * @param isbn - The isbn of the magazine you want to search for.
   * @returns An array of magazines that match the isbn
   */
  async searchByISBN(isbn) {
    try {
      const magazines = await this.repository.find({ isbn });

      const forattedMagazines = await magazineFormatter(this.repository, magazines);

      return forattedMagazines;
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineRepository.searchByISBN': { isbn } };
      throw error;
    }
  }
};
