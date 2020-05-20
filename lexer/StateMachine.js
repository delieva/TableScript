const defaultState = {name: 'begin'};

class StateMachine {
  prevState = defaultState;
  state = defaultState;
  rules = [];
  name = '';

  constructor(name, rules) {
    this.rules = rules;
    this.name = name;
  }

  inputChar = (char) => {
    this.prevState = this.state;
    if (this.state) {
      this.state = this.rules[this.state.name](char);
    }
  };

  resetState = () => {
    this.prevState = defaultState;
    this.state = defaultState;
  }
}

module.exports = {StateMachine, defaultState};
