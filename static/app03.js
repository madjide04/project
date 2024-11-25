const chessBoard = document.querySelector("#chessboard");
const PlayerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#display-info");


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

// the player X has connected to the server 
socket.on('connect', function() {
    // console.log(msg.name, msg.message);
    socket.emit('my event', {data: 'I\'m connected!'});
});

// emote
socket.on('my response', function(msg) {
    console.log('Received:', msg.data);
    challenge()
});

// get a message from the server as a fen (usualy against a player)
socket.on('refresh', function(msg) {
    game.load(msg.fen)
    resetBoard(parseboard(parseFEN(msg.fen).board),msg.to,msg.from)
});

// get a move from the server (against an ai)
socket.on('moving', function(msg) {
    console.log("you clearly did a move here: from",msg.move[0]+msg.move[1],", to :",msg.move[2]+msg.move[3],", promoted to a :",msg.move[4])
    game.move({ from: msg.move[0]+msg.move[1]
        , to:  msg.move[2]+msg.move[3], promotion:  msg.move[4] })
    resetBoard(parseboard(parseFEN(game.fen()).board))
});

//send a copy of the captured piece to the opponent
socket.on('captured',function(msg){
    var takenwhite = document.querySelector(".takenleft");
    var takenblack = document.querySelector(".takenright");
    
    if ("w" ===msg.color) {
        takenblack.innerHTML += (msg.piece)
    } else{
        takenwhite.innerHTML += (msg.piece)
    }
})

// get a message from the server as a fen (usualy against a player)
socket.on('reset', function() {
    resetgame(broadcasted=true)
});



const allSquares = document.querySelectorAll("#chessboard .square" )

allSquares.forEach(square=>{
    //for each square run draggable events
    square.addEventListener("dragstart",dragStart)
    square.addEventListener("dragover",dragOver)
    square.addEventListener("drop",dragDrop)
    square.addEventListener("click", function(e) {
        if (clicknbr === 0) {
            clickone(e);
        } else if (clicknbr === 1){
            clicktwo(e);
        }
    });
    // square.addEventListener("click",clicktwo)
})

let dummybRook = "", dummybKnight = "", dummybBishop = "", dummybQueen = ""
    , dummybKing = "", dummybPawn = "", dummypawn = "", dummyrook = ""
    , dummyknight = "", dummybishop = "", dummyqueen = "", dummyking = "";
let turn = chessBoard.getAttribute("color");
let name01 = chessBoard.getAttribute("namer");
let botcolor = turn === 'w' ? 'b' : 'w';
console.log("turn is :",turn,",bot color is :",botcolor)
// let opponent = chessBoard.getAttribute("opponent");
// let hardness = chessBoard.getAttribute("hardness");
let halfmoveCount = 0
let startPositionId
let lasttakenpiece
let lastmovenumber
let dragedElement
let takenElement
let movefromtmp  = ""
let movetotmp = ""
let pdragged
let ptarget
let ppiece
let clicknbr = 0

// get a message from the server as a fen (usualy against a player)
socket.on('name', function() {
    // room = room
    // name01 = name01
    console.log('set the name for: ' ,turn," to : ",name01)
    namechanger(name01,turn)
    socket.emit('namer', {room: room,name:name01,color:turn});
    // a funct that when called changes the name to this 
    // and broadcasts it to the rest 
    // resetgame(broadcasted=true)
});

socket.on('namer', function(msg) {
    // room = room
    // name01 = name01
    console.log('set the namer for: ' ,msg.color," to : ",msg.name)
    namechanger(msg.name,msg.color)
    // socket.emit('namer', {room: room,name:name01,color:color});
    // a funct that when called changes the name to this 
    // and broadcasts it to the rest 
    // resetgame(broadcasted=true)
});


const takenRightElement = document.querySelector('.takenleft');
const takenLeftElement = document.querySelector('.takenright');

// Change the CSS variable --label-content based on the condition
if (turn === 'b') {
    takenRightElement.style.setProperty('--label-content', `"${name01}"`);
} else {
    takenRightElement.style.setProperty('--label-content', '"right"');
}

if (turn === 'w') {
    takenLeftElement.style.setProperty('--label-content', `"${name01}"`);
} else {
    takenLeftElement.style.setProperty('--label-content', '"left"');
}

