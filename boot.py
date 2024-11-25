
import chess
import chess.polyglot
from chess.polyglot import zobrist_hash
import random
import time 
import chess.svg
board = chess.Board()
pawnValue = 100
knightValue = 300
bishopValue = 300
rookValue = 500
queenValue = 900
kingValue = 10000
piece_values = {
    chess.PAWN: 1,
    chess.KNIGHT: 2,
    chess.BISHOP: 3,
    chess.ROOK: 4,
    chess.QUEEN: 5,
    chess.KING: 6 # Assuming the king's value is negligible for this purpose
}

mvv_lva = [
    [0, 0, 0, 0, 0, 0, 0],    # victim None, attacker None, P, N, B, R, Q, K
    [0, 15, 14, 13, 12, 11, 10],  # victim P, attacker None, P, N, B, R, Q, K
    [0, 25, 24, 23, 22, 21, 20],  # victim N, attacker None, P, N, B, R, Q, K
    [0, 35, 34, 33, 32, 31, 30],  # victim B, attacker None, P, N, B, R, Q, K
    [0, 45, 44, 43, 42, 41, 40],  # victim R, attacker None, P, N, B, R, Q, K
    [0, 55, 54, 53, 52, 51, 50],  # victim Q, attacker None, P, N, B, R, Q, K
    [0, 0, 0, 0, 0, 0, 0]     # victim K, attacker None, P, N, B, R, Q, K

]
# Create a dictionary from the nested list

mvv_lva_dict = {}
for victim_idx, row in enumerate(mvv_lva):
    for attacker_idx, value in enumerate(row):
        mvv_lva_dict[(victim_idx, attacker_idx)] = value

bpawn_piece_square_table = [
100, 100, 100, 100, 100, 100, 100, 100,
150, 150, 150, 150, 150, 150, 150, 150, 
110, 110, 120, 130, 130, 120, 110, 110, 
105, 105, 110, 125, 125, 110, 105, 105,
100, 100, 100, 120, 120, 100, 100, 100, 
105, 95, 90, 100, 100, 90, 95, 105,
105, 110, 110, 80, 80, 110, 110, 105,
100, 100, 100, 100, 100, 100, 100, 100
]


pawn_piece_square_table = [
100, 100, 100, 100, 100, 100, 100, 100, 
105, 110, 110, 80, 80, 110, 110, 105, 
105, 95, 90, 100, 100, 90, 95, 105, 
100, 100, 100, 120, 120, 100, 100, 100, 
105, 105, 110, 125, 125, 110, 105, 105, 
110, 110, 120, 130, 130, 120, 110, 110, 
150, 150, 150, 150, 150, 150, 150, 150, 
100, 100, 100, 100, 100, 100, 100, 100
]


# print(list(reversed(pawn_piece_square_table)))


bknight_piece_square_table = [
270, 280, 290, 290, 290, 290, 280, 270, 
280, 300, 320, 320, 320, 320, 300, 280, 
290, 320, 330, 335, 335, 330, 320, 290, 
290, 325, 335, 340, 340, 335, 325, 290, 
290, 320, 335, 340, 340, 335, 320, 290, 
290, 325, 330, 335, 335, 330, 325, 290, 
280, 300, 320, 325, 325, 320, 300, 280, 
270, 280, 290, 290, 290, 290, 280, 270
]


knight_piece_square_table = [
270, 280, 290, 290, 290, 290, 280, 270, 
280, 300, 320, 325, 325, 320, 300, 280, 
290, 325, 330, 335, 335, 330, 325, 290, 
290, 320, 335, 340, 340, 335, 320, 290, 
290, 325, 335, 340, 340, 335, 325, 290, 
290, 320, 330, 335, 335, 330, 320, 290, 
280, 300, 320, 320, 320, 320, 300, 280, 
270, 280, 290, 290, 290, 290, 280, 270
]


bbishop_piece_square_table = [
310, 320, 320, 320, 320, 320, 320, 310, 
320, 330, 330, 330, 330, 330, 330, 320, 
320, 330, 335, 340, 340, 335, 330, 320, 
320, 335, 335, 340, 340, 335, 335, 320, 
320, 330, 340, 340, 340, 340, 330, 320, 
320, 340, 340, 340, 340, 340, 340, 320, 
320, 335, 330, 330, 330, 330, 335, 320, 
310, 320, 320, 320, 320, 320, 320, 310
]


