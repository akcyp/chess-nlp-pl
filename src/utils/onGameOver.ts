import { Api } from "chessground/api";

export const onGameOver = (board: Api) => {
  board.set({
    draggable: {
      enabled: false,
    },
    selectable: {
      enabled: false,
    },
    premovable: {
      enabled: false,
    },
  });
};
