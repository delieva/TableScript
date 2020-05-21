const fs = require('fs');
const deepClone = require('../utils/deepClone');

// fs operations

const readFileRawPath = (filePath) => {
  const csvString = fs.readFileSync(filePath, 'utf-8');
  const table = csvString.split('\n').map((row) => row.split(','))
  
  return table
}

const writeFileRawPath = (filePath, table) => {
  const csvString = table.map((row) => row.join(',')).join('\n')
  fs.writeFileSync(filePath, csvString, 'utf-8')
};

// displaying

const log = (...args) => {
  console.log(...args)
}

const showTable = (table) => {
  console.table(table);
}

// table operations

const setValue = (row, column, value, table) => {
  table[row][column] = value;
  return deepClone(table);
}

const removeRow = (rowCount, table) => {
  table.splice(rowCount, 1)
  return deepClone(table);
}

const removeColumn = (columnCount, table) => {
  table.forEach((row) => {
    row.splice(columnCount, 1)
  })
  
  return deepClone(table)
}

const addRow = (...arguments) => {
  const table = arguments.pop();
  table.push([...arguments]);
  
  return deepClone(table);
}

const addColumn = (...arguments) => {
  const table = arguments.pop();
  const maxRowLength = findMaxRowLength(table);
  
  arguments.forEach((item, index) => {
    if (!table[index]) {
      table[index] = [];
    }
    table[index][maxRowLength] = item;
  })
  
  return replaceUndefined(deepClone(table));
};

const replaceUndefined = (table) => {
  return table.map((item) => {
    return item.map((val) => {
      if (!val) {
        return ''
      }
      return val
    })
  })
};

const findMaxRowLength = (table) => {
  let max = 0;
  table.forEach((item) => {
    if (item.length > max) {
      max = item.length
    };
  })
  return max
};

const getValue = (row, column, table) => {
  return table[row][column]
}

const swapColumns = (column1, column2, table) => {
  table.forEach((r, rowIndex) => {
    const temp = table[rowIndex][column1]
    table[rowIndex][column1] = table[rowIndex][column2];
    table[rowIndex][column2] = temp;
  })
  
  return deepClone(table);
}

const swapRows = (row1, row2, table) => {
  const temp = table[row1];
  table[row1] = table[row2];
  table[row2] = temp;
  
  return deepClone(table)
};

module.exports = {
  readFileRawPath,
  writeFileRawPath,
  log,
  showTable,
  setValue,
  removeColumn,
  removeRow,
  getValue,
  swapColumns,
  swapRows,
  addRow,
  addColumn
}