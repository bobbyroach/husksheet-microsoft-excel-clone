import FormulaCell from './FormulaCell';
import Spreadsheet from './Spreadsheet';
import NumberCell from './NumberCell';
import TextCell from './TextCell';
import FormulaParser from './FormulaParser';

describe('FormulaCell', () => {
    let spreadsheet: Spreadsheet;

    beforeEach(() => {
        spreadsheet = new Spreadsheet("New spreadsheet", "dummy sheet", 10, 10);
    });

    // Tests for simple arithmetic operations
    
    test('evaluate simple addition with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=5 + 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test('evaluate simple subtraction with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=5 - 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(-5);
    });

    test('evaluate simple multiplication with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=5 * 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(50);
    });

    test('evaluate simple division with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=10 / 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(2);
    });

    test('evaluate simple exponentiation with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=2 ** 3', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(8);
    });

    test('test adding floting points numbers', () => {
        const formulaCell = new FormulaCell(0, 0, '=5.5 + 10.5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(16);
    });

    test('test subtracting floting points numbers', () => {
        const formulaCell = new FormulaCell(0, 0, '=5.5 - 10.5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(-5);
    });

    test('test multiplying floting points numbers', () => {
        const formulaCell = new FormulaCell(0, 0, '=10 * 0.5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(5);
    });

    test('test dividing floating points numbers', () => {
        const formulaCell = new FormulaCell(0, 0, '=10 / 0.5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(20);
    });

    test('test exponential floating points numbers', () => {
        const formulaCell = new FormulaCell(0, 0, '=9 ** 0.5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(3);
    });

    test('Test "<>" operator', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=IF(($B1 <> $C1), "True", "False")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe("True");
    });

    test('Test "<>" operator for true case', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 <> 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('Test "<>" operator for false case', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 <> 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('Test "=" operator with not equal numbers', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 = 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('Test "=" operator with equal numbers', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 = 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('Test "=" operator with equal strings', () => {
        const formulaCell = new FormulaCell(0, 0, '= "Hello" = "Hello"', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('test "=" with not equal strings', () => {
        const formulaCell = new FormulaCell(0, 0, '= "Hello" = "World"', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('test the = operator to return true', () => {
        const formulaCell = new FormulaCell(0, 0, '= (5 = 5)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('test the = operator to return false', () => {
        const formulaCell = new FormulaCell(0, 0, '= (5 = 10)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('test the "&" operator to concatenate strings', () => {
        const formulaCell = new FormulaCell(0, 0, '="Hello" & "World"', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('HelloWorld');
    });

    test('test the & operator to concatenate string and number', () => {
        const formulaCell = new FormulaCell(0, 0, '="Hello" & 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Hello5');
    });

    test('test "<" operator to return true', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 < 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('test "<" operator to return false', () => {
        const formulaCell = new FormulaCell(0, 0, '= 10 < 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('test ">" operator to return true', () => {
        const formulaCell = new FormulaCell(0, 0, '= 10 > 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('test ">" operator to return false', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 > 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('test "<=" operator to return true', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 <= 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('test "<=" operator to return false', () => {
        const formulaCell = new FormulaCell(0, 0, '= 10 <= 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('test ">=" operator to return true', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 >= 5', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('true');
    });

    test('test ">=" operator to return false', () => {
        const formulaCell = new FormulaCell(0, 0, '= 5 >= 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('false');
    });

    test('evaluate simple addition formula with cell references', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=$B1 + $C1', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test('evaluate simple formulas with multiple operations', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=$B1 + $C1 * 2', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(25);
    });

    test('evaluate simple formulas with multiple cell references', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 2, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        spreadsheet.setCell(numberCell3);
        const formulaCell = new FormulaCell(0, 0, '=$B1 + $C1 * $D1', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(25);
    });

    // Tests for Functions (SUM, AVG, MAX, MIN, CONCAT, IF, DEBUG, COPY)

    test("evaluate SUM formula with cell references", () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 2, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        spreadsheet.setCell(numberCell3);
        const formulaCell = new FormulaCell(0, 0, '=SUM($B1:$D1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(17);
    });

    test('sum function with a simple addition formula after', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1)
        spreadsheet.setCell(numberCell2)
        const formulaCell = new FormulaCell(1, 3, '=SUM($B1:$C1) + 5', spreadsheet);
        spreadsheet.setCell(formulaCell);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(20);
    });

    test('evalute AVG with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=AVG(5, 10, 15)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(10);
    });

    test("evaluate AVG formula with cell references", () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 15, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        spreadsheet.setCell(numberCell3);
        const formulaCell = new FormulaCell(0, 0, '=AVG($B1:$D1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(10);
    });

    test('evaluate MAX with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=MAX(5, 10, 15)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test("evaluate MAX formula with cell references", () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 15, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        spreadsheet.setCell(numberCell3);
        const formulaCell = new FormulaCell(0, 0, '=MAX($B1:$D1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test('evalute MIN with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=MIN(5, 10, 15)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(5);
    });

    test("evaluate MIN formula with cell references", () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 15, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        spreadsheet.setCell(numberCell3);
        const formulaCell = new FormulaCell(0, 0, '=MIN($B1:$D1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(5);
    });

    test('basic concat function with string values', () => {
        const formulaCell = new FormulaCell(0, 0, '=CONCAT("Hello", "World")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('HelloWorld');
    });

    test('evaluate CONCAT formula with 3 cell references', () => {
        const textCell1 = new TextCell(0, 1, 'Hello', spreadsheet);
        const textCell2 = new TextCell(0, 2, 'World', spreadsheet);
        const textCell3 = new TextCell(0, 3, '!', spreadsheet);
        spreadsheet.setCell(textCell1);
        spreadsheet.setCell(textCell2);
        spreadsheet.setCell(textCell3);
        const formulaCell = new FormulaCell(0, 0, '=CONCAT($B1, $C1, $D1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('HelloWorld!');
    });

    test('evaluate CONCAT formula with number values', () => {
        const formulaCell = new FormulaCell(0, 0, '=CONCAT(5, 10)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('510');
    });

    test("evaluate CONCAT formula with cell references", () => {
        const textCell1 = new TextCell(0, 1, 'Hello', spreadsheet);
        const textCell2 = new TextCell(0, 2, 'World', spreadsheet);
        spreadsheet.setCell(textCell1);
        spreadsheet.setCell(textCell2);
        const formulaCell = new FormulaCell(0, 0, '=CONCAT($B1:$C1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('HelloWorld');
    });

    test('evaluate IF formula with numerical conditonal values', () => {
        const formulaCell = new FormulaCell(0, 0, '=IF(5 > 10, "Greater", "Lesser")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Lesser');
    });

    test('evalute IF formula with cell references', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=IF($B1 > $C1, "Greater", "Lesser")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Lesser');
    });

    test('evaluate IF formula with cell references', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=IF(($B1 > $C1), "Greater", "Lesser")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Lesser');
    });

    test('evalute IF formula with string conditonal values', () => {
        const formulaCell = new FormulaCell(0, 0, '=IF("Hello" = "World", "Equal", "Not Equal")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Not Equal');
    });

    test("test the '|' operators in an IF function", () => {
        const formulaCell = new FormulaCell(0, 0, '=IF((5 > 10 | 10 > 5), "True", "False")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('True');
    });

    test('evalute IF formula with cell references', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=IF($B1 > $C1, "Greater", "Lesser")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Lesser');
    });

    test('evalute IF formula with conditional being 0', () => {
        const formulaCell = new FormulaCell(0, 0, '=IF(0, "Greater", "Lesser")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Lesser');
    });

    test('evalute IF formula with conditional being non-zero number', () => {
        const formulaCell = new FormulaCell(0, 0, '=IF(5, "Greater", "Lesser")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Greater');
    });

    test('evalute IF formula with conditional being string but not conditional', () => {
        const formulaCell = new FormulaCell(0, 0, '=IF("Hello", "Greater", "Lesser")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue())
            .toBe("Cannot read properties of undefined (reading '0')");
    });

    test('evalute IF formula with functional branches', () => {
        const formulaCell1 = new FormulaCell(0, 1, '=SUM(5, 10)', spreadsheet);
        const formulaCell2 = new FormulaCell(0, 2, '=SUM(2, 15)', spreadsheet);
        spreadsheet.setCell(formulaCell1);
        spreadsheet.setCell(formulaCell2);
        const formulaCell = new FormulaCell(0, 0, '=IF(5, $B1, $C1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test('evalute SUM with multiple comma separated values', () => {
        const formulaCell = new FormulaCell(0, 0, '=SUM(5, 10, 15)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(30);
    });

    test('evaluate SUM with comma separated cell references', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 15, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        spreadsheet.setCell(numberCell3);
        const formulaCell = new FormulaCell(0, 0, '=SUM($B1, $C1, $D1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(30);
    }); 

    test('Test "<>" operator', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=IF(($B1 <> $C1), "True", "False")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe("True");
    });

    test('evalute DEBUG formula with cell reference to number cell', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        spreadsheet.setCell(numberCell1);
        const formulaCell = new FormulaCell(0, 0, '=DEBUG($B1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(5);
    });

    test('evalute DEBUG formula with cell references and operation between cells', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=DEBUG($B1 + $C1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test('evalute DEBUG formula with cell reference to text cell', () => {
        const textCell = new FormulaCell(0, 1, 'Hello', spreadsheet);
        spreadsheet.setCell(textCell);
        const formulaCell = new FormulaCell(0, 0, '=DEBUG($B1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('Hello');
    });

    test('evalute DEBUG formula with number cell', () => {
        const numberCell = new NumberCell(0, 1, 5, spreadsheet);
        spreadsheet.setCell(numberCell);
        const formulaCell = new FormulaCell(0, 0, '=DEBUG($B1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(5);
    })

    test('evaluate DEBUG with function call', () => {
        const formulaCell = new FormulaCell(0, 0, '=DEBUG(SUM(5, 10))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test('evaluate DEBUG formula with cell references and SUM function', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=DEBUG(SUM($B1:$C1))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    test('evaluate DEBUG with multiple function calls', () => {
        const formulaCell = new FormulaCell(0, 0, '=DEBUG(SUM(5, 10) + AVG(5, 10))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(22.5);
    });

    test('evalute COPY formula with cell references', () => {
        const textCell1 = new FormulaCell(0, 1, 'Hello', spreadsheet);
        const textCell2 = new FormulaCell(0, 2, '', spreadsheet);
        spreadsheet.setCell(textCell1);
        spreadsheet.setCell(textCell2);
        const formulaCell = new FormulaCell(0, 0, '=COPY($B1, "$C1")', spreadsheet);
        expect(textCell2.setFormula(textCell2.getFormula()).getValue()).toBe('Hello');
    });

    test('COPY formula with complex source value', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 0, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=SUM($B1:$C1)', spreadsheet);
        const formulaCell2 = new FormulaCell(0, 3, '=COPY($A1, "$D1")', spreadsheet);
    });

    test('evaluate DEBUG formula with cell references and SUM function', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        const formulaCell = new FormulaCell(0, 0, '=DEBUG(SUM($B1:$C1))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(15);
    });

    //Test for updating formula cell when dependent cells change in UI

    test('sum function with a simple addition formula after', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(numberCell1)
        spreadsheet.setCell(numberCell2)
        const formulaCell = new FormulaCell(1, 3, '=SUM($B1:$C1) + 5', spreadsheet);
        spreadsheet.setCell(formulaCell);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(20);
    });

    test('evaluate nested functions with SUM using comma', () => {
        const numberCell1 = new NumberCell(0, 1, 5, spreadsheet);
        const numberCell2 = new NumberCell(0, 2, 10, spreadsheet);
        const numberCell3 = new NumberCell(0, 3, 15, spreadsheet);
        spreadsheet.setCell(numberCell1);
        spreadsheet.setCell(numberCell2);
        spreadsheet.setCell(numberCell3);
        const formulaCell = new FormulaCell(0, 0, '=SUM(SUM($B1:$D1), 5)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(35);
    });

    test('test incorrect paranthesis in formula', () => {
        const formulaCell = new FormulaCell(0, 0, '=SUM($B1:$D1', spreadsheet);
        //expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('=SUM($B1:$D1');
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue())
            .toBe("Unbalanced parentheses in formula");
    });

    test('evaluate simple nested SUM function', () => {
        const formulaCell = new FormulaCell(0, 0, '=SUM(5, SUM(10, 15))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(30);
    });

    test('evaluate complex multi-nested SUM function', () => {
        const formulaCell = new FormulaCell(0, 0, '=SUM(SUM(SUM(10, 5, 5), 5), SUM(10, 15))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(50);
    });

    test('evaluate multi-nested SUM and AVG function', () => {
        const formulaCell = new FormulaCell(0, 0, '=SUM(AVG(10, 20), AVG(10, 20))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(30);
    });

    test('evaluate DEBUG with nested function calls', () => {
        const formulaCell = new FormulaCell(0, 0, '=DEBUG(SUM(SUM(5, 10), AVG(5, 10)))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(22.5);
    });

    // Testing error handling
    test('test incorrect paranthesis in formula', () => {
        const formulaCell = new FormulaCell(0, 0, '=SUM($B1:$D1', spreadsheet);
        //expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe('=SUM($B1:$D1');
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue())
            .toBe("Unbalanced parentheses in formula");
    });

    test("test error handling for SUM function with a text cell", () => {
        const textCell = new TextCell(0, 1, 'Hello', spreadsheet);
        const numberCell = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(textCell);
        spreadsheet.setCell(numberCell);
        const formulaCell = new FormulaCell(0, 0, '=SUM($B1:$C1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(NaN);
    });

    test('test error handling for AVG function with a text cell', () => {
        const textCell = new TextCell(0, 1, 'Hello', spreadsheet);
        const numberCell = new NumberCell(0, 2, 10, spreadsheet);
        spreadsheet.setCell(textCell);
        spreadsheet.setCell(numberCell);
        const formulaCell = new FormulaCell(0, 0, '=AVG($B1:$C1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe(NaN);
    });

    test('test error handling for invalid function name', () => {
        const formulaCell = new FormulaCell(0, 0, '=SUMM(5, 10)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue())
            .toBe("Function not recognized");
    });

    test('test error handling for double invalid operators', () => {
        const formulaCell = new FormulaCell(0, 0, '=5 + + 10', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue())
            .toBe("Error evaluating expression");
    });

    test('test error handling for invalid IF parameters', () => {
        const formulaCell = new FormulaCell(0, 0, '=IF(5, "Greater")', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue())
            .toBe("Invalid arguments count in IF function. Expected 3 arguments.");
    });

    test('test error handling for invalid COPY parameters', () => {
        const formulaCell = new FormulaCell(0, 0, '=COPY($B1)', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue())
            .toBe("COPY function requires exactly two arguments.");
    });

    test('evaluate DEBUG with IF statement with string', () => {
        const textCell = new FormulaCell(0, 1, 'Monkey', spreadsheet);
        const numberCell = new FormulaCell(0, 2, 'Monkey', spreadsheet);

        const formulaCell = new FormulaCell(0, 0, '=DEBUG(IF(($B1 = $C1), "Pass", "Fail"))', spreadsheet);
        expect(formulaCell.setFormula(formulaCell.getFormula()).getValue()).toBe("Pass");
    });
});