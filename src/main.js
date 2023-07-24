import Board from "./board";
import Player from "./player";
import cssText from 'bundle-text:./main.css';

class TicTacToe {
    constructor(playerInstances, boardInstance) {
        this.gameContainer = null;
        this.playerX = playerInstances.x;
        this.playerO = playerInstances.o;
        this.playerTurn = this.playerX.symbol;
        this.board = boardInstance
    }
    setContainer(container) {
        this.gameContainer = container;

        let style = document.createElement('style');
        style.textContent = cssText;
        this.gameContainer.insertAdjacentElement('beforebegin', style);

        this.gameContainer.style.width = `${this.board.boardSize.width}px`;
        this.gameContainer.style.height = `${this.board.boardSize.width}px`;
    }
    changeTurn (currentTurn) {
        return currentTurn === this.playerX.symbol ? this.playerO.symbol : this.playerX.symbol;
    }
    onCellClick(e) {
        const selectedRow = e.target.getAttribute("data-row");
        const selectedCol = e.target.getAttribute("data-col");
        if (this.board.boardMap[selectedRow][selectedCol] !== this.board.INACTIVE) {
            return;
        }
        this.board.updateBoardMap(selectedRow, selectedCol, this.playerTurn);
        this.render();
        if (this.doesPlayerWin(this.playerTurn, this.board)) {
            this.board.disableBoard();
            this.alert(`${this.playerTurn} wins!`, this.gameContainer);
            this.showRestartButton();
        }
        if (this.doesTie(this.board)) {
            this.board.disableBoard();
            this.alert(`It's a tie!`, this.gameContainer);
            this.showRestartButton();
        }
        this.playerTurn = this.changeTurn(this.playerTurn);
    }
    doesPlayerWin(currentPlayer, board) {
        const checkHorizontal = (board, player) => {
            return board.boardMap.some((row) => {
                return row.every((col) => {
                    return col === player;
                });
            });
        }

        const checkVertical = (board, player) => {
            const transposedBoard = board.boardMap[0].map((col, i) => {
                return board.boardMap.map((row) => {
                    return row[i];
                });
            });

            return transposedBoard.some((row) => {
                return row.every((col) => {
                    return col === player;
                });
            });
        }

        const checkDiagonal = (board, player) => {
            const leftToRight = board.boardMap.every((row, i) => {
                return row[i] === player;
            });

            const rightToLeft = board.boardMap.every((row, i) => {
                return row[row.length - 1 - i] === player;
            });

            return leftToRight || rightToLeft;
        }

        return checkHorizontal(board, currentPlayer) || checkVertical(board, currentPlayer) || checkDiagonal(board, currentPlayer);
    }
    doesTie(board) {
        return board.boardMap.every((row) => {
            return row.every((col) => {
                return col !== board.INACTIVE;
            });
        });
    }
    showRestartButton() {
        const restartButton = document.createElement("button");
        restartButton.setAttribute("type", "button");
        restartButton.classList.add("restart");
        restartButton.innerHTML = "Restart";
        restartButton.addEventListener("click", () => {
            this.playerTurn = this.playerX.symbol;
            this.board = new Board({ x: 3, y: 3 }, "#eee", "#fafafa", {width: this.board.boardSize.width, height: this.board.boardSize.height});
            this.render();
        });
        this.gameContainer.appendChild(restartButton);
    }
    alert(message, container) {
        const el = document.createElement("div");
        el.classList.add("alert");
        el.innerHTML = message;
        container.appendChild(el);
    }
    render() {
        this.gameContainer.innerHTML = "";
        this.board.setCellListener(this.board.boardEls, this.onCellClick.bind(this))
        this.board.boardEls.forEach((row) => {
            this.gameContainer.appendChild(row);
        });
    }
}

window.game = { TicTacToe, Board, Player }
