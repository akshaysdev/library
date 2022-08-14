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
