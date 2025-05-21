import TicTacToe from '../main.js';
import RandomMoveStrategy from '../RandomMoveStrategy.js';
import Player from '../player.js'; // Needed for instanceof checks

// Helper for creating a container element in a test environment
function createTestContainer(id = 'test-container') {
    let container = document.getElementById(id);
    if (!container) {
        container = document.createElement('div');
        container.id = id;
        document.body.appendChild(container); // Needs to be in the DOM for some tests
    }
    // Clear container before each use in a test
    container.innerHTML = '';
    return container;
}

// --- Test Suite for TicTacToe Library Features ---
export function runTicTacToeLibraryTests() {
    console.log("--- Running TicTacToe Library Tests ---");

    testInstantiationWithDefaultOptions();
    testInstantiationWithCustomOptions();
    testDestroyMethod();
    testMultipleInstances();

    console.log("--- TicTacToe Library Tests Completed ---");
}

function testInstantiationWithDefaultOptions() {
    console.log("Test: Instantiation with Default Options");
    const container = createTestContainer('container-default');
    let game;
    try {
        game = new TicTacToe({ containerElement: container });
        game.startGame();

        console.assert(game.board.getRows() === 3, "Default board rows should be 3");
        console.assert(game.board.getCols() === 3, "Default board cols should be 3");
        console.assert(game.playerX instanceof Player, "Player X should be a Player instance");
        console.assert(game.playerX.isComputer === false, "Player X should be human by default");
        console.assert(game.playerO instanceof Player, "Player O should be a Player instance");
        console.assert(game.playerO.isComputer === true, "Player O should be computer by default");
        console.assert(game.playerO.aiStrategy instanceof RandomMoveStrategy, "Player O should have RandomMoveStrategy by default");
        console.assert(container.children.length > 0, "Container element should have children after startGame()");
        console.assert(container.querySelector('.row') !== null, "Container should render board rows");
    } catch (e) {
        console.error("Error in testInstantiationWithDefaultOptions:", e);
        console.assert(false, "Test failed due to error: " + e.message);
    } finally {
        if (game && game.destroy) game.destroy(); // Cleanup
        container.remove(); // Clean up container from DOM
    }
}

function testInstantiationWithCustomOptions() {
    console.log("Test: Instantiation with Custom Options");
    const container = createTestContainer('container-custom');
    const customAI = new RandomMoveStrategy(); // Could be a mock or different strategy if available
    let game;

    try {
        game = new TicTacToe({
            containerElement: container,
            boardRows: 4,
            boardCols: 4,
            playerXSymbol: 'A',
            playerOSymbol: 'B',
            playerXIsComputer: true,
            playerOIsComputer: false,
            playerXAIStrategy: customAI,
            boardCellBackgroundColorBlack: '#111',
            boardCellBackgroundColorWhite: '#fff',
            boardPixelWidth: 400,
            boardPixelHeight: 400,
        });
        game.startGame();

        console.assert(game.board.getRows() === 4, "Custom board rows should be 4");
        console.assert(game.board.getCols() === 4, "Custom board cols should be 4");
        console.assert(game.playerX.symbol === 'A', "Player X symbol should be 'A'");
        console.assert(game.playerO.symbol === 'B', "Player O symbol should be 'B'");
        console.assert(game.playerX.isComputer === true, "Player X should be computer");
        console.assert(game.playerX.aiStrategy === customAI, "Player X AI strategy should be customAI");
        console.assert(game.playerO.isComputer === false, "Player O should be human");
        console.assert(container.children.length > 0, "Container should have children after startGame()");
        console.assert(container.style.width === '400px', "Container width should be 400px");
        
        // Check for applied colors (indirectly, by checking if BoardRenderer stored them)
        // This assumes BoardRenderer makes them available or uses them in a way we can inspect,
        // or we trust the visual outcome based on previous manual tests or more complex visual regression.
        // For now, we'll trust they are passed down as per previous reviews.
        // Example: console.assert(game.uiManager.boardRenderer.bgBlack === '#111', "Custom bgBlack color");

    } catch (e) {
        console.error("Error in testInstantiationWithCustomOptions:", e);
        console.assert(false, "Test failed due to error: " + e.message);
    } finally {
        if (game && game.destroy) game.destroy();
        container.remove();
    }
}

