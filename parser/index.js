let pos = 0, line = 1, col = 0, program = [];
class Parser {
	constructor(input) {
		this.input = input;
		this.PRECEDENCE = {
			"=": 1,
			"|": 2,
			".": 3
		};
		return this.parse_toplevel(input);
	};
	next = () => {
		return this.input.shift();
	};
	peek = () => {
		return this.input[pos];
	};
	eof = () => {
		return !(this.peek(this.input));
	};
	croak = (msg) => {
		throw new Error(msg + " (line: " + line + ")");
	};
	
	is_pipe = (ch) => {
		let tok = this.peek(this.input);
		return tok && tok.token === "pipe" && (tok.lexeme === ch);
	};
	is_punc = (ch) => {
		let tok = this.peek(this.input);
		return tok && tok.token === "punc" && (tok.lexeme === ch);
	};
	is_kw = (kw) => {
		let tok = this.peek(this.input);
		return tok && tok.token === "word" && (!kw || tok.lexeme === kw) && tok;
	};
	is_appropr = (appr) => {
		let tok = this.peek(this.input);
		return tok && tok.token === "appropriation" && (!appr || tok.lexeme === appr) && tok;
	};
	is_start = (start) => {
		let tok = this.peek();
		return (tok && tok.token === "functionBodyStart" && tok.lexeme === start) || (tok && tok.token === "punc" && tok.lexeme === start);
	};
	is_stop = (stop) => {
		let tok = this.peek();
		return (tok && tok.token === "word" && tok.lexeme === stop) || (tok && tok.token === "punc" && tok.lexeme === stop);
	};
	is_separator = (separator) => {
		let tok = this.peek();
		return ((tok && tok.token === "punc" && tok.lexeme === separator) || (tok && tok.token === "newLine" && tok.lexeme === separator));
	};
	is_empty_params = () => {
		let tok = this.peek();
		return (tok && tok.token === "punc" && tok.lexeme === '()');
	};
	is_newLine = () => {
		let tok = this.peek();
		return (tok && tok.token === "newLine");
	};
	
	
	skip_start = (start) => {
		if (this.is_start(start)) this.next(this.input);
		
		else this.croak("Expecting punctuation: \"" + this.peek().lexeme + "\"");
	};
	skip_separator = (separator) => {
		if (this.is_separator(separator)) this.next(this.input);
		else this.croak("Expecting punctuation: \"" + this.peek().lexeme + "\"");
	};
	skip_stop = (stop) => {
		if (this.is_stop(stop)) this.next(this.input);
		else this.croak("Expecting punctuation: \"" + this.peek().lexeme + "\"");
	};
	skip_pipe = (ch) => {
		if (this.is_pipe(ch)) this.next();
		else this.croak("Expecting punctuation: \"" + ch + "\"");
	};
	unexpected = () => {
		this.croak("Unexpected token: " + JSON.stringify(this.peek(this.input)));
	};
	
	maybe_binary = (left, my_prec) => {
		let tok = this.is_appropr();
		if (tok) {
			let his_prec = this.PRECEDENCE[tok.lexeme];
			if (his_prec > my_prec) {
				this.next(this.input);
				return this.maybe_binary({
					type     : "assign",
					operator : tok.lexeme,
					left     : left,
					right    : this.maybe_binary(this.parse_atom(), his_prec)
				}, my_prec);
			}
		}
		return left;
	};
  delimited = (start, stop, separator, parser) => {
  	if(this.is_empty_params()) {
  		return this.next()
	  }
    let a = [], first = true;
    this.skip_start(start);
	  if(this.is_newLine()){
		  this.next();
		  line++;
	  }
    while (!this.eof()) {
		    if(this.is_newLine()){
			    this.next();
			    line++;
		    }
        if (this.is_stop(stop)) break;
        if(this.is_newLine()){
			    this.next();
			    line++;
		    }
        if (first) first = false; else if (separator !== '\n') {this.skip_separator(separator)};
		    if(this.is_newLine()){
			    this.next();
			    line++;
		    }
        if (this.is_stop(stop)) break;
		    if(this.is_newLine()){
			    this.next();
			    line++;
		    }
        a.push(parser());
    }
	  if(this.is_newLine()){
		  this.next();
		  line++;
	  }
    this.skip_stop(stop);
	  if(this.is_newLine()){
		  this.next();
		  line++;
	  }
    return a;
  };
	parse_call = (func) => {
		return {
			type: "call",
			func: func,
			args: this.delimited("(", ")", ",", this.parse_expression),
			next: this.is_pipe('|') ? (() => {this.skip_pipe('|'); return this.parse_expression()})() : ''
		};
	};
  parse_lambda = () => {
      return {
          type: "function",
          lets: this.delimited("(", ")", ",", this.parse_letname),
          body: this.parse_prog()
      };
  };
	parse_letname = () => {
		let name = this.next(this.input);
		if (name.token !== "word") this.croak("Expecting letiable name");
		return name.lexeme;
	};
	maybe_call = (expr) => {
		expr = expr();
		return this.is_punc("(") ? this.parse_call(expr) : expr;
	};
	parse_atom = () => {
		return this.maybe_call(() => {
			if(this.is_separator(';')){
				this.next();
			}
			if(this.is_newLine()){
				this.next();
				line++;
			}
			if (this.is_punc(":")) return this.parse_prog();
			if (this.is_kw("function")) {
				this.next(this.input);
				return this.parse_lambda();
			}
			let tok = this.next();
			if (tok.token === "number" || tok.token === "string" || tok.token === "word" || (tok.token === "punc" && tok.lexeme === '_'))
				return tok;
			this.unexpected();
		});
	};
	parse_toplevel = (input) => {
		while (!this.eof(input)) {
			program.push(this.parse_expression());
		}
		return { type: "prog", prog: program };
	};
  parse_prog = () => {
      let prog = this.delimited(":", "end", "\n", this.parse_expression);
      if (prog.length === 0) return 1;
      if (prog.length === 1) return prog[0];
      return { type: "prog", prog: prog };
  }
	parse_expression = () => {
		if(this.is_newLine()){
			this.next();
			line++;
		}
		return this.maybe_call(() => this.maybe_binary(this.parse_atom(this.input), 0));
	}
}

module.exports = Parser;