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
      console.log(join(dirname(filePath), tablePath));
      return readFileRawPath(join(dirname(filePath), tablePath));
    };
    
    eval(code + 'main()');
  }
}

module.exports = Core;