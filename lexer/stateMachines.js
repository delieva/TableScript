const { StateMachine, defaultState } = require('./StateMachine');

const wordMachine = new StateMachine('word', {
  begin: char => {
    if (/[a-z]/i.test(char)) {
      return defaultState
    }
  }
})

const spaceMachine = new StateMachine('spaces', {
  begin: char => {
    if (char === ' ') {
      return defaultState
    }
  }
});

const newLineMachine = new StateMachine('newLine', {
  begin: char => {
    if (char === '\n') {
      return defaultState
    }
  }
});

const pipeMachine = new StateMachine('pipe', {
  begin: char => {
    if (char === '|') {
      return defaultState
    }
  }
});

const commentMachine = new StateMachine('comment', {
  begin: char => {
    if (char === '#') {
      return {name: 'comment'}
    }
  },
  comment: char => {
    if (char !== '\n') {
      return {name: 'comment'}
    }
  }
})

const dotMachine = new StateMachine('dot', {
  begin: char => {
    if (char === '.') {
      return defaultState
    }
  }
});

const puncMachine = new StateMachine('punc', {
  begin: char => {
    if (/[(,),_]/.test(char)) {
      return {name: 'end'};
    }
  },
  end: () => undefined
});

const stringMachine = new StateMachine('string', {
  begin: char => {
    if (char === '\'') {
      return {name: 'string'};
    }
  },
  string: char => {
    if (char !== '\'') {
      return {name: 'string'}
    }
    return {name: 'stringEnd'}
  },
  stringEnd: char => {
    if (char === '\'') {
      return {name: 'stringEnd'}
    }
  }
});

const functionBodyStartMachine = new StateMachine('functionBodyStart', {
  begin: char => {
    if (char === ':') {
      return defaultState;
    }
  }
});

const numberMachine = new StateMachine('number', {
  begin: char => {
    if (/[0-9]/.test(char)) {
      return {name: 'num'}
    }
  },
  num: char => {
    if (/[0-9]/.test(char)) {
      return {name: 'num'}
    } else if (char === '.') {
      return {name: 'dot', notEnd: true}
    }
  },
  dot: char => {
    if (/[0-9]/.test(char)) {
      return {name: 'dot'}
    }
  },
});

const appropriationMachine = new StateMachine('appropriation', {
  begin: char => {
    if (char === '=') {
      return {name: 'end'}
    }
  },
  end: () => undefined
});

const allMachines = [
  wordMachine,
  spaceMachine,
  pipeMachine,
  puncMachine,
  stringMachine,
  functionBodyStartMachine,
  dotMachine,
  appropriationMachine,
  numberMachine,
  newLineMachine,
  commentMachine
];

module.exports = allMachines;
