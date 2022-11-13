import { Wave } from "./wave.js";
import { MazeCreator } from "./mazeCreator.js";
import { getCellSize } from "./utils.js";

const rowsInput = document.querySelector('.rows-count');
const columnsInput = document.querySelector('.columns-count');
const button = document.querySelector('button');
const canvasBlock = document.querySelector('.board');
const drawTypeCheckbox = document.querySelector('.type-draw');
const animationSpeedInput = document.querySelector('.animation-speed');

let wave = null;
let mazeCreator = null;

button.addEventListener('click', async () => {
    mazeCreator && mazeCreator.finish();
    wave && wave.finish();

  if (!rowsInput?.value || !columnsInput?.value) {
    return;
  }
  const rowsCount = Math.max(+rowsInput.value, 10);
  const columnsCount = Math.max(+columnsInput.value, 10);
  const animationSpeed = Math.abs(animationSpeedInput.value ? +animationSpeedInput.value : 0);

  if (rowsCount * columnsCount > 10000) return;

  mazeCreator = new MazeCreator(canvasBlock, {
    columns: columnsCount,
    rows: rowsCount,
    animationSpeed,
    cellSize: getCellSize(rowsCount * columnsCount)
  });
  await mazeCreator.run();

  wave = new Wave(() => {
      mazeCreator.getCanvasInstance().drawMaze();
    },
    mazeCreator.getBoard(),
    {
      stopOnEnd: !drawTypeCheckbox.checked,
      animationSpeed
    }
  );
  wave.start();

});
