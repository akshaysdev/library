const Schema = require('mongoose').Schema;

const MagazineSchema = new Schema({
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
  publishedAt: {
    type: Date,
    required: true,
  },
});

module.exports = (mongoDb) => {
  return mongoDb.model('Magazine', MagazineSchema);
};
