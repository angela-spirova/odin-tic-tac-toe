function Gameboard(){
    function Cell(){
        let _symbol="";
        const isEmpty = () => _symbol == "";
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
    const isFullBoard = () => _freeCells==0;
    const fillCell = function(index, symbol){
        if(cells[index].isEmpty()){
            cells[index].setSymbol(symbol);
            _freeCells--;
            return true;
        }
        return false;
    }

    const cellIsEmpty = function(index){
        return cells[index].getSymbol() == "";
    }

    const threeMatchingCells = function(index1, index2, index3){
        if(cells[index1].getSymbol()==cells[index2].getSymbol()
        && cells[index1].getSymbol()==cells[index3].getSymbol()){
            return true;
        }
        return false;
    }

    const emptyBoard = function(){
        for(let i=0; i<9; i++){
            cells[i].setSymbol("");
        }
        _freeCells=9;
    }

    return {
        fillCell,
        isFullBoard,
        emptyBoard,
        threeMatchingCells,
        cellIsEmpty
    };
}

function DisplayController(){
    const gameboardDisplay = document.getElementById("gameboard");
    const results = document.getElementById("results");
    const gameOverDisplay = document.getElementById("game-over");
    const placeMarker = function(cell, symbol){
        cell.innerText = symbol;
    }

    const displayResults = function(isTie, winnerName){
        gameboardDisplay.classList.add("game-over");
        gameOverDisplay.style.visibility="visible";
        if(isTie){
            results.innerText="It's a tie!";
            return ;
        }
        results.innerText = `${winnerName} wins!`;
    }

    const resetDisplay = function(){
        gameboardDisplay.classList.remove("game-over");
        gameOverDisplay.style.visibility="hidden";
        const cellDisplays = gameboardDisplay.children;
        [...cellDisplays].forEach(cell => {
            cell.innerText="";
        });
    }

    return {
        displayResults,
        placeMarker,
        resetDisplay
    }
}

function GameController(){
    function Player(symbol){
        const _symbol = symbol;
        let _name;
        const getSymbol = () => _symbol;
        const getName = () => _name;
        const setName = function(name=_symbol){
            if(name==""){
                _name=_symbol;
                return ;
            }
            _name=name;
        }
        return {
            getSymbol,
            getName,
            setName
        }
    }
    const players = new Array();
    players.push(new Player("X"));
    players.push(new Player("O"));

    const gameboard = new Gameboard();
    const displayController = new DisplayController();

    let _currentPlayerIndex = 0;
    let _gameOver = false;
    let _winner = null;

    const setPlayerNames = function(player1Name, player2Name){
        players[0].setName(player1Name);
        players[1].setName(player2Name);
    }

    const changePlayer = function(){
        _currentPlayerIndex = (_currentPlayerIndex+1)%2;
    }

    const endGame = function(isTie){
        _gameOver = true;
        const winnerName = (_winner == null) ? null : _winner.getName();
        displayController.displayResults(isTie, winnerName);
    }

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

        if((column==2 && row==2) || (column!=2 && row!=2)){
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

    const playTurn = function(cell){
        const index = Number(cell.getAttribute('data-index'));
        if(!gameboard.cellIsEmpty(index)){
            return ;
        }
        const player = players[_currentPlayerIndex];
        const symbol = player.getSymbol();
        gameboard.fillCell(index,symbol);

        displayController.placeMarker(cell, symbol);

        if(gameWon(index)){
            setWinner(player);
            endGame(false);
        } 
        else if(gameboard.isFullBoard()){
            endGame(true);
        }else{
            changePlayer();
        }
    }

    const resetGame = function(){
        _currentPlayerIndex = 0;
        _gameOver = false;
        _winner = null;
        gameboard.emptyBoard();
        displayController.resetDisplay();
    }
    return {
        setPlayerNames,
        playTurn,
        resetGame
    }
}

function ScreenController(){
    const game = new GameController();
    const gameboardDisplay = document.getElementById("gameboard");
    gameboardDisplay.addEventListener('click', (event) => {
        if(!event.target.classList.contains('cell')){
            return;
        }
        const cell = event.target;
        game.playTurn(cell);
    });

    const initialDialog = document.getElementById("before-game");
    const playerNameForm = document.forms["player-names"];
    playerNameForm.addEventListener('submit', (event)=>{
        gameboardDisplay.classList.remove('game-not-started');
        const player1Name = playerNameForm.p1name.value;
        const player2Name = playerNameForm.p2name.value;
        game.setPlayerNames(player1Name, player2Name);
        initialDialog.close();
        event.preventDefault();
    });
    const resetButton = document.getElementById("reset-game");
    resetButton.addEventListener('click', () =>{
        game.resetGame();
    });
}

ScreenController();