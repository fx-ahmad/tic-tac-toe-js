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
            this.board = new Board({ x: 3, y: 3 }, "#eee", "#fafafa");
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

class Board {
    constructor(size, bgBlack, bgWhite) {
        this.INACTIVE = 0;
        this.bgBlack = bgBlack;
        this.bgWhite = bgWhite;
        this.boardMap = this.build2DArray(size.x, size.y);
        this.boardEls = this.buildElement(this.boardMap, this.bgBlack, this.bgWhite);
    }
    /**
     * 
     * @param {number} rows 
     * @param {number} cols 
     * @returns 2D array based on rows and cols
     */
    build2DArray(rows, cols, currRow = 0, currCol = 0, result = []) {
        // enough rows, return the result
        if (currRow == rows) {
            return result;
        }

        // initialize the row
        if (!result[currRow]) {
            result[currRow] = [];
        }

        // set the value
        result[currRow][currCol] = this.INACTIVE;

        // if we are at the end of the column, go to the next row
        if (currCol === cols - 1) {
            return this.build2DArray(rows, cols, currRow + 1, 0, result);
        }

        // else, go to the next column
        return this.build2DArray(cols, rows, currRow, currCol + 1, result);
    }

    /**
     * 
     * @param {Array} _boardMap 2D array of the board
     * @param {String} _bgWhite Hex color code for white
     * @param {String} _bgBlack Hex color code for black
     * @returns 2D array of the board elements
     */

    buildElement(_boardMap, _bgWhite, _bgBlack) {
        const boardEls = _boardMap.map((row, rowIndex) => {
            const rowEl = document.createElement("div");
            rowEl.classList.add("row");

            row.forEach((col, colIndex) => {
                const colEl = document.createElement("button");
                colEl.setAttribute("type", "button");
                colEl.classList.add("col");
                colEl.classList.add("inactive");
                colEl.setAttribute("data-row", rowIndex);
                colEl.setAttribute("data-col", colIndex);
                colEl.style.backgroundColor =
                    (rowIndex + colIndex) % 2 === 0 ? _bgWhite : _bgBlack;
                colEl.innerHTML = col != 0 ? col : "";
                rowEl.appendChild(colEl);
            });

            return rowEl;
        });

        return boardEls;
    }

    setCellListener(boardEls, listener) {
        boardEls.forEach((row) => {
            row.childNodes.forEach((col) => {
                col.addEventListener("click", listener);
            });
        });
    }

    updateBoardMap(row, col, value) {
        this.boardMap[row][col] = value;
        this.boardEls = this.buildElement(this.boardMap, this.bgBlack, this.bgWhite)
        this.logBoardMap()
    }

    logBoardMap() {
        console.log(this.boardMap);
    }

    disableBoard() {
        this.boardEls.forEach((row) => {
            row.childNodes.forEach((col) => {
                col.disabled = true;
            });
        });
    }
}

class Player {
    constructor(symbol, isComputer, score) {
        this.symbol = symbol;
        this.isComputer = isComputer;
        this.score = score;
        this.positions = [];
    }

    addPosition(position) {
        this.positions.push(position);
    }
}

// Usage
const game = new TicTacToe(
    {
        x: new Player("X", false, 0),
        o: new Player("O", false, 0),
    },
    new Board({ x: 3, y: 3 }, "#eee", "#fafafa")
);

game.setContainer(document.getElementById("app"));
game.render();
