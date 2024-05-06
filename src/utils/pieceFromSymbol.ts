import { PieceSymbol } from "chess.js";
import { Role } from "chessground/types";

export const pieceFromSymbol = (symbol: PieceSymbol): Role => {
  const mapper: Record<PieceSymbol, Role> = {
    'r': 'rook',
    'b': 'bishop',
    'k': 'king',
    'n': 'knight',
    'q': 'queen',
    'p': 'pawn',
  };
  return mapper[symbol];
};
