import { runBoardTests } from './board.test.js';
import { runTicTacToeLogicTests } from './tictactoe.test.js';
import { runRandomMoveStrategyTests } from './randomMoveStrategy.test.js';
import { runTicTacToeLibraryTests } from './TicTacToe.library.test.js';

function runAll() {
    console.log("Starting All Tests...");
    // The individual test functions use console.assert and log their own errors.
    // If a test fails with console.assert, it will log an error but not stop execution by default.
    // If a test function throws an unhandled error, execution might stop.
    // For now, we'll assume each test suite logs its own summary or errors.

    try {
        runBoardTests();
        console.log("--------------------");
        runTicTacToeLogicTests();
        console.log("--------------------");
        runRandomMoveStrategyTests();
        console.log("--------------------");
        runTicTacToeLibraryTests(); // Added new test suite
        console.log("--------------------");

        // If execution reaches here without unhandled errors, 
        // and console.assert failures are logged, this is a "completion" message.
        // A more robust system would have each test suite return a true/false status.
        console.log("All test suites completed. Check console for individual test results and errors.");

    } catch (error) {
        console.error("A critical error occurred during test execution:", error);
        console.error("Some tests may not have run or completed.");
    }
}

runAll();
