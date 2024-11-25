import chess
import chess.engine


elo = { #38
1: 800,#easy
2: 900,
3: 1100,
4: 1300,#medium
5: 1500,
6: 1650,#hard
7: 1700,
8: 1900,
9: 2000,#expert
10: 2100,
11: 2300,
12: 2500,#grandmaster
13: 2650,
14: 2700,#super grandmaster
15: 2800
}

def rodent_best_move(fen, elo_rating):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Rodent IV engine
    engine = chess.engine.SimpleEngine.popen_uci("rodent-iv-x64.exe")

    # Configure the engine with the desired Elo rating
    engine.configure({"UCI_LimitStrength": True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        
        engine.close()
        return move
    else:
        
        engine.close()
        return None


def rodenting(fen,diff):
    option= elo.get(diff)
    try :
        return rodent_best_move(fen,option)
    except:
        return rodent_best_move(fen,2800)

"""
def rodent_best_move_800(fen, elo_rating=800):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    
    # Configure the engine with the desired Elo rating
    engine.configure({"UCI_LimitStrength": True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        return move
    else:
        return None


def rodent_best_move_1600(fen, elo_rating=1600):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    
    # Configure the engine with the desired Elo rating
    engine.configure({"UCI_LimitStrength": True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        return move
    else:
        return None
    

def rodent_best_move_2200(fen, elo_rating=2200):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    
    # Configure the engine with the desired Elo rating
    engine.configure({"UCI_LimitStrength": True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        return move
    else:
        return None


def rodent_best_move_2800(fen, elo_rating=2800):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    
    # Configure the engine with the desired Elo rating
    engine.configure({"UCI_LimitStrength": True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        return move
    else:
        return None


def rodent(fen,diff):
    diff = int(diff)
    if diff == 1:
        return rodent_best_move_800(fen)
    if diff == 2:
        return rodent_best_move_1600(fen)
    if diff == 3:
        return rodent_best_move_2200(fen)
    if diff == 4:
        return rodent_best_move_2800(fen)
    
    return rodent_best_move_2800(fen)
    """


# fen = "r1bqkbnr/pppppppp/n7/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

# # Test with different Elo ratings
# print(rodent_best_move_800(fen))
# print(rodent_best_move_1600(fen))
# print(rodent_best_move_2200(fen))
# print(rodent_best_move_2800(fen))
