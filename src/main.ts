import './style.css';

import { GameCoreController } from './GameCore/GameCore';
import { StockfishEngineCtrl } from './StockfishCtrl/StockfishCtrl';

const aiEngine = new StockfishEngineCtrl();
aiEngine.toggleDebugging(true);

const game = new GameCoreController(document.querySelector<HTMLDivElement>('#main')!, {
  async getComputerMove(chess) {
    return aiEngine.getNextMove(chess.fen());
  },
});

(globalThis as any).game = game;
