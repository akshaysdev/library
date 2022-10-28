/**
 * It takes a model and an array of magazines, and returns an array of magazines with their authors
 * populated
 * @param model - The model to be populated.
 * @param magazines - The magazines to be formatted.
 * @returns An array of magazines with the authors populated.
 */
const magazineFormatter = async (model, magazines) => {
  return await model.populate(magazines, [
    {
      path: 'authors',
      model: 'Author',
      select: 'email firstname lastname -_id',
      options: { lean: true },
    },
  ]);
};

module.exports = { magazineFormatter };
