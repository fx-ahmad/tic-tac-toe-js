import Board from "./board.js";
import Player from "./player.js";
import UIManager from "./UIManager.js";
import BoardRenderer from "./boardRenderer.js";
import RandomMoveStrategy from "./RandomMoveStrategy.js";

class TicTacToe {
    constructor(playerX, playerO, board, uiManager) {
        this.playerX = playerX;
        this.playerO = playerO;
        this.board = board; 
        this.uiManager = uiManager;
        this.playerTurn = this.playerX.symbol;
        this.isProcessingClick = false;
    }

    startGame() {
        this.isProcessingClick = false;
        // Create a new board state for the game, dimensions from initial board instance
        this.board = new Board(this.board.getRows(), this.board.getCols());
        this.playerTurn = this.playerX.symbol;
        this.uiManager.resetUI();
        // BoardRenderer needs to be aware of the new board instance if it holds a direct reference
        // that needs to be updated. Assuming BoardRenderer's render method uses the game's board instance
        // or is updated separately.
        // For now, let's assume UIManager or BoardRenderer is designed to work with the game's current board state.
        // The BoardRenderer instance passed to UIManager is constructed with the initial boardData.
        // If TicTacToe creates a *new* Board object, BoardRenderer might be looking at an old one.
        // This needs careful handling.
        // Solution: BoardRenderer should perhaps take a getter function for the board,
        // or TicTacToe should update the BoardRenderer's internal board reference.
        // For this step, we follow the prompt, but this is a potential refactor point.
        // Let's assume BoardRenderer's render method uses the board passed at construction,
        // so we must update its internal reference or make it use the game's board.
        // The current BoardRenderer is built with a specific board instance.
        // We need to ensure the renderer is using the *active* board.
        // Simplest for now: UIManager's renderBoard could implicitly use this.board from TicTacToe
        // if UIManager has a reference to TicTacToe, or BoardRenderer is updated.
        // The provided UIManager.renderBoard() calls this.boardRenderer.render().
        // The BoardRenderer.render() uses this.board.getCellValue().
        // So, the Board instance in BoardRenderer must be the same as in TicTacToe.
        // One way: Update BoardRenderer's board.
        this.uiManager.boardRenderer.board = this.board; // Make BoardRenderer use the new board.

        this.uiManager.renderBoard(); 
        this.uiManager.enableBoardInteraction();
        this.uiManager.setBoardCellClickListener(this.onCellClick.bind(this));

        const currentPlayer = this.getPlayerInstance(this.playerTurn);
        if (currentPlayer.isComputer) {
            this.handleComputerTurn();
        }
    }

    restartGame() {
        this.startGame();
    }

    onCellClick(e) {
        if (this.isProcessingClick) return;

        const selectedRow = parseInt(e.target.getAttribute("data-row"));
        const selectedCol = parseInt(e.target.getAttribute("data-col"));

        if (!this.board.isCellEmpty(selectedRow, selectedCol)) {
            return;
        }
        
        this.isProcessingClick = true;
        this.board.setCellValue(selectedRow, selectedCol, this.playerTurn);
        this.uiManager.updateCell(selectedRow, selectedCol);

        if (this.checkGameEnd(this.playerTurn)) {
            this.isProcessingClick = false; 
            return;
        }

        this.playerTurn = this.changeTurn(this.playerTurn);
        const currentPlayer = this.getPlayerInstance(this.playerTurn);

        if (currentPlayer.isComputer) {
            this.handleComputerTurn();
        } else {
            this.isProcessingClick = false; 
        }
    }
    
    handleComputerTurn() {
        this.uiManager.disableBoardInteraction(); 
        const currentPlayer = this.getPlayerInstance(this.playerTurn);
        const move = currentPlayer.computerTurn(this.board);

        if (!move) { // Should not happen if game logic correctly identifies no moves left (tie)
             this.isProcessingClick = false;
             this.uiManager.enableBoardInteraction();
             return;
        }
        const [row, col] = move;

        setTimeout(() => {
            this.board.setCellValue(row, col, this.playerTurn);
            this.uiManager.updateCell(row, col);

            if (this.checkGameEnd(this.playerTurn)) {
                this.isProcessingClick = false; 
                return;
            }

            this.playerTurn = this.changeTurn(this.playerTurn);
            
            const nextPlayer = this.getPlayerInstance(this.playerTurn);
            if (nextPlayer.isComputer) {
                this.handleComputerTurn(); 
            } else {
                this.uiManager.enableBoardInteraction(); 
                this.isProcessingClick = false;
            }
        }, 500);
    }

