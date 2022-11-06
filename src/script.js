import { Board } from "./board.js";
import { getClassNameByCellType } from "./utils.js";
import { Wave } from "./wave.js";

const rowsInput = document.querySelector('.rows-count');
const columnsInput = document.querySelector('.columns-count');
const button = document.querySelector('button');
const boardContainer = document.querySelector('.board');
const drawTypeCheckbox = document.querySelector('.type-draw');
const animateCheckbox = document.querySelector('.animate');
const exitCountInput = document.querySelector('.exit-count');

const generateBoardHTML = field => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < field.length; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < field[i].length; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add(getClassNameByCellType(field[i][j]));
      cell.textContent = field[i][j] > 0 ? field[i][j] : '';
      row.appendChild(cell);
    }
    fragment.appendChild(row);
  }

  return fragment;
};

let wave = null;

button.addEventListener('click', () => {
  if (!rowsInput?.value || !columnsInput?.value) {
    return;
  }
  const rowsCount = Math.max(+rowsInput.value, 3);
  const columnsCount = Math.max(+columnsInput.value, 3);
  const exitCount = Math.min(+exitCountInput.value, 3);
  if (rowsCount * columnsCount > 10000) return;
  if (wave) {
    wave.destroy();
  }
  const board = new Board(rowsCount, columnsCount, exitCount);
  board.generateField();

  wave = new Wave(board => {
      boardContainer.innerHTML = '';
      boardContainer.append(generateBoardHTML(board));
    },
    board.getBoard(),
    {stopOnEnd: !drawTypeCheckbox.checked, isAnimate: animateCheckbox.checked, endsCount: exitCount}
  );
  wave.start();

});
