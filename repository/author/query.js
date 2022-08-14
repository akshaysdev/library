const bulkWriteQuery = (authors) => {
  const bulkWriteOperations = [];
  for (let author of authors) {
    bulkWriteOperations.push({
      updateOne: {
        filter: { email: author.email },
        update: {
          $set: {
            firstname: author.firstname || '',
            lastname: author.lastname || '',
          },
        },
      },
    });
  }
  return bulkWriteOperations;
};

module.exports = { bulkWriteQuery };
