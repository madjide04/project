/*
// const { Chess } = require("./chess");


const chessBoard = document.querySelector("#chessboard");
const PlayerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#display-info");

// const io = require('socket.io')(server);




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

// //implement piece movements/attack pattern 
// const pawnMove = [[2,0],[1,0]]
// const pawnTake = [[1,-1],[1,1]]
// const bPawnMove = [[-2, 0], [-1, 0]];
// const bPawnTake = [[-1,-1],[-1,1]]
// const knightMove = [
//     [2, 1], [2, -1], [-2, 1], [-2, -1],
//     [1, 2], [1, -2], [-1, 2], [-1, -2]
// ];
// const bishopMove = [
//     // Up-Right
//     [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
//     // Up-Left
//     [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7],
//     // Down-Right
//     [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7],
//     // Down-Left
//     [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]
// ];
// const rookMove = [
//     // make castling possible later
//     // Move horizontally (left and right)
//     [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
//     [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7],
//     // Move vertically (up and down)
//     [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
//     [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]
// ];
// const queenMove = [
//     // Rook-like moves (horizontally and vertically)
//     [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
//     [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7],
//     [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
//     [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0],
//     // Bishop-like moves (diagonally)
//     [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
//     [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7],
//     [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7],
//     [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]
// ];
// const kingMove = [
//     [0, 1], [0, -1], [1, 0], [-1, 0], // Horizontal and vertical moves
//     [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonal moves
// ];


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

function createPromoter() {
        // create new square div in each start piece
        const promoter = document.createElement('div')
        promoter.classList.add('promoter')
        
        

        for(i=0;i<4;i++){
            const box = document.createElement('div')
            box.classList.add('box')
            box.classList.add('boardwhite')

            if (i===0){
                box.innerHTML = dummybKnight
                box.firstChild?.setAttribute("box-id",i)
            }
            if (i===1){
                box.innerHTML = dummybBishop
                box.firstChild?.setAttribute("box-id",i)
            }
            if (i===2){
                box.innerHTML = dummybRook
                box.firstChild?.setAttribute("box-id",i)
            }
            if (i===3){
                box.innerHTML = dummybQueen
                box.firstChild?.setAttribute("box-id",i)
            }
            box.firstChild.setAttribute("draggable",false)
            // box.firstChild.removeEventListener("dragover",dragOver)
            // box.firstChild.removeEventListener("drop",dragDrop)
            box.addEventListener("click",boxClicked)

            promoter.append(box)
        }  

        promoter.style.display = 'none';
        chessBoard.append(promoter)
    }

const game = new Chess()

createBoard()



// Connect to the server
const socket = io('http://' + document.domain + ':' + location.port);

// Test event listener
socket.on('testEvent', (data) => {
    console.log('Received testEvent from server:', data);
    // Check if the data received matches what you expect
});

// var socket = io();
socket.on('connect', function() {
    socket.emit('my event', {data: 'I\'m connected!'});
});

socket.on('my response', function(msg) {
    // Handle the response from the server
    console.log('Received:', msg.data);
});

// var socket = io();
socket.on('refresh', function(msg) {
    console.log("you clearly did a move :",msg.fen)
    game.load(msg.fen)
    resetBoard(parseboard(parseFEN(msg.fen).board))
    // socket.emit('my event', {data: 'I\'m connected!'});
});

// var socket = io();
socket.on('moving', function(msg) {
    console.log("you clearly did a move here: from",msg.move[0]+msg.move[1],", to :",msg.move[2]+msg.move[3],", promoted to a :",msg.move[4])
    game.move({ from: msg.move[0]+msg.move[1]
        , to:  msg.move[2]+msg.move[3], promotion:  msg.move[4] })
    console.log("and the new game fen after the ai moves is :",game.fen())
    resetBoard(parseboard(parseFEN(game.fen()).board))
    // socket.emit('my event', {data: 'I\'m connected!'});
});



// ////////////////////////////////////////////////////////////////////////////////////////////////////

// socket.on('bord_state', function(fen) { // f here is a fen string 
//     console.log("bord state fen :",fen)
//     // game.load(fen)
//     // resetBoard(parseboard(parseFEN(game.fen()).board)); 
// });

// socket.on('ai_move', function(move) { // f here is a san 
//     console.log("ai move :",move)
//     game.move(move)
    
//     resetBoard(parseboard(parseFEN(game.fen()).board)); 
// });


// function handleChessEvent(event, data) {
//     socket.send(JSON.stringify({ event: event, data: data }));
// }

// available events 
// handleChessEvent("fen", data)
// handleChessEvent("move" , JSON.stringify({fen:game.fen()}))
// handleChessEvent("move" , JSON.stringify({fen:game.fen()}))



// create set for all board squares

const allSquares = document.querySelectorAll("#chessboard .square" )


allSquares.forEach(square=>{
    //for each square run draggable events
    square.addEventListener("dragstart",dragStart)
    square.addEventListener("dragover",dragOver)
    square.addEventListener("drop",dragDrop)
})

let dummybRook = "", dummybKnight = "", dummybBishop = "", dummybQueen = "", dummybKing = "", dummybPawn = "", dummypawn = "", dummyrook = "", dummyknight = "", dummybishop = "", dummyqueen = "", dummyking = "";

allSquares.forEach((square, i) => {
    switch (i) {
        case 0:
            dummybRook = square.innerHTML;
            break;
        case 1:
            dummybKnight = square.innerHTML;
            break;
        case 2:
            dummybBishop = square.innerHTML;
            break;
        case 3:
            dummybQueen = square.innerHTML;
            break;
        case 4:
            dummybKing = square.innerHTML;
            break;
        case 8:
            dummybPawn = square.innerHTML;
            break;
        case 48:
            dummypawn = square.innerHTML;
            break;
        case 56:
            dummyrook = square.innerHTML;
            break;
        case 57:
            dummyknight = square.innerHTML;
            break;
        case 58:
            dummybishop = square.innerHTML;
            break;
        case 59:
            dummyqueen = square.innerHTML;
            break;
        case 60:
            dummyking = square.innerHTML;
            break;
        default:
            // Handle additional squares if needed
            break;
    }
});


createPromoter()


const promoter = document.querySelector("#chessboard .promoter")
const boxes = document.querySelectorAll("#chessboard .promoter .box")


// set global variables
let startPositionId
let dragedElement
let takenElement
let pdragged
let ptarget
let ppiece
let turn = "w"


const squareNames = {
    1: "a8",  2: "b8",  3: "c8",  4: "d8",  5: "e8",  6: "f8",  7: "g8",  8: "h8",
    9: "a7", 10: "b7", 11: "c7", 12: "d7", 13: "e7", 14: "f7", 15: "g7", 16: "h7",
   17: "a6", 18: "b6", 19: "c6", 20: "d6", 21: "e6", 22: "f6", 23: "g6", 24: "h6",
   25: "a5", 26: "b5", 27: "c5", 28: "d5", 29: "e5", 30: "f5", 31: "g5", 32: "h5",
   33: "a4", 34: "b4", 35: "c4", 36: "d4", 37: "e4", 38: "f4", 39: "g4", 40: "h4",
   41: "a3", 42: "b3", 43: "c3", 44: "d3", 45: "e3", 46: "f3", 47: "g3", 48: "h3",
   49: "a2", 50: "b2", 51: "c2", 52: "d2", 53: "e2", 54: "f2", 55: "g2", 56: "h2",
   57: "a1", 58: "b1", 59: "c1", 60: "d1", 61: "e1", 62: "f1", 63: "g1", 64: "h1"
};


const flippedSquareNames = {};
for (const key in squareNames) {
    const value = squareNames[key];
    flippedSquareNames[value] = parseInt(key);
}

console.log(flippedSquareNames);

function checkSquareId(element) {
    if (element?.getAttribute('square-id')) {
        return parseInt(element.getAttribute('square-id'))+1
    } else if (element?.parentNode?.getAttribute('square-id')) {
        return parseInt(element.parentNode.getAttribute('square-id'))+1
    } else {    
        return false
    }
}

function checkrank(element,rank) {
    if (parseInt(element?.getAttribute('square-id')) < (8-rank)*8+8 && parseInt(element?.getAttribute('square-id'))> (8-rank)*8-1) {
        return true
    } else if (parseInt(element?.parentNode?.getAttribute('square-id'))
        < (8-rank)*8+8 && parseInt(element?.parentNode?.getAttribute('square-id'))> (8-rank)*8-1) {
        return true
    } else {    
        return false
    }
}

function checkPromotion(dragged,target,turn,promoter){


    //try to move 
    //you move normally unless you are a pawn on the promote rank 
    //then you display the promoter and if the promoter is pressed
    // you make the move then continue to move where you were before 
    // pdragged = dragged
    // ptarget = target
    // console.log(promoter)
    // console.log()


    if (promoter?.style?.display === "flex"){
        console.log("you cant play while the promoter is on")
        return null
    }

    if (turn === "w") {
        if (dragged.classList[1]==="pawn" && checkrank(dragged,7) && checkrank(target,8) ){
            // now you have a pawn that is in the 8th rank which should make it promote to ?? 
            pdragged = squareNames[checkSquareId(dragged)]
            ptarget = squareNames[checkSquareId(target)]

            promoter.style.display = "flex"
            return null
        }
    } else if (turn === "b"){
        if (dragged.classList[1]==="bPawn" && checkrank(dragged,2) && checkrank(target,1)){
            pdragged = squareNames[checkSquareId(dragged)]
            ptarget = squareNames[checkSquareId(target)]
            // console.log("affected dragged :",dragged)
            // console.log("affected target :",target)
            
            // console.log("affected dragged  id:",checkSquareId(dragged))
            // console.log("affected target id:",checkSquareId(target))

            promoter.style.display = "flex"
            return null
        }
    }
    
    var current_move = game.move({ from: squareNames[checkSquareId(dragged)]
                    , to: squareNames[checkSquareId(target)] })

    console.log("ugly move:",squareNames[checkSquareId(dragged)]
                    +squareNames[checkSquareId(target)],"move :"
                    ,current_move)
    resetBoard(parseboard(parseFEN(game.fen()).board))
    challenge()
    return current_move
}

var options = { verbose: true };

function indicatorHelper(dragged){
    var possibleMoves = []
    var i=0
    game.moves(options).forEach(move=> {
        if(move.from===squareNames[checkSquareId(dragged)]){
            possibleMoves[i] = move.to 
            i++
        }
    })
    console.log("the indicator list",possibleMoves)
    return possibleMoves
}

function indicator(dragged){
    possibleMoves = []
    possibleMoves = indicatorHelper(dragged) // this returns :{}
    possibleMoves.forEach((move,i)=>{
        possibleMoves[i] = parseInt(flippedSquareNames[move])-1
    })
    // console.log("indicator squares 01 : ", flippedSquareNames['e1'])
    
    console.log("indicator squares : ", possibleMoves)
    doindicator(possibleMoves)
}

function boxClicked(e){
    console.log("box is clicked")
    console.log("the target is :",e.target)
    console.log("what piece is this ?  :",e.target.classList[1])
    // console.log("box dragged :",pdragged)
    // console.log("box target :",ptarget)
    
    // console.log("box dragged  id:",checkSquareId(pdragged))
    // console.log("box target id:",checkSquareId(ptarget))
    switch (e.target.classList[1]) {
        case "queen":
            ppiece = "q"
            
            break;
        case "rook":
            ppiece = "r"

            break;
        case "bishop":
            ppiece = "b"

            break;
        case "knight":
            ppiece = "n"

            break;
    
        default:
            break;
    }
    var current_move = game.move({ from: pdragged
        , to: ptarget, promotion: ppiece }) 
        console.log("from:", pdragged
        ,"to: ",ptarget,"promotion: ",ppiece)

    console.log("ugly move:",pdragged
        +ptarget,"move :"
        ,current_move)

    pdragged = ""
    ptarget = ""
    ppiece = ""

    promoter.style.display = "none"
    resetBoard(parseboard(parseFEN(game.fen()).board))

    challenge()
    return current_move
}

function checkpiece(element) {
    if (element?.classList[0]==="piece") {
        return true
    } else if (element.parentNode?.classList[0]==="piece") {
        return true
    } else if (element.firstChild?.classList[0]==="piece") {
        return true
    } else {    
        return false
    }
}

function removepiece(element) {
    if (element?.classList[0]==="piece") {
        element.remove();
    } else if (element.parentNode?.classList[0]==="piece") {
        element.parentNode.remove()
    } else if (element.firstChild?.classList[0]==="piece") {
        element.firstChild.remove()
    }
}
//used this before refreshing the whole board each time
function checksquare(element,draggedelement02) {
    if (element?.classList[0]==="square") {
        // console.log(checkpiece(element))// add code for when the target piece is not empty later 
        removepiece(element) // condition to check if target square is empty or not 
        element.append(draggedelement02)       
    } else if (element.classList[0]==="piece") {
        element.parentNode.append(draggedelement02)
        removepiece(element) // condition to check if target square is empty or not 
    }// else if (element.firstChild?.classList[0]==="piece") {
    //     return true
    // } else {    
    //     return false
    // }
}



function findKingSquare(fen) {
    // const chess = new Chess();
    // chess.load(fen); // Load the FEN notation representing the board position
    var kingSquare 
    // const boardpieces = parseboard(parseFEN(fen).board)
    const color = parseFEN(fen).turn
    allSquares.forEach((square,i)=>{
        if (color==="b"){
            if (square?.firstChild?.classList[1] === "king" && square?.firstChild?.firstChild?.classList[0] === "blackpiece") kingSquare = i
        } else if (color === "w"){
            if (square?.firstChild?.classList[1] === "king" && square?.firstChild?.firstChild?.classList[0] === "whitepiece") kingSquare = i
        }
    })
    // const kingSquare = Chess().king(color); // Get the square of the specified king
    return kingSquare;
}




//add this to the reset board and make it only aply at the end but after it checks if we are on 
// a check and at the begining it resets all the squares to normal color 
function dokingsquare(fen){
    const kingsquare = findKingSquare(fen) 
    console.log("the king square is :",kingsquare)
    
    
    // find the king square then change the class into a green
    //  one what is next you refresh everything after the turn and 
    // this only aply when there is check
    
    
    allSquares.forEach((square,i)=> {
        if (i===kingsquare){
            if (square.classList[1] === "boardwhite") {
                square.classList.add("incheckwhite")
                console.log("the king square is white")
            } else {
                square.classList.add("incheckblack")
                console.log("the king square is  black")
            }

        }
    })
}

function doindicator(possibleMoves){
    possibleMoves.forEach((move,j)=>{
        allSquares.forEach((square,i)=> {
            if (i===move){
                if (square.classList[1] === "boardwhite") {
                    square.classList.add("indicatedwhite")
                    console.log("an indicated square is white")
                } else {
                    square.classList.add("indicatedblack")
                    console.log("an indicated square is  black")
                }
    
            }
        })

    })
    
    
    
    // allSquares.forEach((square,i)=> {
    //     if (i===kingsquare){
    //         if (square.classList[1] === "boardwhite") {
    //             square.classList.add("incheckwhite")
    //             console.log("the king square is white")
    //         } else {
    //             square.classList.add("incheckblack")
    //             console.log("the king square is  black")
    //         }

    //     }
    // })
}

// function isincheck(){
//     Chess().in
// }


// boxes.forEach(box=>{
//     //for each square run draggable events
//     box.removeEventListener("dragstart")
//     box.addEventListener("click",boxClicked)
// })


function challenge(){
    opponent = chessBoard.getAttribute("opponent");
    room = chessBoard.getAttribute("room");
    console.log("Opponent :",opponent)
    console.log("Room :",room)
    if (opponent ==="bot") {
        //play against ai :
        console.log("game fen before emiting:",game.fen())
        if (game.turn() === "b"){
            tempfen = game.fen();
            console.log("tempfen:",tempfen,",room :",room)
            socket.emit('moving',{fen: tempfen, room: room});
        }
    } else if (opponent==="player") {
        //play against a player :
        tempfen = game.fen();
        socket.emit('refresh',{fen: tempfen, room: room});
    }
}



function resetBoard(boardpieces) {
    allSquares.forEach((square,i) => {
        square.classList.remove("indicatedwhite")
        square.classList.remove("indicatedblack")
        square.classList.remove("incheckwhite")
        square.classList.remove("incheckblack")
        
        square.innerHTML = boardpieces[i]
    })
    if (game.in_check()) {
        console.log("the kingsquare is found :",findKingSquare(game.fen()))
        dokingsquare(game.fen())  
    }
    gameEnd()
}
// allSquares.forEach(square,i=>{
//     //for each square run draggable events
//     square.firstChild().remove()
//     square.firstChild().append()
// })




// a function that parsesa  fen string and does something with it 
function parseFEN(fenString) {
    const parts = fenString.split(' ');
    const board = parts[0];
    const turn = parts[1];
    const castlingRights = parts[2];
    const enPassantSquare = parts[3];
    const halfmoveClock = parts[4];
    const fullmoveNumber = parts[5];

    return {
        board: board,
        turn: turn,
        castlingRights: castlingRights,
        enPassantSquare: enPassantSquare,
        halfmoveClock: halfmoveClock,
        fullmoveNumber: fullmoveNumber
    };
}

function parseboard(board){
    // Define an array to store the pieces
    const boardArray = [];
    for (let i = 0; i < 64; i++) boardArray[i] = ''
    // Iterate over each character of the board part
    let currentPiece = -1;
    let spaceCount = 0; // Start from the 8th rank (index 7) and move downward
    for (let i = 0; i < board.length; i++) {
        const char = board.charAt(i);
        if(char === "/") continue

        if (!isNaN(parseInt(char))) {
            
            spaceCount += parseInt(char);
            // console.log(spaceCount,"(#)",char)
        } else {

            const pieceValue = mapPiece(char);
            currentPiece += 1  ;
            const squareIndex = spaceCount + currentPiece;
            boardArray[squareIndex] = pieceValue;
            // console.log(squareIndex,"<=",char)
        }
    }

    return boardArray;

}

function mapPiece(pieceChar) {
    switch (pieceChar) {
        case 'P': return dummypawn; // White Pawn
        case 'N': return dummyknight; // White Knight
        case 'B': return dummybishop; // White Bishop
        case 'R': return dummyrook; // White Rook
        case 'Q': return dummyqueen; // White Queen
        case 'K': return dummyking; // White King
        case 'p': return dummybPawn; // Black Pawn
        case 'n': return dummybKnight; // Black Knight
        case 'b': return dummybBishop; // Black Bishop
        case 'r': return dummybRook; // Black Rook
        case 'q': return dummybQueen; // Black Queen
        case 'k': return dummybKing; // Black King
        default: return null; // Empty square
    }
}

function gameEnd(){
    if (game.in_checkmate()) {
        if (!(game.turn()==="b")){
            PlayerDisplay.innerHTML = "and the winner for this game is : Black"
        } else if (!(game.turn() === "w")){
            PlayerDisplay.innerHTML = "and the winner for this game is : White"
        }
    }
}





console.log(game)

//you now have to create the suggestions when you click on a piece or drag it idc 
// and you'd do that by searching on the dragstart 6function for whatever moves have
// the same from as the dragged element and then make a reversed dictionary that get's the 
// id of the square that  is  being suggested as a move 
// var options = { verbose: true };
console.log(game.moves(options))



console.log("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RnbQKBNR")
// console.log(parseFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RnbQKBNR").board)
// console.log(parseboard(parseFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RnbQKBNR").board))
console.log(promoter)
console.log(Chess().fen())

// console.log("the kingsquare is found :",findKingSquare(game.fen()))
// dokingsquare(game.fen())
// resetBoard(parseboard(parseFEN(game.fen()).board))
// console.log(parseboard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"))
game.move()
// Chess().KING()
// game.PlayerDisplay

// console.log(game.PlayerDisplay)







function dragStart(e){
    // console.log("Clicked square:", e.target);
    // console.log("Draggable attribute:", e.target.getAttribute("draggable"));
    // console.log("Is draggable:", e.target.draggable);
    //check if target is piece and not square
    if (e.target.classList[0] === "piece") {
        indicator(e.target)
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
    
    if (game.in_checkmate()) {
        console.log("game is in checkmate")
    }

    console.log("fen :", game.fen());
    // console.log("dropped square:", checkSquareId(e.target));
    // console.log("Draggable attribute:", e.target.getAttribute("draggable"));
    // console.log("Is draggable:", e.target.draggable);
    e.stopPropagation();

    
    // console.log("target:",e.target);
    // console.log("target  parent:",e.target.parentNode);
    // console.log("target child:",e.target.firstChild);
    
    // // console.log("dragged square:",checkSquareId(dragedElement))
    // console.log("dropped square:", e.target); // Output: "a8"
    // console.log("dragged square:",dragedElement); // Output: "h5


    // // // Example usage:
    // console.log("dropped square:", squareNames[checkSquareId(e.target)]); // Output: "a8"
    // console.log("dragged square:",squareNames[checkSquareId(dragedElement)]); // Output: "h5"

    
    


    // console.log(dragedElement);
    // console.log("is this the 8th rank ? :",checkrank(e.target))
    current_move = checkPromotion(dragedElement,e.target,parseFEN(game.fen()).turn,promoter)
    // console.log("promotion check:",current_move)
    // if (dragedElement.classList[1]==="pawn" && e.target)

    // var current_move = game.move({ from: squareNames[checkSquareId(dragedElement)]
    //                                         , to: squareNames[checkSquareId(e.target)] })

    // console.log("ugly move:",squareNames[checkSquareId(dragedElement)]
    //                 +squareNames[checkSquareId(e.target)],"move :"
    //                 ,current_move)


    //console.log(dragedElement.parentNode.classList)
    // console.log(e.target.parentNode.getAttribute('square-id'))
    // console.log(pawnMove[0])
    //console.log()

    //////////////////////  this  /////////////////////////////////
    // this wont work you need to reload the whole board
    // if (current_move) {
    //     // console.log("target :",e.target)
    //     // console.log("parent :",e.target.parentNode)
    //     // console.log("child :",e.target.firstChild)

    //     // console.log("dragged :",dragedElement)
    //     // console.log("parent :",dragedElement.parentNode)
    //     // console.log("child :",dragedElement.firstChild)
    //     console.log(checkpiece(e.target))// add code for when the target piece is not empty later        
    //     // // removepiece(e.target) // condition to check if target square is empty or not

    //     // checksquare(e.target,dragedElement)
    //     // e.target.append(dragedElement)
    // }
    
    // resetBoard(parseboard(parseFEN(game.fen()).board))
    // console.log(Chess().fen())
    // fent = Chess().fen()

    // console.log(game.fen())
    // console.log(findKingSquare(game.fen()))
    // console.log(parseFEN(fent).turn)
    // console.log(parseboard(parseFEN(fent).board))
    // console.log(parseboard(parseFEN(fent)))
    // console.log(findKingSquare(Chess().fen()))
    // console.log(mapPiece("r"))
    //console.log(dragedElement.classList.contains('pawn'))
    // console.log(dragedElement.classList)
    // console.log("the kingsquare is found :",findKingSquare(game.fen()))
    // dokingsquare(game.fen())    
    gameEnd() 
    // challenge()


    
    
}

// ////add in css the promoter to be positioned 
// //// position relative
// //// top -360
// add checkmate 
// add winner
// add taken pieces
// add sound
// add fen string loading support
// add posibility of playing using san
// add play again 
// add timer
//add on click 
//add other bots













///////////////// bugs :
// moving a piece to a promotion square displays it whether the move is legal or mot 
// when you do a wrong move it plays your turn next 
// when the promoter shows up and you choose a piece nothing happens 
// + i prefer to broadcast the refresh and not the moving 
//


















// what is in the game rn :
//create a board:

*/