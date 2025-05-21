// Defines the interface for AI strategies
export default class AIStrategy {
    constructor() {
        if (this.constructor === AIStrategy) {
            throw new Error("AIStrategy class is an abstract class and cannot be instantiated directly.");
        }
    }

    // boardState will be the this.board object from TicTacToe, 
    // which has methods like getAvailablePositions(), getCellValue(), etc.
    getMove(boardState) {
        throw new Error("Method 'getMove()' must be implemented.");
    }
}
