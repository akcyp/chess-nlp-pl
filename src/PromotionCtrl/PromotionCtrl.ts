import { Api as CgApi } from 'chessground/api';
import { DrawShape } from 'chessground/draw';
import { opposite, key2pos } from 'chessground/util';
import { Color, Key, MoveMetadata, Role } from 'chessground/types';

import './PromotionCtrl.scss';

export type Hooks = {
  submit: (orig: Key, dest: Key, role: Role) => void;
  show?: (ctrl: PromotionCtrl, roles: Role[] | false) => void;
};

interface Promoting {
  orig: Key;
  dest: Key;
  pre: boolean;
  hooks: Hooks;
}

const PROMOTABLE_ROLES: Role[] = ['queen', 'knight', 'rook', 'bishop'];

export function promote(g: CgApi, key: Key, role: Role): void {
  const piece = g.state.pieces.get(key);
  if (piece && piece.role == 'pawn') {
    g.setPieces(new Map([[key, { color: piece.color, role, promoted: true }]]));
  }
}

export class PromotionCtrl {
  private promoting?: Promoting;
  private prePromotionRole?: Role;

  constructor(
    private withGround: <A>(f: (cg: CgApi) => A) => A | false | undefined,
    private onCancel: () => void,
    private redraw: () => void,
  ) {}

  start = (orig: Key, dest: Key, hooks: Hooks, meta?: MoveMetadata, forceAutoQueen = false): boolean =>
    this.withGround(g => {
      const premovePiece = g.state.pieces.get(orig);
      const piece = premovePiece || g.state.pieces.get(dest);
      if (
        piece?.role == 'pawn' &&
        ((dest[1] == '8' && g.state.turnColor == 'black') || (dest[1] == '1' && g.state.turnColor == 'white'))
      ) {
        if (this.prePromotionRole && meta?.premove) {
          this.doPromote({ orig, dest, hooks }, this.prePromotionRole);
          return true;
        }
        if (
          !meta?.ctrlKey &&
          !this.promoting &&
          (premovePiece || forceAutoQueen)
        ) {
          if (premovePiece) this.setPrePromotion(dest, 'queen');
          else this.doPromote({ orig, dest, hooks }, 'queen');
          return true;
        }
        this.promoting = { orig, dest, pre: !!premovePiece, hooks };
        this.redraw();
        return true;
      }
      return false;
    }) || false;

  cancel = (): void => {
    this.cancelPrePromotion();
    if (this.promoting) {
      this.promoting = undefined;
      this.onCancel();
      this.redraw();
    }
  };

  cancelPrePromotion = (): void => {
    this.promoting?.hooks.show?.(this, false);
    if (this.prePromotionRole) {
      this.withGround(g => g.setAutoShapes([]));
      this.prePromotionRole = undefined;
      this.redraw();
    }
  };

  view = () => {
    const promoting = this.promoting;
    if (!promoting) return;
    promoting.hooks.show?.(this, PROMOTABLE_ROLES);

    return (
      this.withGround(g =>
        this.renderPromotion(
          promoting.dest,
          PROMOTABLE_ROLES,
          opposite(g.state.turnColor),
          g.state.orientation,
        ),
      ) || null
    );
  };

  finish(role: Role): void {
    const promoting = this.promoting;
    if (promoting) {
      this.promoting = undefined;
      if (promoting.pre) this.setPrePromotion(promoting.dest, role);
      else this.doPromote(promoting, role);
      promoting.hooks.show?.(this, false);
      this.redraw();
    }
  }

  private doPromote(promoting: Omit<Promoting, 'pre'>, role: Role): void {
    this.withGround(g => promote(g, promoting.dest, role));
    promoting.hooks.submit(promoting.orig, promoting.dest, role);
  }

  private setPrePromotion(dest: Key, role: Role): void {
    this.prePromotionRole = role;
    this.withGround(g =>
      g.setAutoShapes([
        {
          orig: dest,
          piece: { color: opposite(g.state.turnColor), role, opacity: 0.8 },
          brush: '',
        } as DrawShape,
      ]),
    );
  }

  private renderPromotion(dest: Key, pieces: Role[], color: Color, orientation: Color) {
    let left = (7 - key2pos(dest)[0]) * 12.5;
    if (orientation === 'white') left = 87.5 - left;

    const vertical = color === orientation ? 'top' : 'bottom';

    const promotionElement = Object.assign(document.createElement('div'), {
      className: `promotion-choice ${vertical} cg-wrap`,
      oncontextmenu: () => false,
      onclick: () => this.cancel(),
    });
    promotionElement.append(...pieces.map((serverRole, i) => {
      const top = (color === orientation ? i : 7 - i) * 12.5;
      const square = document.createElement('square');
      square.appendChild(Object.assign(document.createElement('piece'), {
        className: `${serverRole} ${color}`
      }));
      Object.assign(square.style, {
        top: `${top}%`,
        left: `${left}%`,
      });
      square.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finish(serverRole);
      });
      return square;
    }));
    return promotionElement;
  }
}
