const MagazineSchema = require('./schema');
const { magazineFormatter } = require('./formatter');

module.exports = class MagazineRepository {
  constructor({ mongoDb }) {
    this.repository = MagazineSchema(mongoDb);
  }

  async create(magazine) {
    try {
      const response = await this.repository.create(magazine);

      return response;
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineRepository.create': { magazine } };
      throw error;
    }
  }

  async insertMany(magazines) {
    try {
      return await this.repository.insertMany(magazines, { ordered: true });
    } catch (error) {
      error.meta = { ...error.meta, 'MagazineRepository.insertMany': { magazines } };
      throw error;
    }
  }

  async fetchAllMagazines() {
    try {
      const magazines = await this.repository.find({});

      const forattedMagazines = await magazineFormatter(this.repository, magazines);

      return forattedMagazines;
    } catch (error) {
      throw error;
    }
  }


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
