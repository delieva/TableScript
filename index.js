const Lexer = require('./lexer');
const Parser = require('./parser');
const Compiler = require('./compiler');
const LanguageCore = require('./languageCore');
const fs = require('fs');

try {
  const filePath = process.argv[2] || './programExample/program.tbs';
  const code = fs.readFileSync(filePath, 'utf-8');
  const lexemes = new Lexer(code);
  //fs.writeFileSync('./programExample/lexeme-example.json', JSON.stringify(lexemes, null, 2))
  const ast = new Parser(lexemes);
  const jsCode = (new Compiler(ast)).resultJsCode;

  new LanguageCore(jsCode, filePath);
} catch (e) {
  console.error(e.toString())
}

