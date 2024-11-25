import chess.svg
import chess.pgn
import chess.engine
from IPython.display import SVG
import matplotlib.pyplot as plt
import numpy as np

elo = { #38
1: 1320,#medium
2: 1400,
3: 1450,
4: 1500,
5: 1550,
6: 1600,
7: 1650,#hard
8: 1700,
9: 1750,
10: 1800,
11: 1850,
12: 1900,
13: 1950,
14: 2000,#expert
15: 2050,
16: 2100,
17: 2150,
18: 2200,
19: 2250,
20: 2300,
21: 2350,
22: 2400,
23: 2450,
24: 2500,#grandmaster
25: 2550,
26: 2600,
27: 2650,
28: 2700,#super grandmaster
29: 2750,
30: 2800,
31: 2850,
32: 2900,
33: 2950,
34: 3000,
35: 3050,
36: 3100,
37: 3150,
38: 3190
}


def stock_best_move(fen, elo_rating):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"UCI_LimitStrength":True, "UCI_Elo": elo_rating})
    
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
    

def stockfishing(fen,diff):
    pass
    
    option= elo.get(diff)
    try :
        return stock_best_move(fen,option)
    except:
        return stock_best_move(fen,3190)
"""
def stock_best_move_1320(fen, elo_rating=1320):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"UCI_LimitStrength":True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        engine.close()
        return move
    else:
        return None
    

def stock_best_move_2000(fen, elo_rating=2000):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"Skill Level": 20, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        engine.close()
        return move
    else:
        return None
    

def stock_best_move_3000(fen, elo_rating=3000):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"UCI_LimitStrength":True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        engine.close()
        return move
    else:
        return None
    

def stock_best_move_3190(fen, elo_rating=3190):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"UCI_LimitStrength":True, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        engine.close()
        return move
    else:
        return None
    

def stock_best_move_1400(fen, elo_rating=1400):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"Skill Level": 20, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        engine.close()
        return move
    else:
        return None


def stock_best_move_1500(fen, elo_rating=1500):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"Skill Level": 20, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        engine.close()
        return move
    else:
        return None


def stock_best_move_1600(fen, elo_rating=1600):
    # Create a chess board object from the FEN string
    board = chess.Board(fen)
    
    # Initialize the Stockfish engine
    engine = chess.engine.SimpleEngine.popen_uci("stockfish-windows-x86-64-avx2.exe")
    
    # Set the engine's Elo rating
    engine.configure({"Skill Level": 20, "UCI_Elo": elo_rating})
    
    # Get the list of legal moves
    legal_moves = list(board.legal_moves)
    
    # If there are legal moves available, get the best move from the engine
    if legal_moves:
        move = engine.play(board, chess.engine.Limit(time=0.1)).move
        engine.close()
        return move
    else:
        return None

def stockfish(fen,diff):
    diff = int(diff)
    # print(f"stockfish{diff}")
    if diff == 1:
        return stock_best_move_1320(fen)
    if diff == 2:
        return stock_best_move_1400(fen)
    if diff == 3:
        return stock_best_move_1500(fen)
    if diff == 4:
        return stock_best_move_1600(fen)
    if diff == 5:
        return stock_best_move_2000(fen)
    if diff == 6:
        return stock_best_move_3000(fen)
    if diff == 7:
        return stock_best_move_3190(fen)
    
    return stock_best_move_2000(fen)
 """
# board = chess.Board()
# print("start")
# i= 0
# try:
#     while not board.is_game_over():
#         i=i+1
#         move = stockfish(board.fen(),7)
#         # print(f"{i}. {move}")
#         board.push(move)
#         move2 = stockfish(board.fen(),1)
#         print(f"{i}. {move} {move2}")
#         board.push(move2)
#     print(f"the game ended and the winner is {board.turn}\n {board.fen()}")
    
# except:
#     print(f"the game ended and the winner is {board.turn}\n {board.fen()}")


# print(stock_best_move_1320("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
# print(stock_best_move_2000("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
# print(stock_best_move_3000("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
# print(stock_best_move_3190("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
# print(stock_best_move_1400("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
# print(stock_best_move_1500("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
# print(stock_best_move_1600("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
