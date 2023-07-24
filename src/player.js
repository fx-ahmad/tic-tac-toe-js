export default class Player {
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