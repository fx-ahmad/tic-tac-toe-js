import Board from '../board.js';

function runBoardTests() {
    console.log("Running Board Tests...");
    let testCount = 0;
    let assertionsPassed = 0;

    function assert(condition, message) {
        testCount++;
        if (condition) {
            assertionsPassed++;
            console.log(`  [PASS] ${message}`);
        } else {
            console.error(`  [FAIL] ${message}`);
        }
    }

    // Test 1: Board initialization
    const board = new Board(3, 3);
    assert(board.getRows() === 3, "Test 1.1: Board has 3 rows");
    assert(board.getCols() === 3, "Test 1.2: Board has 3 columns");
    assert(board.getBoardMap().length === 3, "Test 1.3: Board map has 3 rows");
    assert(board.getBoardMap()[0].length === 3, "Test 1.4: Board map row has 3 columns");
    assert(board.getAvailablePositions().length === 9, "Test 1.5: Initial board has 9 available positions");

    // Test 2: Setting and getting cell values
    board.setCellValue(0, 0, 'X');
    assert(board.getCellValue(0, 0) === 'X', "Test 2.1: Cell (0,0) is set to 'X'");
    assert(!board.isCellEmpty(0, 0), "Test 2.2: Cell (0,0) is not empty");
    assert(board.getAvailablePositions().length === 8, "Test 2.3: Available positions reduced to 8");

    board.setCellValue(1, 1, 'O');
    assert(board.getCellValue(1, 1) === 'O', "Test 2.4: Cell (1,1) is set to 'O'");
    assert(board.getAvailablePositions().length === 7, "Test 2.5: Available positions reduced to 7");

    // Test 3: isCellEmpty
    assert(board.isCellEmpty(2, 2), "Test 3.1: Cell (2,2) is initially empty");
    board.setCellValue(2, 2, 'X');
    assert(!board.isCellEmpty(2, 2), "Test 3.2: Cell (2,2) is not empty after setting value");

    // Test 4: getAvailablePositions
    const board2 = new Board(2,2); // Create a 2x2 board
    board2.setCellValue(0,0, 'X');
    board2.setCellValue(0,1, 'O');
    board2.setCellValue(1,0, 'X');
    const available = board2.getAvailablePositions();
    assert(available.length === 1, "Test 4.1: One position available on 2x2 board");
    assert(available[0][0] === 1 && available[0][1] === 1, "Test 4.2: Available position is (1,1)");
    board2.setCellValue(1,1, 'O');
    assert(board2.getAvailablePositions().length === 0, "Test 4.3: No positions available when full");
    
    // Test 5: Out of bounds access (should be handled gracefully)
    console.log("  Testing out-of-bounds (expect console errors from Board class, not test failures):");
    board.setCellValue(5, 5, 'X'); // Should log error, not throw
    assert(board.getCellValue(5,5) === undefined, "Test 5.1: Getting value out of bounds returns undefined");
    assert(board.isCellEmpty(5,5) === false, "Test 5.2: Checking empty out of bounds returns false (as per current implementation)");


    console.log(`Board Tests Complete: ${assertionsPassed}/${testCount} assertions passed.`);
    return assertionsPassed === testCount;
}

// Expose if needed, or auto-run
// runBoardTests(); 
export { runBoardTests };
