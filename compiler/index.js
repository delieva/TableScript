const cloneDeep = require('../utils/deepClone');

const coreFunctions = [
  'readFile',
  'writeFile',
  'log',
  'showTable',
  'setValue',
  'removeColumn',
  'removeRow',
  'getValue',
  'swapColumns',
  'swapRows'
]

const declaredFunctions = new Map();
coreFunctions.forEach((name) => {
  declaredFunctions.set(name, true)
})

let currentFunction = 'global';
const contexts = {
  global: {
    lets: [],
    variables: new Map()
  }
};

let prevType = '';
let currentNodeType = '';
let closeCount = 1;
let inDeep = 0;
let prevNode = {}

class Compiler {
  constructor(astTree) {
    this.resultJsCode = ''
    
    this.move(astTree);
    console.log(contexts);
    console.log(this.resultJsCode);
    
    return this.resultJsCode
  }
  
  typeHandlers = {
    assign: (currentNode) => {
      this.move(currentNode.left)
      this.move(currentNode.right)
    },
    function: (currentNode) => {
      currentFunction = prevNode.lexeme;
      if (declaredFunctions.get(currentFunction)) {
        throw new Error(`Function ${currentFunction} is already declared`)
      };
      
      declaredFunctions.set(currentFunction, true);
      
      contexts[currentFunction] = {
        lets: currentNode.lets,
        variables: new Map(),
        body: currentNode.body
      }
      
      this.resultJsCode += `(${currentNode.lets.join(', ')}) => {`
      this.move(currentNode.body)
      this.resultJsCode += '}'
      
      currentFunction = 'global'
    },
    call: (currentNode) => {
      if (currentNode.next) {
        closeCount++;
        inDeep++;
        this.move(currentNode.next)
      }
      
      const callFunctionName = currentNode.func.lexeme;

      currentNodeType = 'call';
      this.move(currentNode.func)
      
      this.move({
        type: 'args',
        args: currentNode.args
      });
      
      if (inDeep <= 0) {
        this.resultJsCode += ')'.repeat(closeCount)
        closeCount = 1;
        inDeep = 1;
      }
      
      inDeep--;
    },
    args: (currentNode) => {
      currentNode.args.map((item, i) => {
        this.move(item)
        if (i !== currentNode.args.length - 1) {
          this.resultJsCode += ', '
        } else if (inDeep > 0) {
          this.resultJsCode += ', '
        }
      })
    },
    prog: (currentNode) => {
      currentNode.prog.forEach((prog) => {
        this.move(prog)
        this.resultJsCode += ';\n'
      })
    }
  };
  
  tokenHandlers = {
    string: (currentNode) => {
      this.resultJsCode += currentNode.lexeme;
    },
    number: (currentNode) => {
      this.resultJsCode += currentNode.lexeme;
    },
    word: (currentNode) => {
      console.log(currentFunction)
      if (prevType === 'call') {
        if (!declaredFunctions.get(currentNode.lexeme)) {
          throw new Error(`Calling function ${currentNode.lexeme} before initialization`)
        }
        this.resultJsCode += `${currentNode.lexeme}(`
      } else if (prevType === 'assign') {
        if (currentNode.lexeme === 'return') {
          this.resultJsCode += 'return '
        } else {
          this.checkIfInCurrentContext(currentNode.lexeme);
          contexts[currentFunction].variables.set(currentNode.lexeme, true)
          this.resultJsCode += `const ${currentNode.lexeme} = `
        }
      } else {
        this.checkIfInContext(currentNode.lexeme)
        this.resultJsCode += currentNode.lexeme
      }
    }
  }
  
  
  move(obj) {
    const currentNode = obj;
    
    prevType = currentNodeType;
    currentNodeType = currentNode.type;
    const currentNodeToken = currentNode.token;
    
    if (this.typeHandlers[currentNodeType]) {
      this.typeHandlers[currentNodeType](currentNode);
    } else if (this.tokenHandlers[currentNodeToken]) {
      this.tokenHandlers[currentNodeToken](currentNode)
    }
    
    prevNode = currentNode;
  }
  
  checkIfInCurrentContext(word) {
    const functionContext = cloneDeep(contexts[currentFunction]);
    if (functionContext.variables.get(word) || functionContext.lets.includes(word)) {
      throw new Error(`Variable ${word} is already declared in current scope`)
    }
  }
  
  checkIfInContext(word) {
    const globalContext = cloneDeep(contexts.global);
    const functionContext = cloneDeep(contexts[currentFunction]);
    
    if (currentFunction !== 'global') {
      functionContext.lets = [...functionContext.lets, ...globalContext.lets]
      functionContext.variables = new Map([...functionContext.variables, ...globalContext.variables]);
    }
    
    if (!functionContext.variables.get(word) && !functionContext.lets.includes(word)) {
      throw new Error(`Accesing variable ${word} before initialization`)
    }
  }
}

module.exports = Compiler;