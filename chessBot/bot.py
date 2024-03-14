import chess
import random

def get_random_move(board):
    legal_moves = list(board.legal_moves)
    if legal_moves:
        return random.choice(legal_moves)
    else:
        return None

def main():
    board = chess.Board()
    print("Initial Board:")
    print(board)

    random_move = get_random_move(board)
    if random_move:
        print("\nRandom Move Selected:")
        print(random_move)
        board.push(random_move)
        print("\nBoard After Move:")
        print(board)
    else:
        print("\nNo legal moves available. Game Over.")

if __name__ == "__main__":
    main()
