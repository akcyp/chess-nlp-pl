import { Chess, Move, PieceSymbol } from 'chess.js';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Key, Role } from 'chessground/types';

import { PromotionCtrl } from '../PromotionCtrl/PromotionCtrl';
import { toDests } from '../utils/toDests';
import { toColor } from '../utils/toColor';
import { onGameOver } from '../utils/onGameOver';
import { colorFromSymbol } from '../utils/colorFromSymbol';
import { pieceFromSymbol } from '../utils/pieceFromSymbol';

import './GameCore.scss';

interface GameCoreMove {
  from: Key;
  to: Key;
  promotion?: PieceSymbol;
}

interface GameCoreControllerConfig {
  getComputerMove: (chess: Chess) => Promise<GameCoreMove>;
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

  constructor(container: HTMLDivElement, private config: GameCoreControllerConfig) {
    const game = Object.assign(document.createElement('div'), { className: 'game' });
    this.wrapperElement.appendChild(game);
    this.board = Chessground(game, {
      orientation: 'white',
      disableContextMenu: true,
      animation: {
        enabled: true,
        duration: 200,
      },
      movable: {
        color: 'white',
        free: false,
        showDests: true,
        dests: toDests(this.chess),
        events: {
          after: this.onUserMove.bind(this),
        }
      },
      draggable: {
        showGhost: true
      },
      drawable: {
        enabled: false,
      },
    });
    this.redrawPromotion();
    container.appendChild(this.wrapperElement);
  }

  private redrawPromotion() {
    const oldPromotionElement = this.wrapperElement.querySelector('.promotion-choice');
    if (oldPromotionElement) this.wrapperElement.removeChild(oldPromotionElement);
    const newPromotionElement = this.promotionCtrl.view();
    if (newPromotionElement) this.wrapperElement.appendChild(newPromotionElement);
  }

  private async playUserMove(orig: Key, dest: Key, promotion?: Role) {
    const move = this.chess.move({ from: orig, to: dest, promotion: promotion?.charAt(0) });
    this.onChessMove(move);
    if (this.chess.isGameOver()) {
      onGameOver(this.board);
      return;
    }
    await this.playComputerMove();
  }

  private onUserMove(orig: Key, dest: Key) {
    if (!this.promotionCtrl.start(orig, dest, {
      submit: this.playUserMove.bind(this),
    })) {
      this.playUserMove(orig, dest);
    }
  }

  private async playComputerMove() {
    const computerMove = await this.config.getComputerMove(this.chess);
    const move = this.chess.move({ from: computerMove.from, to: computerMove.to, promotion: computerMove.promotion });
    this.board.move(move.from, move.to);
    if (move.promotion) {
      this.board.setPieces(new Map([[move.to, { color: colorFromSymbol(move.color), role: pieceFromSymbol(move.promotion), promoted: true }]]));
    }
    this.onChessMove(move);

    if (this.chess.isGameOver()) {
      onGameOver(this.board);
      return;
    }
    this.board.set({
      turnColor: toColor(this.chess),
      movable: {
        color: toColor(this.chess),
        dests: toDests(this.chess)
      },
    });
    this.board.playPremove();
  }

  private onChessMove(move: Move) {
    if (move.flags.includes('e')) {
      // En-passant capture
      const caputuredPosition = `${move.to.charAt(0)}${Number(move.to.charAt(1)) + (move.color === 'w' ? -1 : 1)}` as Key;
      this.board.setPieces(new Map([[caputuredPosition, undefined]]));
    }
  }
}