function namechanger(name,color){
    if (color === 'b') {
        takenRightElement.style.setProperty('--label-content', `"${name}"`);
    } else if (color ==="w"){
        takenLeftElement.style.setProperty('--label-content', `"${name}"`);
    }
}

/*

*/

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

// takes square? and returns id if possible
function checkSquareId(element) {
    if (element?.getAttribute('square-id')) {
        return parseInt(element.getAttribute('square-id'))+1
    } else if (element?.parentNode?.getAttribute('square-id')) {
        return parseInt(element.parentNode.getAttribute('square-id'))+1
    } else {    
        return false
    }
}

//
function getSquareId(element) {
    if (element?.getAttribute('square-id')) {
        return parseInt(element.getAttribute('square-id'))
    } else if (element?.parentNode?.getAttribute('square-id')) {
        return parseInt(element.parentNode.getAttribute('square-id'))
    } else {    
        return false
    }
}

//takes rank and calculate if piece is in same rank
function checkrank(element,rank) {
    if (parseInt(element?.getAttribute('square-id')) < (8-rank)*8+8 
            && parseInt(element?.getAttribute('square-id'))> (8-rank)*8-1) {
        return true
    } else if (parseInt(element?.parentNode?.getAttribute('square-id')) < (8-rank)*8+8 
            && parseInt(element?.parentNode?.getAttribute('square-id'))> (8-rank)*8-1) {
        return true
    } else {    
        return false
    }
}

//move and if this can result in promotion 
function checkPromotion(dragged,target,turn,promoter){

    if (promoter?.style?.display === "flex"){
        console.log("you cant play while the promoter is on")
        return null
    }

    if (turn === "w") {
        if (dragged.classList[1]==="pawn" && checkrank(dragged,7) && checkrank(target,8) ){
            pdragged = squareNames[checkSquareId(dragged)]
            ptarget = squareNames[checkSquareId(target)]

            promoter.style.display = "flex"
            return null
        }

    } else if (turn === "b"){
        if (dragged.classList[1]==="bPawn" && checkrank(dragged,2) && checkrank(target,1)){
            pdragged = squareNames[checkSquareId(dragged)]
            ptarget = squareNames[checkSquareId(target)]

            promoter.style.display = "flex"
            return null
        }
    }
    
    var current_move = game.move({ from: squareNames[checkSquareId(dragged)]
                    , to: squareNames[checkSquareId(target)] })

    resetBoard(parseboard(parseFEN(game.fen()).board))
    challenge()
    return current_move
}

//to return prettier moves
var options = { verbose: true };

//returns an array of possible moves from a square
function indicatorHelper(dragged){
    var possibleMoves = []
    var i=0
    game.moves(options).forEach(move=> {
        if(move.from===squareNames[checkSquareId(dragged)]){
            possibleMoves[i] = move.to 
            i++
        }
    })
    return possibleMoves
}

//color squares by indicated
function doindicator(possibleMoves){
    possibleMoves.forEach((move)=>{
        allSquares.forEach((square,i)=> {
            if (i===move){
                if (square.classList[1] === "boardwhite") {
                    square.classList.add("indicatedwhite")
                } else {
                    square.classList.add("indicatedblack")
                }
            }
        })
    })
}

//reverse map squares by id and color them
function indicator(dragged){
    possibleMoves = []
    possibleMoves = indicatorHelper(dragged)
    possibleMoves.forEach((move,i)=>{
        possibleMoves[i] = parseInt(flippedSquareNames[move])-1
    })
    
    doindicator(possibleMoves)
}

//if promoter is on move previous move with the sufix on click
function boxClicked(e){
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

    pdragged = ""
    ptarget = ""
    ppiece = ""

    promoter.style.display = "none"
    resetBoard(parseboard(parseFEN(game.fen()).board))
    challenge()
    return current_move
}

//is piece ?
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

//store the king square index
function findKingSquare(fen) {
    var kingSquare 
    
    const color = parseFEN(fen).turn
    allSquares.forEach((square,i)=>{
        if (color==="b"){
            if (square?.firstChild?.classList[1] === "king" && square?.firstChild?.firstChild?.classList[0] === "blackpiece") kingSquare = i
        } else if (color === "w"){
            if (square?.firstChild?.classList[1] === "king" && square?.firstChild?.firstChild?.classList[0] === "whitepiece") kingSquare = i
        }
    })
    
    return kingSquare;
}

