export default class UIManager {
    constructor(gameContainerElement, boardRenderer) {
        this.gameContainer = gameContainerElement;
        this.boardRenderer = boardRenderer; // Instance of BoardRenderer
        this.messageElement = null; 
        this.restartButton = null;
    }

    setupGameContainer(boardPixelWidth, boardPixelHeight) {
        this.gameContainer.style.width = `${boardPixelWidth}px`;
        this.gameContainer.style.height = `${boardPixelHeight}px`;
        // BoardRenderer's constructor likely called _buildInitialBoardDOM.
        // If render is needed for initial display, TicTacToe.startGame will call renderBoard.
    }
    
    renderBoard() {
        this.boardRenderer.render();
    }

    updateCell(row, col) {
        this.boardRenderer.updateCellDisplay(row, col);
    }

    setBoardCellClickListener(listener) {
        this.boardRenderer.setCellClickListener(listener);
    }

    disableBoardInteraction() {
        this.boardRenderer.disableBoardCells();
    }
    
    enableBoardInteraction() {
        this.boardRenderer.enableBoardCells();
    }

    showMessage(message) {
        if (!this.messageElement) {
            this.messageElement = document.createElement("div");
            this.messageElement.classList.add("alert"); 
            this.gameContainer.appendChild(this.messageElement);
        }
        this.messageElement.innerHTML = message;
        this.messageElement.style.display = 'block';
    }

    hideMessage() {
        if (this.messageElement) {
            this.messageElement.style.display = 'none';
        }
    }

    showRestartButton(restartCallback) {
        if (!this.restartButton) {
            this.restartButton = document.createElement("button");
            this.restartButton.setAttribute("type", "button");
            this.restartButton.classList.add("restart"); 
            this.restartButton.innerHTML = "Restart";
            this.gameContainer.appendChild(this.restartButton);
        }
        const newButton = this.restartButton.cloneNode(true);
        this.restartButton.parentNode.replaceChild(newButton, this.restartButton);
        this.restartButton = newButton;
        
        this.restartButton.addEventListener("click", restartCallback);
        this.restartButton.style.display = 'block';
    }

    hideRestartButton() {
        if (this.restartButton) {
            this.restartButton.style.display = 'none';
        }
    }
    
    resetUI() {
        this.hideMessage();
        this.hideRestartButton();
    }

    destroyUI() {
        // Remove message element if it exists
        if (this.messageElement) {
            this.messageElement.remove();
            this.messageElement = null;
        }
        // Remove restart button if it exists
        if (this.restartButton) {
            this.restartButton.remove(); // This also removes its event listeners
            this.restartButton = null;
        }
        // Note: BoardRenderer's DOM container cleanup will be handled separately
        // by TicTacToe.destroy calling boardDOMContainer.innerHTML = ''
    }
}
