board = chess.Board()
print("start")
i= 0
while not board.is_game_over:
    i=+1
    print("\n")
    move = stockfish(board.fen(),1)
    print(f"{i}. {move}")
    board.push(move)