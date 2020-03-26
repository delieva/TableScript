const Lexer = require('./lexer');
const fs = require('fs');
const code = fs.readFileSync('./program.tbs', 'utf-8');

fs.writeFileSync('./example.json', JSON.stringify(new Lexer(code), null, 2));
