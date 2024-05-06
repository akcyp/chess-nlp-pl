import { Chess } from 'chess.js';
import { Color } from 'chessground/types';

export function toColor(chess: Chess): Color {
  return (chess.turn() === 'w') ? 'white' : 'black';
};
