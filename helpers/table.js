const bookTable = () => {
  return [
    { header: 'Title', key: 'title' },
    { header: 'Authors', key: 'authors' },
    { header: 'ISBN', key: 'isbn' },
    { header: 'Description', key: 'description' },
  ];
};

const magazineTable = () => {
  return [
    { header: 'Title', key: 'title' },
    { header: 'Authors', key: 'authors' },
    { header: 'ISBN', key: 'isbn' },
    { header: 'Published At', key: 'publishedAt' },
  ];
};

const booksAndMagazinesTable = () => {
  return [
    { header: 'Title', key: 'title' },
    { header: 'Authors', key: 'authors' },
    { header: 'ISBN', key: 'isbn' },
    { header: 'Description', key: 'description' },
    { header: 'Published At', key: 'publishedAt' },
  ];
};

module.exports = { bookTable, magazineTable, booksAndMagazinesTable };
