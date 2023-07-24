# Tic-Tac-Toe Widget

Add tic tac toe game to your website with this simple widget. 

## Installation

JS file can be downloaded from [here](https://devtest.my.id/downloads/tic-tac-toe.min.js)

## Usage

```javascript
        var game = new game.TicTacToe(
            { x: new game.Player("X", false, 0), o: new game.Player("O", true, 0) },
            new game.Board({ x: 3, y: 3 }, "#eee", "#fafafa", {width: 200, height: 200}),
        );

        game.setContainer(document.getElementById("widget"));
        game.render();
```

## Demo
Visit [this link](https://devtest.my.id/tic-tac-toe/) to see the demo. 