import { runBoardTests } from './board.test.js';
import { runTicTacToeLogicTests } from './tictactoe.test.js';
import { runRandomMoveStrategyTests } from './randomMoveStrategy.test.js';

function runAll() {
    console.log("Starting All Tests...");
    let allPassed = true;
    
    allPassed = runBoardTests() && allPassed;
    console.log("--------------------");
    allPassed = runTicTacToeLogicTests() && allPassed;
    console.log("--------------------");
    allPassed = runRandomMoveStrategyTests() && allPassed;
    console.log("--------------------");

    if(allPassed) {
        console.log("All tests passed successfully!");
    } else {
        console.error("Some tests failed.");
    }
}

runAll();
