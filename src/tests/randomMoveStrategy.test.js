import RandomMoveStrategy from '../RandomMoveStrategy.js';
import Board from '../board.js';

function runRandomMoveStrategyTests() {
    console.log("Running RandomMoveStrategy Tests...");
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

    const strategy = new RandomMoveStrategy();

    // Test 1: Get move from a board with multiple options
    const board1 = new Board(3,3);
    const move1 = strategy.getMove(board1);
    assert(move1 !== null, "Test 1.1: Move is not null");
    assert(Array.isArray(move1) && move1.length === 2, "Test 1.2: Move is an array of length 2 [row, col]");
    assert(move1[0] >= 0 && move1[0] < 3 && move1[1] >=0 && move1[1] < 3, "Test 1.3: Move is within board bounds");

    // Test 2: Get move from a board with only one option
    const board2 = new Board(2,2);
    board2.setCellValue(0,0,'X');
    board2.setCellValue(0,1,'O');
    board2.setCellValue(1,0,'X');
    const move2 = strategy.getMove(board2);
    assert(move2 !== null && move2[0] === 1 && move2[1] === 1, "Test 2.1: Correctly selects the only available move (1,1)");

    // Test 3: Get move from a full board (should return null or handle gracefully)
    const board3 = new Board(1,1);
    board3.setCellValue(0,0,'X');
    const move3 = strategy.getMove(board3);
    assert(move3 === null, "Test 3.1: Returns null when no moves are available");
    
    // Test 4: Consistency of returned format (multiple calls)
    const board4 = new Board(3,3);
    for(let i=0; i<5; i++) { // Call multiple times
        const move = strategy.getMove(board4);
        if(board4.getAvailablePositions().length > 0) {
            assert(move !== null && Array.isArray(move) && move.length === 2, `Test 4.${i+1}: Move format is [row,col]`);
        } else {
            assert(move === null, `Test 4.${i+1}: Move is null if no spots (should not happen in this loop setup)`);
        }
        // To make the board change for subsequent calls in a real scenario, we'd setCellValue here.
        // For this test, we just ensure format if positions ARE available.
    }


    console.log(`RandomMoveStrategy Tests Complete: ${assertionsPassed}/${testCount} assertions passed.`);
    return assertionsPassed === testCount;
}
export { runRandomMoveStrategyTests };
