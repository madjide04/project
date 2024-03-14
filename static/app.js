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

const socket =  new WebSocket('ws://' + window.location.host + '/websocket');
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
    // make castling possible later
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

function calcRC(id) {
    const draggedRow = Math.floor(id / width);
    const draggedColumn = id % width;
    return [ draggedRow, draggedColumn ];
}

function calcId(row,col) {
    return row*8+col
}

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
        const [ draggedRow, draggedColumn ] = calcRC(dragedId);

        // Calculate the row and column
        const [ droppedRow, droppedColumn ] = calcRC(droppedId);
        
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

function checkN(draggedRow, draggedColumn, droppedRow) {
    let clearPath = true;
    for (let index = parseInt(draggedRow) - 1; index > parseInt(droppedRow); index--) {
        allSquares.forEach((square, i) => {
            if (i === calcId(index, draggedColumn) && square.firstChild && square.firstChild.classList[0] === "piece") {
                console.log(square.firstChild.classList[0], "i:", i, "/index: ", index, "/dropped row:", droppedRow);
                clearPath = false;
            }
        });
    }
    return clearPath;
}

function checkS(draggedRow, draggedColumn, droppedRow) {
    let clearPath = true;
    for (let index = parseInt(draggedRow) + 1; index < parseInt(droppedRow); index++) {
        allSquares.forEach((square, i) => {
            if (i === calcId(index, draggedColumn) && square.firstChild && square.firstChild.classList[0] === "piece") {
                console.log(square.firstChild.classList[0], "i:", i, "/index: ", index, "/dropped row:", droppedRow);
                clearPath = false;
            }
        });
    }
    return clearPath;
}

function checkE(draggedRow, draggedColumn, droppedColumn) {
    let clearPath = true;
    for (let index = parseInt(draggedColumn) + 1; index < parseInt(droppedColumn); index++) {
        allSquares.forEach((square, i) => {
            if (i === calcId(draggedRow, index) && square.firstChild && square.firstChild.classList[0] === "piece") {
                console.log(square.firstChild.classList[0], "i:", i, "/index:", index, "/Dropped Column:", droppedColumn);
                clearPath = false;
            }
        });
    }
    return clearPath;
}

function checkW(draggedRow, draggedColumn, droppedColumn) {
    let clearPath = true;
    for (let index = parseInt(draggedColumn) - 1; index > parseInt(droppedColumn); index--) {
        allSquares.forEach((square, i) => {
            if (i === calcId(draggedRow, index) && square.firstChild && square.firstChild.classList[0] === "piece") {
            console.log(square.firstChild.classList[0], "i:", i, "/index:", index, "/Dropped Column:", droppedColumn);
            clearPath = false;
        }
    });
}
    return clearPath;
}

function checkAxis(draggedRow, draggedColumn, droppedRow, droppedColumn) {
    // Determine the direction of movement
    if (draggedRow === droppedRow) {
        // Horizontal movement
        if (draggedColumn < droppedColumn) {
            return checkE(draggedRow, draggedColumn, droppedColumn);
        } else {
            return checkW(draggedRow, draggedColumn, droppedColumn);
        }
    } else if (draggedColumn === droppedColumn) {
        // Vertical movement
        if (draggedRow < droppedRow) {
            return checkS(draggedRow, draggedColumn, droppedRow);
        } else {
            return checkN(draggedRow, draggedColumn, droppedRow);
        }
    } else {
        // Diagonal movement (assuming only vertical and horizontal movements are allowed)
        console.log("Diagonal movement is not supported.");
        return true;
    }
}

function checkNE(draggedRow, draggedColumn, droppedRow) {
    let clearPath = true;
    for (let index = parseInt(draggedRow) - 1; index > parseInt(droppedRow); index--) {
        allSquares.forEach((square, i) => {
            if (i === calcId(index, draggedColumn+(draggedRow-index)) && square.firstChild && square.firstChild.classList[0] === "piece") {
                console.log(square.firstChild.classList[0], "i:", i, "/index: ", index, "/dropped row:", droppedRow);
                clearPath = false;
            }
        });
    }
    return clearPath;
}