//color king square
function dokingsquare(fen){
    const kingsquare = findKingSquare(fen) 
    
    allSquares.forEach((square,i)=> {
        if (i===kingsquare){
            if (square.classList[1] === "boardwhite") {
                square.classList.add("incheckwhite")
            } else {
                square.classList.add("incheckblack")
            }
        }
    })
}

//color lastmove
function lastmove(moveto=null,movefrom=null){
    console.log('lastmove called by parameters :',movefrom , moveto)
    gamehistory = game.history({verbose:true})
    move = gamehistory.pop()
    if(move){
        movefrom = flippedSquareNames[move.from]-1
        movefromtmp = movefrom
        moveto = flippedSquareNames[move.to]-1
        movetotmp = moveto
        console.log("last move 01 is :",move)
        console.log('move from:',movefrom,', move to:',moveto)
        allSquares.forEach((square,i)=> {
            
            if (i===movefrom) {
                square.classList.add("movedfrom")
            } else if (i===moveto){
                square.classList.add("movedto")
            }
            
        })
    } else if ((moveto !== null && movefrom !== null)) {
        console.log("last move 02 is :",move)
        console.log('move from:',movefrom,', move to:',moveto)
        allSquares.forEach((square,i)=> {
            
            if (i===parseInt(movefrom)) {
                square.classList.add("movedfrom")
            } else if (i===parseInt(moveto)){
                square.classList.add("movedto")
            }
            
        })
    } else {
        console.log("none of these moves got colored")
    }
}

//shows taken pieces
function takenpiece(){
    var takenwhite = document.querySelector(".takenleft");
    var takenblack = document.querySelector(".takenright");
    
    room = chessBoard.getAttribute("room");

    gamehistory = game.history({verbose:true})
    console.log("game history :",gamehistory)
    move = gamehistory.pop()
    comparison = JSON.stringify(move) === JSON.stringify(lasttakenpiece)
    /*
    something i swrong with this it is redoing  apiece after capture

    so lets start first you sa]ve whatever divs you're working on 
    then you initialize your working variables, in here we have 
    last move on history 
    move number to pass the first pop
    captured piece
    turn to capitalize the capturer
    you start by poping the last move and work on it by checking
    if it contains a capture if it does then you set your capture
    to it and compare the moce to the previous move if theyre not 
    identical you inject html and save the current move as the last 
    and theoretically we're good 

    */
    
    movenumber = parseInt(parseFEN(game.fen()).fullmoveNumber)
    if(movenumber>1){
        if (move?.captured) {
            captured =move.captured
            if (game.turn() ==="w") {
                captured = captured.charAt(0).toUpperCase()
            }
            if (comparison)  {
            } else {
                if (game.turn() ==="w") {
                    takenblack.innerHTML += (mapPiece(captured))
                } else{
                    takenwhite.innerHTML += (mapPiece(captured))
                }
                socket.emit('captured',{piece: mapPiece(captured), color: game.turn(), room: room});
                lasttakenpiece=move
            }
        }
    }
}

//used in resetgame to record the wins
function incrementCounter(gameState) {
    fetch('/increment-counter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameState: gameState })
    })
    .then(response => response.json())
    .then(data => {
        console.log("\n\ncounter :",data.counter,"\n\n");
    })
    .catch(error => console.error('Error:', error));
}

//resets board to the given fen and removes all colors 
function resetBoard(boardpieces,moveto=null,movefrom=null) {
    allSquares.forEach((square,i) => {
        square.classList.remove("indicatedwhite")
        square.classList.remove("indicatedblack")
        square.classList.remove("incheckwhite")
        square.classList.remove("incheckblack")
        square.classList.remove("movedfrom")
        square.classList.remove("movedto")

        square.innerHTML = boardpieces[i]
    })
    if ((moveto !== null && movefrom !== null)) {
        lastmove(moveto=moveto,movefrom=movefrom)
    } else {
        lastmove()
    }
        
    if (game.in_check()) {
        dokingsquare(game.fen())  
    }
    takenpiece()
    gameEnd()
}

