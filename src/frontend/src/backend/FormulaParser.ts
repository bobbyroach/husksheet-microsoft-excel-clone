import Spreadsheet from "./Spreadsheet";
import FormulaCell from "./FormulaCell";
import { ICell } from "./ICell";
 
// Class to represent a formula parser
// Ownership: Aneesh Ponduru
class FormulaParser {
    private spreadsheet: Spreadsheet;
    private cell: ICell | null;

    constructor(spreadsheet: Spreadsheet) {
        this.spreadsheet = spreadsheet; // Reference to the spreadsheet
        this.cell = null
    }
 
    /**
     * Parses and evaluates a formula
     * @param formula - The formula to parse
     * @returns The result of the formula evaluation
     */
    parseFormula(cell: ICell, formula: string): any {
        // Current cell
        this.cell = cell
        // Tokenize the formula
        const tokens = this.tokenize(formula);
        // Parse the tokens into an abstract syntax tree (AST)
        const ast = this.parseTokens(tokens);
        // Evaluate the AST to get the result
        return this.evaluateAst(ast);
    }    
 
    /**
     * Tokenizes a formula into individual tokens
     * @param formula - The formula to tokenize
     * @private
     * @returns The tokens in the formula
     */
    private tokenize(formula: string) {
        const tokens = [];      // Array to store the tokens
        let buffer = '';        // Buffer to store the current token
        let inString = false;   // Track whether we are within a string literal
    
        for (let i = 0; i < formula.length; i++) {
            const char = formula[i];
    
            if (char === '"' && (i === 0 || formula[i - 1] !== '\\')) {  // Check for quote not escaped
                if (!inString) {
                    // Starting a new string literal
                    inString = true;
                    buffer += char;  // Include the opening quote in the buffer for now
                } else {
                    // Closing a string literal
                    buffer += char;         // Include the closing quote in the buffer for now
                    tokens.push(buffer);    // Add the string literal to tokens
                    buffer = '';            // Reset the buffer
                    inString = false;       // Reset the inString flag
                }
            } else if (inString) {
                buffer += char;     // Include all characters within a string literal
            } else {
                // Handle tokens as before when not in a string
                if (char.match(/[A-Za-z0-9$.]/)) {
                    buffer += char;     // Add the character to the buffer
                } else if (char === '<' && formula[i + 1] === '>') {
                    // Handle '<>' as a single operator
                    if (buffer.length > 0) {
                        tokens.push(buffer);
                        buffer = '';
                    }
                    tokens.push('<>');
                    i++; // Skip the next '>' since it's part of the operator
                } else if (char === ':' || char === ',' || char === '&' || char === '|') {
                    // Handle ':', ',', '&' and '|' as individual tokens
                    if (buffer.length > 0) {
                        tokens.push(buffer);
                        buffer = '';
                    }
                    tokens.push(char);
                } else if (char.match(/[\s+()\-*/]/)) {
                    // Handle whitespace, parentheses, and basic operators as individual tokens
                    if (buffer.length > 0) {
                        tokens.push(buffer);
                        buffer = '';
                    }
                    // Skip whitespace characters
                    if (char.trim().length > 0) {
                        tokens.push(char);
                    }
                } else if (char === '<' || char === '>') {
                    // Handle '<' and '>' as individual tokens
                    if (buffer.length > 0) {
                        tokens.push(buffer);
                        buffer = '';
                    }
                    // Check if next character forms a two-character operator
                    if (i + 1 < formula.length && (formula[i + 1] === '=' || (char === '<' && formula[i + 1] === '>'))) {
                        tokens.push(char + formula[i + 1]);     // Add combined operator to tokens
                        i++;                                    // Skip the next character as it is already processed
                    } else {
                        tokens.push(char);  // Add the single character operator to tokens
                    }
                } else if (char === '=') {
                    // Handle '=' as an individual token
                    if (buffer.length > 0) {
                        tokens.push(buffer);
                        buffer = '';
                    }
                    tokens.push(char);
                }
            }
        }
        // Add the last token to the tokens array
        if (buffer.length > 0) {
            tokens.push(buffer);
        }
 
        // Check parentheses balance
        const openParenCount = tokens.filter(token => token === '(').length;
        const closeParenCount = tokens.filter(token => token === ')').length;
        if (openParenCount !== closeParenCount) {
            console.error('Unbalanced parentheses in formula:', formula);
            throw new Error('Unbalanced parentheses in formula');
        }
 
        return tokens;
    }
 