function checkNW(draggedRow, draggedColumn, droppedRow) {
    let clearPath = true;
    for (let index = parseInt(draggedRow) - 1; index > parseInt(droppedRow); index--) {
        allSquares.forEach((square, i) => {
            if (i === calcId(index, draggedColumn-(draggedRow-index)) && square.firstChild && square.firstChild.classList[0] === "piece") {
                console.log(square.firstChild.classList[0], "i:", i, "/index: ", index, "/dropped row:", droppedRow);
                clearPath = false;
            }
        });
    }
    return clearPath;
}

function checkSE(draggedRow, draggedColumn, droppedRow) {
    let clearPath = true;
    for (let index = parseInt(draggedRow) + 1; index < parseInt(droppedRow); index++) {
        allSquares.forEach((square, i) => {
            if (i === calcId(index, draggedColumn+(index-draggedRow)) && square.firstChild && square.firstChild.classList[0] === "piece") {
                console.log(square.firstChild.classList[0], "i:", i, "/index: ", index, "/dropped row:", droppedRow);
                clearPath = false;
            }
        });
    }
    return clearPath;
}

function checkSW(draggedRow, draggedColumn, droppedRow) {
    let clearPath = true;
    for (let index = parseInt(draggedRow) + 1; index < parseInt(droppedRow); index++) {
        allSquares.forEach((square, i) => {
            if (i === calcId(index, draggedColumn-(index-draggedRow)) && square.firstChild && square.firstChild.classList[0] === "piece") {
                console.log(square.firstChild.classList[0], "i:", i, "/index: ", index, "/dropped row:", droppedRow);
                clearPath = false;
            }
        });
    }
    return clearPath;
}

// function checkNW(draggedRow, draggedColumn, droppedRow) {
//     let clearPath = true;
//     for (let index = parseInt(draggedColumn) - 1; index > parseInt(droppedColumn); index--) {
//         allSquares.forEach((square, i) => {
//             if (i === calcId(draggedRow-(draggedColumn-index), index) && square.firstChild && square.firstChild.classList[0] === "piece") {
//                 console.log(square.firstChild.classList[0], "i:", i, "/index:", index, "/Dropped Column:", droppedColumn);
//                 clearPath = false;
//             }
//         });
//     }
//     return clearPath;
// }

// function checkSW(draggedRow, draggedColumn, droppedColumn) {
//     let clearPath = true;
//     for (let index = parseInt(draggedRow) + 1; index < parseInt(droppedRow); index++) {
//         allSquares.forEach((square, i) => {
//             if (i === calcId(index, draggedColumn-(index-draggedRow)) && square.firstChild && square.firstChild.classList[0] === "piece") {
//                 console.log(square.firstChild.classList[0], "i:", i, "/index: ", index, "/dropped row:", droppedRow);
//                 clearPath = false;
//             }
//         });
//     }
//     return clearPath;
// }

// function checkSE(draggedRow, draggedColumn, droppedColumn) {
//     let clearPath = true;
//     for (let index = parseInt(draggedColumn) + 1; index < parseInt(droppedColumn); index++) {
//         allSquares.forEach((square, i) => {
//             if (i === calcId(draggedRow+(index-draggedColumn), index) && square.firstChild && square.firstChild.classList[0] === "piece") {
//                 console.log(square.firstChild.classList[0], "i:", i, "/index:", index, "/Dropped Column:", droppedColumn);
//                 clearPath = false;
//             }
//         });
//     }
//     return clearPath;
// }



function checkDiagonal(draggedRow, draggedColumn, droppedRow, droppedColumn) {
    if (Math.abs(droppedRow - draggedRow) !== Math.abs(droppedColumn - draggedColumn)) {
        console.log("Invalid diagonal movement: Rows and columns must change by the same amount.");
        return false;
    }

    if (droppedRow < draggedRow && droppedColumn < draggedColumn) {
        console.log("chose NW");
        return checkNW(draggedRow, draggedColumn, droppedRow);
    } else if (droppedRow < draggedRow && droppedColumn > draggedColumn) {
        console.log("chose NE");
        return checkNE(draggedRow, draggedColumn, droppedRow);
    } else if (droppedRow > draggedRow && droppedColumn < draggedColumn) {
        console.log("chose SW");
        return checkSW(draggedRow, draggedColumn, droppedRow);
    } else if (droppedRow > draggedRow && droppedColumn > draggedColumn) {
        console.log("chose SE");
        return checkSE(draggedRow, draggedColumn, droppedRow);
    }
}

