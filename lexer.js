function StateMachine(name, rules) {
    this.prevState = {name: 'begin'}
    this.state = {name: 'begin'}
    this.rules = rules
    this.name = name
}

StateMachine.prototype.inputChar = function(char) {
    this.prevState = this.state
    if (this.state) {
        this.state = this.rules[this.state.name](char)
    }
}

StateMachine.prototype.resetState = function() {
    this.prevState = {name: 'begin'}
    this.state = {name: 'begin'}
}

const wordMachine = new StateMachine('word', {
    begin: char => {
        if (/[a-z]/i.test(char)) {
            return {name: 'begin'}
        }
    }
})

const spaceMachine = new StateMachine('spaces', {
    begin: char => {
        if (char === ' ') {
            return {name: 'begin'}
        }
    }
})

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
})

const appropriationMachine = new StateMachine('appropriation', {
    begin: char => {
        if (char === '=') {
            return {name: 'end'}
        }
    },
    end: () => undefined
})

function getActiveName(machinesList) {
    for (let i = 0; i < machinesList.length; i++) {
        if (machinesList[i].prevState && !machinesList[i].prevState.notEnd) {
            return machinesList[i].name
        }
    }
}

function resetAllRules(machinesList) {
    machinesList.forEach(item => {
        item.resetState()
    })
}

const allRules = [wordMachine, spaceMachine, appropriationMachine, numberMachine]

const string = `
main = function():
    table = readFile('kek').
    end.
`;
const tokens = [] // Результирующий список токенов
let charsCounter = 0 // счётчик символов в пределах одного токена

for (let i = 0; i <= string.length; i++) {
    charsCounter++
    let hasActiveMachine = false
    allRules.forEach(machine => {
        machine.inputChar(string[i])
        if (machine.state) {
            hasActiveMachine = true
        }
    })

    if (!hasActiveMachine) {
        if (charsCounter > 1) {
            tokens.push({
                token: getActiveName(allRules),
                lexeme: string.substring(i - charsCounter + 1, i)
            })
            i--
        } else {
            tokens.push({
                token: undefined,
                lexeme: string.substring(i, i + 1)
            })
        }
        charsCounter = 0
        resetAllRules(allRules)
    }
}

console.log(tokens)