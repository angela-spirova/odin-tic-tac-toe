function Gameboard(){
    function Cell(){
        let _symbol = " ";
        const getSymbol = function(){
            return _symbol;
        }
        const setSymbol = function(symbol){
            _symbol = symbol;
        }
        return {
            getSymbol,
            setSymbol
        }
    }

    const cells = new Array();
    for(let i=0; i<6; i++){
        cells.push(new Cell());
    }

    const fillCell = function(index, symbol){
        cells[index].setSymbol(symbol);
    }

    return {
        cells,
        fillCell
    };
}