bishop_piece_square_table = [
310, 320, 320, 320, 320, 320, 320, 310, 
320, 335, 330, 330, 330, 330, 335, 320, 
320, 340, 340, 340, 340, 340, 340, 320, 
320, 330, 340, 340, 340, 340, 330, 320, 
320, 335, 335, 340, 340, 335, 335, 320, 
320, 330, 335, 340, 340, 335, 330, 320, 
320, 330, 330, 330, 330, 330, 330, 320, 
310, 320, 320, 320, 320, 320, 320, 310
]


brook_piece_square_table = [
500, 500, 500, 500, 500, 500, 500, 500, 
505, 510, 510, 510, 510, 510, 510, 505, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
500, 500, 500, 505, 505, 500, 500, 500
]

rook_piece_square_table = [
500, 500, 500, 505, 505, 500, 500, 500, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
495, 500, 500, 500, 500, 500, 500, 495, 
505, 510, 510, 510, 510, 510, 510, 505, 
500, 500, 500, 500, 500, 500, 500, 500
]

bqueen_piece_square_table = [
880, 890, 890, 895, 895, 890, 890, 880, 
890, 900, 900, 900, 900, 900, 900, 890, 
890, 900, 905, 905, 905, 905, 900, 890, 
895, 900, 905, 905, 905, 905, 900, 895, 
900, 900, 905, 905, 905, 905, 900, 895, 
890, 905, 905, 905, 905, 905, 900, 890, 
890, 900, 905, 900, 900, 900, 900, 890, 
880, 890, 890, 895, 895, 890, 890, 880
]


queen_piece_square_table = [
880, 890, 890, 895, 895, 890, 890, 880, 
890, 900, 900, 900, 900, 905, 900, 890, 
890, 900, 905, 905, 905, 905, 905, 890, 
895, 900, 905, 905, 905, 905, 900, 900, 
895, 900, 905, 905, 905, 905, 900, 895, 
890, 900, 905, 905, 905, 905, 900, 890, 
890, 900, 900, 900, 900, 900, 900, 890, 
880, 890, 890, 895, 895, 890, 890, 880
]

bking_piece_square_table_middle_game = [
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970, 
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970, 
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970, 
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970, 
9980, 9970, 9970, 9960, 9960, 9970, 9970, 9980, 
9990, 9980, 9980, 9980, 9980, 9980, 9980, 9990, 
10020, 10020, 10000, 10000, 10000, 10000, 10020, 10020, 
10020, 10030, 10010, 10000, 10000, 10010, 10030, 10020
]

king_piece_square_table_middle_game = [
10020, 10030, 10010, 10000, 10000, 10010, 10030, 10020, 
10020, 10020, 10000, 10000, 10000, 10000, 10020, 10020, 
9990, 9980, 9980, 9980, 9980, 9980, 9980, 9990, 
9980, 9970, 9970, 9960, 9960, 9970, 9970, 9980, 
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970, 
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970, 
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970, 
9970, 9960, 9960, 9950, 9950, 9960, 9960, 9970
] 



bking_piece_square_table_end_game = [
9950, 9960, 9970, 9980, 9980, 9970, 9960, 9950, 
9970, 9980, 9990, 10000, 10000, 9990, 9980, 9970, 
9970, 9990, 10020, 10030, 10030, 10020, 9990, 9970, 
9970, 9990, 10030, 10040, 10040, 10030, 9990, 9970, 
9970, 9990, 10030, 10040, 10040, 10030, 9990, 9970, 
9970, 9990, 10020, 10030, 10030, 10020, 9990, 9970, 
9970, 9970, 10000, 10000, 10000, 10000, 9970, 9970, 
9950, 9970, 9970, 9970, 9970, 9970, 9970, 9950
] 

