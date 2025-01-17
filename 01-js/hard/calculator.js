/*
  Implement a class `Calculator` having below methods
    - initialise a result variable in the constructor and keep updating it after every arithmetic operation
    - add: takes a number and adds it to the result
    - subtract: takes a number and subtracts it from the result
    - multiply: takes a number and multiply it to the result
    - divide: takes a number and divide it to the result
    - clear: makes the `result` variable to 0
    - getResult: returns the value of `result` variable
    - calculate: takes a string expression which can take multi-arithmetic operations and give its result
      example input: `10 +   2 *    (   6 - (4 + 1) / 2) + 7`
      Points to Note: 
        1. the input can have multiple continuous spaces, you're supposed to avoid them and parse the expression correctly
        2. the input can have invalid non-numerical characters like `5 + abc`, you're supposed to throw error for such inputs

  Once you've implemented the logic, test your code by running
  - `npm run test-calculator`
*/
class Calculator {
  constructor() {
    this.result = 0;
  }

  add(num) {
    this.result += num;
  }

  subtract(num) {
    this.result -= num;
  }

  multiply(num) {
    this.result *= num;
  }

  divide(num) {
    if (num == 0) {
      throw new Error("Error");
    }
    this.result /= num;
  }

  clear() {
    this.result = 0;
  }

  getResult() {
    return this.result;
  }

  calculate(string) {
    // can be done using eval() function

    // check if it is invalid
    const regex = /[^0-9+\-*/().\s]/g;
    if (regex.test(string)) {
      // console.log("Expression contains invalid characters");
      throw new Error("Error");
    }
    // check for valid parantheses
    let stack = [];
    for (const c of string) {
      if(c != '(' && c != ')') continue;
      if (stack.length==0 && c===')') throw new Error("Error");
      else if(c === '(') stack.push(c);
      else if (stack.length>0 && stack[stack.length - 1]==='(' && c===')') stack.pop();
      else throw new Error("Error")
    }
    if (stack.length > 0) throw new Error("Error");

    // storing operand and operators separately then evaluating expression
    let expression = [];
    let tmp = "";
    let operators = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 3,
      "(": 0,
      ")": 0,
    };

    for (const i in string) {
      if (string[i] in operators) {
        if (tmp) expression.push(tmp);
        tmp = "";
        expression.push(`${string[i]}`);
      } else tmp += string[i];
    }
    if (tmp) expression.push(tmp);

    // removing spaces
    expression.forEach((val, index) => (expression[index] = val.trim()));
    expression.forEach((item, i) => { // maybe this is wrong cause it effect the indexes.
      if (!item) {
        expression.splice(i, 1);
      }
    });

    // evaluate
    const calc = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": function (a, b) {
        if(!a || !b || b==0) throw new Error("Error")
        return a / b;
      }
    };
    let valueStack = [];
    let opStack = [];

    expression.push(")");
    for (const item of expression) {
      if (item === ")") {
        let op = opStack.pop();

        while (op !== "(" && valueStack.length > 1) {
          const val1 = parseFloat(valueStack.pop());
          const val2 = parseFloat(valueStack.pop());
          let res = calc[op](val2, val1);

          valueStack.push(res);

          if (opStack) op = opStack.pop();
          else break;
        }
      } else if (item === "(") {
        opStack.push(item);
      } else if (
        item in operators &&
        opStack.length > 0 &&
        operators[opStack[opStack.length - 1]] > operators[item]
      ) {
        const val1 = valueStack.pop();
        const val2 = valueStack.pop();
        const res = calc[opStack.pop()](val2, val1);
        valueStack.push(res);
        opStack.push(item);
      } else if (item in operators) {
        opStack.push(item);
      } else {
        valueStack.push(item);
      }
    }

    this.result = valueStack[0];
  }
}


module.exports = Calculator;
