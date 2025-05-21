export default class Player {
    constructor(symbol, isComputer = false, score = 0, aiStrategy = null) {
        this.symbol = symbol;
        this.isComputer = isComputer;
        this.score = score;
        // this.positions = []; // This was in the original, seems unused, can be removed or kept if planned for future
        
        if (this.isComputer && !aiStrategy) {
            throw new Error("Computer player must be configured with an AI strategy.");
        }
        this.aiStrategy = aiStrategy;
    }

    // computerTurn now delegates to the strategy
    // boardState is an instance of the Board class
    computerTurn(boardState) {
        if (!this.isComputer || !this.aiStrategy) {
            // This should ideally not be reached if constructor enforces strategy for AI players
            console.error("Player is not a computer or no AI strategy set.");
            return null; 
        }
        return this.aiStrategy.getMove(boardState); // Expects [row, col]
    }

    // Optional: A way to update strategy if needed, though typically set at construction
    setAIStrategy(strategy) {
        if (this.isComputer) {
            this.aiStrategy = strategy;
        } else {
            console.warn("Cannot set AI strategy for a human player.");
        }
    }
}