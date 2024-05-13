import './style.css';

import { GameCoreController } from './GameCore/GameCore';
import { StockfishEngineCtrl } from './StockfishCtrl/StockfishCtrl';
import { SpeechCtrl, SpeechResult } from './SpeechCtrl/SpeechCtrl';

const aiEngine = new StockfishEngineCtrl();
aiEngine.toggleDebugging(true);


const preGame: HTMLDivElement = document.querySelector('#pre-game')!;
const inGame: HTMLDivElement = document.querySelector('#in-game')!;
const postGame: HTMLDivElement = document.querySelector('#post-game')!;

const game = new GameCoreController(document.querySelector<HTMLDivElement>('#main')!, {
  async getComputerMove(chess) {
    return aiEngine.getNextMove(chess.fen());
  },
  onGameStatusChange: (status) => {
    preGame.style.display = 'none';
    inGame.style.display = 'none';
    postGame.style.display = 'none';
    switch(status) {
      case 'initied': {
        preGame.style.display = '';
        break;
      };
      case 'started': {
        inGame.style.display = '';
        break;
      };
      case 'finished': {
        postGame.style.display = '';
        break;
      };
    }
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

const startBtn = document.querySelector('#action-start')!;
startBtn.addEventListener('click', () => game.exec('start'));

const sideBtn = document.querySelector('#action-side')!
sideBtn.addEventListener('click', () => game.exec('side=!'));

const resignBtn = document.querySelector('#action-resign')!
resignBtn.addEventListener('click', () => game.exec('resign'));

const rematchBtn = document.querySelector('#action-rematch')!
rematchBtn.addEventListener('click', () => game.exec('rematch'));
