import './style.css';

import { GameCoreController } from './GameCore/GameCore';
import { StockfishEngineCtrl } from './StockfishCtrl/StockfishCtrl';
import { SpeechCtrl, SpeechResult } from './SpeechCtrl/SpeechCtrl';

const aiEngine = new StockfishEngineCtrl();
aiEngine.toggleDebugging(true);

const game = new GameCoreController(document.querySelector<HTMLDivElement>('#main')!, {
  async getComputerMove(chess) {
    return aiEngine.getNextMove(chess.fen());
  },
});

const speechAPI = new SpeechCtrl();
speechAPI.on('speech', (results: SpeechResult[]) => {
  console.log(results);
  if (results.length) {
    const action = results[0];
    game.exec(action.san);
  }
})

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    speechAPI.start();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    speechAPI.stop();
  }
});