function checkPath(draggedRow, draggedColumn, droppedRow, droppedColumn) {
    // Check if it's diagonal movement
    if (Math.abs(droppedRow - draggedRow) === Math.abs(droppedColumn - draggedColumn)) {
        // Diagonal movement
        if (droppedRow < draggedRow && droppedColumn < draggedColumn) {
            console.log("chose NW");
            return checkNW(draggedRow, draggedColumn, droppedRow);
        } else if (droppedRow < draggedRow && droppedColumn > draggedColumn) {
            console.log("chose NE");
            return checkNE(draggedRow, draggedColumn, droppedRow);
        } else if (droppedRow > draggedRow && droppedColumn < draggedColumn) {
            console.log("chose SW");
            return checkSW(draggedRow, draggedColumn, droppedRow);
        } else if (droppedRow > draggedRow && droppedColumn > draggedColumn) {
            console.log("chose SE");
            return checkSE(draggedRow, draggedColumn, droppedRow);
        }
    } else {
        // Axis movement
        if (draggedRow === droppedRow) {
            // Horizontal movement
            if (draggedColumn < droppedColumn) {
                return checkE(draggedRow, draggedColumn, droppedColumn);
            } else {
                return checkW(draggedRow, draggedColumn, droppedColumn);
            }
        } else if (draggedColumn === droppedColumn) {
            // Vertical movement
            if (draggedRow < droppedRow) {
                return checkS(draggedRow, draggedColumn, droppedRow);
            } else {
                return checkN(draggedRow, draggedColumn, droppedRow);
            }
        } else {
            console.log("Invalid movement: Only vertical, horizontal, or diagonal movements are allowed.");
            return false;
        }
    }
}



function clearPath(dragedClass,dragedId,droppedId){
    // clearPat = true

    // Calculate the row and column
    const [ draggedRow, draggedColumn ] = calcRC(dragedId);

    // Calculate the row and column
    const [ droppedRow, droppedColumn ] = calcRC(droppedId);

    // console.log("-",droppedId,"-")
    
    // return checkN(draggedRow, draggedColumn, droppedRow)
    // return checkAxis(draggedRow, draggedColumn, droppedRow, droppedColumn)
    // // column and row difference 
    // const rowDiff = draggedRow-droppedRow
    // const colDiff = draggedColumn-droppedColumn

    switch (dragedClass) {
        case "pawn" :
            return checkN(draggedRow, draggedColumn, droppedRow)
        case "bPawn":
            return checkS(draggedRow, draggedColumn, droppedRow)
    //     case "knight":
    //         return knightMove.some(([row, col]) => row === rowDiff && col === colDiff);
        case "bishop":
            return checkDiagonal(draggedRow, draggedColumn, droppedRow, droppedColumn)
        case "rook":
            return checkAxis(draggedRow, draggedColumn, droppedRow, droppedColumn)
        case "queen":
            return checkPath(draggedRow, draggedColumn, droppedRow, droppedColumn)
    //     case "king":
    //         return kingMove.some(([row, col]) => row === rowDiff && col === colDiff);
        default:
            return true;
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
function handleChessEvent(event, data) {
    socket.send(JSON.stringify({ event: event, data: data }));
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
            if (canMove(dragedElement.classList[1],dragedId,dropedId)&& clearPath(dragedElement.classList[1], dragedId, dropedId)) {
                // add logic for chen the path is blocked later
                // console.log(clearPath(dragedElement.classList[1], dragedId, dropedId))

               handleChessEvent("move" , dropedId);
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
                 && canTake(dragedElement.classList[1], dragedId, dropedId,dragedColor ,droppedColor) && clearPath(dragedElement.classList[1], dragedId, dropedId)) {
                //removed {e.target.parentNode &&} from condition because i cant remember what bug it caused 
                
                const { droppedRow, droppedColumn } = calcRC(dragedId);
                const { draggedRow, draggedColumn } = calcRC(dragedId);

                console.log(clearPath(dragedElement.classList[1], dragedId, dropedId,dragedColor))

                handleChessEvent("move" , dropedId);
                e.target.parentNode.append(dragedElement);
                
                e.target.remove();

            }            
        }
    }

    
    //console.log(dragedElement.classList.contains('pawn'))
    // console.log(dragedElement.classList)
}





