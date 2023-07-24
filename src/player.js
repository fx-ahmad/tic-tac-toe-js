export default class Player {
    constructor(symbol, isComputer, score) {
        this.symbol = symbol;
        this.isComputer = isComputer;
        this.score = score;
        this.positions = [];
    }

    // TODO: implement minimax algorithm
    computerTurn(board) {
        if (!this.isComputer) {
            return;
        }
        const availablePositions = board.getAvailablePositions();
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        const randomPosition = availablePositions[randomIndex];
        return randomPosition;
    }
}