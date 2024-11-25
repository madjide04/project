import chess
import random

def get_first_available_move(fen):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    legal_moves = list(board.legal_moves)
    if legal_moves:
        return random.choice(legal_moves)
    else:
        return None