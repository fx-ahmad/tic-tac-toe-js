import Board from "./board.js";
import Player from "./player.js";
import UIManager from "./UIManager.js";
import BoardRenderer from "./boardRenderer.js";
import RandomMoveStrategy from "./RandomMoveStrategy.js";

class TicTacToe {
    constructor(options = {}) {
        const {
            containerElement,
            boardRows = 3,
            boardCols = 3,
            playerXSymbol = 'X',
            playerOSymbol = 'O',
            playerXIsComputer = false,
            playerOIsComputer = true,
            playerXAIStrategy = null,
            playerOAIStrategy = null, // Default handled below
            boardCellBackgroundColorBlack = '#eee',
            boardCellBackgroundColorWhite = '#fafafa',
            boardPixelWidth = 300,
            boardPixelHeight = 300
        } = options;

        if (!containerElement) {
            throw new Error("containerElement is required when initializing TicTacToe.");
        }

        this.board = new Board(boardRows, boardCols);

        let finalPlayerXAIStrategy = playerXAIStrategy;
        if (playerXIsComputer && !finalPlayerXAIStrategy) {
            finalPlayerXAIStrategy = new RandomMoveStrategy();
        } else if (!playerXIsComputer) {
            finalPlayerXAIStrategy = null;
        }

        let finalPlayerOAIStrategy = playerOAIStrategy;
        if (playerOIsComputer && !finalPlayerOAIStrategy) {
            finalPlayerOAIStrategy = new RandomMoveStrategy();
        } else if (!playerOIsComputer) {
            finalPlayerOAIStrategy = null;
        }

        this.playerX = new Player(playerXSymbol, playerXIsComputer, 0, finalPlayerXAIStrategy);
        this.playerO = new Player(playerOSymbol, playerOIsComputer, 0, finalPlayerOAIStrategy);
        
        const boardRenderer = new BoardRenderer(
            this.board,
            containerElement,
            boardCellBackgroundColorBlack,
            boardCellBackgroundColorWhite,
            { width: boardPixelWidth, height: boardPixelHeight }
        );

        this.uiManager = new UIManager(containerElement, boardRenderer);
        this.uiManager.setupGameContainer(boardPixelWidth, boardPixelHeight);

        this.playerTurn = this.playerX.symbol;
        this.isProcessingClick = false;
    }

    startGame() {
        this.isProcessingClick = false;
        // Create a new board state for the game, dimensions from initial board instance
        this.board = new Board(this.board.getRows(), this.board.getCols());
        this.playerTurn = this.playerX.symbol;
        this.uiManager.resetUI();
        // Ensure the renderer is using the *active* board.
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

    destroy() {
        // 1. Disable Board Interaction (disables cell buttons)
        if (this.uiManager && this.uiManager.boardRenderer) {
            this.uiManager.disableBoardInteraction(); // Disables buttons
        }

        // 2. Clear Board Click Listeners
        // BoardRenderer.removeCellClickListeners uses cloning to remove listeners
        if (this.uiManager && this.uiManager.boardRenderer) {
            this.uiManager.boardRenderer.removeCellClickListeners();
        }

        // 3. & 4. Clear UIManager's specific UI elements (message, restart button)
        // UIManager.destroyUI handles removing these elements and their listeners
        if (this.uiManager) {
            this.uiManager.destroyUI();
        }

        // 5. Clear Board DOM from its container
        if (this.uiManager && this.uiManager.boardRenderer && this.uiManager.boardRenderer.boardDOMContainer) {
            this.uiManager.boardRenderer.boardDOMContainer.innerHTML = '';
        }

        // 6. Nullify References
        this.board = null;
        this.playerX = null;
        this.playerO = null;
        this.uiManager = null; // Includes boardRenderer through UIManager
        this.playerTurn = null;
        this.isProcessingClick = false; // Reset state

        // Optional: Log destruction
        console.log("TicTacToe instance destroyed.");
    }
}

export default TicTacToe;
