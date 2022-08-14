const { Lifetime, createContainer, asClass, asValue } = require('awilix');

const { uploadImage } = require('./multer');
const { mongoDb } = require('./mongoDb');

/**
 * It creates a container, registers some dependencies, and then loads all the files in the repository
 * and service directories
 * @returns A function that returns a container.
 */
const Container = () => {
  const container = createContainer();

  container.register('uploadImage', asValue(uploadImage, { lifetime: Lifetime.SINGLETON }));
  container.register('mongoDb', asValue(mongoDb, { lifetime: Lifetime.SINGLETON }));

  const options = {
    cwd: __dirname,
    formatName: (_, descriptor) => {
      const path = descriptor.path.split('/');
      const className = path[path.length - 2];
      let classType = path[path.length - 3];
      classType = classType.charAt(0).toUpperCase() + classType.substring(1);
      return className + classType;
    },
    resolverOptions: {
      register: asClass,
      lifetime: Lifetime.SINGLETON,
    },
  };

  container.loadModules(['../repository/*/index.js', '../service/*/index.js'], options);

  return container;
};

module.exports = { container: Container() };
