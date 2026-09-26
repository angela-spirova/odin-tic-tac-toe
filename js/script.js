function Gameboard(){
    function Cell(){
        let _symbol="-";
        const isEmpty = () => _symbol == "-";
        const getSymbol = () => _symbol;
        const setSymbol = function(symbol){
            _symbol = symbol;
        }
        return {
            isEmpty,
            getSymbol,
            setSymbol
        }
    }
    
    const cells = new Array();
    for(let i=0; i<9; i++){
        cells.push(new Cell());
    }
    let _freeCells = 9;
    const fullBoard = () => _freeCells==0;
    const fillCell = function(index, symbol){
        if(cells[index].isEmpty()){
            cells[index].setSymbol(symbol);
            _freeCells--;
            console.log(_freeCells);
        }
    }
    return {
        cells,
        fillCell,
        fullBoard
    };
}

function Player(symbol){
    const _symbol = symbol;
    let _name = _symbol // temp
    const getSymbol = () => _symbol;
    const getName = () => _name;
    return {
        getSymbol,
        getName
    }
}

function DisplayController(){
    const updateDisplay = function(gameboard){
        let str = new String;
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                str+=gameboard.cells[i*3+j].getSymbol();
            }
            str+="\n";
        }

        console.log(str);

    }

    const displayResults = function(winner){
        if(winner==null){
            console.log("it's a tie!");
        }else{
            console.log(`${winner.getName()} is the winner!`)
        }
    }
    return {
        updateDisplay,
        displayResults
    }
}

function GameController(){
    const players = new Array();
    players.push(new Player("X"));
    players.push(new Player("O"));

    const gameboard = new Gameboard();
    const displayController = new DisplayController();

    let _currentPlayerIndex = 0;
    let _gameOver = false;
    let _winner = null;

    const changePlayer = function(){
        _currentPlayerIndex = (_currentPlayerIndex+1)%2;
    }

    const endGame = function(){
        _gameOver = true;
    }

    const isGameOver = () => _gameOver;

    const setWinner = function(winner){
        _winner = winner;
    }
    
    const gameWon = function(){
        return false; // temp
    }

    const playGame = function(){
        let player;
        let symbol;
        while(!isGameOver()){
            player = players[_currentPlayerIndex];
            symbol = player.getSymbol();
            const index = prompt("where to place");
            console.log(index);
            gameboard.fillCell(index, symbol);
            displayController.updateDisplay(gameboard);
            if(gameWon() || gameboard.fullBoard()){
                endGame();
            }else{
                changePlayer();
            }
        }
        setWinner(player);
        displayController.displayResults(_winner);
    }


    return {
        playGame,
        gameboard
    }
}

const game = new GameController();