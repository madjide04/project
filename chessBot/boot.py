
import chess
# from tqdm import tqdm 
# import math
import random
import chess.svg
# from IPython.display import SVG, display
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



def count_pawns(board, color):
    count = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.PAWN and piece.color == color:
            count += 1
    return count * pawnValue

def count_knights(board, color):
    count = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.KNIGHT and piece.color == color:
            count += 1
    return count * knightValue

def count_bishops(board, color):
    count = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.BISHOP and piece.color == color:
            count += 1
    return count * bishopValue

def count_rooks(board, color):
    count = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.ROOK and piece.color == color:
            count += 1
    return count * rookValue

def count_queens(board, color):
    count = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.piece_type == chess.QUEEN and piece.color == color:
            count += 1
    return count * queenValue

def count_all(board, color):
    return count_pawns(board, color)+count_knights(board, color)+count_bishops(board, color)+count_rooks(board, color)+count_queens(board, color)
def evaluate(board):
    white_eval = count_all(board,chess.WHITE)# count each piece from the board and multiply it to a constant signifying the value of said piece
    black_eval = count_all(board,chess.BLACK)# same 

    eval = white_eval - black_eval
    
    prespective = 1 if board.turn == chess.WHITE else -1

    return eval*prespective

def sort_key(move: chess.Move,board):
    
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
def search(board, depth = initial_depth, alpha=-10000, beta=10000):
    
    global best_move
    best_temp = None
    # Increment the search counter
    search_counter.increment()

    if (depth <= 0 ):
        # print("Reached depth limit. Evaluating position.")
        return evaluate(board)
    legal_moves = list(board.legal_moves)  # Convert legal moves to a list
    if len(legal_moves) == 0:
        # print("depth: ", depth , " No legal moves available. Returning negative infinity.")
        return -float('inf')

    if depth == initial_depth:
        # print("Shuffling legal moves.")
        random.shuffle(legal_moves)
    legal_moves.sort(key=lambda move: sort_key(move,board=board), reverse=True)

    # print("legalmoves",legal_moves)

    for move in legal_moves:
        # if depth >= initial_depth-1: print("Considering move:", move)
        # if alpha>=beta:
        #     break
        board.push(move)
        evaluation = -search(board, depth - 1, -beta, -alpha)
        # if depth == initial_depth: 
        #     # print("move:",move," evaluation:",evaluation," beta:",beta," depth:",depth)
        #     if len(legal_moves) > 1:  # Only update best_move if there are multiple legal moves
        #         best_move = move

        board.pop()

        if evaluation>=beta: # evaluation>=-beta
            if depth == initial_depth:
            #     # print("Pruning branch. Current best move:", best_move)
            #     # print("New best move:", move)
                best_move = move
            return  beta
        if evaluation > alpha:
            alpha = evaluation
            best_temp = move

    if depth == initial_depth: 
        best_move = best_temp
    if best_move==None:
        best_move= legal_moves[0]

    return alpha

def ourai(fen):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    search(board)
    return best_move

print(ourai("2B1Nkbr/1RK5/PnP1RPrp/2N2pPp/2Q2ppn/P2q3p/PpP1p2P/2B1b3 w - - 0 1"))

'''
import chess
import random

pawnValue = 100
knightValue = 300
bishopValue = 300
rookValue = 500
queenValue = 900

piece_values = {
    chess.PAWN: pawnValue,
    chess.KNIGHT: knightValue,
    chess.BISHOP: bishopValue,
    chess.ROOK: rookValue,
    chess.QUEEN: queenValue,
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
mvv_lva_dict = {(victim_idx, attacker_idx): value for victim_idx, row in enumerate(mvv_lva) for attacker_idx, value in enumerate(row)}

def sort_key(board, move):
    piece01 = board.piece_at(move.from_square)
    piece02 = board.piece_at(move.to_square)
    
    value01 = piece_values.get(piece01.piece_type, 0) if piece01 else 0
    value02 = piece_values.get(piece02.piece_type, 0) if piece02 else 0
    
    return mvv_lva_dict.get((value01, value02), 0)

def count_piece(board, piece_type, color):
    count = sum(1 for square in chess.SQUARES if board.piece_at(square) == chess.Piece(piece_type, color))
    return count * piece_values.get(piece_type, 0)

def evaluate(board):
    white_eval = sum(count_piece(board, piece_type, chess.WHITE) for piece_type in piece_values.keys())
    black_eval = sum(count_piece(board, piece_type, chess.BLACK) for piece_type in piece_values.keys())
    return white_eval - black_eval

initial_depth = 4
best_move = None

def search(board, depth=initial_depth, alpha=-10000, beta=10000):
    # global best_move
    best_temp = None

    if depth <= 0:
        return evaluate(board)

    legal_moves = list(board.legal_moves)
    if not legal_moves:
        return -float('inf')

    if depth == initial_depth:
        random.shuffle(legal_moves)
    legal_moves.sort(key=lambda move: sort_key(board, move), reverse=True)

    for move in legal_moves:
        board.push(move)
        evaluation = -search(board, depth - 1, -beta, -alpha)
        board.pop()

        if evaluation >= beta:
            if depth == initial_depth:
                best_move = move
            return beta

        if evaluation > alpha:
            alpha = evaluation
            best_temp = move

    if depth == initial_depth:
        best_move = best_temp or legal_moves[0]

    return alpha

def ourai(fen):
    global best_move
    board = chess.Board(fen)
    search(board)
    return best_move
print(ourai("2B1Nkbr/1RK5/PnP1RPrp/2N2pPp/2Q2ppn/P2q3p/PpP1p2P/2B1b3 w - - 0 1"))
'''