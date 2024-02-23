const chessBoard = document.querySelector("#chessboard");
const PlayerDisplay = document.querySelector("#player");//not used yet
const infoDisplay = document.querySelector("#display-info")// not used yet
const width = 8 // set board width in squares
// import chessboard class from code

//set initial board position 
const startPieces = [
    bRook,bKnight,bBishop,bQueen,bKing,bBishop,bKnight,bRook,
    bPawn,bPawn,bPawn,bPawn,bPawn,bPawn,bPawn,bPawn,
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
    rook,knight,bishop,queen,king,bishop,knight,rook
]


//implement piece movements/attack pattern 
const pawnMove = [[2,0],[1,0]]
const pawnTake = [[1,-1],[1,1]]
const bPawnMove = [[-2, 0], [-1, 0]];
const bPawnTake = [[-1,-1],[-1,1]]
const knightMove = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
];
const bishopMove = [
    // Up-Right
    [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
    // Up-Left
    [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7],
    // Down-Right
    [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7],
    // Down-Left
    [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]
];
const rookMove = [
    // Move horizontally (left and right)
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
    [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7],
    // Move vertically (up and down)
    [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
    [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]
];
const queenMove = [
    // Rook-like moves (horizontally and vertically)
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
    [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7],
    [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
    [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0],
    // Bishop-like moves (diagonally)
    [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
    [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7],
    [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7],
    [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]
];
const kingMove = [
    [0, 1], [0, -1], [1, 0], [-1, 0], // Horizontal and vertical moves
    [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonal moves
];




function createBoard() {
    startPieces.forEach((startPiece,i) => {
        // create new square div in each start piece
        const square = document.createElement('div')
        square.classList.add('square')
        //inject svg in said div for initial position 
        square.innerHTML = startPiece
        // check if square is not empty then make it draggable
        square.firstChild?.setAttribute("draggable",true)
        // give every square unique id
        square.setAttribute("square-id",i)
        // color squares based on board position 
        if ((Math.floor(i / 8) + i) % 2===1) {
            square.classList.add('boardblack')
        } else {
            square.classList.add('boardwhite')
        }

        // Assigning "blackpiece" class to black pawns
        if (i >= 0 &&  i < 16) {
            square.firstChild.firstChild.classList.add("blackpiece");
        }
        // Assigning "whitepiece" class to white pawns
        if (i >= 48 && i < 64) {
            square.firstChild.firstChild.classList.add("whitepiece");
        }

        
       // add square to chessboard class
        chessBoard.append(square)
    })
}

createBoard();

// create set for all board squares
const allSquares = document.querySelectorAll("#chessboard .square" )


allSquares.forEach(square=>{
    //for each square run draggable events
    square.addEventListener("dragstart",dragStart)
    square.addEventListener("dragover",dragOver)
    square.addEventListener("drop",dragDrop)
})

// set global variables
let startPositionId
let dragedElement
let takenElement


function canMove(dragedClass,dragedId,droppedId){

    // Calculate the row and column
    const draggedRow = Math.floor(dragedId / width);
    const draggedColumn = dragedId % width;

    // Calculate the row and column
    const droppedRow = Math.floor(droppedId / width);
    const droppedColumn = droppedId % width;

    // column and row difference 
    const rowDiff = draggedRow-droppedRow
    const colDiff = draggedColumn-droppedColumn

    switch (dragedClass) {
        case "pawn":
            return (rowDiff === pawnMove[0][0] && colDiff === pawnMove[0][1] && draggedRow > 5) || 
                   (rowDiff === pawnMove[1][0] && colDiff === pawnMove[1][1]);
        case "bPawn":
            return (rowDiff === bPawnMove[0][0] && colDiff === bPawnMove[0][1] && draggedRow < 2) ||
                   (rowDiff === bPawnMove[1][0] && colDiff === bPawnMove[1][1]);
        case "knight":
            return knightMove.some(([row, col]) => row === rowDiff && col === colDiff);
        case "bishop":
            return bishopMove.some(([row, col]) => row === rowDiff && col === colDiff);
        case "rook":
            return rookMove.some(([row, col]) => row === rowDiff && col === colDiff);
        case "queen":
            return queenMove.some(([row, col]) => row === rowDiff && col === colDiff);
        case "king":
            return kingMove.some(([row, col]) => row === rowDiff && col === colDiff);
        default:
            return false;
    }
    

}

function canTake(dragedClass,dragedId,droppedId,dragedColor,droppedColor){
    if (dragedColor===droppedColor) {
        //check if enemy piece
        return false
    } else {
        // Calculate the row and column
        const draggedRow = Math.floor(dragedId / width);
        const draggedColumn = dragedId % width;

        // Calculate the row and column
        const droppedRow = Math.floor(droppedId / width);
        const droppedColumn = droppedId % width;
        
        // column and row difference 
        const rowDiff = draggedRow-droppedRow
        const colDiff = draggedColumn-droppedColumn

        switch (dragedClass) {
            case "pawn":
                // add en passant later
                return (rowDiff === pawnTake[0][0] && colDiff === pawnTake[0][1]) || 
                    (rowDiff === pawnTake[1][0] && colDiff === pawnTake[1][1]);
            case "bPawn":
                return (rowDiff === bPawnTake[0][0] && colDiff === bPawnTake[0][1]) ||
                    (rowDiff === bPawnTake[1][0] && colDiff === bPawnTake[1][1]);
            case "knight":
                return knightMove.some(([row, col]) => row === rowDiff && col === colDiff);
            case "bishop":
                return bishopMove.some(([row, col]) => row === rowDiff && col === colDiff);
            case "rook":
                return rookMove.some(([row, col]) => row === rowDiff && col === colDiff);
            case "queen":
                return queenMove.some(([row, col]) => row === rowDiff && col === colDiff);
            case "king":
                return kingMove.some(([row, col]) => row === rowDiff && col === colDiff);
            default:
                return false;    
        }    
    }
    
}

function dragStart(e){
    // console.log("Clicked square:", e.target);
    // console.log("Draggable attribute:", e.target.getAttribute("draggable"));
    // console.log("Is draggable:", e.target.draggable);
    //check if target is piece and not square
    if (e.target.classList[0]==="piece") {
        startPositionId = e.target.parentNode.getAttribute('square-id')
        dragedElement = e.target
    } else {
        //set draged to null to avoid moving last piece
        dragedElement = null
        e.stopPropagation()
    }
    
}

function dragOver(e){
    //remove updates from consolelog
    e.preventDefault()
}

function dragDrop(e){


    // console.log("Clicked square:", e.target);
    // console.log("Draggable attribute:", e.target.getAttribute("draggable"));
    // console.log("Is draggable:", e.target.draggable);
    e.stopPropagation();

    
    // console.log(dragedElement)
    //console.log(dragedElement.parentNode.classList)
    // console.log(e.target.parentNode.getAttribute('square-id'))
    // console.log(pawnMove[0])
    //console.log()
    
    
    if (dragedElement===null) {
        //check if dragged is empty 
        e.stopPropagation() 
    } else {
        if (e.target.children.length === 0 ) {
            //check if target is empty then use move funtion 
            const dragedId = dragedElement.parentNode.getAttribute('square-id')
            const dropedId = e.target.getAttribute('square-id')
            // console.log("---")
            // console.log(dragedId)
            // console.log(dropedId)
            ////
            // console.log(canMove(dragedElement.classList[1],dragedId,dropedId))
            //console.log(dragedElement.firstChild.classList)
            if (canMove(dragedElement.classList[1],dragedId,dropedId)) {
                // add logic for chen the path is blocked later
                e.target.append(dragedElement);
            }
        } else {
            //if dropped is full use take function
            //inplement pinned later
            const dragedId = dragedElement.parentNode.getAttribute('square-id')
            const dropedId = e.target.parentNode.getAttribute('square-id')
            const dragedColor = dragedElement.firstChild.classList[0]
            const droppedColor =  e.target.firstChild.classList[0]
            // console.log("---")
            // console.log(dragedId)
            // console.log(dropedId)
            //check if not the same square and if target piece is enemy and if move legal 
            if (e.target.parentNode.getAttribute('square-id') !== dragedElement.parentNode.getAttribute('square-id')
                 && canTake(dragedElement.classList[1], dragedId, dropedId,dragedColor ,droppedColor)) {
                //removed {e.target.parentNode &&} from condition because i cant remember what bug it caused 
                e.target.parentNode.append(dragedElement);
                e.target.remove();
            }            
        }
    }

    
    //console.log(dragedElement.classList.contains('pawn'))
    // console.log(dragedElement.classList)
}