king_piece_square_table_end_game = [
9950, 9970, 9970, 9970, 9970, 9970, 9970, 9950, 
9970, 9970, 10000, 10000, 10000, 10000, 9970, 9970, 
9970, 9990, 10020, 10030, 10030, 10020, 9990, 9970, 
9970, 9990, 10030, 10040, 10040, 10030, 9990, 9970, 
9970, 9990, 10030, 10040, 10040, 10030, 9990, 9970, 
9970, 9990, 10020, 10030, 10030, 10020, 9990, 9970, 
9970, 9980, 9990, 10000, 10000, 9990, 9980, 9970, 
9950, 9960, 9970, 9980, 9980, 9970, 9960, 9950
] 



"""row = []
for piece in king_piece_square_table_end_game:
    row.append(piece+10000)
print(row)"""


#########################################################################
def count_pawns(board, color):
    pawns = list(board.pieces(chess.PAWN, color))
    return sum(pawn_piece_square_table[sq] for sq in pawns) if color == chess.WHITE else sum(bpawn_piece_square_table[sq] for sq in pawns)

def count_knights(board, color):
    knights = list(board.pieces(chess.KNIGHT, color))
    return sum(knight_piece_square_table[sq] for sq in knights) if color == chess.WHITE else sum(bknight_piece_square_table[sq] for sq in knights)

def count_rooks(board, color):
    rooks = list(board.pieces(chess.ROOK, color))
    return sum(rook_piece_square_table[sq] for sq in rooks) if color == chess.WHITE else sum(brook_piece_square_table[sq] for sq in rooks)

def count_queens(board, color):
    queens = list(board.pieces(chess.QUEEN, color))
    return sum(queen_piece_square_table[sq] for sq in queens) if color == chess.WHITE else sum(bqueen_piece_square_table[sq] for sq in queens)

def count_bishops(board, color):
    bishops = list(board.pieces(chess.BISHOP, color))
    return sum(bishop_piece_square_table[sq] for sq in bishops) if color == chess.WHITE else sum(bbishop_piece_square_table[sq] for sq in bishops)

'''def count_pawns(board, color):
    pawns = list(board.pieces(1, color)) 
    return sum(pawn_piece_square_table[sq] for sq in pawns) if color==chess.WHITE else sum(bpawn_piece_square_table[sq] for sq in pawns)


def count_knights(board, color):
    
    knights = list(board.pieces(2, color))
    return sum(knight_piece_square_table[sq] for sq in knights) if color==chess.WHITE else sum(bknight_piece_square_table[sq] for sq in knights)

    # count = board.pieces(2,color).__len__()

    """
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.KNIGHT and piece.color == color:
            count += 1
    """

    return count * knightValue

def count_bishops(board, color):
    count = board.pieces(3,color).__len__()

    """
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.BISHOP and piece.color == color:
            count += 1
    """
    
    return count * bishopValue

def count_rooks(board, color):
    count = board.pieces(4,color).__len__()

    """for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.ROOK and piece.color == color:
            count += 1
    """
    return count * rookValue

def count_queens(board, color):
    count = board.pieces(5,color).__len__()
    
    """
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.QUEEN and piece.color == color:
            count += 1
    """
    return count * queenValue
'''

def count_all(board, color):
    return count_pawns(board, color)+count_knights(board, color)+count_bishops(board, color)+count_rooks(board, color)+count_queens(board, color)

def evaluate(board):
    white_eval = count_all(board,chess.WHITE)# count each piece from the board and multiply it to a constant signifying the value of said piece
    black_eval = count_all(board,chess.BLACK)# same 

    eval = white_eval - black_eval
    
    prespective = 1 if board.turn == chess.WHITE else -1

    return eval*prespective

##########################################################################

def sort_key(move: chess.Move,board:chess.Board):
    
    piece01 = board.piece_at(move.from_square)  # Get the piece on the starting square
    piece02 = board.piece_at(move.to_square)    # Get the piece on the ending square (if any)
    
    value01 = piece_values.get(piece01.piece_type, 0) if piece01 else 0
    value02 = piece_values.get(piece02.piece_type, 0) if piece02 else 0
    
    return mvv_lva_dict.get((value01, value02), 0)


# main search function
global best_move
best_move = None
initial_depth = 4

class SearchCounter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1

    def get_count(self):
        return self.count

