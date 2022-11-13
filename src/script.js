import { Wave } from "./wave.js";
import { MazeCreator } from "./mazeCreator.js";
import { getCellSize, typeOfCell } from "./utils.js";

const rowsInput = document.querySelector('.rows-count');
const columnsInput = document.querySelector('.columns-count');
const button = document.querySelector('button');
const canvasBlock = document.querySelector('.board');
const drawTypeCheckbox = document.querySelector('.type-draw');
const animationSpeedInput = document.querySelector('.animation-speed');
const remainingDiv = document.querySelector('.remaining');

let wave = null;
let mazeCreator = null;

let positions = null;

let rowsCount = null;
let columnsCount = null;
let isEventListener = false;


let innerWidth = window.innerWidth;

button.addEventListener('click', async () => {
  remainingDiv.style.display = 'block';
  mazeCreator && mazeCreator.finish();
  wave && wave.finish();

  if (!rowsInput?.value || !columnsInput?.value) {
    alert('Введите количество строчек и столбцов');
    return;
  }
  rowsCount = Math.max(+rowsInput.value, 10);
  columnsCount = Math.max(+columnsInput.value, 10);
  const animationSpeed = Math.abs(animationSpeedInput.value ? +animationSpeedInput.value : 0);

  if (rowsCount * columnsCount > 10000) {
    alert('Количество ячеек не должно превышать 10 000');
    return;
  }
  mazeCreator = new MazeCreator(canvasBlock, {
    columns: columnsCount,
    rows: rowsCount,
    animationSpeed,
    cellSize: getCellSize(columnsCount, innerWidth)
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

  remainingDiv.textContent = 'Установите точку входа';
  positions = {
    start: null,
    end: null,
  }
  if (!isEventListener) {
    isEventListener = true;
    canvasBlock.addEventListener('click', async (e) => {
      if (positions.end && positions.start) {
        return;
      }

      const [y, x] = [e.offsetX, e.offsetY];
      const cellSize = getCellSize(columnsCount, innerWidth);
      const [cellX, cellY] = [Math.floor(x / cellSize), Math.floor(y /cellSize)];
      const isValidCell = mazeCreator.checkCell(cellX, cellY);
      if (!isValidCell) {
        remainingDiv.textContent = 'Точки входа и выхода можно ставить только в пустые клетки';
        return;
      }
      if (!positions.start) {
        positions.start = {x: cellX, y: cellY};
        mazeCreator.addCell({...positions.start}, typeOfCell.start);
        mazeCreator.draw();
        remainingDiv.textContent = 'Установите точку выхода';
      } else {
        positions.end = {x: cellX, y: cellY};
        mazeCreator.addCell({...positions.end}, typeOfCell.end);
        mazeCreator.draw();
        remainingDiv.textContent = 'Построение пути';
        await wave.start();
        remainingDiv.textContent = 'Путь построен';
      }
    })
  }
});
