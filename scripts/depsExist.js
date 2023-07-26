const fs = require('fs'); // eslint-disable-line

const packagesRoot = `${__dirname}/../packages`;
const depsPaths = [`${packagesRoot}/database/dist`, `${packagesRoot}/shared/dist`];

if (depsPaths.some((path) => !fs.existsSync(path))) {
  // Package has not been built; bail
  process.exit(1);
}
