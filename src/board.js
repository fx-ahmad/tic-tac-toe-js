export default class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.INACTIVE = 0;
        this.boardMap = this._initializeBoardMap();
    }

    _initializeBoardMap() {
        const map = [];
        for (let r = 0; r < this.rows; r++) {
            map[r] = [];
            for (let c = 0; c < this.cols; c++) {
                map[r][c] = this.INACTIVE;
            }
        }
        return map;
    }

    setCellValue(row, col, value) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.boardMap[row][col] = value;
        } else {
            console.error("Invalid cell coordinates for setCellValue:", row, col);
        }
    }

    getCellValue(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.boardMap[row][col];
        }
        console.error("Invalid cell coordinates for getCellValue:", row, col);
        return undefined;
    }

    isCellEmpty(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.boardMap[row][col] === this.INACTIVE;
        }
        // Return true for out-of-bounds cells to prevent trying to place marks there,
        // or handle as an error, depending on desired game logic.
        // For now, logging error and returning true as if it's "empty" but unusable.
        console.error("Invalid cell coordinates for isCellEmpty:", row, col);
        return false; // Or true, depending on how external logic should treat out-of-bounds
    }

    getAvailablePositions() {
        const availablePositions = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.boardMap[r][c] === this.INACTIVE) {
                    availablePositions.push([r, c]);
                }
            }
        }
        return availablePositions;
    }

    getBoardMap() {
        return this.boardMap;
    }

    getRows() {
        return this.rows;
    }

    getCols() {
        return this.cols;
    }

    logBoardMap() {
        console.log(JSON.parse(JSON.stringify(this.boardMap)));
    }
}