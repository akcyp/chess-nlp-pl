import { Chess, Move, PieceSymbol } from 'chess.js';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Key, Role } from 'chessground/types';
import { Config } from 'chessground/config';

import { PromotionCtrl } from '../PromotionCtrl/PromotionCtrl';
import { toDests } from '../utils/toDests';
import { toColor } from '../utils/toColor';
import { onGameOver, onGameStart } from '../utils/onGameStateChange';
import { colorFromSymbol } from '../utils/colorFromSymbol';
import { pieceFromSymbol } from '../utils/pieceFromSymbol';

import './GameCore.scss';
import { delay } from '../utils/delay';

const INITIAL_CONFIG: Config = {
  orientation: 'white',
  disableContextMenu: true,
  animation: {
    enabled: true,
    duration: 200,
  },
  draggable: {
    enabled: false,
    showGhost: true,
  },
  selectable: {
    enabled: false,
  },
  drawable: {
    enabled: false,
  },
  premovable: {
    enabled: false,
  },
};

interface GameCoreMove {
  from: Key;
  to: Key;
  promotion?: PieceSymbol;
}

interface GameCoreControllerConfig {
  getComputerMove: (chess: Chess) => Promise<GameCoreMove>;
  onGameStatusChange: (status: 'started' | 'finished' | 'initied') => void;
}

export class GameCoreController {
  private chess = new Chess();
  private board: Api;
  private promotionCtrl = new PromotionCtrl(
    (fn: (cg: Api) => any) => fn(this.board),
    () => this.board.set({ fen: this.chess.fen() }),
    () => this.redrawPromotion(),
  );

  private wrapperElement = Object.assign(document.createElement('div'), { className: 'game-wrapper' });

  private state = {
    gameStarted: false,
    gameOver: false,
    playAs: 'white' as 'white' | 'black',
  };

  constructor(container: HTMLDivElement, private config: GameCoreControllerConfig) {
    const game = Object.assign(document.createElement('div'), { className: 'game' });
    this.wrapperElement.appendChild(game);
    this.board = Chessground(game, INITIAL_CONFIG);
    container.appendChild(this.wrapperElement);
    this.reset();
  }

  private reset() {
    this.state.gameStarted = false;
    this.state.gameOver = false;
    this.chess.reset();
    this.board.set({
      fen: this.chess.fen(),
      lastMove: undefined,
      movable: {
        color: this.state.playAs,
        free: false,
        showDests: true,
        dests: toDests(this.chess),
        events: {
          after: this.onUserMove.bind(this),
        },
      },
    });
    this.redrawPromotion();
  }

  private redrawPromotion() {
    const oldPromotionElement = this.wrapperElement.querySelector('.promotion-choice');
    if (oldPromotionElement) this.wrapperElement.removeChild(oldPromotionElement);
    const newPromotionElement = this.promotionCtrl.view();
    if (newPromotionElement) this.wrapperElement.appendChild(newPromotionElement);
  }

  private setSides() {
    this.board.set({
      orientation: this.state.playAs,
      movable: {
        color: this.state.playAs,
      },
    });
  }

  private setBoardTurn() {
    this.board.set({
      turnColor: toColor(this.chess),
      movable: {
        color: toColor(this.chess),
        dests: this.state.playAs === toColor(this.chess) ? toDests(this.chess) : new Map(),
      },
    });
  }

  private async playUserMove(orig: Key, dest: Key, promotion?: Role) {
    const move = this.chess.move({ from: orig, to: dest, promotion: promotion?.charAt(0) });
    this.onChessMove(move);
  }

  private onUserMove(orig: Key, dest: Key) {
    if (!this.promotionCtrl.start(orig, dest, {
      submit: this.playUserMove.bind(this),
    })) {
      this.playUserMove(orig, dest);
    }
  }

  private async playComputerMove() {
    await delay(300);
    const computerMove = await this.config.getComputerMove(this.chess);
    const move = this.chess.move({ from: computerMove.from, to: computerMove.to, promotion: computerMove.promotion });
    this.board.move(move.from, move.to);
    this.onChessMove(move);
  }

  private onChessMove(move: Move) {
    if (move.promotion) {
      this.board.setPieces(new Map([[move.to, { color: colorFromSymbol(move.color), role: pieceFromSymbol(move.promotion), promoted: true }]]));
    }
    if (move.flags.includes('e')) {
      // En-passant capture
      const caputuredPosition = `${move.to.charAt(0)}${Number(move.to.charAt(1)) + (move.color === 'w' ? -1 : 1)}` as Key;
      this.board.setPieces(new Map([[caputuredPosition, undefined]]));
    }
    if (this.chess.isGameOver()) {
      this.state.gameOver = true;
      this.config.onGameStatusChange('finished');
      onGameOver(this.board);
      return;
    }
    this.setBoardTurn();
    if (this.state.playAs !== toColor(this.chess)) {
      this.playComputerMove();
    }
  }

  private playSAN(san: string) {
    if (this.state.gameStarted && !this.state.gameOver && toColor(this.chess) !== this.state.playAs) {
      console.log('not your turn');
      return;
    }
    try {
      const move = this.chess.move(san);
      this.board.move(move.from, move.to);
      this.onChessMove(move);
    } catch (_) {
      console.log('invalid move: ' + san);
    }
  }

  public exec(action: string) {
    switch (action) {
      case 'start': {
        this.reset();
        this.state.gameStarted = true;
        this.config.onGameStatusChange('started');
        onGameStart(this.board);
        this.setBoardTurn();
        if (this.state.playAs !== toColor(this.chess)) {
          this.playComputerMove();
        }
        break;
      };
      case 'resign': {
        if (this.state.gameStarted && !this.state.gameOver) {
          this.state.gameOver = true;
          this.config.onGameStatusChange('finished');
          onGameOver(this.board);
        }
        break;
      };
      case 'rematch': {
        if (this.state.gameStarted && this.state.gameOver) {
          console.log('rematch');
          this.reset();
          this.config.onGameStatusChange('initied');
        }
        break;
      };
      case 'side=w': {
        if (!this.state.gameStarted) {
          this.state.playAs = 'white';
          this.setSides();
        }
        break;
      };
      case 'side=b': {
        if (!this.state.gameStarted) {
          this.state.playAs = 'black';
          this.setSides();
        }
        break;
      };
      case 'side=!': {
        if (!this.state.gameStarted) {
          this.state.playAs = this.state.playAs === 'white' ? 'black' : 'white';
          this.setSides();
        }
        break;
      };
      case 'enpassant': {
        const moves = this.chess.moves({ verbose: true });
        const enpassantMove = moves.find(move => move.flags.includes('e'));
        if (enpassantMove) {
          this.playSAN(enpassantMove.san);
        }
        break;
      };
      default: {
        const lastMove = this.chess.history({ verbose: true }).at(-1);
        let san = action;
        if (lastMove && lastMove.flags.includes('c')) {
          san = san.replace(/\?/g, lastMove.to);
        }
        san = san.replace(/([prbnqk])([a-h][1-8])/ig, (_, piece, coord) => {
          return piece.toUpperCase() + coord;
        });
        san = san.replace(/<!([prbnqk])([a-h][1-8])>/i, (_, piece, coord) => {
          const coordPiece = this.chess.get(coord);
          const pieceColor = coordPiece.color === 'w' ? 'white' : 'black';
          if (coordPiece?.type === piece && pieceColor !== this.state.playAs) {
            return '';
          }
          return 'INVALID MOVE';
        });
        this.playSAN(san);
      }
    }
  }
}
