import './style.css';

import { GameCoreController } from './GameCore/GameCore';
import { StockfishEngineCtrl } from './StockfishCtrl/StockfishCtrl';
import { SpeechCtrl, SpeechResult } from './SpeechCtrl/SpeechCtrl';
import { parse } from './SpeechCtrl/grammarParser';

const aiEngine = new StockfishEngineCtrl();
aiEngine.toggleDebugging(true);

const game = new GameCoreController(document.querySelector<HTMLDivElement>('#main')!, {
  async getComputerMove(chess) {
    return aiEngine.getNextMove(chess.fen());
  },
});

(globalThis as any).game = game;


const speechAPI = new SpeechCtrl();
speechAPI.on('speech', ({ transcript, confidence }: SpeechResult) => {
  const san = parse(transcript);
  console.log({
    transcript,
    confidence,
    san,
  });
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
