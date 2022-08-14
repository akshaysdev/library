const Schema = require('mongoose').Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  authors: {
    type: [Schema.Types.ObjectId],
    ref: 'Author',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = (mongoDb) => {
  return mongoDb.model('Book', BookSchema);
};
