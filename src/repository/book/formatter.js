/**
 * It takes a model and an array of books, and returns a promise that resolves to an array of books
 * with their authors populated
 * @param model - The model to populate
 * @param books - The books to be formatted
 * @returns An array of objects with their authors populated.
 */
const bookFormatter = async (model, books) => {
  return await model.populate(books, [
    {
      path: 'authors',
      model: 'Author',
      select: 'email firstname lastname -_id',
      options: { lean: true },
    },
  ]);
};

module.exports = { bookFormatter };
