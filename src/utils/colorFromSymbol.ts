import { Color as Symbol } from "chess.js";
import { Color } from "chessground/types";

export const colorFromSymbol = (symbol: Symbol): Color => {
  return symbol === 'w' ? 'white' : 'black';
};