    /**
     * Parses tokens into an abstract syntax tree (AST)
     * @param tokens - The tokens to parse
     * @private
     * @returns The abstract syntax tree (AST)
     */
    
    private parseTokens(tokens: string[]): any {
        const stack: any[] = [];        // Stack to store the parsed tokens
        let currentFunction = null;     // Track the current function context
        let subexpression = [];
        let insubexpression = false;
 
        if (this.containsOnlyNumbersAndCells(tokens)) {
            let simplifiedTokens = this.simplifyFormula(tokens)
            return [simplifiedTokens.join('')];
        }
 
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];    // Get the current token
            
            if (token[0] === '"' && token[token.length - 1] === '"') {
                // Directly push string literals as Literal type and remove the surrounding quotes
                stack.push({ type: 'Literal', value: token.slice(1, -1) });
 
            } else if (token === '(') {
                // Set the current function context when entering a function or subexpression
                if (stack.length > 0 && stack[stack.length - 1].type === 'Function') {
                    currentFunction = stack[stack.length - 1];
                } else {
                    subexpression.push([]);
                    insubexpression = true;
                }
                stack.push(token);
            } else if (token.match(/^\$[A-Z]+\d+$/i)) {
                // Handle cell references or ranges
                if (tokens[i + 1] === ':') {
                    // Check for range
                    if (i + 2 < tokens.length && tokens[i + 2].match(/^\$[A-Z]+\d+$/i)) {
                        let operation = 'SUM'; // Default operation
                        if (currentFunction && currentFunction.name) {
                            // Use the function name as the operation for the range
                            operation = currentFunction.name.toUpperCase();
                        }
                        // Create a range node and push it to the stack
                        let rangeNode = {
                            type: 'Range',
                            value: `${token}:${tokens[i + 2]}`,
                            operation: operation
                        };
                        stack.push(rangeNode);
                        i += 2; // Skip ':' and the second cell reference
                    }
                } else {
                    // Push the cell reference as an object
                    stack.push({ type: 'CellReference', value: token });
                }
            } else if (token === ',') {
                continue; // Skip commas, they are handled as argument separators
            } else if (token === ')') {
                // Close current function or subexpression
                const args = [];
                while (stack.length && stack[stack.length - 1] !== '(') {
                    // Pop arguments until the opening parenthesis
                    args.unshift(stack.pop());
                }
                stack.pop(); // Remove '('
                if (stack.length > 0 && typeof stack[stack.length - 1] === 'object' && stack[stack.length - 1].type === 'Function') {
                    // If the top of the stack is a function, update its arguments
                    const func = stack.pop();
                    func.arguments = args;
                    stack.push(func);
                } else {
                    stack.push(args.length > 1 ? args : args[0]);   // Push the arguments to the stack
                }
                currentFunction = null;     // Reset current function context after closing a function
            } else if (['>', '<', '>=', '<=', '=', '!=', '<>', '&', '|'].includes(token)) {
                // Handle comparison operators
                if (stack.length === 0) {
                    throw new Error("Syntax error: No operand before operator " + token);
                }
                let left = stack.pop(); // Pop the left operand from the stack
            
                // Ensure left is not an operator which would indicate a missing operand
                if (i + 1 >= tokens.length) {
                    throw new Error("Syntax error: No operand after operator " + token);
                }
 
                // Get the right operand
                let right = tokens[++i]; // Move to the next token for the right operand
                let finalRight : any;
                
                // Check if the right operand needs to be parsed as a CellReference
                if (right.match(/^\$[A-Z]+\d+$/i)) {
                    finalRight = { type: 'CellReference', value: right }; // Convert to CellReference object
                } else {
                    finalRight = right ; // Otherwise, keep the right operand as-is
                }
 
                // Ensure right is not an operator which would indicate a missing operand
                if (['>', '<', '>=', '<=', '=', '!=', '&','<>', '|', '+', '-', '*', '/'].includes(right)) {
                    throw new Error("Syntax error: Operator " + token + " cannot be followed by another operator " + right);
                }
 
                let updatedToken : string;
                // Translate the operator to TypeScript equivalent
                if (token === '<>') {
                    updatedToken = '!==';
                } else if (token === '=') {
                    updatedToken = '===';
                } else if (token === '&') {
                    updatedToken = '&&';
                } else if (token === '|') {
                    updatedToken = '||';
                } else {
                    updatedToken = token;
                }
 
                // Push the condition object onto the stack
                stack.push({ type: 'Condition', operator: updatedToken, operands: [left, finalRight] });
            } else if (token.match(/^[A-Za-z]+$/)) {
                // Start a new function
                let functionNode = { type: 'Function', name: token, arguments: [] };
                stack.push(functionNode);
            } else {
                stack.push(token);
            }
        }
        return stack;
    }    
    
    /**
     * Evaluates an abstract syntax tree (AST) to get the result
     * @param ast The abstract syntax tree to evaluate
     * @returns The result of the evaluation
     */
    evaluateAst(ast: any): any {
        // If the AST is an array, it represents an expression, so we evaluate it
        if (Array.isArray(ast)) {
            let expression = ast.map(part => {
                let evaluated = this.evaluateAst(part)
                // Needs to return 0 if empty string in case of condition statements (+, -, ...)
                return evaluated === '' ? 0 : evaluated
            }).join(''); // Evaluate each part of the expression and join them

            try {
                // Evaluate the expression using a function
                return new Function(`return ${expression}`)();
            } catch (error) {
                // Handle any errors that occur during evaluation
                // console.error("Error evaluating expression:", expression, error);
                throw new Error("Error evaluating expression");
            }
        } else if (typeof ast === 'object') { // If the AST is an object, determine its type and evaluate it accordingly
            switch (ast.type) {
                case 'Function':
                    try {
                        // Pass the function name and arguments to the applyFunction method
                        return this.applyFunction(ast.name, ast.arguments);
                    } catch (error) {
                        // Handle any errors that occur during function application
                        // console.error("Error applying function:", ast.name, ast.arguments, error);
                        if (error instanceof Error) {
                            throw new Error(error.message)
                        } else {
                            throw new Error("Error applying function: Incompatible arguments");
                        }
                    }
                case 'CellReference':
                    // Get the row and column of the cell and return its value as a number or string
                    const [row, col] = this.getCellRowCol(ast.value);
                    const cell = this.spreadsheet.getCell(row, col);
                    let value : number | string;

                    // Check if the cell is a formula cell and get the value accordingly
                    if (cell instanceof FormulaCell) {
                        value = cell.setFormula(cell.getFormula()).getValue();
                    } else {
                        value = cell.getValue();
                    }
                    return value
 
                case 'Range':
                    // Evaluate the range and return the result
                    return this.evaluateRange(ast.value, ast.operation);
                case 'Literal':
                    //  Return the literal value as a string or number
                    return typeof ast.value === 'string' ? `"${ast.value}"` : ast.value;
                case 'Condition':
                    // Evaluate the condition and return the result
                    return `(${this.evaluateAst(ast.operands[0])} ${ast.operator} ${this.evaluateAst(ast.operands[1])})`;
                default:
                    // Handle any other types of AST nodes
                    // console.error('Unhandled part type:', ast);
                    throw new Error('Unhandled part type');
            }
        } else {
            // Return primitives directly, ensure proper formatting for strings only when needed
            return ast;
        }
    }

    /**
     * Applies a function to the arguments
     * @param name - The name of the function
     * @param args - The arguments to the function
     * @private
     */
    private applyFunction(name: string, args: any[]): any {
        // Handle function calculations based on the function name
        switch (name.toUpperCase()) {
            case 'SUM':
            case 'MIN':
            case 'AVG':
            case 'MAX':
                // For these functions, evaluate the arguments and pass them to handleAggregateFunctions
                const evaluatedArgs = args.map(arg => Number(this.evaluateAst(arg)));
                return this.handleAggregateFunctions(name, evaluatedArgs);
            case 'CONCAT':
                // Concatenate the arguments and return the result as a string
                const concatArgs = args.map(arg => this.evaluateAst(arg).toString());   
                // Check if the argument is a string that needs to be quoted
                const result = concatArgs.map(arg =>
                    typeof arg === 'string' && arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg
                ).join('');
                return `"${result}"`; // Return the concatenated string as a quoted string
            case 'IF':
                if (args.length !== 3) {
                    throw new Error('Invalid arguments count in IF function. Expected 3 arguments.');
                }
 
                // Check if the first argument is a condition object and evaluate it
                if (typeof args[0] === 'object') {
                    const condition = this.evaluateCondition(args[0]);
                    if (typeof(condition) != 'boolean') {
                        throw new Error('Invalid condition in IF function.');
                    }
                    return condition ? this.evaluateAst(args[1]) : this.evaluateAst(args[2]);
                } else if (!isNaN(parseFloat(args[0]))) {
                    // Check if the first argument is a number and evaluate it based whether it is 0 or not
                    if (parseFloat(args[0]) == 0) {
                        return this.evaluateAst(args[2]);
                    } else if (parseFloat(args[0]) != 0) {
                        return this.evaluateAst(args[1]);
                    }
                }
                break;
            case 'DEBUG':
                const evaluatedResult = this.evaluateAst(args); // Evaluate the full expression
                // Check if the result is a string that needs to be quoted
                if (typeof evaluatedResult === 'string') {
                    return `"${evaluatedResult}"`;
                } else {
                    return evaluatedResult;
                }
            case 'COPY':
                if (args.length != 2) {
                    throw new Error('COPY function requires exactly two arguments.');
                }
                
                // Extract the source and target cell references
                let [sourceCell, targetCell] = [args[0].value, args[1].value];
                targetCell = targetCell.trim().slice(1, -1);
 
                // Get the row and column of the source and target cells
                const [sourceRow, sourceCol] = this.getCellRowCol(sourceCell);
                const [targetRow, targetCol] = this.getCellRowCol(targetCell);
 
                // Get the value of the source cell and set it to the target cell
                let sourceValue = this.spreadsheet.getCell(sourceRow, sourceCol).getValue();
                sourceValue = this.evaluateAst(sourceValue);
                this.spreadsheet.getCell(targetRow, targetCol).setFormula(String(sourceValue));
                return `'${sourceValue}'`;
 
            default:
                // Handle any other functions that are not recognized by throwing an error
                // console.error('Function not recognized:', name);
                throw new Error('Function not recognized');
        }
    }
 
    /**
     * Handles aggregate functions like SUM, MIN, AVG, MAX
     * @param name - The name of the function
     * @param args - The arguments to the function
     * @private
     */
    private handleAggregateFunctions(name: string, args: number[]) {
        // Handle aggregate functions based on the function name
        switch (name) {
            case 'SUM':
                return args.reduce((a, b) => a + b, 0);
            case 'MIN':
                return Math.min(...args);
            case 'AVG':
                return args.reduce((a, b) => a + b, 0) / args.length;
            case 'MAX':
                return Math.max(...args);
            default:
                throw new Error('Invalid aggregate function');
        }
    }
    
    /**
     * Extracts the row and column from a cell reference
     * @param cell - The cell reference
     * @private
     */
    getCellRowCol(cell: string): [number, number] {
        // Extract the row and column from the cell reference
        const columnMatch = cell.match(/[A-Z]+/);
        const rowMatch = cell.match(/\d+/);
 
        // Convert the row and column to numbers
        const column = columnMatch ? columnMatch[0].charCodeAt(0) - 'A'.charCodeAt(0) : 0;
        
        // parseInt is used to convert the row number to a number
        const row = rowMatch ? parseInt(rowMatch[0], 10) - 1 : 0;
        return [row, column];
    }
 
    /**
     * Evaluates a range of cells
     * @param range - The range to evaluate
     * @param func - The function to apply to the range
     * @private
     */
    evaluateRange(range: string, func: string): any {
        // Extract the start and end cell references from the range
        const [start, end] = range.split(':');
        const [startRow, startCol] = this.getCellRowCol(start);
        const [endRow, endCol] = this.getCellRowCol(end);
 
        // Get the values of the cells in the range
        const values = [];
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                values.push(this.spreadsheet.getCell(row, col).getValue());
            }
        }
        // Apply the function to the values in the range
        return this.applyFunction(func, values);
    }
 
    /**
     * Evaluates the condition in an IF function
     * @param condition - The condition to evaluate
     * @private
     */
    private evaluateCondition(condition: any): boolean {
        // Extract the left and right operands and the operator from the condition
        const left = condition.operands[0];
        const right = condition.operands[1];
        const operator = condition.operator;
    
        // Evaluate the left and right operands
        const leftEval = this.evaluateAst(left);
        const rightEval = this.evaluateAst(right);
    
        // Helper function to determine if a value can be converted to a number
        const isNumeric = (value: any) => !isNaN(parseFloat(value)) && isFinite(value);
    
        // Helper function to convert boolean values to numbers
        const toNumericIfBoolean = (value: any) => {
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'true') return 1;
                if (value.toLowerCase() === 'false') return 0;
            }
            else {
                if (value === true) return 1;
                if (value === false) return 0;
            }
            return value;
        };
    
        // Determine if the left and right values are numeric or boolean
        const leftValue = isNumeric(toNumericIfBoolean(leftEval)) ? toNumericIfBoolean(leftEval) : `'${leftEval}'`;
        const rightValue = isNumeric(toNumericIfBoolean(rightEval)) ? toNumericIfBoolean(rightEval) : `'${rightEval}'`;
    
        // Construct the conditional expression
        const conditional = `${leftValue} ${operator} ${rightValue}`;

        console.log(conditional)

        return new Function(`return ${conditional};`)();
    }
 
    /**
     * Checks if the input contains only numbers and cell references.
     * @param input A string or array of string tokens.
     * @returns true if only numbers and cell references are present, false otherwise.
     */
    public containsOnlyNumbersAndCells(input: string[]): boolean {
        // Regular expression to match numbers (integers or decimals)
        const numberRegex = /^-?\d+(\.\d+)?$/;
        // Regular expression to match cell references like A1, B2, C10, etc.
        const cellReferenceRegex = /^\$[A-Za-z]+\d+$/;
        // Regular expression for allowed operators and parentheses
        const operatorsAndParenthesesRegex = /^[()&|<>]+$/;
 
        for (const token of input) {
            // Check each token if it matches number or cell reference
            if (!numberRegex.test(token) && !cellReferenceRegex.test(token) && !operatorsAndParenthesesRegex.test(token)) {
                return false; // Found a token that is neither a number nor a cell reference nor an operator
            }
        }
 
        return true; // All tokens are valid numbers or cell references
    }
 
    private simplifyFormula(tokens: string[]): string[] {;
        let values : string[] = [];
        for (const token of tokens) {
            if (token.match(/^\$[A-Za-z]+\d+$/)) {
                let [row, col] = this.getCellRowCol(token);
                let cell = this.spreadsheet.getCell(row, col);
                let value : number | string;
                if (cell instanceof FormulaCell) {
                    value = cell.setFormula(cell.getFormula()).getValue().toString();
                } else {
                    value = cell.getValue().toString();
                }
                values.push(value);
            } else if (['=', '!=', '&','<>', '|'].includes(token)) {
                if (token === '<>' || token === '!=') {
                    values.push('!==');
                } else if (token === '=') {
                    values.push('===');
                } else if (token === '&') {
                    values.push('&&');
                } else if (token === '|') {
                    values.push('||');
                } else {
                    values.push(token);
                }
            } else {
                values.push(token);
            }
        }
        return values;
    }
 
} export default FormulaParser;