const stateMachines = require('./stateMachines');

class Lexer {
  constructor(code) {
    this.stateMachines = stateMachines;
    this.tokens = [];
    this.charsCounter = 0;

    return this.parse(code);
  };

  getActiveName = () => {
    return (this.stateMachines.find((machine) => {
      return machine.prevState && !machine.prevState.notEnd
    }) || {}).name
  };

  resetAllRules = () => {
    this.stateMachines.forEach(item => {
      item.resetState()
    })
  };

  parse = (code) => {
    const { tokens, stateMachines, resetAllRules, getActiveName } = this;
    for (let i = 0; i <= code.length; i++) {
      this.charsCounter++;
      let hasActiveMachine = false;
      stateMachines.forEach(machine => {
        machine.inputChar(code[i]);
        if (machine.state) {
          hasActiveMachine = true
        }
      });

      if (!hasActiveMachine) {
        if (this.charsCounter > 1) {
          tokens.push({
            token: getActiveName(),
            lexeme: code.substring(i - this.charsCounter + 1, i)
          });
          i--
        } else {
          tokens.push({
            token: undefined,
            lexeme: code.substring(i, i + 1)
          })
        }
        this.charsCounter = 0;
        resetAllRules(stateMachines);
      }
    }
    return tokens.filter((item) => {
      return item.token !== 'spaces' && item.token !== 'newLine' && item.token !== 'comment';
    })
  }
}

module.exports = Lexer;
