const chessBoard = document.querySelector("#chessboard");
const PlayerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#display-info")
const width = 8

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

function createBoard() {
    startPieces.forEach((startPiece,i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute("draggable",true)
        square.setAttribute("square-id",i)
        if ((Math.floor(i / 8) + i) % 2===1) {
            square.classList.add('boardblack')
        } else {
            square.classList.add('boardwhite')
        }

        // Assigning "black-piece" class to black pawns
        if (i >= 0 &&  i < 16) {
            square.firstChild.firstChild.classList.add("blackpiece");
        }
        // Assigning "white-piece" class to white pawns
        if (i >= 48 && i < 64) {
            square.firstChild.firstChild.classList.add("whitepiece");
        }

        
       
        chessBoard.append(square)
    })
}

createBoard();


const allSquares = document.querySelectorAll("#chessboard .square" )


allSquares.forEach(square=>{
    square.addEventListener("dragstart",dragStart)
    square.addEventListener("dragover",dragOver)
    square.addEventListener("drop",dragDrop)
})

let startPositionId
let dragedElement


function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id')
    dragedElement = e.target
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    e.stopPropagation();

    // Check if the square is empty (does not contain any child elements)
    if (e.target.children.length === 0) {
        // Square is empty, append dragedElement to the square
        e.target.append(dragedElement);
    } else {
        // Square is not empty, append dragedElement to the parent node of the square and remove the square
        if (e.target.parentNode) {
            e.target.parentNode.append(dragedElement);
            e.target.remove();
        }
    }
}





