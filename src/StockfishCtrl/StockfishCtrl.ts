import StockfishWorker from 'stockfish.js?worker';
import { PieceSymbol } from 'chess.js';
import { EventEmitter } from '../EventEmitter/EventEmitter';
import { Key } from 'chessground/types';

interface Move {
  from: Key;
  to: Key;
  promotion?: PieceSymbol;
}

const parseMove = (move: string): Move => {
  const [sx, sy, tx, ty, p] = move.split('');
  return {
    from: `${sx}${sy}` as Key,
    to: `${tx}${ty}` as Key,
    promotion: p as PieceSymbol | undefined,
  }
};

export class StockfishEngineCtrl extends EventEmitter {
  private worker = new StockfishWorker();
  private skillLevel = 10;
  private debug = false;
  constructor() {
    super();
    this.worker.addEventListener('message', this.onMessage);
    this.setSkillLevel(this.skillLevel);
  }
  public toggleDebugging(debug: boolean) {
    this.debug = debug;
  }
  private send = (command: string) => {
    if (this.debug) {
      console.log('[Sending]', command);
    }
    this.worker.postMessage(command);
  }
  private onMessage = (e: MessageEvent<string>) => {
    if (this.debug) {
      console.log('[Received]', e.data);
    }
    const [cmd, ...args] = e.data.split(' ');
    this.emit(cmd, ...args);
  }
  call({ commands, waitFor, timeout = 1e3 * 60 * 5 }: { commands: string[], waitFor: string, timeout?: number }): Promise<string[]> {
    commands.forEach(command => this.send(command));
    return new Promise((resolve, reject) => {
      const cancelTimeout = setTimeout(() => {
        this.off(waitFor, onEvent);
        reject();
      }, timeout);
      const onEvent = (...args: string[]) => {
        clearTimeout(cancelTimeout);
        resolve(args);
      }
      this.once(waitFor, onEvent);
    });
  }
  setSkillLevel(level: number) {
    this.skillLevel = level;
    this.worker.postMessage('setoption name skill level value ' + level);
  }
  async getNextMove(fen: string): Promise<Move> {
    const eventData = await this.call({
      commands: [`position fen ${fen}`, `go movetime ${this.skillLevel}`],
      waitFor: 'bestmove',
    });
    return parseMove(eventData[0]);
  }
};
