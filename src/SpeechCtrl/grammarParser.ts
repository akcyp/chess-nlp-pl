import grammar from './chess.ohm?raw';
import { grammar as createGrammar } from 'ohm-js';
import { PAWN, KING, KNIGHT, BISHOP, QUEEN, ROOK  } from 'chess.js';
import type { ChessActionDict } from './chess.ohm';

const g = createGrammar(grammar);
const semantic = g.createSemantics();

const pieces: Partial<ChessActionDict<any>> = {
  KingNormative: (_) => KING,
  KingAccusative: (_) => KING,
  KingAblative: (_) => KING,

  QueenNormative: (_) => QUEEN,
  QueenAccusative: (_) => QUEEN,
  QueenAblative: (_) => QUEEN,

  KnightNormative: (_) => KNIGHT,
  KnightAccusative: (_) => KNIGHT,
  KnightAblative: (_) => KNIGHT,

  BishopNormative: (_) => BISHOP,
  BishopAccusative: (_) => BISHOP,
  BishopAblative: (_) => BISHOP,

  RookNormative: (_) => ROOK,
  RookAccusative: (_) => ROOK,
  RookAblative: (_) => ROOK,

  PawnNormative: (_) => PAWN,
  PawnAccusative: (_) => PAWN,
  PawnAblative: (_) => PAWN,

  PieceNormative: (piece) => piece.piece,
  PieceAccusative: (piece) => piece.piece,
  PieceAblative: (piece) => piece.piece,

  PieceNormativeFrom: (piece, _, __) => piece.piece,
  PieceAccusativeFrom: (piece, _, __) => piece.piece,
  PieceAblativeFrom: (piece, _, __) => piece.piece,
  
  PieceNormativeTo: (piece, _, __) => piece.piece,
  PieceAccusativeTo: (piece, _, __) => piece.piece,
};

const coords: Partial<ChessActionDict<any>> = {
  Coord: (x, y) => `${x.sourceString}${y.sourceString}`,

  PieceNormativeFrom: (_, __, coord) => coord.coord,
  PieceAccusativeFrom: (_, __, coord) => coord.coord,
  PieceAblativeFrom: (_, __, coord) => coord.coord,

  PieceNormativeTo: (_, __, coord) => coord.coord,
  PieceAccusativeTo: (_, __, coord) => coord.coord,
};


const evals: Partial<ChessActionDict<any>> = {
  Coord(_x, _y) {
    return this.coord;
  },

  MoveSourceNormative: (source) => {
    if (source.ctorName === 'Coord') {
      return source.coord;
    }
    return `${source.piece}${source.coord}`;
  },
  
  CaptureMove: (source, _, destination) => {
    const san = `${source.eval()}x${destination.coord}`;
    if (destination.ctorName === 'Coord') {
      return san;
    }
    // Check destination piece exists
    return `${san}<!${destination.piece}${destination.coord}>`;
  },

  ReCaptureMove: (_, source) => {
    // Last capture move position
    const lastCapturePosition = '?';
    return `${source.piece}${source.coord}x${lastCapturePosition}`;
  },

  FigureMove: (piece, coord) => `${piece.piece === 'p' ? '' : piece.piece}${coord.coord}`,
  PawnMove: (coord) => coord.coord,

  BasicMove: (source, _, coord) => `${source.eval()}${coord.coord}`,

  MoveWithCoords: (move) => {
    if (move.ctorName === 'PieceNormativeTo') {
      if (move.piece === 'p') {
        return `${move.coord}`;
      }
      return `${move.piece}${move.coord}`;
    }
    return `${move.eval()}`;
  },

  MoveWithPromotion: (move, _, promotion) => `${move.eval()}=${promotion.piece}`,

  CaptureEnPassant: (_) => {
    return 'enpassant'
  },

  CastlingKingside: (_) => 'O-O',
  CastlingQueenside: (_) => 'O-O-O',
  Castling: (castling) => castling.eval(),

  Move: (move) => move.eval(),

  ActionPlayAsBlack: (_) => 'side=b',
  ActionPlayAsWhite: (_) => 'side=w',
  ActionPlayAsOpponentColor: (_) => 'side=!',
  ActionChangeSide: (node) => node.eval(),

  ActionStart: (_) => 'start',
  ActionResign: (_) => 'resign',
  ActionRematch: (_) => 'rematch',

  Action: (node) => node.eval(),
  Exp: (node) => node.eval(),
};

semantic.addAttribute('piece', pieces);
semantic.addAttribute('coord', coords);
semantic.addOperation('eval()', evals);

export const parse = (text: string) => {
  const result = g.match(text);
  if (!result.succeeded()) {
    return null;
  }
  const node = semantic(result);
  return node.eval();
};
