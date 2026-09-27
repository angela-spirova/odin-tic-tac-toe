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
            return true;
        }
        return false;
    }

    const threeMatchingCells = function(index1, index2, index3){
        if(cells[index1].getSymbol()==cells[index2].getSymbol()
        && cells[index1].getSymbol()==cells[index3].getSymbol()){
            return true;
        }
        return false;
    }

    return {
        cells,
        fillCell,
        fullBoard,
        threeMatchingCells
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
    
    
    const gameWon = function(index){
        index=+index;
        const row = Math.floor(index/3)+1;
        const column = (index%3)+1;

        const leftStep = column==1 ? 2 : -1; // if it's on the first column it wraps around to the right of the board
        const rightStep = column==3 ? -2 : 1; 
        
        if(gameboard.threeMatchingCells(index, index+leftStep, index+rightStep)){
            return true;
        }
        
        const upStep = row==1 ? 6 : -3;
        const downStep = row==3 ? -6 : 3;

        if(gameboard.threeMatchingCells(index, index+upStep, index+downStep)){
            return true;
        }

        if((column==2 && row==2) || (column!=2 || row!=2)){
            
            if(row==column){
                const majorDiagonalUpStep = column==1 ? 8 : -4;
                const majorDiagonalDownStep = column==3 ? -8 : 4;
                if(gameboard.threeMatchingCells(index, index+majorDiagonalUpStep, index+majorDiagonalDownStep)){
                    return true;
                }
            }
            else{
                const minorDiagonalUpStep = row==1 ? 4 : -2;
                const minorDiagonalDownStep = row==3 ? -4 : 2;
                if(gameboard.threeMatchingCells(index, index+minorDiagonalUpStep, index+minorDiagonalDownStep)){
                    return true;
                }
            }
        }
        return false;
    }

    const playGame = function(){
        let player;
        let symbol;
        while(!isGameOver()){
            player = players[_currentPlayerIndex];
            symbol = player.getSymbol();
            let index = prompt("where to place");
            console.log(index);
            while(!gameboard.fillCell(index, symbol)){
                index = prompt("where to place");
                console.log(index);
            }
            displayController.updateDisplay(gameboard);
            if(gameWon(index) || gameboard.fullBoard()){
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