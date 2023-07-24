export default class Board {
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