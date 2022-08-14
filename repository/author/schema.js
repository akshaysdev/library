const Schema = require('mongoose').Schema;

const AuthorSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
});

module.exports = (mongoDb) => {
  return mongoDb.model('Author', AuthorSchema);
};