# Initialize the search counter
search_counter = SearchCounter()
def search(board:chess.Board,endtime, depth = initial_depth, alpha=-10000, beta=10000):
    if endtime< time.time():
        raise TimeoutError
    
    global best_move
    best_temp = None
    # Increment the search counter
    search_counter.increment()

    # if (depth > -3 and depth <= 0 ):
    #     # print("Reached depth limit. Evaluating position.")
    #     return quiescence_search(board,alpha,beta)
    if (depth <= 0 ): # if search depth is zero make the first possible move if there is 
        legal_moves_iter = board.legal_moves 
        best_move = legal_moves_iter.__iter__().__next__() if any(legal_moves_iter) else None
        return evaluate(board)
    legal_moves_iter = board.legal_moves

    if not any(legal_moves_iter):
        return -float('inf')
    
    legal_moves = list(legal_moves_iter)  # Convert legal moves to a list


    # if depth == initial_depth:
    #     # print("Shuffling legal moves.")
    #     random.shuffle(legal_moves)
    random.shuffle(legal_moves)

    legal_moves.sort(key=lambda move: sort_key(move,board=board), reverse=True)
    
    # print(f"the number of moves available: {legal_moves.__len__()} ")
    # print("legalmoves",legal_moves)

    for move in legal_moves:
        # if depth >= initial_depth-1: print("Considering move:", move)
        # if alpha>=beta:
        #     break
        board.push(move)
        evaluation = -alphabeta(board,endtime, depth - 1, -beta, -alpha)
        # print(f"the current move is : {move} and it's evaluated as {evaluation}")
        # if depth == initial_depth: 
        #     # print("move:",move," evaluation:",evaluation," beta:",beta," depth:",depth)
        #     if len(legal_moves) > 1:  # Only update best_move if there are multiple legal moves
        #         best_move = move

        board.pop()

        if evaluation>=beta: # evaluation>=-beta
            best_move = move
            return  beta
        if evaluation > alpha:
            alpha = evaluation
            best_temp = move

    # if depth == initial_depth: 
    #     best_move = best_temp
    # if best_move==None:
    #     best_move= legal_moves[0]
    best_move=best_temp if best_temp!= None else (legal_moves[0] if any(legal_moves) else None)

    return alpha


def quiescence_search(board:chess.Board,alpha, beta):
    current_eval = evaluate(board)

    if current_eval >= beta:
        return beta
    if alpha < current_eval:
        alpha = current_eval
    
    # legal_captures = [move for move in board.legal_moves if board.is_capture(move)]

    # for move in legal_captures:
    for move in board.generate_legal_captures():
        board.push(move)
        score = -quiescence_search(board,-beta, -alpha)
        board.pop()

        if score >= beta:
            return beta

        if score > alpha:
            alpha = score

    return alpha


"""
def count_pawns(board, color):
    pawns = board.pieces(1, color)
    pawn_value = sum(pawn_piece_square_table[sq] for sq in pawns)
    return count * pawn_value

def count_knights(board, color):
    knights = board.pieces(2, color)
    knight_value = sum(knight_piece_square_table[sq] for sq in knights)
    return count * knight_value

def count_bishops(board, color):
    bishops = board.pieces(3, color)
    bishop_value = sum(bishop_piece_square_table[sq] for sq in bishops)
    return count * bishop_value

def count_rooks(board, color):
    rooks = board.pieces(4, color)
    rook_value = sum(rook_piece_square_table[sq] for sq in rooks)
    return count * rook_value

def count_queens(board, color):
    queens = board.pieces(5, color)
    queen_value = sum(queen_piece_square_table[sq] for sq in queens)
    return count * queen_value

def count_all(board, color):
    return (
        count_pawns(board, color) + 
        count_knights(board, color) + 
        count_bishops(board, color) + 
        count_rooks(board, color) + 
        count_queens(board, color)
    )
"""

