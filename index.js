const Lexer = require('./lexer');
const Parser = require('./parser');
const fs = require('fs');
const code = fs.readFileSync('./program.tbs', 'utf-8');

const lexemes = new Lexer(code);
fs.writeFileSync('./example.json', JSON.stringify(lexemes, null, 2));
const ast = new Parser(lexemes);
console.log(ast);