
/**
 * It takes an array of authors and returns an array of bulk write operations
 * @param authors - An array of objects containing the author's email and name.
 * @returns An array of objects.
 */
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
