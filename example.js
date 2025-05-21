// Import necessary classes
import TicTacToe from './src/main.js';
import RandomMoveStrategy from './src/RandomMoveStrategy.js';

// Wait for the DOM to be fully loaded before trying to access elements
document.addEventListener('DOMContentLoaded', () => {
    // Get container elements from example.html
    const container1 = document.getElementById('ticTacToeContainer1');
    const container2 = document.getElementById('ticTacToeContainer2');

    // Check if container elements exist
    if (!container1 || !container2) {
        console.error('One or both game container elements not found. Make sure example.html is set up correctly.');
        return;
    }

    // --- Options for the first Tic Tac Toe instance ---
    // Player X (Human) vs. Player O (Computer with RandomMoveStrategy)
    // Default board size (3x3), default symbols (X, O), default colors
    const options1 = {
        containerElement: container1,
        playerXIsComputer: false, // Player X is Human
        playerOIsComputer: true,  // Player O is Computer
        playerOAIStrategy: new RandomMoveStrategy(), // AI for Player O
        // boardRows, boardCols, playerXSymbol, playerOSymbol, etc., will use defaults
    };

    // --- Options for the second Tic Tac Toe instance ---
    // Player A (Computer with RandomMoveStrategy) vs. Player B (Human)
    // 4x4 board, custom symbols (A, B), custom colors, custom size
    const options2 = {
        containerElement: container2,
        boardRows: 4,
        boardCols: 4,
        playerXSymbol: 'A',
        playerOSymbol: 'B',
        playerXIsComputer: true,  // Player A is Computer
        playerXAIStrategy: new RandomMoveStrategy(), // AI for Player A
        playerOIsComputer: false, // Player B is Human
        boardCellBackgroundColorBlack: '#aabbcc', // Custom dark color for cells
        boardCellBackgroundColorWhite: '#ddeeff', // Custom light color for cells
        boardPixelWidth: 400, // Custom board width
        boardPixelHeight: 400, // Custom board height
    };

    try {
        // Create and start the first game instance
        const game1 = new TicTacToe(options1);
        game1.startGame();
        console.log('Game 1 (Player vs. Computer) started.');

        // Create and start the second game instance
        const game2 = new TicTacToe(options2);
        game2.startGame();
        console.log('Game 2 (Computer vs. Player, 4x4, Custom Symbols/Colors) started.');

        // Optional: Expose instances to window for debugging
        window.ticTacToeGame1 = game1;
        window.ticTacToeGame2 = game2;

    } catch (error) {
        console.error("Error initializing Tic Tac Toe game(s):", error);
    }
});