//pick what opponent are you facing
function challenge(){
    opponent = chessBoard.getAttribute("opponent");
    hardness = chessBoard.getAttribute("hardness");
    room = chessBoard.getAttribute("room");
    // console.log("challenging the oppomemt : " ,opponent)

    // console.log("case 1 " ,opponent)
    if (opponent ==="our ai") {
        // console.log("case 1 " ,opponent)
        if (game.turn() === botcolor){
            tempfen = game.fen();
            socket.emit('moving',{fen: tempfen, room: room,opponent:opponent,hardness:hardness});
        }
    } else if (opponent==="player") {
        // console.log("case 2 " ,opponent)
        tempfen = game.fen();
        socket.emit('refresh',{fen: tempfen, room: room,to:movetotmp,from:movefromtmp});
    } else if (opponent ==="RodentIV") {
        // console.log("case 3 " ,opponent)
        console.log("RODENT IS PALYIINNG")
        if (game.turn() === botcolor){
            tempfen = game.fen();
            socket.emit('moving',{fen: tempfen, room: room,opponent:opponent,hardness:hardness});
        }
    } else if (opponent === "Stockfish") {
        // console.log("case 4 " ,opponent)
        console.log("STOCKFISH IS PALYIINNG")
        if (game.turn() === botcolor){
            tempfen = game.fen();
            socket.emit('moving',{fen: tempfen, room: room,opponent:opponent,hardness:hardness});
        }
    }
    // console.log("case 5 " ,opponent)
}


//split a fen to an array
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

//creates an array of pieces based on a fen board
function parseboard(board){
    const boardArray = [];
    for (let i = 0; i < 64; i++) boardArray[i] = ''

    let currentPiece = -1;
    let spaceCount = 0; 
    
    for (let i = 0; i < board.length; i++) {
        const char = board.charAt(i);
        if(char === "/") continue

        if (!isNaN(parseInt(char))) {
            spaceCount += parseInt(char);
        } else {
            const pieceValue = mapPiece(char);
            currentPiece += 1  ;
            const squareIndex = spaceCount + currentPiece;
            boardArray[squareIndex] = pieceValue;
        }
    }

    return boardArray;
}

//take a letter and return coresponding piece html
function mapPiece(pieceChar) {
    switch (pieceChar) {
        case 'P': return dummypawn; 
        case 'N': return dummyknight;
        case 'B': return dummybishop; 
        case 'R': return dummyrook; 
        case 'Q': return dummyqueen;
        case 'K': return dummyking; 
        case 'p': return dummybPawn;
        case 'n': return dummybKnight;
        case 'b': return dummybBishop;
        case 'r': return dummybRook; 
        case 'q': return dummybQueen;
        case 'k': return dummybKing; 
        default: return null; 
    }
}

//say who won at the end of the game
function gameEnd(){
    if (game.in_checkmate()) {
        if (turn === game.turn()) {
            incrementCounter(3)
        } else {
            incrementCounter(1)
        }
        var gameoverDiv = document.querySelector(".gameover");
        
        gameoverDiv.style.display = "flex";

        // Get the winner span
        var winnerSpan = document.querySelector(".winner");


        if (!(game.turn()==="b")){
            winnerSpan.innerHTML = "Black"
        } else if (!(game.turn() === "w")){
            
            winnerSpan.innerHTML = "White"
        }
    }else if (game.game_over()) {
        incrementCounter(2)
        
        var gameoverDiv = document.querySelector(".gameover");
        
        var winnerdiv = document.querySelector("#winner");
        
        gameoverDiv.style.display = "flex";
        winnerdiv.innerHTML = "DRAW"
        
    }

}

