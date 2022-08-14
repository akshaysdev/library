const viewsFilePath = {
  home: `${__dirname}/views`,
  books: `${__dirname}/views/pages/booksAndMagazines`,
  magazines: `${__dirname}/views/pages/booksAndMagazines`,
  booksAndMagazines: `${__dirname}/views/pages/booksAndMagazines`,
  createBook: `${__dirname}/views/pages/bookForm`,
  createMagazine: `${__dirname}/views/pages/magazineForm`,
  search: `${__dirname}/views/pages/searchForm`,
  upload: `${__dirname}/views/pages/uploadForm`,
  download: `${__dirname}/views/pages/downloadForm`,
};

const csvPath = {
  books: `${__dirname}/csv/books.csv`,
  magazines: `${__dirname}/csv/magazines.csv`,
  author: `${__dirname}/csv/author.csv`,
};

const uploadPath = `${__dirname}/csv`;

const fileType = {
  BOOKS: 'BOOKS',
  MAGAZINES: 'MAGAZINES',
  AUTHORS: 'AUTHORS',
};

const pagePath = {
  home: '/api/v1/home',
  uploadForm: '/api/v1/file/upload',
  bookForm: '/api/v1/library/book/form',
  magazineForm: '/api/v1/library/magazine/form',
  searchForm: '/api/v1/library/search/form',
};

module.exports = { viewsFilePath, csvPath, uploadPath, fileType, pagePath /* jsonPath, /* pagePath */ };
