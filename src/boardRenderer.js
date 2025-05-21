export default class BoardRenderer {
    constructor(board, boardDOMContainer, bgBlack, bgWhite, boardPixelSize) {
        this.board = board; // Board instance
        this.boardDOMContainer = boardDOMContainer; // HTML element to render in
        this.bgBlack = bgBlack;
        this.bgWhite = bgWhite;
        this.boardPixelSize = boardPixelSize; // e.g., { width: 300, height: 300 }
        
        // This will store the actual DOM elements for each cell button
        this.cellElements = []; // Initialize as a flat list or 2D array

        // Initial rendering of the board structure
        this._buildInitialBoardDOM();
    }

    _buildInitialBoardDOM() {
        this.boardDOMContainer.innerHTML = ''; // Clear previous content
        this.boardDOMContainer.style.width = `${this.boardPixelSize.width}px`;
        this.boardDOMContainer.style.height = `${this.boardPixelSize.height}px`;
        // Ensure the container itself is set up for grid or flex if rows are added directly
        // Or manage rows as separate divs if needed by main.css styling

        const rows = this.board.getRows();
        const cols = this.board.getCols();
        this.cellElements = []; // Reset if building fresh

        for (let r = 0; r < rows; r++) {
            const rowEl = document.createElement("div");
            rowEl.classList.add("row");
            // If cellElements is to be 2D: this.cellElements[r] = [];

            for (let c = 0; c < cols; c++) {
                const cellEl = document.createElement("button");
                cellEl.style.width = this.boardPixelSize.width / cols + "px";
                cellEl.style.height = this.boardPixelSize.height / rows + "px";
                cellEl.setAttribute("type", "button");
                cellEl.classList.add("col", "inactive"); // Start as inactive
                cellEl.setAttribute("data-row", r);
                cellEl.setAttribute("data-col", c);
                cellEl.style.backgroundColor = (r + c) % 2 === 0 ? this.bgWhite : this.bgBlack;
                cellEl.innerHTML = ""; // Empty initially

                rowEl.appendChild(cellEl);
                // If cellElements is 2D: this.cellElements[r][c] = cellEl;
                // If cellElements is flat:
                this.cellElements.push(cellEl); 
            }
            this.boardDOMContainer.appendChild(rowEl);
        }
    }

    render() {
        // This method updates the display based on the Board's current state
        const rows = this.board.getRows();
        const cols = this.board.getCols();
        let cellElementIndex = 0; // Used if cellElements is a flat list

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cellValue = this.board.getCellValue(r, c);
                // const cellEl = this.cellElements[r][c]; // If 2D
                const cellEl = this.cellElements[cellElementIndex++]; // If flat

                if (!cellEl) {
                    console.error(`Cell element not found at [${r},${c}] during render.`);
                    continue;
                }
                
                cellEl.innerHTML = cellValue !== this.board.INACTIVE ? cellValue : "";
                if (cellValue !== this.board.INACTIVE) {
                    cellEl.classList.remove("inactive");
                    cellEl.classList.add("active"); // Or some other class based on value
                } else {
                    cellEl.classList.add("inactive");
                    cellEl.classList.remove("active");
                }
            }
        }
    }
    
    // Method to update a single cell's display
    // This is more efficient than a full re-render if only one cell changes
    updateCellDisplay(row, col) {
        const cellValue = this.board.getCellValue(row, col);
        const cols = this.board.getCols();
        const cellEl = this.cellElements[row * cols + col]; // Calculate index for flat list

        if (!cellEl) {
            console.error(`Cell element not found at [${row},${col}] for updateCellDisplay.`);
            return;
        }

        cellEl.innerHTML = cellValue !== this.board.INACTIVE ? cellValue : "";
        if (cellValue !== this.board.INACTIVE) {
            cellEl.classList.remove("inactive");
            cellEl.classList.add("active"); 
        } else {
            cellEl.classList.add("inactive");
            cellEl.classList.remove("active");
        }
    }


    setCellClickListener(listener) {
        this.cellElements.forEach(cellEl => {
            cellEl.addEventListener("click", listener);
        });
    }

    disableBoardCells() {
        this.cellElements.forEach(cellEl => {
            cellEl.disabled = true;
        });
    }

    enableBoardCells() {
        this.cellElements.forEach(cellEl => {
            cellEl.disabled = false;
        });
    }
}
