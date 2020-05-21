const { join, dirname} = require('path');

const {
  readFileRawPath,
  writeFileRawPath,
  log,
  showTable,
  setValue,
  removeColumn,
  removeRow,
  getValue,
  swapColumns,
  swapRows
} = require('./functions');

class Core {
  constructor(code, filePath) {
    const readFile = (tablePath) => {
      return readFileRawPath(join(dirname(filePath), tablePath));
    };
    
    const writeFile = (tablePath, table) => {
      return writeFileRawPath(join(dirname(filePath), tablePath), table)
    }
    
    eval(code + 'main()');
  }
}

module.exports = Core;