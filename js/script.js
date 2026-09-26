function Gameboard(){
    function Cell(){
        let _symbol = null;
        const isEmpty = () => _symbol == null;
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
    
    const fillCell = function(index, symbol){
        if(index<0 || index>8){
            throw RangeError("Invalid array index");
        }
        if(cells[index].isEmpty()){
            return ;
        }
        cells[index].setSymbol(symbol);
    }

    return {
        cells,
        fillCell
    };
}

function Player(symbol){
    const _symbol = symbol;
    const _name = _symbol // temp
    const getSymbol = () => _symbol;
    const getName = () => _name;
    return {
        getSymbol,
        getName
    }
}