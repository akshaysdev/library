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