def alphabeta(board:chess.Board,endtime, depth = initial_depth, alpha=-10000, beta=10000):
    if endtime< time.time():
        raise TimeoutError
    # Increment the search counter
    search_counter.increment()

    if (depth > -3 and depth <= 0 ):
        return quiescence_search(board,alpha,beta)
    if (depth <= 0 ):
        return evaluate(board)
    
    legal_moves_iter = board.legal_moves
    
    if not any(legal_moves_iter):
        return -float('inf')
    
    legal_moves = list(legal_moves_iter)
    
    legal_moves.sort(key=lambda move: sort_key(move,board=board), reverse=True)

    for move in legal_moves:
        board.push(move)
        evaluation = -alphabeta(board,endtime, depth - 1, -beta, -alpha)

        board.pop()

        if evaluation>=beta:
            return  beta
        if evaluation > alpha:
            alpha = evaluation


    return alpha




def ourai(fen,timeout=1.5):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    best_moves = []
    try:
        book_moves = chess.polyglot.MemoryMappedReader("openings/rodent.bin").weighted_choice(board).move
        return book_moves
    except:
        pass
    endtime = time.time()+timeout
    try:
        for i in range(initial_depth*3):
            search(board,endtime,depth=i)
            if best_move!= None : 
                best_moves.append(best_move) 
    except:
        pass    
    finally:
        # print(best_moves.__len__())
        if any(best_moves):
            move = best_moves[-1]
        else:
            print("there was no bestmoves this move")
            legal_moves = board.legal_moves
            
            if any(legal_moves):
                move = legal_moves.__iter__().__next__()
            else:
                move = None 
        return move 
        pass
    return best_move


# board = chess.Board("N2B3R/1prp1Pn1/1ppP1PB1/PQ3P2/b1pP2kp/KpP1RNb1/2rP2p1/4q1n1 w - - 0 1")
# board = chess.Board()
# while not board.is_game_over():
#     move = ourai(board.fen())
#     print("move is :",move)
#     if move and board.is_legal(move):

#         board.push(move)
#     else:
#         board.push(board.legal_moves.__iter__().__next__())
# print(board.fen())

# queens = list(board.pieces(1, chess.WHITE))
# board.push(board.legal_moves.__iter__().__next__())
# print(queens)
# print(board.pieces(1, chess.WHITE))
# print(count_all(board,0))
# print(count_all(board,1))
# i=0
# smth = []
# for (square,value) in board.piece_map().items():
#     smth.append({square:value.symbol()})
# # Create a dictionary from the list for easier access
# smth_dict = {list(entry.keys())[0]: list(entry.values())[0] for entry in smth}
# smth =""
# # Print piece information in reverse order
# for i in range(63, -1, -1):  # Adjusted to range from 63 to 0
#     if i in smth_dict:
#         smth += f"{smth_dict[i]}"
#     else:
#         smth += f" "
#     if (i+1)%8==1:
#         smth += "\n"

# print(smth)

# print(sum(pawn_piece_square_table[sq] for sq in queens))
# print(board.pieces(1,1).__len__())
# print(list(board.pieces(1,1)))
# for move in board.generate_legal_captures():
#     print(move)

"""

STUPID YOU FORGOT TO ADD ITERATIVE DEEPENING

you have this for quiescent search:
you take a set of the current legal moves you 
apply a filtration function using is_capture 
and do the search on what rests for you

like this 
legal_captures = [move for move in board.legal_moves if board.is_capture(move)]

you call it instead of the eval i believe

this is your blueprint :

int Quies(int alpha, int beta)

{

    val = Evaluate();

    if (val >= beta)

        return beta;

    if (val > alpha)

        alpha = val;

    GenerateGoodCaptures();

    while (CapturesLeft()) {

        MakeNextCapture();

        val = -Quies(-beta, -alpha);

        UnmakeMove();

        if (val >= beta)

            return beta;

        if (val > alpha)

            alpha = val;

    }

    return alpha;

}


so what are you going to do next?

you are going to implement transposition tables using the chess.polyglot zobrist keys

and you will start by declaring a table in a class containing all your positions 

and making a call store and add methods 

then you declare an entery and that's the hash key and a value a type a depth 

and a best move in said position 

now what to do with it you basically generate a key every move and pass the current key to 

the next call

and after the evaluation is complete you store the current hash with the 

move and evaluation and score and type in the table  


now you are able to add piece square tables fairly easily 

"""