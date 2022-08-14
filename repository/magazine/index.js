const MagazineSchema = require('./schema');

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
};
