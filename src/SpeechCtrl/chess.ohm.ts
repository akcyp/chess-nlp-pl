import {
  BaseActionDict,
  NonterminalNode,
  TerminalNode
} from 'ohm-js';

export interface ChessActionDict<T> extends BaseActionDict<T> {
  Exp?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Coord?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode) => T;
  KingNormative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  KingAccusative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  KingAblative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  QueenNormative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  QueenAccusative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  QueenAblative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  KnightNormative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  KnightAccusative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  KnightAblative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  BishopNormative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  BishopAccusative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  BishopAblative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  RookNormative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  RookAccusative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  RookAblative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  PawnNormative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  PawnAccusative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  PawnAblative?: (this: NonterminalNode, arg0: TerminalNode) => T;
  PieceNormative?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  PieceAccusative?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  PieceAblative?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  PieceNormativeFrom?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  PieceAccusativeFrom?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  PieceAblativeFrom?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  PieceNormativeTo?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  PieceAccusativeTo?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  MoveSourceNormative?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  CaptureMove?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  ReCaptureMove?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
  FigureMove?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode) => T;
  PawnMove?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  BasicMove?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  MoveWithCoords?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  MoveWithPromotion?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  CaptureEnPassant?: (this: NonterminalNode, arg0: TerminalNode) => T;
  CastlingQueenside?: (this: NonterminalNode, arg0: TerminalNode) => T;
  CastlingKingside?: (this: NonterminalNode, arg0: TerminalNode) => T;
  Castling?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Move?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ActionPlayAsWhite?: (this: NonterminalNode, arg0: TerminalNode) => T;
  ActionPlayAsBlack?: (this: NonterminalNode, arg0: TerminalNode) => T;
  ActionPlayAsOpponentColor?: (this: NonterminalNode, arg0: TerminalNode) => T;
  ActionChangeSide?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ActionStart?: (this: NonterminalNode, arg0: TerminalNode) => T;
  ActionResign?: (this: NonterminalNode, arg0: TerminalNode) => T;
  ActionRematch?: (this: NonterminalNode, arg0: TerminalNode) => T;
  Action?: (this: NonterminalNode, arg0: NonterminalNode) => T;
}
