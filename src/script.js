import { Wave } from "./wave.js";
import { MazeCreator } from "./mazeCreator.js";
import { getCellSize } from "./utils.js";

const rowsInput = document.querySelector('.rows-count');
const columnsInput = document.querySelector('.columns-count');
const button = document.querySelector('button');
const canvasBlock = document.querySelector('.board');
const drawTypeCheckbox = document.querySelector('.type-draw');
const animationSpeedInput = document.querySelector('.animation-speed');
const remainingDiv = document.querySelector('.remaining');

let wave = null;
let mazeCreator = null;

button.addEventListener('click', async () => {
  remainingDiv.style.display = 'block';
  mazeCreator && mazeCreator.finish();
  wave && wave.finish();

  if (!rowsInput?.value || !columnsInput?.value) {
    alert('Введите количество строчек и столбцов');
    return;
  }
  const rowsCount = Math.max(+rowsInput.value, 10);
  const columnsCount = Math.max(+columnsInput.value, 10);
  const animationSpeed = Math.abs(animationSpeedInput.value ? +animationSpeedInput.value : 0);

  if (rowsCount * columnsCount > 10000) {
    alert('Количество ячеек не должно превышать 10 000');
    return;
  }
  mazeCreator = new MazeCreator(canvasBlock, {
    columns: columnsCount,
    rows: rowsCount,
    animationSpeed,
    cellSize: getCellSize(columnsCount)
  }, (currentBlocks, maxBlocks) => {
    remainingDiv.textContent = `Лабирит сгенерирован на ${(currentBlocks / maxBlocks * 100).toFixed(2)}%`
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
