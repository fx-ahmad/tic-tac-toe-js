import TicTacToe from '../main.js'; // Assuming TicTacToe class is default export from main.js
import Board from '../board.js';
import Player from '../player.js';
// UIManager and BoardRenderer are not strictly needed for testing core logic if mocked/stubbed
// For these tests, we'll focus on doesPlayerWin and doesTie which operate on Board state.

// A mock UIManager that does nothing, to satisfy TicTacToe constructor
const mockUIManager = {
    resetUI: () => {},
    renderBoard: () => {},
    enableBoardInteraction: () => {},
    setBoardCellClickListener: () => {},
    updateCell: () => {},
    disableBoardInteraction: () => {},
    showMessage: () => {},
    showRestartButton: () => {}
};

function runTicTacToeLogicTests() {
    console.log("Running TicTacToe Logic Tests...");
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

    const playerX = new Player('X', false);
    const playerO = new Player('O', false); // No AI for these tests

    // Test 1: Horizontal Win
    let board1 = new Board(3,3);
    let game1 = new TicTacToe(playerX, playerO, board1, mockUIManager);
    board1.setCellValue(0,0,'X'); board1.setCellValue(0,1,'X'); board1.setCellValue(0,2,'X');
    assert(game1.doesPlayerWin('X', board1), "Test 1.1: Player X wins horizontally (row 0)");

    // Test 2: Vertical Win
    let board2 = new Board(3,3);
    let game2 = new TicTacToe(playerX, playerO, board2, mockUIManager);
    board2.setCellValue(0,1,'O'); board2.setCellValue(1,1,'O'); board2.setCellValue(2,1,'O');
    assert(game2.doesPlayerWin('O', board2), "Test 2.1: Player O wins vertically (col 1)");

    // Test 3: Diagonal Win (top-left to bottom-right)
    let board3 = new Board(3,3);
    let game3 = new TicTacToe(playerX, playerO, board3, mockUIManager);
    board3.setCellValue(0,0,'X'); board3.setCellValue(1,1,'X'); board3.setCellValue(2,2,'X');
    assert(game3.doesPlayerWin('X', board3), "Test 3.1: Player X wins diagonally (TL to BR)");

    // Test 4: Diagonal Win (top-right to bottom-left)
    let board4 = new Board(3,3);
    let game4 = new TicTacToe(playerX, playerO, board4, mockUIManager);
    board4.setCellValue(0,2,'O'); board4.setCellValue(1,1,'O'); board4.setCellValue(2,0,'O');
    assert(game4.doesPlayerWin('O', board4), "Test 4.1: Player O wins diagonally (TR to BL)");

    // Test 5: No Win
    let board5 = new Board(3,3);
    let game5 = new TicTacToe(playerX, playerO, board5, mockUIManager);
    board5.setCellValue(0,0,'X'); board5.setCellValue(0,1,'O'); board5.setCellValue(0,2,'X');
    assert(!game5.doesPlayerWin('X', board5) && !game5.doesPlayerWin('O', board5), "Test 5.1: No player wins");

    // Test 6: Tie Game
    let board6 = new Board(3,3);
    let game6 = new TicTacToe(playerX, playerO, board6, mockUIManager);
    // X O X
    // O X O
    // O X O
    board6.setCellValue(0,0,'X'); board6.setCellValue(0,1,'O'); board6.setCellValue(0,2,'X');
    board6.setCellValue(1,0,'O'); board6.setCellValue(1,1,'X'); board6.setCellValue(1,2,'O');
    board6.setCellValue(2,0,'O'); board6.setCellValue(2,1,'X'); board6.setCellValue(2,2,'O');
    assert(game6.doesTie(board6), "Test 6.1: Game is a tie");
    assert(!game6.doesPlayerWin('X', board6) && !game6.doesPlayerWin('O', board6), "Test 6.2: No player wins in a tie");
    
    // Test 7: Not a Tie (empty board)
    let board7 = new Board(3,3);
    let game7 = new TicTacToe(playerX, playerO, board7, mockUIManager);
    assert(!game7.doesTie(board7), "Test 7.1: Empty board is not a tie");

    // Test 8: Not a Tie (incomplete board, no winner)
    let board8 = new Board(3,3);
    let game8 = new TicTacToe(playerX, playerO, board8, mockUIManager);
    board8.setCellValue(0,0,'X');
    assert(!game8.doesTie(board8), "Test 8.1: Incomplete board is not a tie");

    console.log(`TicTacToe Logic Tests Complete: ${assertionsPassed}/${testCount} assertions passed.`);
    return assertionsPassed === testCount;
}
export { runTicTacToeLogicTests };
