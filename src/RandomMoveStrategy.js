import AIStrategy from './AIStrategy.js';

export default class RandomMoveStrategy extends AIStrategy {
    constructor() {
        super();
    }

    // boardState is an instance of the Board class
    getMove(boardState) {
        const availablePositions = boardState.getAvailablePositions();
        if (availablePositions.length === 0) {
            return null; // Or throw an error, though this case should be handled by game logic before calling
        }
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        return availablePositions[randomIndex]; // Returns [row, col]
    }
}
