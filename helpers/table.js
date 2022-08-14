/**
 * It returns an array of objects, each of which has a header and a key property
 * @returns An array of objects.
 */
const bookTable = () => {
  return [
    { header: 'Title', key: 'title' },
    { header: 'Authors', key: 'authors' },
    { header: 'ISBN', key: 'isbn' },
    { header: 'Description', key: 'description' },
  ];
};

/**
 * It returns an array of objects, each of which has a header and a key property
 * @returns An array of objects.
 */
const magazineTable = () => {
  return [
    { header: 'Title', key: 'title' },
    { header: 'Authors', key: 'authors' },
    { header: 'ISBN', key: 'isbn' },
    { header: 'Published At', key: 'publishedAt' },
  ];
};

/**
 * It returns an array of objects, each of which has a header and a key property
 * @returns An array of objects.
 */
const booksAndMagazinesTable = () => {
  return [
    { header: 'Title', key: 'title' },
    { header: 'Authors', key: 'authors' },
    { header: 'ISBN', key: 'isbn' },
    { header: 'Description', key: 'description' },
    { header: 'Published At', key: 'publishedAt' },
  ];
};

/**
 * It returns an array of strings
 * @returns An array of strings.
 */
const bookCsvHeaders = () => {
  return ['title', 'isbn', 'authors', 'description'];
};

/**
 * It returns an array of strings
 * @returns An array of strings.
 */
const magazineCsvHeaders = () => {
  return ['title', 'isbn', 'authors', 'publishedAt'];
};

/**
 * It returns an array of strings
 * @returns An array of strings.
 */
const authorCsvHeaders = () => {
  return ['email', 'firstname', 'lastname'];
};

module.exports = {
  bookTable,
  magazineTable,
  booksAndMagazinesTable,
  bookCsvHeaders,
  magazineCsvHeaders,
  authorCsvHeaders,
};