    checkGameEnd(playerSymbol) {
        if (this.doesPlayerWin(playerSymbol, this.board)) {
            this.uiManager.disableBoardInteraction();
            this.uiManager.showMessage(`${playerSymbol} wins!`);
            this.uiManager.showRestartButton(() => this.restartGame());
            return true;
        }
        if (this.doesTie(this.board)) {
            this.uiManager.disableBoardInteraction();
            this.uiManager.showMessage("It's a tie!");
            this.uiManager.showRestartButton(() => this.restartGame());
            return true;
        }
        return false;
    }

    getPlayerInstance(symbol) {
        return symbol === this.playerX.symbol ? this.playerX : this.playerO;
    }

    changeTurn(currentTurn) {
        return currentTurn === this.playerX.symbol ? this.playerO.symbol : this.playerX.symbol;
    }

    doesPlayerWin(currentPlayerSymbol, board) {
        const bMap = board.getBoardMap();
        const N = board.getRows(); // Assuming square board, common in TicTacToe

        // Check rows
        for (let i = 0; i < N; i++) {
            if (bMap[i].every(cell => cell === currentPlayerSymbol)) return true;
        }
        // Check columns
        for (let j = 0; j < N; j++) { // N is also number of columns for square board
            if (bMap.every(row => row[j] === currentPlayerSymbol)) return true;
        }
        // Check main diagonal
        if (N > 0 && bMap.every((row, idx) => row[idx] === currentPlayerSymbol)) return true;
        // Check anti-diagonal
        if (N > 0 && bMap.every((row, idx) => row[N - 1 - idx] === currentPlayerSymbol)) return true;
        
        return false;
    }

    doesTie(board) {
        // Tie if no available positions and no player has won
        return board.getAvailablePositions().length === 0 && 
               !this.doesPlayerWin(this.playerX.symbol, board) && 
               !this.doesPlayerWin(this.playerO.symbol, board);
    }
}

export default TicTacToe;

document.addEventListener('DOMContentLoaded', () => {
    const gameContainerId = 'tic-tac-toe-container';
    const gameContainer = document.getElementById(gameContainerId);

    if (!gameContainer) {
        console.error(`HTML element with ID '${gameContainerId}' not found. Game cannot start.`);
        return;
    }

    // Game Configuration
    const boardRows = 3;
    const boardCols = 3;
    const boardCellBackgroundColorBlack = '#eee'; // Example color
    const boardCellBackgroundColorWhite = '#fafafa'; // Example color
    const boardPixelWidth = 300;
    const boardPixelHeight = 300;

    // 1. Create Board (Initial Data/Configuration Carrier)
    const initialBoardData = new Board(boardRows, boardCols);

    // 2. Create BoardRenderer
    const boardRenderer = new BoardRenderer(
        initialBoardData, // Will be replaced by the game's board in TicTacToe.startGame
        gameContainer,
        boardCellBackgroundColorBlack,
        boardCellBackgroundColorWhite,
        { width: boardPixelWidth, height: boardPixelHeight }
    );

    // 3. Create AI Strategy
    const computerAI = new RandomMoveStrategy();

    // 4. Create Players
    const playerX = new Player('X', false, 0, null); 
    const playerO = new Player('O', true, 0, computerAI); 

    // 5. Create UIManager
    const uiManager = new UIManager(gameContainer, boardRenderer);

    // 6. Create TicTacToe Game Instance
    // The 'initialBoardData' is passed here, TicTacToe's startGame will create its own internal board
    // but uses dimensions from this initial one. And we updated startGame to link the new board to the renderer.
    const ticTacToeGame = new TicTacToe(playerX, playerO, initialBoardData, uiManager);

    // 7. Setup the overall game container dimensions via UIManager
    uiManager.setupGameContainer(boardPixelWidth, boardPixelHeight);

    // 8. Start the Game
    ticTacToeGame.startGame();

    // 9. Optional: Expose to window for debugging
    window.game = {
        ticTacToeInstance: ticTacToeGame,
        Board,
        Player,
        UIManager,
        BoardRenderer,
        RandomMoveStrategy
    };
});