//
function resetgame(broadcasted=false){
    game.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    resetBoard(parseboard(parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').board))
    
    var gameoverDiv = document.querySelector(".gameover");
    var takenwhite = document.querySelector(".takenleft");
    var takenblack = document.querySelector(".takenright");
    
    room = chessBoard.getAttribute("room");
    
        
    gameoverDiv.style.display = "none";

    takenblack.innerHTML = ""
    
    takenwhite.innerHTML = ""

    if (broadcasted) {
        
    } else {
        socket.emit("reset",{room: room});
    }
    challenge() 
}
/*
var gameoverDiv = document.querySelector(".gameover");

// Get the winner span
var winnerSpan = document.querySelector(".winner");

// Function to show the gameover div
function showGameOver(winner) {
    gameoverDiv.style.display = "block";
    // Set the winner text and color based on the turn
    if (winner === "white") {
        winnerSpan.textContent = "White";
        winnerSpan.style.color = "white";
    } else {
        winnerSpan.textContent = "Black";
        winnerSpan.style.color = "black";
    }
}

*/

//
function dragStart(e){
    if (game.turn() === turn){

        if (e.target.classList[0] === "piece") {
            indicator(e.target)
            startPositionId = e.target.parentNode.getAttribute('square-id')
            dragedElement = e.target
        } else {
            dragedElement = null
            e.stopPropagation()
        }
    } else {
        console.log("NOT your turn")
    }
}

//
function dragOver(e){
    e.preventDefault()
}

//
function dragDrop(e){
    if (game.turn() === turn){
        if (game.in_checkmate()) {
            return
        }
        
        e.stopPropagation();
        
        current_move = checkPromotion(dragedElement,e.target,parseFEN(game.fen()).turn,promoter)
    } else {
        console.log("NOT your turn")
    }
}

//
function canmove(){

/*
i click on a piece if clicknbr is 0 i remove all green then indicate as green i check
if something is green i set clicknbr to 1 i click on a piece 
if clicknumber is 1 i check if clicked-id is indicated if yes
i continue if not i call clickone

*/
    
    var indicatedblack = document.querySelector(".indicatedblack");
    var indicatedwhite = document.querySelector(".indicatedwhite");
    console.log(indicatedblack)
    console.log(indicatedwhite)
    console.log('possible move? :',indicatedblack? true : indicatedwhite? true : false)
    return indicatedblack? true : indicatedwhite? true : false
}

/*

var indicatedblack = document.querySelector(".indicatedblack");
var indicatedwhite = document.querySelector(".indicatedwhite");
console.log(indicatedblack)
console.log(indicatedwhite)
console.log('possible move? :',indicatedblack? true : indicatedblack? true : false)


var indicatedelem = getIndicatedElement(startPositionId)
console.log("the indicated element",indicatedelem)

*/

//
function isSquareIndicated(squareId) {
    // Check for indicated white
    var indicatedWhiteSquare = document.querySelector('.square.boardwhite.indicatedwhite[square-id="' + squareId + '"]');
    
    
    // Check for indicated black if indicated white not found
    if (!indicatedWhiteSquare) {
        // If indicated black square found, return true
        var indicatedBlackSquare = document.querySelector('.square.boardblack.indicatedblack[square-id="' + squareId + '"]');
        return indicatedBlackSquare ? true : false;
    }
    
    // If indicated white square found, return true
    return true;
}

//
function clickone(e){
    if (game.turn() === turn){
        console.log("wow")
        console.log("click one has been initiated")
    
        allSquares.forEach((square) => {
            square.classList.remove("indicatedwhite")
            square.classList.remove("indicatedblack")
        })
    
        if (e.target.classList[0] === "piece") {
            indicator(e.target)
            startPositionId = e.target.parentNode.getAttribute('square-id')
            dragedElement = e.target
        } else {
            dragedElement = null
        }
        clicknbr = canmove()? 1 : 0
        // clicknbr = isSquareIndicated(startPositionId)?  1 : 0
        console.log("clicked number :",clicknbr)

    } else {
        console.log("NOT your turn")
    }
}

//
function clicktwo(e){
    
    
    if (game.turn() === turn){
        console.log("click two has been initiated!!!")
    
        clickedsquare = getSquareId(e.target)
        console.log("clicked square is :",clickedsquare)
        clicknbr =  0
        
        if (isSquareIndicated(clickedsquare)){
            if (game.turn() === turn){
                if (game.in_checkmate()) {
                    return
                }
                
                
                current_move = checkPromotion(dragedElement,e.target,parseFEN(game.fen()).turn,promoter)
            } else {
                console.log("NOT your turn")
            }
            
        } else {
            clickone(e)
        }

    } else {
        console.log("NOT your turn")

    }
}
challenge()
/*
lastmove
use.history{verbose}.pop then color square 
use this in resetboard


add takenpieces


add name's turn 

*/