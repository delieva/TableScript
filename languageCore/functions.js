const fs = require('fs');

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
  return table;
}

const removeRow = (rowCount, table) => {
  table.splice(rowCount, 1)
  return table;
}

const removeColumn = (columnCount, table) => {
  table.forEach((row) => {
    row.splice(columnCount, 1)
  })
  
  return table
}

const getValue = (row, column, table) => {
  return table[row][column]
}

const swapColumns = (column1, column2, table) => {
  table.forEach((r, rowIndex) => {
    const temp = table[rowIndex][column1]
    table[rowIndex][column1] = table[rowIndex][column2];
    table[rowIndex][column2] = temp;
  })
  
  return table;
}

const swapRows = (row1, row2, table) => {
  const temp = table[row1];
  table[row1] = table[row2];
  table[row2] = temp;
  
  return table
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
  swapRows
}