function testDestroyMethod() {
    console.log("Test: destroy() Method Functionality");
    const container = createTestContainer('container-destroy');
    let game;
    try {
        game = new TicTacToe({ containerElement: container });
        game.startGame();

        // Ensure UI is there
        console.assert(container.innerHTML !== '', "Container should not be empty after start");
        game.uiManager.showMessage("Test Message"); // Show a message to test its removal
        game.uiManager.showRestartButton(() => {}); // Show restart button

        console.assert(container.querySelector('.alert') !== null, "Message element should exist before destroy");
        console.assert(container.querySelector('.restart') !== null, "Restart button should exist before destroy");
        
        const cellButton = container.querySelector('button.col'); // Get a cell
        console.assert(cellButton !== null, "Cell button should exist before destroy");


        game.destroy();

        console.assert(container.innerHTML === '', "Container should be empty after destroy()");
        console.assert(game.board === null, "Game board property should be null after destroy");
        console.assert(game.uiManager === null, "Game uiManager property should be null after destroy");
        // Message and restart button are part of the container's innerHTML, so they are already checked.
        // Checking cell interaction is tricky without full browser events.
        // The fact that cells are removed (container.innerHTML === '') is a good indicator.

    } catch (e) {
        console.error("Error in testDestroyMethod:", e);
        console.assert(false, "Test failed due to error: " + e.message);
    } finally {
        // Game is already destroyed, but container needs removal
        container.remove();
    }
}

function testMultipleInstances() {
    console.log("Test: Multiple Instances");
    const container1 = createTestContainer('container-multi1');
    const container2 = createTestContainer('container-multi2');
    let game1, game2;

    try {
        game1 = new TicTacToe({ containerElement: container1 });
        game1.startGame();

        game2 = new TicTacToe({
            containerElement: container2,
            boardRows: 4,
            playerXSymbol: 'P1',
            playerOSymbol: 'P2',
        });
        game2.startGame();

        console.assert(container1.innerHTML !== '', "Container 1 should not be empty");
        console.assert(container1.querySelector('.row').children.length === 3, "Game 1 board should be 3x3");
        console.assert(container2.innerHTML !== '', "Container 2 should not be empty");
        console.assert(container2.querySelector('.row').children.length === 4, "Game 2 board should be 4x4");

        // Destroy game1
        game1.destroy();
        console.assert(container1.innerHTML === '', "Container 1 should be empty after game1.destroy()");
        console.assert(container2.innerHTML !== '', "Container 2 should NOT be empty after game1.destroy()");
        console.assert(game2.board.getRows() === 4, "Game 2 board should still be 4x4");
        
        // Ensure game2 is still functional (e.g., try to make a move or check its state)
        // This is a simplified check; more complex interaction test would be better.
        const game2Cell = container2.querySelector('button.col');
        console.assert(game2Cell !== null, "Game 2 should still have cells");
        // game2.onCellClick({ target: game2Cell }); // This would be a more direct test if onCellClick was easier to simulate

    } catch (e) {
        console.error("Error in testMultipleInstances:", e);
        console.assert(false, "Test failed due to error: " + e.message);
    } finally {
        if (game1 && game1.destroy && game1.uiManager !== null) game1.destroy(); // If not already destroyed by test
        if (game2 && game2.destroy) game2.destroy();
        container1.remove();
        container2.remove();
    }
}

// If running in a Node-like environment for testing, this might be needed.
// For browser, runTicTacToeLibraryTests() would be called from runAllTests.js or similar.
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = { runTicTacToeLibraryTests };
// }
