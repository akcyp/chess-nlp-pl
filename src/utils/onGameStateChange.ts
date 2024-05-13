import { Api } from "chessground/api";

export const onGameOver = (board: Api) => {
  board.set({
    draggable: {
      enabled: false,
    },
    selectable: {
      enabled: false,
    },
  });
};

export const onGameStart = (board: Api) => {
  board.set({
    draggable: {
      enabled: true,
    },
    selectable: {
      enabled: true,
    },
  });
};
